open Easy_logging

let get_logger lname fname =
  let h_config : Handlers.config =
    {
      file_handlers =
        {
          logs_folder = "logs/";
          truncate = false;
          file_perms = 0o664;
          date_prefix = Some "%Y%m%d_";
          versioning = None;
          suffix = ".log";
        };
    }
  in
  Logging.set_handlers_config h_config;
  Logging.make_logger lname Debug
    [ RotatingFile (fname, Debug, 65536, 2); Cli Debug ]

let get_time () =
  let open CalendarLib in
  let curren_tz = Time_Zone.current () in
  Time_Zone.change Local;
  let log_msg =
    Printer.Calendar.sprint "%d-%B-%Y %H:%M:%S %p" (Calendar.now ())
  in
  Time_Zone.change curren_tz;
  log_msg

let get_time_log msg = Printf.sprintf "%s| %s\n" (get_time ()) msg
