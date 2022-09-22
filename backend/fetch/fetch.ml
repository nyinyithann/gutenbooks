open Common.Setting
open Common.Logging

let logger = get_logger "download_unzip" "fetch"

let log msg = logger#info "%s" (get_time_log (Printf.sprintf "%s" msg))

let download url dest =
  let open Piaf in
  let open Lwt_io in
  let open Lwt.Infix in
  let open Lwt_result.Syntax in
  let* response = Client.Oneshot.get (Uri.of_string url) in
  if Status.is_successful response.status then
    let stream, _ = Body.to_string_stream response.body in
    with_file ~mode:Output dest (fun chan ->
        Lwt_stream.iter_s (write chan) stream)
    >>= fun _ -> Lwt_result.return (Ok (Status.to_string response.status))
  else
    let message = Status.to_string response.status in
    Lwt_result.fail (`Msg message)

let () =
  try
    log "Start downloading...";
    let setting = get_settings () in
    let download_path = get_download_path setting in
    Lwt_main.run (download setting.books_url download_path) |> ignore;
    let unzip_path = get_unzip_path setting in
    let cmd_text =
      Printf.sprintf "tar -xvf %s -C %s" download_path unzip_path
    in
    log "unzipping...";
    Sys.command cmd_text |> ignore;
    update_setting { setting with latest_unzip_path = unzip_path };
    log "done."
  with _ ->
    log
      ("Error occured while downloading and unzipping."
     ^ Printexc.get_backtrace ())
