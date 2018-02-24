var UserController = require('../controllers/UserController');

module.exports = function(app, route) {
  var User = new UserController();
  /*
  ** Route to get all the users
  */
  app.get('/' + route, function(req, res) {
    User.list()
      .then(function(users) {
        return res.status(200).send(users);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  /*
  ** Route to get a single user
  */
  app.get('/' + route + '/:id', function(req, res) {
    User.findById(req.params.id)
      .then(function(user) {
        return res.status(200).send(user);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  /*
  ** Route to create a user
  */
  app.post('/' + route, function(req, res) {
    User.create(req.body)
      .then(function(user) {
        return res.status(200).send(user);
      })
      .catch(function(error) {
        return res.status(400).send(error);
      });
  });

  return function(req, res, next) {
    next();
  };
};
