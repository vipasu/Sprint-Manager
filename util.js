/*
 * Function: calc_sprint_days_left
 * Return value: integer
 * last_sprint: Date object
 * weeks_per_sprint: integer
 */
var calc_sprint_days_left = function(last_sprint, weeks_per_sprint) {
  var ms_per_day = 24 * 60 * 60 * 1000;
  var ms_per_sprint = weeks_per_sprint * 7 * ms_per_day;
// milliseconds since last sprint
  var ms_past = Date.now() - last_sprint;
  var ms_left = weeks_per_sprint * ms_per_sprint - ms_past;
  return Math.floor(ms_left / ms_per_day);
};

/*
 * Function: update_settings
 * Return value:
 */
// TODO: Do functions need to have no parameters?
// TODO: Copy for each update setting
var update_settings = function(id, field, value) {
  Settings.update(
		  { _id : id },
		  { $set: {field: value} }
		  );
};

// TODO: Messages.find().fetch() -> array of objects
// Iterate over message
