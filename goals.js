// Set up a collection to contain goal information. On the server,
// it is backed by a MongoDB collection named "goals".

Goals = new Meteor.Collection("goals");

if (Meteor.isClient) {
  Template.leaderboard.goals = function () {
    return Goals.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var goal = Goals.findOne(Session.get("selected_goal"));
    return goal && goal.name;
  };

  Template.goal.selected = function () {
    return Session.equals("selected_goal", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Goals.update(Session.get("selected_goal"), {$inc: {score: 5}});
    }
  });

  Template.goal.events({
    'click': function () {
      Session.set("selected_goal", this._id);
    }
  });
}

// On server startup, create some goals if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Goals.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Goals.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
