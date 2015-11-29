module.exports = function(app,adapter) {
  var express = require('express');
  var dataRouter = express.Router();
  var data = require('../data/data');

  dataRouter.get('/clean', function(req, res) {
    adapter.clean(data.data, res);
    res.send("ok");
  });
  dataRouter.get('/reset', function(req, res) {
    adapter.clean(data.data, res);
    adapter.insertAll(data.data);
    res.send('ok');
  });
  dataRouter.get('/insertAll', function(req, res) {
    adapter.insertAll(data.data, res);
    res.send('ok');
  });
  app.use('/api/data', dataRouter);
};
