module.exports = function(app, adapter) {
  var express = require('express');
  var usersRouter = express.Router();


  usersRouter.get('/', function(req, res) {
    adapter.find('users', req.query, res);
  });

  usersRouter.get('/:id?', function(req, res) {
    adapter.findById('users',req.params.id, res);
  });

  usersRouter.post('/', function(req, res) {
    adapter.post('users', res, req.body.user);
  });

  usersRouter.delete('/:id', function(req, res) {
    adapter.delete('users', req.params.id, res);
  });

  usersRouter.put('/:id', function(req, res) {
    adapter.put('users',  res, req);
  });

  app.use('/api/users', usersRouter);
};
