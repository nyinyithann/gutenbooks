open Common.Io
open Common.Setting
open Common.Model
open Common.Logging

let logger = get_logger "indexing" "elasticsearch-index"
let log msg = logger#info "%s" (get_time_log (Printf.sprintf "%s" msg))

let index http_client index_name book =
  let open Lwt_result.Syntax in
  let doc = book |> yojson_of_book |> Yojson.Safe.to_string in
  let target = Printf.sprintf "/%s/_doc/%d" index_name book.index_id in
  let headers = [ ("Content-Type", "application/json") ] in
  let body = Piaf.Body.of_string doc in
  let* client = http_client in
  let* resp = Piaf.Client.post client ~headers ~body target in
  if Piaf.Status.is_successful resp.status then begin
    log (Printf.sprintf "Successfully indexd %d.\n" book.id);
    Lwt_result.return
      (Printf.sprintf "Indexing successfull for id %d.\n" book.id)
  end
  else
    let msg = Piaf.Status.to_string resp.status in
    log
      (Printf.sprintf "Error at indexing book with id:%d. Error => %s.\n"
         book.id msg);
    Lwt_result.fail (`Msg msg)

let get_files setting =
  let pattern = ".+\\.rdf" in
  getfiles setting.latest_unzip_path pattern

let usage_msg = "usage: index [-url string] [-index-name string] [-count int]\n"
let url = ref ""
let index_name = ref ""
let count = ref Stdlib.Int.max_int

let speclist =
  [
    ("-url", Arg.Set_string url, "url - url of node ");
    ("-index-name", Arg.Set_string index_name, "index-name - index name");
    ("-count", Arg.Set_int count, "c - number of documents to index");
  ]

let get_sorted_filenames () =
  let setting = get_settings () in
  let fileinfos = ref [] in
  if !count != Int.max_int then
    fileinfos := get_files setting |> Common.Util.take !count
  else fileinfos := get_files setting;

  let filename_to_num name =
    let name = Filename.chop_extension @@ Filename.basename name in
    let num_str = Str.global_replace (Str.regexp "pg") "" name in
    int_of_string_opt num_str
  in
  let cmp x y =
    match (filename_to_num x, filename_to_num y) with
    | Some xn, Some yn -> xn - yn
    | Some xn, None -> xn
    | None, Some yn -> yn
    | _ -> 0
  in
  List.sort cmp !fileinfos

let () =
  Arg.parse speclist (fun _ -> ()) usage_msg;
  if !count <= 0 then begin
    print_endline usage_msg;
    exit 0
  end
  else
    let sorted_filenames = get_sorted_filenames () in
    let http_client = Piaf.Client.create (Uri.of_string !url) in
    let count = ref 1 in
    let rec decode_and_index files =
      match files with
      | [] ->
          let msg =
            Printf.sprintf "Finished decoding & indexing files: %d/%d.\n"
              (!count - 1) (List.length sorted_filenames) 
          in
          Lwt_result.return msg
      | h :: t -> (
          match Rdfdec.Decoder.decode h with
          | Ok (book, _) ->
              if String.length book.title > 0 then begin
                book.index_id <- !count;
                count := !count + 1;
                let open Lwt.Syntax in
                let* _ = index http_client !index_name book in
                decode_and_index t
              end else begin
                log (Printf.sprintf "Title of book id %d is empty." book.id);
                decode_and_index t
              end
          | Error err ->
              log err;
              decode_and_index t)
    in
    let run () = Lwt_main.run (decode_and_index sorted_filenames) in
    run ()
    |> Format.asprintf "%a"
         Fmt.Dump.(result ~ok:string ~error:Piaf.Error.pp_hum)
    |> log
    
