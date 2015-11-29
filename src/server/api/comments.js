module.exports = function(app, adapter) {
  var express = require('express');
  var commentsRouter = express.Router();

  commentsRouter.get('/', function(req, res) {
    adapter.find('comments', req.query, res);

  });

  commentsRouter.get('/:id?', function(req, res) {
    adapter.findById('comments',req.params.id, res);
  });

  commentsRouter.post('/', function(req, res) {
    adapter.post('comments', res, req.body.comment);
  });

  commentsRouter.delete('/:id', function(req, res) {
    adapter.delete('comments', req.params.id, res);
  });

  commentsRouter.put('/:id', function(req, res) {
    adapter.put('comments',  res, req);
  });

  app.use('/api/comments', commentsRouter);
};
