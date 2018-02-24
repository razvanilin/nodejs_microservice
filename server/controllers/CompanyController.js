var mongoose = require('mongoose');
var BaseController = require('./BaseController');
var CompanySchema = require('../models/Company');

function CompanyController() {
  var companyModel = mongoose.model('company', CompanySchema);
  BaseController.call(this, companyModel, '_id');
}

CompanyController.prototype = Object.create(BaseController.prototype);
CompanyController.prototype.contructor = CompanyController;

CompanyController.prototype.addWorkspace = function(companyId, workspace) {
  return this.model.findById(companyId)
    .then(function(company) {
      company.workspaces.push(workspace);
      return company.save();
    })
    .then(function(updatedCompany) {
      return updatedCompany;
    })
    .catch(function(error) {
      return error;
    });
};

CompanyController.prototype.updateWorkspace = function(workspaceId, data) {
  return this.model.findOne({'workspaces._id': workspaceId})
    .then(function(company) {
      if (!company) throw new Error('no document');

      var workspace;
      for (var i in company.workspaces) {
        if (company.workspaces[i]._id === workspaceId) {
          workspace = company.workspaces[i];
          break;
        }
      }

      for (var j in data) {
        // modify the data in the workspace but make sure to not modify the primary key
        if (j !== '_id' && j !== this.key) {
          workspace[j] = data[j];
        }
      }

      return company.save();
    })
    .then(function(company) {
      return company;
    })
    .catch(function(error) {
      return error;
    });
};

CompanyController.prototype.assignUserToWorkspace = function(workspaceId, userId) {
  return this.model.findOne({'workspaces._id': workspaceId})
    .then(function(company) {
      if (!company) throw new Error('no document');

      var workspace;
      for (var i in company.workspaces) {
        if (company.workspaces[i]._id === workspaceId) {
          workspace = company.workspaces[i];
          break;
        }
      }

      if (!workspace.users) workspace.users = [];
      workspace.users.push(userId);

      return company.save();
    })
    .then(function(company) {
      return company;
    })
    .catch(function(error) {
      return error;
    });
};

CompanyController.prototype.removeUserFromWorkspace = function(workspaceId, userId) {
  return this.model.findOne({'workspaces._id': workspaceId})
    .then(function(company) {
      if (!company) throw new Error('no document');

      var workspace;
      for (var i in company.workspaces) {
        if (company.workspaces[i]._id === workspaceId) {
          workspace = company.workspaces[i];
          break;
        }
      }

      var cutIndex;
      for (var j in workspace.users) {
        if (workspace.users[j].toString() === userId.toString()) {
          cutIndex = j;
        }
      }
      workspace.users.splice(cutIndex, 1);

      return company.save();
    })
    .then(function(company) {
      return company;
    })
    .catch(function(error) {
      return error;
    });
};

module.exports = CompanyController;
