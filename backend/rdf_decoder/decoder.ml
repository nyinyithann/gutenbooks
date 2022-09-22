open Common.Model

type xtree = Element of Xmlm.tag * xtree list | Data of string

exception Decode_error of { msg : string; inner_exn : string }

let to_error_message fname msg backtrace =
  Printf.sprintf "Filename: %s\nError message: %s\nBacktrace:%s\n" fname msg
    backtrace

let throw_with msg inner_exn =
  let inner_msg =
    Printf.sprintf "%s\n%s\n"
      (Printexc.to_string inner_exn)
      (Printexc.get_backtrace ())
  in
  raise (Decode_error { msg; inner_exn = inner_msg })

let extract_data_value (input : Xmlm.input) =
  match Xmlm.input input with `Data v -> v | _ -> ""

let extract_title (input : Xmlm.input) =
  try extract_data_value input
  with exn -> throw_with "Error occured while extracting book title." exn

let extract_download_count (input : Xmlm.input) =
  try extract_data_value input |> int_of_string_opt |> Option.value ~default:0
  with exn ->
    throw_with "Error occured while extracting book download count." exn

let extract_attr_value attrs (name : string) =
  attrs
  |> List.map (function
       | (_, attr_name), v when attr_name = name -> v
       | _ -> "")
  |> List.hd

let extract_id attrs =
  try
    extract_attr_value attrs "about"
    |> String.split_on_char '/' |> List.rev |> List.hd |> int_of_string
  with exn -> throw_with "Error occured while extracting book id." exn

let first_or_default dl default =
  match List.nth_opt dl 0 with Some (Data v) -> v | _ -> default

let to_xtree (input : Xmlm.input) =
  Xmlm.input_tree ~el:(fun t l -> Element (t, l)) ~data:(fun d -> Data d) input

let to_data (xt : xtree) =
  let attrs = match xt with Element (_, al) -> al | Data _ -> [] in
  attrs
  |> List.concat_map (function
       | Element (((_, field), attrs), dl) ->
           [ (field, first_or_default dl "", attrs) ]
       | _ -> [])

let extract_subtree (input : Xmlm.input) = input |> to_xtree |> to_data

let extract_format (input : Xmlm.input) =
  let xt = to_xtree input in
  let link =
    match xt with
    | Element ((_, attrs), _) -> extract_attr_value attrs "about"
    | Data _ -> ""
  in
  let attrs = match xt with Element (_, attrs) -> attrs | Data _ -> [] in
  let fe =
    attrs
    |> List.find_map (function
         | Element (((_, "format"), _), dl) -> Some dl
         | _ -> None)
  in
  let type_ =
    match fe with
    | None -> ""
    | Some x ->
        let rec aux = function
          | [] -> ""
          | Data _ :: t -> aux t
          | Element (((_, "value"), _), dl) :: _ -> first_or_default dl ""
          | Element (_, dl) :: t -> aux (dl @ t)
        in
        aux x
  in
  { type_; link }

let extract_creator (input : Xmlm.input) =
  try
    let kvs = extract_subtree input
    and f acc kv =
      match kv with
      | "name", v, _ -> { acc with name = v }
      | "birthdate", v, _ -> { acc with birth_year = int_of_string_opt v }
      | "deathdate", v, _ -> { acc with death_year = int_of_string_opt v }
      | "webpage", _, attrs ->
          let wp =
            match List.nth_opt attrs 0 with
            | Some ((_, "resource"), v) -> v
            | _ -> ""
          in
          { acc with webpage = wp }
      | "alias", v, _ -> { acc with alias = v :: acc.alias }
      | _ -> acc
    and acc =
      {
        name = "";
        birth_year = None;
        death_year = None;
        alias = [];
        webpage = "";
      }
    in
    kvs |> List.fold_left f acc
  with exn ->
    throw_with
      "Error occured while extracting creator - author, contributer, or editor."
      exn

let extract_value_field (input : Xmlm.input) =
  let kvs = extract_subtree input
  and f acc kv = match kv with "value", v, _ -> acc ^ v | _ -> acc
  and acc = "" in
  kvs |> List.fold_left f acc

let extract_subject (input : Xmlm.input) =
  try extract_value_field input
  with exn -> throw_with "Error occured while extracting book subject." exn

let extract_bookshelf (input : Xmlm.input) =
  try extract_value_field input
  with exn -> throw_with "Error occured while extracting bookshelf." exn

let extract_language (input : Xmlm.input) =
  try extract_value_field input
  with exn -> throw_with "Error occured while extracting book language." exn

let skip_empty_data_field (input : Xmlm.input) =
  match Xmlm.peek input with `Data _ -> Xmlm.input input |> ignore | _ -> ()

let decode fname =
  try
    let open Xmlm in
    let xml = Common.Io.readall fname in
    let xi = make_input (`String (0, xml)) in
    let id = ref Int.min_int
    and title = ref ""
    and authors = ref []
    and contributers = ref []
    and editors = ref []
    and subjects = ref []
    and bookshelves = ref []
    and languages = ref []
    and formats = ref []
    and download_count = ref 0
    and well_formed = ref true
    and errors = Buffer.create 65536 in

    while not (eoi xi) do
      try
        match Xmlm.input xi with
        | `El_start ((_, "ebook"), attrs) -> id := extract_id attrs
        | `El_start ((_, "title"), _) -> title := extract_title xi
        | `El_start ((_, "downloads"), _) ->
            download_count := extract_download_count xi
        | `El_start ((_, "creator"), _) ->
            skip_empty_data_field xi;
            authors := extract_creator xi :: !authors
        | `El_start ((_, "ctb"), _) ->
            skip_empty_data_field xi;
            contributers := extract_creator xi :: !contributers
        | `El_start ((_, "edt"), _) ->
            skip_empty_data_field xi;
            editors := extract_creator xi :: !editors
        | `El_start ((_, "subject"), _) ->
            skip_empty_data_field xi;
            subjects := extract_subject xi :: !subjects
        | `El_start ((_, "bookshelf"), _) ->
            skip_empty_data_field xi;
            bookshelves := extract_bookshelf xi :: !bookshelves
        | `El_start ((_, "language"), _) ->
            skip_empty_data_field xi;
            languages := extract_language xi :: !languages
        | `El_start ((_, "hasFormat"), _) ->
            skip_empty_data_field xi;
            formats := extract_format xi :: !formats
        | _ -> ()
      with Decode_error e ->
        well_formed := false;
        Buffer.add_string errors (to_error_message fname e.msg e.inner_exn)
    done;
    Ok
      ( {
          id = !id;
          index_id = Int.min_int;
          title = !title;
          authors = !authors;
          contributers = !contributers;
          editors = !editors;
          subjects = !subjects;
          bookshelves = !bookshelves;
          languages = !languages;
          formats = !formats;
          download_count = !download_count;
          well_formed = !well_formed;
        },
        Buffer.contents errors )
  with _ ->
    Error
      (to_error_message fname "Error occured while parsing."
         (Printexc.get_backtrace ()))
