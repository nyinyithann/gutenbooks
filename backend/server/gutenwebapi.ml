open Lwt.Syntax

let sleep2s () = Unix.sleepf 0.5

let get_page_size () =
  let setting = Common.Setting.get_settings () in
  setting.page_size

let json_response book =
  let open Common.Model in
  book |> yojson_of_book |> Yojson.Safe.to_string |> Dream.json

let response_err msg =
  Printf.sprintf
    "{\"_status\" : \"Error\", \"_message\": %s, \"_result\" : null}" msg
  |> Dream.json

let not_found_response = response_err "Not Found"

let bad_request_response =
  Dream.empty ~headers:[ ("Access-Control-Allow-Origin", "*") ] `Bad_Request

let to_result yj =
  let result = yj |> Yojson.Basic.to_string in
  Printf.sprintf "{\"_status\" : \"Ok\", \"_message\": null, \"_result\" : %s}"
    result
  |> Dream.json
       ~headers:
         [
           ("Access-Control-Allow-Origin", "*");
           ("Cache-Control", "public, max-age=432000");
         ]

let empty_response = to_result (`List [])

let check_es_error es_json =
  let open Yojson.Basic.Util in
  let error_list =
    let err = es_json |> member "error" in
    if err != `Null then
      err |> member "root_cause" |> to_list |> filter_member "reason"
      |> filter_string
    else []
  in
  if List.length error_list > 0 then
    List.fold_left (fun x acc -> Format.sprintf "%s\n%s" x acc) "" error_list
  else ""

let get_bookshelves _ =
  sleep2s ();
  let open Yojson.Basic.Util in
  try%lwt
    let* response = Elastic.get_bookshelves () in
    let es_json = Yojson.Basic.from_string response in
    let error = check_es_error es_json in
    if String.length error > 0 then response_err error
    else
      let bookshelves =
        es_json |> member "aggregations" |> member "bookshelves"
        |> member "buckets" |> to_list
      in
      `Assoc [ ("bookshelves", `List bookshelves) ] |> to_result
  with e ->
    let msg = Printexc.to_string e and stack = Printexc.get_backtrace () in
    response_err (Printf.sprintf "%s%s\n" msg stack)

let get_book request =
  sleep2s ();
  let id = Dream.param request "id" |> int_of_string_opt in
  match id with
  | Some n -> begin
      let open Yojson.Basic.Util in
      try%lwt
        let* response = Elastic.get_book n in
        let es_json = Yojson.Basic.from_string response in
        let error = check_es_error es_json in
        if String.length error > 0 then response_err error
        else
          let hits = es_json |> member "hits" |> member "hits" |> to_list in
          match List.nth_opt hits 0 with
          | Some hit -> hit |> member "_source" |> to_result
          | None -> not_found_response
      with e ->
        let msg = Printexc.to_string e and stack = Printexc.get_backtrace () in
        response_err (Printf.sprintf "%s%s\n" msg stack)
    end
  | None -> response_err "positive number book id is required."

let get_books_by_page request =
  sleep2s ();
  let pageNum = Dream.param request "page" |> int_of_string_opt in
  match pageNum with
  | Some n -> begin
      if n <= 0 then response_err "page must be a positive number."
      else
        try%lwt
          let open Yojson.Basic.Util in
          let page_size = get_page_size () in
          let* response = Elastic.get_books_by_page n page_size in
          let es_json = Yojson.Basic.from_string response in
          let error = check_es_error es_json in
          if String.length error > 0 then response_err error
          else
            let aggr = "aggregations" in
            let total_hits =
              es_json |> member aggr |> member "total" |> member "value"
              |> to_int
            in

            let total_pages =
              if total_hits == 0 then 0
              else
                ceil (Int.to_float total_hits /. Int.to_float page_size)
                |> Float.to_int
            in
            let hits = es_json |> member "hits" |> member "hits" |> to_list in
            let source_hits =
              hits |> List.map (fun h -> h |> member "_source")
            in
            `Assoc
              [
                ("_page", `Int n);
                ("_per_page", `Int page_size);
                ("_total_hits", `Int total_hits);
                ("_total_pages", `Int total_pages);
                ("_hits", `List source_hits);
              ]
            |> to_result
        with e ->
          let msg = Printexc.to_string e
          and stack = Printexc.get_backtrace () in
          response_err (Printf.sprintf "%s%s\n" msg stack)
    end
  | None -> response_err "positive page number is required."

let get_books request =
  sleep2s ();
  let open Msg in
  try%lwt
    let* body = Dream.body request in
    let pagination_info =
      body |> Yojson.Safe.from_string |> pagination_info_of_yojson
    in
    match pagination_info.page with
    | None -> response_err "positive page number is required."
    | Some page ->
        if page <= 0 then response_err "page must be a positive number."
        else
          let query = Option.value pagination_info.query ~default:"" in
          let sort_fields =
            match pagination_info.sort with
            | None -> []
            | Some sort ->
                List.fold_right
                  (fun x acc ->
                    match x with
                    | Some s -> (
                        match (s.field, s.order) with
                        | Some f, Some o -> (f, `String o) :: acc
                        | _ -> acc)
                    | None -> acc)
                  sort []
          in
          let page_size = get_page_size () in
          let field_list =
            match pagination_info.fields with
            | None -> []
            | Some fls ->
                let flist = ref [] in
                List.iter
                  (fun x ->
                    let open Common.Util in
                    let lx = x |> String.trim |> String.lowercase_ascii in
                    if starts_with "title" lx then
                      flist :=
                        `String "title.searchasyoutype._index_prefix^5"
                        :: `String "title.searchasyoutype^4" :: !flist
                    else if starts_with "author" lx then
                      flist :=
                        `String "authors.name.searchasyoutype._index_prefix^3"
                        :: `String "authors.name.searchasyoutype^2" :: !flist
                    else if starts_with "bookshelf" lx then
                      flist := `String "bookshelves^1" :: !flist
                    else flist := `String lx :: !flist)
                  (List.fold_left
                     (fun acc x ->
                       match x with
                       | Some s when String.length s > 0 -> s :: acc
                       | _ -> acc)
                     [] fls);
                !flist
          in
          let open Yojson.Basic.Util in
          let* response =
            Elastic.get_books query page page_size field_list sort_fields
          in
          let es_json = Yojson.Basic.from_string response in
          let error = check_es_error es_json in
          if String.length error > 0 then response_err error
          else
            let aggr = "aggregations" in
            let total_hits =
              es_json |> member aggr |> member "total" |> member "value"
              |> to_int
            in

            let total_pages =
              if total_hits == 0 then 0
              else
                ceil (Int.to_float total_hits /. Int.to_float page_size)
                |> Float.to_int
            in
            let hits = es_json |> member "hits" |> member "hits" |> to_list in
            let source_hits =
              hits |> List.map (fun h -> h |> member "_source")
            in
            let bookshelves =
              es_json |> member aggr
              |> member "related_bookshelves"
              |> member "buckets" |> to_list
            in
            `Assoc
              [
                ("_page", `Int page);
                ("_per_page", `Int page_size);
                ("_total_hits", `Int total_hits);
                ("_total_pages", `Int total_pages);
                ("_hits", `List source_hits);
                ("_related_bookshelves", `List bookshelves);
              ]
            |> to_result
  with e ->
    let msg = Printexc.to_string e and stack = Printexc.get_backtrace () in
    response_err (Printf.sprintf "%s%s\n" msg stack)

let search_books request =
  sleep2s ();
  let open Yojson.Basic.Util in
  try%lwt
    let* body = Dream.body request in
    let autocomplete_info =
      body |> Yojson.Safe.from_string |> Msg.autocomplete_info_of_yojson
    in

    let query = Option.value autocomplete_info.query ~default:"" in

    let field_list =
      match autocomplete_info.fields with
      | None -> []
      | Some fls ->
          let flist = ref [] in
          List.iter
            (fun x ->
              let open Common.Util in
              let lx = x |> String.trim |> String.lowercase_ascii in
              if starts_with "title" lx then
                flist :=
                  `String "title.searchasyoutype._index_prefix^4"
                  :: `String "title.searchasyoutype^3" :: !flist
              else if starts_with "author" lx then
                flist :=
                  `String "authors.name.searchasyoutype._index_prefix^2"
                  :: `String "authors.name.searchasyoutype^1" :: !flist
              else flist := `String lx :: !flist)
            (List.fold_left
               (fun acc x ->
                 match x with
                 | Some s when String.length s > 0 -> s :: acc
                 | _ -> acc)
               [] fls);
          !flist
    in
    let* response = Elastic.search_books query field_list in
    let es_json = Yojson.Basic.from_string response in
    let error = check_es_error es_json in
    if String.length error > 0 then response_err error
    else
      let hits = es_json |> member "hits" |> member "hits" |> to_list in
      let source_hits = hits |> List.map (fun h -> h |> member "_source") in
      `Assoc [ ("_hits", `List source_hits) ] |> to_result
  with e ->
    let msg = Printexc.to_string e and stack = Printexc.get_backtrace () in
    response_err (Printf.sprintf "%s%s\n" msg stack)

let () =
  Dream.run ~interface:"0.0.0.0" ~port:9090
  @@ Dream.logger
  @@ Dream.router
       [
         Dream.get "api/books/bookshelves" get_bookshelves;
         Dream.get "api/books/:id" get_book;
         Dream.get "api/books/pages/:page" get_books_by_page;
         Dream.post "api/books" get_books;
         Dream.post "api/books/search" search_books;
       ]
