/*
 * Function: days_left
 * Return value: integer
 * last_sprint: Date object
 * weeks_per_sprint: integer
 */
var days_left = function() {
  var last_sprint = Settings.findOne().sprint;
  var ms_per_day = 24 * 60 * 60 * 1000;
  var ms_per_sprint = 7 * ms_per_day;
// milliseconds since last sprint
  var ms_past = Date.now() - last_sprint;
  var ms_left = ms_per_sprint - ms_past;
  return Math.floor(ms_left / ms_per_day);
};

/*
 * Function: edit_settings
 * Return value:
 */
// TODO: Do functions need to have no parameters?
// TODO: Copy for each update setting
var edit_settings = function(id, field, value) {
  Settings.update(
		  { _id : id },
		  { $set: {field: value} },
		  { multi: false}
		  );
};

var remove_task = function(id) {
  Tasks.remove({ _id : id });
};

// Can reverse functionality by doing negative hours
var add_hours = function(id, hours) {
  var task = Tasks.findAndModify({
		  query : { _id : id},
		  update : { $inc: {hours_done: hours} },
		  new : true
  });
  var task = Tasks.findOne({_id : id});
  var hours_left = task.hours - task.hours_done;
  var task_done = hours_left <= 0;
};


var finish_task = function(id) {
  var task = Tasks.findOne({_id : id});
  add_hours(id, task.hours - task.hours_done);
};

// Knapsack and then greedy algorithm for what to do in a day
var random_todo = function() {
  var tasks_todo = Tasks.find({ $where : "this.hours_done >= this.hours"});
  return tasks_todo[Math.floor(Math.random() * myArray.length)].fetch();
};	
/*
var todo = function() {
  var tasks_todo = Tasks.find({ $where : "this.hours_done >= this.hours"});
  var max_weight = function(a,b) {
    a.
};*/
