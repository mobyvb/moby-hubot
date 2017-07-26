'use strict'

const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const path = require('path');
const Robot = require('../../src/robot');
const TextMessage = require('../../src/message').TextMessage;


describe('Intro', function() {
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

      require('../../scripts/storj-intro')(robot);

      // create a user
      user1 = robot.brain.userForId('1', {
        name: 'bob',
        room: '#storjioshouse'
      });

      user2 = robot.brain.userForId('2', {
        name: 'sally',
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

  it('should respond to users in a valid room', function(done) {
    adapter.on('reply', function(envelope, strings) {
      expect(strings[0]).to.equal('to update the gui, do x');
      done();
    });

    adapter.receive(new TextMessage(user1, 'Update GUI'));
  });

  it('should not respond to users in an invalid room', function(done) {
    adapter.on('reply', function(envelope, strings) {
      done(new Error('robot replied when it should not have'));
    });

    // TODO test this without a timeout
    setTimeout(function() {
      done();
    }, 200);

    adapter.receive(new TextMessage(user2, 'Update GUI'));
  });

});
