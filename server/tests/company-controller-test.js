/* eslint-env mocha */

var assert = require('assert');
var mongoose = require('mongoose');
var CompanyController = require('../controllers/CompanyController');
var UserController = require('../controllers/UserController');

describe('Testing the Company controller', function() {
  var id;
  var idw;
  var idu;

  var testCompanies = [{
    displayName: 'Company1'
  }];
  var testWorkspaces = [{
    displayName: 'Development'
  }, {
    displayName: 'Maketing'
  }];
  var testUsers = [{
    email: 'user1@email.com',
    role: 'admin'
  }];

  var Company = new CompanyController();
  var User = new UserController();

  beforeEach(function(done) { // eslint-disable-line consistent-return
    if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://localhost/businessTest', done);
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(done);
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

  it('should fail at creating a workspace in the company because of empty name', function(done) {
    Company.addWorkspace(id, {displayName: ''})
      .then(function(company) {
        assert.equal(company, null);
      })
      .catch(function() {
        done();
      });
  });

  it('should create a valid workspace', function(done) {
    Company.addWorkspace(id, testWorkspaces[0])
      .then(function(company) {
        idw = company.workspaces[0]._id;
        assert.equal(company.workspaces[0].displayName, testWorkspaces[0].displayName);
        assert.equal(company.workspaces[0].name, testWorkspaces[0].displayName.toLowerCase());
        done();
      });
  });

  it('should create a second workspace in the company', function(done) {
    Company.addWorkspace(id, testWorkspaces[1])
      .then(function(company) {
        assert.equal(company.workspaces.length, 2);
        done();
      });
  });

  it('should fail to create a new workspace because of duplicity', function(done) {
    Company.addWorkspace(id, testWorkspaces[1])
      .then(function(company) {
        assert.equal(company, null);
      })
      .catch(function() {
        done();
      });
  });

  it('should update the first workspace', function(done) {
    var newName = 'NewDevelopment';
    Company.updateWorkspace(idw, {displayName: newName, _id: 'this should be ignored'})
      .then(function(company) {
        assert.equal(company.workspaces[0]._id, idw);
        assert.equal(company.workspaces[0].displayName, newName);
        assert.equal(company.workspaces[0].name, newName.toLowerCase());
        done();
      });
  });

  it('should create a user', function(done) {
    User.create(testUsers[0])
      .then(function(user) {
        idu = user._id;
        assert.equal(user.email, testUsers[0].email);
        assert.equal(user.role, testUsers[0].role);
        done();
      });
  });

  it('should assign the user to a workspace', function(done) {
    Company.assignUserToWorkspace(idw, idu)
      .then(function(company) {
        assert.equal(company.workspaces[0].users[0], idu);
        done();
      });
  });

  it('should remove the user from the workspace', function(done) {
    Company.removeUserFromWorkspace(idw, idu)
      .then(function(company) {
        assert.equal(company.workspaces[0].users.length, 0);
        done();
      });
  });
});
