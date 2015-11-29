module.exports = function(app, adapter) {
  var express = require('express');
  var postsRouter = express.Router();

  postsRouter.get('/', function(req, res) {
    adapter.find('posts', req.query, res);
  });

  postsRouter.get('/:id?', function(req, res) {
    adapter.findById('posts',req.params.id, res);
  });

  postsRouter.post('/', function(req, res) {
    adapter.post('posts', res, req.body.post);
  });

  postsRouter.delete('/:id', function(req, res) {
    adapter.delete('posts', req.params.id, res);
  });

  postsRouter.put('/:id', function(req, res) {
    adapter.put('posts',  res, req);
  });

  app.use('/api/posts', postsRouter);
};
