// Set up a collection to contain goal information. On the server,
// it is backed by a MongoDB collection named "goals".

Goals = new Meteor.Collection("goals");
Tasks = new Meteor.Collection("tasks");
Settings = new Meteor.Collection("settings");

if (Meteor.isClient) {
    Template.leaderboard.goals = function () {
        return Goals.find({}, {sort: {score: -1, name: 1}});
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
        //return Tasks.find({goal: this.name});
        var tasklist = Goals.findOne({name: this.name}).tasks;
        return Tasks.find({_id: { $in : tasklist} });
        //return the lookup of all the tasks
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

        var username = prompt('name'); //'test';
        if (Settings.find({name: username}).count() === 0) {
            Settings.insert({name: username, start: now, sprint: now, hours_per_day: 8, days_per_week: 5});
        }
    });
}
Goals.find().fetch();