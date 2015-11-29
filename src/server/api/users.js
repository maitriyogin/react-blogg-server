module.exports = function(app, adapter) {
  var express = require('express');
  var usersRouter = express.Router();


  usersRouter.get('/', function(req, res) {
    adapter.find('users', req.query, res).then((val)=>{
      res.send(val)
    }).catch((val)=>{
      res.send(val)
    });
  });

  usersRouter.get('/:id?', function(req, res) {
    adapter.findById('users',req.params.id, res).then((val)=>{
      res.send(val)
    });
  });

  usersRouter.post('/', function(req, res) {
    adapter.post('users', res, req.body.user).then((val)=>{
      res.send(val)
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    adapter.delete('users', req.params.id, res);
  });

  usersRouter.put('/:id', function(req, res) {
    adapter.put('users',  res, req).then((val)=>{
      res.send(val)
    });
  });

  app.use('/api/users', usersRouter);
};
