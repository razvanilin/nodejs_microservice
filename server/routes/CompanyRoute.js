var CompanyController = require('../controllers/CompanyController');

module.exports = function(app, route) {
  var Company = new CompanyController();
  /*
  ** Route to get all the companies
  */
  app.get('/' + route, function(req, res) {
    Company.list()
      .then(function(companies) {
        return res.status(200).send(companies);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  /*
  ** Route to get a single company
  */
  app.get('/' + route + '/:id', function(req, res) {
    Company.findById(req.params.id)
      .then(function(company) {
        return res.status(200).send(company);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  /*
  ** Route to create a company
  */
  app.post('/' + route, function(req, res) {
    Company.create(req.body)
      .then(function(company) {
        return res.status(200).send(company);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  /*
  ** Route to update a company
  */
  app.put('/' + route + '/:id', function(req, res) {
    Company.update(req.params.id, req.body)
      .then(function(company) {
        return res.status(200).send(company);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  return function(req, res, next) {
    next();
  };
};
