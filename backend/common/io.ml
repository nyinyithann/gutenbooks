let getfiles dir pattern =
  let re = Str.regexp pattern in
  let select str = Str.string_match re str 0 in
  let rec walk acc dirs =
    match dirs with
    | [] -> acc
    | h :: t ->
        let contents = Array.to_list (Sys.readdir h) in
        let contents = contents |> List.map (Filename.concat h) in
        let dirs, files =
          contents
          |> List.fold_left
               (fun (dirs, files) x ->
                 match (Unix.stat x).st_kind with
                 | Unix.S_REG -> (dirs, x :: files)
                 | Unix.S_DIR -> (x :: dirs, files)
                 | _ -> (dirs, files))
               ([], [])
        in
        let matched = files |> List.filter select in
        walk (matched @ acc) (dirs @ t)
  in
  walk [] [ dir ]

let readall fname =
  let ic = open_in fname in
  let buflen = 1024 in
  let buffer = Buffer.create buflen in
  let rec read () =
    try
      Buffer.add_channel buffer ic buflen;
      read ()
    with End_of_file ->
      close_in ic;
      Buffer.contents buffer
  in
  read ()
