var introResponses = require('./data/callresponse.js');
var validRooms = /Shell|#storjioshouse/;

module.exports = function(robot) {
  for (var i=0; i<introResponses.length; i++) {
    (function(j) {
      var nextResponse = introResponses[j];
      robot.hear(nextResponse.regex, function(res) {
        if (res.message.room.match(validRooms)) {
          return res.reply(nextResponse.response);
        }
      });
    })(i);
  }
};


