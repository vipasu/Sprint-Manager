// Set up a collection to contain task information. On the server,
// it is backed by a MongoDB collection named "tasks".

Tasks = new Meteor.Collection("tasks");

if (Meteor.isClient) {
  Template.leaderboard.tasks = function () {
    return Tasks.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var task = Tasks.findOne(Session.get("selected_task"));
    return task && task.name;
  };

  Template.task.selected = function () {
    return Session.equals("selected_task", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Tasks.update(Session.get("selected_task"), {$inc: {score: 5}});
    }
  });

  Template.task.events({
    'click': function () {
      Session.set("selected_task", this._id);
    }
  });
}

// On server startup, create some tasks if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Tasks.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Tasks.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
