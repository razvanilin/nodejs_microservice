/* eslint-env mocha */

var assert = require('assert');
var mongoose = require('mongoose');
var UserController = require('../controllers/UserController');

describe('Testing the User controller', function() {
  var id;
  var testUsers = [{
    email: 'user1@email.com',
    role: 'basic'
  }, {
    email: 'user2@email.com',
    role: 'admin'
  }, {
    email: 'user3@email.com',
    role: 'dummy'
  }];

  var User = new UserController();

  beforeEach(function(done) { // eslint-disable-line consistent-return
    if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://localhost/businessTest', done);
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(done);
  });

  it('should find an empty list of users', function(done) {
    User.list()
      .then(function(companies) {
        assert.deepEqual(companies, []);
        done();
      });
  });

  it('should fail at creating a new user because of the wrong role', function(done) {
    User.create(testUsers[2])
      .then(function(user) {
        assert.equal(user._id, null);
        done();
      });
  });

  it('should create a new user', function(done) {
    User.create(testUsers[0])
      .then(function(user) {
        id = user.email;
        assert.equal(user.email, testUsers[0].email);
        assert.equal(user.role, testUsers[0].role);
        done();
      });
  });

  it('should find the newly created user', function(done) {
    User.findById(id)
      .then(function(user) {
        assert.equal(user.email, id);
        assert.equal(user.role, testUsers[0].role);
        done();
      });
  });
});
