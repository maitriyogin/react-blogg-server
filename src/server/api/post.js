module.exports = function(app, adapter) {
  var express = require('express');
  var postsRouter = express.Router();

  postsRouter.get('/', function(req, res) {
    adapter.find('posts', req.query, res).then((val)=>{
      res.send(val)
    }).catch((val)=>{
      res.send(val)
    });
  });

  postsRouter.get('/:id?', function(req, res) {
    adapter.findById('posts',req.params.id, res).then((val)=>{
      res.send(val)
    });
  });

  postsRouter.post('/', function(req, res) {
    adapter.post('posts', res, req.body.post).then((val)=>{
      res.send(val)
    });
  });

  postsRouter.delete('/:id', function(req, res) {
    adapter.delete('posts', req.params.id, res);
  });

  postsRouter.put('/:id', function(req, res) {
    adapter.put('posts',  res, req).then((val)=>{
      res.send(val)
    });
  });

  app.use('/api/posts', postsRouter);
};
