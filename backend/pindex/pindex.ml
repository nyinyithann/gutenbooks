open Common.Io
open Common.Setting
open Common.Model
open Common.Logging
open Common.Util

let logger = get_logger "indexing" "elasticsearch-index"
let log msg = logger#info "%s" (get_time_log (Printf.sprintf "%s" msg))

type decode_book = book option * string
type decode_result = decode_book list

let index http_client index_name decode_book =
  let book_opt, msg = decode_book in
  match book_opt with
  | None ->
      Printf.printf "Indexing failed with %s\n%!" msg;
      Lwt_result.fail (`Msg ("Indexing failed: " ^ msg))
  | Some book -> begin
      Printf.printf "Indexing id %d\n%!" book.id;
      let open Lwt_result.Syntax in
      try
        let doc = book |> yojson_of_book |> Yojson.Safe.to_string in
        let target = Printf.sprintf "/%s/_doc/%d" index_name book.index_id in
        let headers = [ ("Content-Type", "application/json") ] in
        let body = Piaf.Body.of_string doc in
        let* client = http_client in
        let* resp = Piaf.Client.post client ~headers ~body target in
        if Piaf.Status.is_successful resp.status then
          Lwt_result.return
            (Printf.sprintf "Indexing successfull for id %d. %s" book.id msg)
        else
          let msg = Piaf.Status.to_string resp.status in
          Lwt_result.fail
            (`Msg
              (Printf.sprintf "Indexing failed for id: %d. %s\n" book.id msg))
      with _ ->
        Printf.printf "Error: %s" (Printexc.get_backtrace ());
        Lwt_result.fail
          (`Msg (Printf.sprintf "Indexing failed for id: %d. %s\n" book.id msg))
    end

let prepare_index books node_url index_name =
  Lwt_main.run
    begin
      let http_client = Piaf.Client.create (Uri.of_string node_url) in
      books |> Lwt_list.map_p (fun book -> index http_client index_name book)
    end

let decode (file : string) (acc : decode_result) : decode_result =
  Printf.printf "decoding %s\n%!" file;
  match Rdfdec.Decoder.decode file with
  | Ok (book, msg) ->
      if String.length book.title > 0 then [ (Some book, msg) ] @ acc
      else
        [ (None, Printf.sprintf "Title of book id %d is empty." book.id) ] @ acc
  | Error err -> [ (None, err) ] @ acc

let usage_msg = "usage: index [-url string] [-index-name string] [-count int]\n"
let url = ref ""
let index_name = ref ""
let count = ref Int.max_int

let speclist =
  [
    ("-url", Arg.Set_string url, "url - url of node ");
    ("-index-name", Arg.Set_string index_name, "index-name - index name");
    ( "-count",
      Arg.Set_int count,
      "c - number of documents to index. default 4611686018427387903" );
  ]

let get_files setting =
  let pattern = ".+\\.rdf" in
  getfiles setting.latest_unzip_path pattern

let () =
  Arg.parse speclist (fun _ -> ()) usage_msg;
  if !count <= 0 then begin
    print_endline usage_msg;
    exit 0
  end
  else
    let setting = get_settings () in
    let fileinfos = ref [] in
    if !count != Int.max_int then fileinfos := get_files setting |> take !count
    else fileinfos := get_files setting;
    let ncores = cpu_count () in
    let chunksize = List.length !fileinfos / ncores in
    let result =
      Parmap.parfold ~ncores ~chunksize decode (Parmap.L !fileinfos)
        ([] : decode_result)
        ( @ )
    in
    let sorted_result =
      List.sort
        (fun (xb, _) (yb, _) ->
          match (xb, yb) with Some x, Some y -> x.id - y.id | _ -> 0)
        result
    in
    let _ =
      sorted_result
      |> List.iteri (fun i (bopt, _) ->
             match bopt with Some b -> b.index_id <- i + 1 | _ -> ())
    in
    let result =
      prepare_index sorted_result !url !index_name
      |> Format.asprintf "%a"
           Fmt.Dump.(list (result ~ok:string ~error:Piaf.Error.pp_hum))
    in
    log
      (Printf.sprintf "\n\nTotal files: %d\n\n===> Summary ===>\n%s"
         (List.length !fileinfos) result)
