'use strict'

const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const path = require('path');
const Robot = require('../../src/robot');
const TextMessage = require('../../src/message').TextMessage;


describe('Meetings', function() {
  var robot;
  var user1;
  var user2;
  var user3;
  var adapter;

  beforeEach(function(done) {
    // create new robot, without http, using the mock adapter
    robot = new Robot(null, 'mock-adapter', false, 'storjio');

    robot.adapter.on('connected', function() {
      process.env.HUBOT_AUTH_ADMIN = '1';

      require('../../scripts/storj-meetings')(robot);

      // create a user
      user1 = robot.brain.userForId('1', {
        name: 'bob',
        room: '#dev'
      });

      user2 = robot.brain.userForId('2', {
        name: 'sally',
        room: '#dev'
      });

      user3 = robot.brain.userForId('3', {
        name: 'jimbo',
        room: '#jimbosroom'
      });

      adapter = robot.adapter;

      done();
    });

    robot.run();
  });

  afterEach(function() {
    robot.shutdown();
  });

  describe('startmeeting', function() {
    it('should start a meeting with [startmeeting]', function(done) {
      var testMeetingInfo = {
        topics: [],
        currentTopic: -1,
        leader: 'bob'
      };

      expect(robot.meetings).to.equal(undefined);

      adapter.on('send', function(envelope, strings) {
        expect(robot.meetings['#dev']).to.deep.equal(testMeetingInfo);
        expect(strings[0]).to.equal('Starting meeting with leader bob.');
        done();
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
    });

    it('should not start a meeting in the same channel if one is ongoing', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(strings[0]).to.equal('Meeting is already in progress.');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user1, '[startmeeting]'));
    });

    it('should be able to start simultaneous meetings in different channels', function(done) {
      var testMeetingInfo1 = {
        topics: [],
        currentTopic: -1,
        leader: 'bob'
      };

      var testMeetingInfo2 = {
        topics: [],
        currentTopic: -1,
        leader: 'jimbo'
      };

      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(robot.meetings['#dev']).to.deep.equal(testMeetingInfo1);
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(robot.meetings['#jimbosroom']).to.deep.equal(testMeetingInfo2);
          expect(strings[0]).to.equal('Starting meeting with leader jimbo.');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user3, '[startmeeting]'));
    });
  });

  describe('topic', function() {
    it('should allow the leader to change the topic with [topic]', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(robot.meetings['#dev'].topics[0].name).to.equal('test topic');
          expect(strings[0]).to.equal('Setting topic to "test topic"');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user1, '[topic] test topic'));
    });

    it('should not do anything if a meeting is not in progress', function(done) {
      adapter.on('send', function(envelope, strings) {
        expect(strings[0]).to.equal('No meeting is currently in progress.');
        done();
      });

      adapter.receive(new TextMessage(user1, '[topic] test topic'));
    });

    it('should only allow the leader to change the topic', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(robot.meetings['#dev'].topics.length).to.equal(0);
          expect(strings[0]).to.equal('Only bob can change the topic.');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user2, '[topic] test topic'));
    });
  });

  describe('action', function() {
    it('should allow users to add action items with [action]', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else if (count === 1) {
          expect(robot.meetings['#dev'].topics[0].name).to.equal('test topic');
          expect(strings[0]).to.equal('Setting topic to "test topic"');
        } else {
          expect(robot.meetings['#dev'].topics[0].actionItems[0]).to.equal('test action');
          expect(strings[0]).to.equal('Adding action item "test action" to topic "test topic"');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user1, '[topic] test topic'));
      adapter.receive(new TextMessage(user1, '[action] test action'));
    });

    it('should not do anything if a meeting is not in progress', function(done) {
      adapter.on('send', function(envelope, strings) {
        expect(strings[0]).to.equal('No meeting is currently in progress.');
        done();
      });

      adapter.receive(new TextMessage(user1, '[action] test action'));
    });

    it('should not do anything if a topic is not set', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(strings[0]).to.equal('No topic is currently set.');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user1, '[action] test action'));
    });
  });

  describe('endmeeting', function() {
    it('should end a meeting with [endmeeting]', function(done) {
      robot.meetings = {};
      robot.meetings['#dev'] = {
        topics: [
          {
            name: 'test topic',
            actionItems: ['test action']
          }
        ],
        currentTopic: 0,
        leader: 'bob'
      };

      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Stopping meeting.');
        } else if (count === 1) {
          expect(strings[0]).to.equal('Meeting summary:');
        } else {
          expect(strings[0]).to.equal('```Topics:\ntest topic\n\tAction Items:\n\ttest action\n```');
          expect(robot.meetings['#dev']).to.equal(null);
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[endmeeting]'));
    });

    it('should only allow the leader to end the meeting', function(done) {
      var count = 0;
      adapter.on('send', function(envelope, strings) {
        if (count === 0) {
          expect(strings[0]).to.equal('Starting meeting with leader bob.');
        } else {
          expect(strings[0]).to.equal('Only bob can end the meeting.');
          done();
        }
        count++;
      });

      adapter.receive(new TextMessage(user1, '[startmeeting]'));
      adapter.receive(new TextMessage(user2, '[endmeeting]'));
    });

    it('should not do anything if a meeting is not in progress', function(done) {
      adapter.on('send', function(envelope, strings) {
        expect(strings[0]).to.equal('No meeting is currently in progress.');
        done();
      });

      adapter.receive(new TextMessage(user1, '[endmeeting]'));
    });
  });
});
