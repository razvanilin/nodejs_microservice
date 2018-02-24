/* eslint-env mocha */

var supertest = require('supertest');
var server = require('../server');
var assert = require('assert');

describe('Testing API', function() {
  var app = null;
  var db = null;
  var id;
  var testCompanies = [{
    displayName: 'Company1'
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

  it('should return an empty list of companies', function(done) {
    supertest(app)
      .get('/company')
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(result.body, []);
        done();
      });
  });

  it('should create a new company', function(done) {
    supertest(app)
      .post('/company')
      .send(testCompanies[0])
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.equal(result.statusCode, 200);
        assert.equal(result.body.displayName, testCompanies[0].displayName);
        assert.equal(result.body.name, testCompanies[0].displayName.toLowerCase());
        id = result.body._id;
        done();
      });
  });

  it('should return the company just created', function(done) {
    supertest(app)
      .get('/company/' + id)
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.equal(result.statusCode, 200);
        assert.equal(result.body._id, id);
        assert.equal(result.body.displayName, testCompanies[0].displayName);
        assert.equal(result.body.name, testCompanies[0].displayName.toLowerCase());
        done();
      });
  });

  it('should update the company just created', function(done) {
    var newName = 'Company2';
    supertest(app)
      .put('/company/' + id)
      .send({_id: 'this should be ignored', displayName: newName})
      .end(function(err, result) {
        if (err) {
          return;
        }
        assert.equal(result.statusCode, 200);
        assert.equal(result.body._id, id);
        assert.equal(result.body.displayName, newName);
        assert.equal(result.body.name, newName.toLowerCase());
        done();
      });
  });
});
