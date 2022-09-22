type sorting_info = {
  field : string option; [@default Some "_score"]
  order : string option; [@default Some "desc"]
}
[@@deriving yojson]

type pagination_info = {
  page : int option;
  query : string option; [@default Some ""]
  fields : string option list option; [@defult Some [ Some "" ]]
  sort : sorting_info option list option;
      [@default Some [ Some { field = Some "_score"; order = Some "desc" } ]]
}
[@@deriving yojson]

type autocomplete_info = {
  query : string option; [@default Some ""]
  fields : string option list option; [@default Some [ Some "" ]]
}
[@@deriving yojson]
