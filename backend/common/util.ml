let skip n l =
  if n <= 0 then l
  else
    let rec aux n acc = function
      | [] -> acc
      | _ :: t -> if n <= 0 then acc else aux (n - 1) t t
    in
    aux n [] l

let take n l =
  if n <= 0 then []
  else if n >= List.length l then l
  else
    let rec aux n acc = function
      | [] -> acc
      | h :: t -> if n <= 0 then acc else aux (n - 1) (h :: acc) t
    in
    aux n [] l

let starts_with prefix s =
  let len = String.length prefix in
  if len == 0 then false
  else if len > String.length s then false
  else String.equal (String.sub s 0 len) prefix

(*https://stackoverflow.com/questions/16269393/how-to-get-the-number-of-cores-on-a-machine-with-ocaml*)
let cpu_count () =
  try
    match Sys.os_type with
    | "Win32" -> int_of_string (Sys.getenv "NUMBER_OF_PROCESSORS")
    | _ -> begin
        let i = Unix.open_process_in "getconf _NPROCESSORS_ONLN" in
        let close () = ignore (Unix.close_process_in i) in
        try
          let sic = Scanf.Scanning.from_channel i in
          Scanf.bscanf sic "%d" (fun n ->
              close ();
              n)
        with e ->
          close ();
          raise e
      end
  with
  | Not_found | Sys_error _ | Failure _ | Scanf.Scan_failure _ | End_of_file
  | Unix.Unix_error (_, _, _)
  ->
    1
