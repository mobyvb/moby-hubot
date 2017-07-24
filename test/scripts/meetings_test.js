'use strict'

const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const path = require('path');
const Robot = require('../../src/robot');
const TextMessage = require('../../src/message').TextMessage;


describe('Meetings', function() {
  describe('startmeeting', function() {
    var robot;
    var user;
    var adapter;

    beforeEach(function(done) {
      // create new robot, without http, using the mock adapter
      robot = new Robot(null, 'mock-adapter', false, 'storjio');

      robot.adapter.on('connected', function() {
        process.env.HUBOT_AUTH_ADMIN = '1';

        require('../../scripts/meetings')(robot);

        // create a user
        user = robot.brain.userForId('1', {
          name: 'bob',
          room: '#dev'
        });

        adapter = robot.adapter;

        done();
      });

      robot.run();
    });

    afterEach(function() {
      robot.shutdown();
    });

    it('should start a meeting if one is not ongoing', function(done) {
      var testMeetingInfo = {
        topics: [],
        currentTopic: -1,
        leader: 'bob'
      };

      expect(robot.meetingInfo).to.equal(undefined);

      adapter.on('send', function(envelope, strings) {
        expect(robot.meetingInfo).to.deep.equal(testMeetingInfo);
        expect(strings[0]).to.equal('Starting meeting with leader bob.');
        done();
      });

      adapter.receive(new TextMessage(user, '[startmeeting]'));
    });

    it('should not start a meeting if one is ongoing', function(done) {
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

      adapter.receive(new TextMessage(user, '[startmeeting]'));
      adapter.receive(new TextMessage(user, '[startmeeting]'));
    });
  });

  describe('topic', function() {

  });

  describe('action', function() {

  });

  describe('endmeeting', function() {

  });
});
