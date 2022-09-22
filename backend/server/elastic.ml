open Lwt
open Cohttp
open Cohttp_lwt_unix
open Lwt.Syntax

let get_es_search_url () =
  let setting = Common.Setting.get_settings () in
  Format.sprintf "%s/%s/_search" setting.es_host setting.es_index

let yo_obj k v = `Assoc [ (k, v) ]

let yo_obj_of_list lst = `Assoc lst

let q_clause name field value = yo_obj name (yo_obj field value)

let aggr_terms field =
  `Assoc
    [
      ("terms", `Assoc [ ("field", `String field); ("size", `Int 2147483647) ]);
    ]

let match_all = yo_obj "match_all" (`Assoc [])

let target = Uri.of_string (get_es_search_url ())

let headers = Header.of_list [ ("Content-Type", "application/json") ]

let get_book id =
  let ids_clause = q_clause "ids" "values" (`List [ `Int id ]) in
  let search_query = `Assoc [ ("query", ids_clause) ] in
  let body =
    search_query |> Yojson.Safe.to_string |> Cohttp_lwt.Body.of_string
  in
  let* _, body = Client.call ~headers ~body `POST target in
  body |> Cohttp_lwt.Body.to_string >|= fun body -> body

let get_bookshelves () =
  let query =
    `Assoc
      [
        ("size", `Int 0);
        ("query", match_all);
        ("aggs", `Assoc [ ("bookshelves", aggr_terms "bookshelves.keyword") ]);
      ]
  in
  let body = query |> Yojson.Safe.to_string |> Cohttp_lwt.Body.of_string in
  let* _, body = Client.call ~headers ~body `POST target in
  body |> Cohttp_lwt.Body.to_string >|= fun body -> body

let search_books query fields =
  let query =
    `Assoc
      [
        ("size", `Int 5);
        ( "query",
          `Assoc
            [
              ( "multi_match",
                `Assoc
                  [
                    ("query", `String query);
                    ("type", `String "bool_prefix");
                    ("fields", `List fields);
                  ] );
            ] );
      ]
  in
  let body = query |> Yojson.Safe.to_string |> Cohttp_lwt.Body.of_string in
  let* _, body = Client.call ~headers ~body `POST target in
  body |> Cohttp_lwt.Body.to_string >|= fun body -> body

let get_books_by_page page page_size =
  let query =
    `Assoc
      [
        ("size", `Int page_size);
        ("query", match_all);
        ("sort", `List [ yo_obj "index_id" (`String "asc") ]);
        ("search_after", `List [ `Int (page_size * (page - 1)) ]);
        ( "aggs",
          `Assoc
            [
              ( "total",
                `Assoc [ ("value_count", `Assoc [ ("field", `String "id") ]) ]
              );
            ] );
      ]
  in
  let body = query |> Yojson.Safe.to_string |> Cohttp_lwt.Body.of_string in
  let* _, body = Client.call ~headers ~body `POST target in
  body |> Cohttp_lwt.Body.to_string >|= fun body -> body

let get_books query page page_size fields sort_fields =
  let from = (page - 1) * page_size in
  let query =
    `Assoc
      [
        ("from", `Int from);
        ("size", `Int page_size);
        ( "query",
          `Assoc
            [
              ( "multi_match",
                `Assoc
                  [
                    ("query", `String query);
                    ("type", `String "bool_prefix");
                    ("fields", `List fields);
                  ] );
            ] );
        ("sort", `Assoc sort_fields);
        ( "aggs",
          `Assoc
            [
              ( "total",
                `Assoc [ ("value_count", `Assoc [ ("field", `String "id") ]) ]
              );
              ( "related_bookshelves",
                `Assoc
                  [
                    ( "terms",
                      `Assoc
                        [
                          ("field", `String "bookshelves.keyword");
                          ("size", `Int 2147483647);
                        ] );
                  ] );
            ] );
      ]
  in
  let body = query |> Yojson.Safe.to_string |> Cohttp_lwt.Body.of_string in
  let* _, body = Client.call ~headers ~body `POST target in
  body |> Cohttp_lwt.Body.to_string >|= fun body -> body
