/* eslint-env mocha */

var supertest = require('supertest');
var server = require('../server');
var assert = require('assert');

describe('Testing User Route from the API', function() {
  var app = null;
  var db = null;
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

  beforeEach(function() {
    return server({
      port: 3330,
      dbhost: 'mongodb://localhost/businessTest',
      test: true
    }, function(serverConf) {
      app = serverConf.app;
      db = serverConf.db;
    });
  });

  afterEach(function(done) {
    app.close(done);
    app = null;
  });

  after(function(done) {
    db.dropDatabase(done);
  });

  it('should return an empty list of users', function(done) {
    supertest(app)
      .get('/user')
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(result.body, []);
        done();
      });
  });

  it('should create a new user', function(done) {
    supertest(app)
      .post('/user')
      .send(testUsers[0])
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.equal(result.statusCode, 200);
        assert.equal(result.body.email, testUsers[0].email);
        assert.equal(result.body.role, testUsers[0].role);
        id = result.body.email;
        done();
      });
  });

  it('should return the user just created', function(done) {
    supertest(app)
      .get('/user/' + id)
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.equal(result.statusCode, 200);
        assert.equal(result.body.email, id);
        assert.equal(result.body.role, testUsers[0].role);
        done();
      });
  });
});
