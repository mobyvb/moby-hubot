// Description:
//   Commands for call responses
//
// Commands:
//   hubot list call response pairs - lists all call response pairs
//   hubot create call: <call> - creates a new call for hubot to respond to (not saved yet)
//   hubot response: <response> - associates response with previously set call (must run create call before this)
//   hubot delete call: <call> - deletes a call response pair

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var db;
if (fs.existsSync('/home/hubot/scripts/data')) {
  db = new sqlite3.Database('/home/hubot/scripts/data/mydb.db');
} else {
  db = new sqlite3.Database('./mydb.db');
}

var check;
var validRooms = /Shell|storjioshouse/;

module.exports = function(robot) {
  db.serialize(function() {
    if (!robot.responses) {
      robot.responses = {};
    }
    db.run('CREATE TABLE if not exists call_response (call TEXT PRIMARY KEY, response TEXT)');
    db.each("SELECT call, response FROM call_response", function(err, row) {
      robot.responses[row.call] = row.response;
      robot.respond(new RegExp(row.call, 'i'), function(res) {
        if (robot.responses[row.call]) {
          return res.reply(robot.responses[row.call]);
        }
      });
    });
  });

  robot.respond(/list call response pairs/i, function(res) {
    db.each("SELECT call, response FROM call_response", function(err, row) {
      res.send(row.call + ' ->\n' + row.response + '\n-----');
    }, function(err, count) {
      if (count === 0) {
        res.send('No call response pairs set. Try "create call: <call>"');
      }
    });
  });

  robot.respond(/create call: (.*)/i, function(res) {
    if (res.message.room.match(validRooms)) {
      if (!robot.unsavedCalls) {
        robot.unsavedCalls = {};
      }
      var user = res.message.user.name;
      var call = res.match[1];
      if (!robot.responses[call]) {
        robot.unsavedCalls[user] = call;
        res.reply('Stored "' + call + '" as a call pattern. Waiting for "response: <response>" to save the call-response pair.');
      } else {
        res.reply('There is already a response associated with call "' + call + '".');
      }
    }
  });

  robot.respond(/delete call: (.*)/i, function(res) {
    if (res.message.room.match(validRooms)) {
      var user = res.message.user.name;
      var call = res.match[1];
      robot.responses[call] = null;

      db.run('DELETE FROM call_response WHERE (call=$call)', {$call: call}, function(err) {
        if (err || this.changes < 1) {
          return res.reply('Error deleting call response pair from database. Does it exist?');
        }
        res.reply('Call response pair successfully deleted from database.');
      });
    }
  });

  robot.respond(/response: ((\n|.)*)/i, function(res) {
    if (res.message.room.match(validRooms)) {
      var user = res.message.user.name;
      if (!robot.unsavedCalls || !robot.unsavedCalls[user]) {
        return res.reply('There are no unsaved calls that require a response from you.');
      }

      var call = robot.unsavedCalls[user];
      var response = res.match[1];
      db.run('INSERT INTO call_response (call, response) VALUES ($call,$response)',
             {$call: call, $response: response}, function(err) {
        if (err) {
          return res.reply('Error adding call response pair to database. Is the call unique?');
        }

        res.reply('call:\n' + call + '\nresponse:\n' + response);
        robot.unsavedCalls[user] = null;

        if (robot.responses[call] === undefined) { // no hubot listener already attached to this call
          robot.responses[call] = response;
          robot.respond(new RegExp(call, 'i'), function(res) {
            if (robot.responses[call]) {
              return res.reply(robot.responses[call]);
            }
          });
        } else {
          robot.responses[call] = response;
        }
      });
    }
  });

  robot.respond(/which room/i, function(res) {
    return res.reply('The current room is "' + res.message.room + '"');
  });
};


