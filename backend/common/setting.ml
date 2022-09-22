let setting_path = "./settings.json"

type setting = {
  books_url : string;
  download_location : string;
  unzip_location : string;
  latest_unzip_path : string;
  page_size : int;
  es_host : string;
  es_index : string;
}
[@@deriving yojson]

let get_settings () =
  let json = Yojson.Basic.from_file setting_path in
  let open Yojson.Basic.Util in
  {
    books_url = json |> member "books_url" |> to_string;
    download_location = json |> member "download_location" |> to_string;
    unzip_location = json |> member "unzip_location" |> to_string;
    latest_unzip_path = json |> member "latest_unzip_path" |> to_string;
    page_size = json |> member "page_size" |> to_int;
    es_host = json |> member "es_host" |> to_string;
    es_index = json |> member "es_index" |> to_string;
  }

let get_download_path setting =
  if not (Sys.file_exists setting.download_location) then
    Sys.mkdir setting.download_location 0o775;

  let fname =
    setting.books_url |> String.split_on_char '/' |> List.rev |> List.hd
  in
  Filename.concat setting.download_location fname

let get_unzip_path setting =
  if not (Sys.file_exists setting.unzip_location) then
    Sys.mkdir setting.unzip_location 0o775;

  let open CalendarLib in
  let curren_tz = Time_Zone.current () in
  Time_Zone.change Local;
  let now = Calendar.now () in
  let folder_name = Printer.Calendar.sprint "%d%m%Y" now in
  Time_Zone.change curren_tz;
  let new_folder_name = Filename.concat setting.unzip_location folder_name in
  if Sys.file_exists new_folder_name then
    Sys.command (Printf.sprintf "rm -rf %s" new_folder_name) |> ignore;

  Sys.mkdir new_folder_name 0o775;
  new_folder_name

let update_setting setting =
  let json_str = setting |> yojson_of_setting |> Yojson.Safe.to_string in
  Unix.chmod setting_path 0o640;
  let oc = open_out setting_path in
  try
    Printf.fprintf oc "%s" json_str;
    close_out oc
  with _ -> close_out oc
