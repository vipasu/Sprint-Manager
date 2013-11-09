// Set up a collection to contain goal information. On the server,
// it is backed by a MongoDB collection named "goals".

Sprints = new Meteor.Collection("sprints");
Goals = new Meteor.Collection("goals");
Tasks = new Meteor.Collection("tasks");
Settings = new Meteor.Collection("settings");

if (Meteor.isClient) {

    var clearUser = function() {
        while (Settings.findOne() !== 'undefined'){
            Settings.remove({_id : Settings.findOne()._id});
        }

    };

    Handlebars.registerHelper('newUser', function(){
        return (Settings.find().count() == 0);
    });

    Template.newProfile.events = {
        'submit': function(err, newProfile) {
            var now = new Date();
            var days_past = now.getDay();
            var prev_sunday = new Date(now - days_past * 24 * 60 * 60 * 1000);
            // Set to 12:00 AM
            prev_sunday.setHours(0,0,0,0);

            var profile = {
                name: newProfile.find("#name").value,
                start: now,
                sprint: prev_sunday,
                hours_per_day: parseInt(newProfile.find("#hpd").value),
                days_per_week: parseInt(newProfile.find("#dpw").value)
            };
            Settings.insert(profile);
	    Sprints.insert({goals:[], start: prev_sunday});
        }
    };

    Template.leaderboard.sprints = function() {
        return Sprints.findOne({},{ sort : { start : -1}});
    }

    Template.sprint.goals = function () {
        return Goals.find({_id: {$in : this.goals}});
    };

    Template.sprint.sprint_empty = function () {
        var curr_sprint = Sprints.findOne({},{ sort : { start : -1}});
        if (curr_sprint === undefined)
            return false;
        return curr_sprint.goals.length === 0;
    };

    Template.leaderboard.selected_name = function () {
        var goal = Goals.findOne(Session.get("selected_goal"));
        return goal && goal.name;
    };

    Template.leaderboard.events({
        'click input.inc': function () {
            Goals.update(Session.get("selected_goal"), {$inc: {score: 5}});
        }
    });

    Template.goal.selected = function () {
        return Session.equals("selected_goal", this._id) ? "selected" : '';
    };

    Template.goal.tasks = function(){
        var tasklist = Goals.findOne({name: this.name}).tasks;
        return Tasks.find({_id: { $in : tasklist} });
    }

    Template.leaderboard.sprint = function() {
        var now = new Date();
        var ms_in_2_weeks = 24 * 7 * 2 * 60 * 60 * 1000;
        var latest = Sprints.find({}, {sort: {start: -1}});
        if ((!latest) ||now - latest.start > ms_in_2_weeks) {
            latest = Sprint.insert({goals : [], start: nearestSunday()});
            console.log(latest);
            return Sprint.find({_id: latest});
        } else {
            return latest;
        }
        // TODO: Should we return the object instead of the cursor?
    }

    Template.goal.events({
        'click': function () {
            Session.set("selected_goal", this._id);
        }
    });

    Template.addTask.events = {
        'submit': function(err, task) {
            err.preventDefault();
            var newTask =  {
                name: task.find("#name").value,
                goal: task.find("#category").value,
                hours: task.find("#hours").value,
                hours_done: 0
            };
            var res = Tasks.insert(newTask);
            var goal_id = Goals.findOne({name: newTask.goal})._id
            Goals.update({_id: goal_id}, {$push : {tasks: res}});
        }
    }
}

// On server startup, create some goals if the database is empty.
if (Meteor.isServer) {
    Meteor.startup(function () {
        if (Goals.find().count() == 0) {
            Goals.insert({name: "Health", tasks: []});
        }
        var now = new Date();

        /*if (Settings.find({name: username}).count() === 0) {
            Settings.insert({name: username, start: now, sprint: now, hours_per_day: 8, days_per_week: 5});
        }*/
    });
}
Goals.find().fetch();
