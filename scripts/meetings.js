module.exports = function(robot) {
  robot.hear(/\[startmeeting\]/i, function(res) {
    if (!robot.meetings) {
      robot.meetings = {};
    }

    var room = res.message.user.room;
    if (robot.meetings[room]) {
      return res.send('Meeting is already in progress.');
    }

    var user = res.message.user.name;
    robot.meetings[room] = {
      topics: [],
      currentTopic: -1,
      leader: user
    };
    return res.send('Starting meeting with leader ' + user + '.');
  });

  robot.hear(/\[endmeeting\]/i, function(res) {
    var room = res.message.user.room;
    if (!robot.meetings || !robot.meetings[room]) {
      return res.send('No meeting is currently in progress.');
    }

    var user = res.message.user.name;
    if (robot.meetings[room].leader != user) {
      return res.send('Only ' + robot.meetings[room].leader + ' can end the meeting.');
    }

    res.send('Stopping meeting.');

    var meetingInfo = robot.meetings[room];
    var meetingSummary = '```';
    meetingSummary += 'Topics:\n';
    for (var i=0; i<meetingInfo.topics.length; i++) {
      var topic = meetingInfo.topics[i];
      meetingSummary += topic.name + '\n';
      meetingSummary += '\tAction Items:\n';
      for (var j=0; j<topic.actionItems.length; j++) {
        var actionItem = topic.actionItems[j];
        meetingSummary += '\t' + actionItem + '\n';
      }
    }

    robot.meetings[room] = null;

    meetingSummary += '```';

    res.send('Meeting summary:');
    return res.send(meetingSummary);
  });

  robot.hear(/\[topic\] (.*)/i, function(res) {
    var room = res.message.user.room;
    if (!robot.meetings || !robot.meetings[room]) {
      return res.send('No meeting is currently in progress.');
    }

    var user = res.message.user.name;
    if (robot.meetings[room].leader != user) {
      return res.send('Only ' + robot.meetings[room].leader + ' can change the topic.');
    }

    var topicName = res.match[1];

    var newTopic = {
      name: topicName,
      actionItems: []
    };

    robot.meetings[room].topics.push(newTopic);
    robot.meetings[room].currentTopic++;

    return res.send('Setting topic to "' + topicName + '"');
  });

  robot.hear(/\[action\] (.*)/i, function(res) {
    var room = res.message.user.room;
    if (!robot.meetings || !robot.meetings[room]) {
      return res.send('No meeting is currently in progress.');
    }

    if (robot.meetings[room].currentTopic < 0) {
      return res.send('No topic is currently set.');
    }

    var actionItem = res.match[1];

    var currentTopic = robot.meetings[room].currentTopic;
    robot.meetings[room].topics[currentTopic].actionItems.push(actionItem);
    var topicName = robot.meetings[room].topics[currentTopic].name;

    return res.send('Adding action item "' + actionItem + '" to topic "' + topicName + '"');
  });
};

