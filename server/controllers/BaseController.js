function BaseController(model, key) {
  this.model = model;
  this.key = key;
}

BaseController.prototype.list = function() {
  return this.model
    .find({})
    .then(function(docs) {
      return docs;
    });
};

BaseController.prototype.create = function(data) {
  return this.model
    .create(data)
    .then(function(doc) {
      return doc;
    })
    .catch(function(error) {
      return error;
    });
};

BaseController.prototype.findById = function(id) {
  // prepare the query options with the correct primary key
  var queryOpt = {};
  queryOpt[this.key] = id;

  return this.model
    .findOne(queryOpt)
    .then(function(doc) {
      return doc;
    });
};

BaseController.prototype.update = function(id, data) {
  var queryOpt = {};
  queryOpt[this.key] = id;

  // find the right document and then update it with the data passed
  return this.model
    .findOne(queryOpt)
    .then(function(doc) {
      // go through the data and prepare the update object
      for (var attr in data) {
        // ignore the attribute if it coincides with the key
        if (data.attr && attr !== this.key && attr !== '_id') {
          doc[attr] = data[attr];
        }
      }

      return doc.save();
    })
    .then(function(doc) {
      return doc;
    });
};

module.exports = BaseController;
