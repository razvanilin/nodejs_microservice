/* eslint-env mocha */

var assert = require('assert');
var server = require('../server');
var CompanyController = require('../controllers/CompanyController');

describe('Testing the controllers', function() {
  var db = null;
  var app = null;
  var id;
  var testCompanies = [{
    displayName: 'Company1'
  }];
  var Company = new CompanyController();

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

  it('should find an empty list of companies', function(done) {
    Company.list()
      .then(function(companies) {
        assert.deepEqual(companies, []);
        done();
      });
  });

  it('should fail at creating a new company because of an empty name', function(done) {
    Company.create({displayName: ''})
      .then(function(company) {
        assert.equal(company._id, null);
        done();
      })
      .catch(function() {

      });
  });

  it('should create a new company', function(done) {
    Company.create(testCompanies[0])
      .then(function(company) {
        id = company._id;
        assert.equal(company.displayName, testCompanies[0].displayName);
        assert.equal(company.name, testCompanies[0].displayName.toLowerCase());
        done();
      });
  });

  it('should find the newly created company', function(done) {
    Company.findById(id)
      .then(function(company) {
        assert.equal(company._id, id);
        assert.equal(company.displayName, testCompanies[0].displayName);
        assert.equal(company.name, testCompanies[0].displayName.toLowerCase());
        done();
      });
  });

  it('should update the company but leave the ID intact', function(done) {
    var newName = 'Company1New';
    Company.update(id, {displayName: newName, _id: 'this should not update'})
      .then(function(company) {
        assert.equal(company._id, id);
        assert.equal(company.displayName, newName);
        assert.equal(company.name, newName.toLowerCase());
        done();
      });
  });
});
