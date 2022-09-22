type creator = {
  name : string;
  birth_year : int option;
  death_year : int option;
  alias : string list;
  webpage : string;
}
[@@deriving yojson]

type format = { type_ : string; [@key "type"] link : string }
[@@deriving yojson]

type book = {
  id : int;
  mutable index_id : int;
  title : string;
  authors : creator list;
  contributers : creator list;
  editors : creator list;
  subjects : string list;
  bookshelves : string list;
  languages : string list;
  formats : format list;
  download_count : int;
  well_formed : bool; [@yojson_drop_if fun x -> x || not x]
}
[@@deriving yojson]

type book_response = { _status : string; _message : string; _result : book }
[@@deriving yojson]

let pp = Format.fprintf

let string_or_default i default =
  match i with Some x -> string_of_int x | None -> default

let string_of_list l =
  Printf.sprintf "[%s]"
    (l |> List.fold_left (fun acc x -> Printf.sprintf "%s; " (acc ^ x)) "")

let pp_list ppf l = pp ppf "%s" (string_of_list l)

let pp_creator ppf { name; birth_year; death_year; alias; webpage } =
  let alias_str = string_of_list alias in
  pp ppf
    {|{
        name=%s;
        birth_year=%s;
        death_year=%s;
        alias=%s;
        webpage=%s
    }|}
    name
    (string_or_default birth_year "")
    (string_or_default death_year "")
    alias_str webpage

let pp_creators ppf cs =
  pp ppf {|[|};
  cs
  |> List.iter (fun a ->
         pp_creator ppf a;
         print_endline ";");
  pp ppf {|]|}

let pp_format ppf { type_; link } = pp ppf "{ type_=%s; link=%s }" type_ link

let pp_formats ppf fs =
  pp ppf {|[|};
  fs
  |> List.iter (fun a ->
         pp_format ppf a;
         print_endline ";");
  pp ppf {|]|}

let pp_book ppf b =
  pp ppf
    {| book {
        id = %d;
        title = %s;
        download_count = %d;
        authors = |}
    b.id b.title b.download_count;
  pp_creators ppf b.authors;
  pp ppf {|;
        contributers = |};
  pp_creators ppf b.contributers;
  pp ppf {|;
        editors = |};
  pp_creators ppf b.editors;
  pp ppf {|;
        subjects = |};
  pp_list ppf b.subjects;
  pp ppf {|;
        bookshelves = |};
  pp_list ppf b.bookshelves;
  pp ppf {|;
        languages = |};
  pp_list ppf b.languages;
  pp ppf {|;
        formats = |};
  pp_formats ppf b.formats;
  pp ppf ";\n}\n"
