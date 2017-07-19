module.exports = function(robot) {
  robot.hear(/\[startmeeting\]/i, function(res) {
    if (robot.meetingInfo) {
      return res.send('Meeting is already in progress.');
    }

    var user = res.message.user.name;
    robot.meetingInfo = {
      topics: [],
      currentTopic: -1,
      leader: user
    };
    return res.send('Starting meeting with leader ' + user + '.');
  });

  robot.hear(/\[endmeeting\]/i, function(res) {
    if (!robot.meetingInfo) {
      return res.send('No meeting is currently in progress.');
    }

    var user = res.message.user.name;
    if (robot.meetingInfo.leader != user) {
      return res.send('Only ' + robot.meetingInfo.leader + ' can end the meeting.');
    }

    res.send('Stopping meeting.');

    var meetingInfo = robot.meetingInfo;
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

    robot.meetingInfo = null;

    meetingSummary += '```';

    res.send('Meeting summary:');
    return res.send(meetingSummary);
  });

  robot.hear(/\[topic\] (.*)/i, function(res) {
    if (!robot.meetingInfo) {
      return res.send('No meeting is currently in progress.');
    }

    var user = res.message.user.name;
    if (robot.meetingInfo.leader != user) {
      return res.send('Only ' + robot.meetingInfo.leader + ' can change the topic.');
    }

    var topicName = res.match[1];

    var newTopic = {
      name: topicName,
      actionItems: []
    };

    robot.meetingInfo.topics.push(newTopic);
    robot.meetingInfo.currentTopic++;

    return res.send('Setting topic to "' + topicName + '"');
  });

  robot.hear(/\[action\] (.*)/i, function(res) {
    if (!robot.meetingInfo) {
      return res.send('No meeting is currently in progress.');
    }

    if (robot.meetingInfo.currentTopic < 0) {
      return res.send('No topic is currently set.');
    }

    var actionItem = res.match[1];

    var currentTopic = robot.meetingInfo.currentTopic;
    robot.meetingInfo.topics[currentTopic].actionItems.push(actionItem);
    var topicName = robot.meetingInfo.topics[currentTopic].name;

    return res.send('Adding action item "' + actionItem + '" to topic "' + topicName + '"');
  });
};

