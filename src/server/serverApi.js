var isProduction = process.env.NODE_ENV === 'production';

var env = {
  isProduction : isProduction,
  port : isProduction ? process.env.PORT : 3001
}

// "postgres://epsnrnnvupsuur:2tDRMbPZ7QrQeyiE342hVldDmR@ec2-54-83-201-196.compute-1.amazonaws.com:5432/d9l7bj2t8sljkl"

module.exports = function() {
  var globSync = require('glob').sync;
  var bodyParser = require('body-parser');
  var api = globSync('./api/**/*.js', {cwd: __dirname}).map(require);
  var express = require('express');
  var adapter = require('./adapter')();
  var graphql = require('graphql');
  var expressGraphql = require('express-graphql');
  var Schema = require('./schema.js');

  var app = express();


  console.log('---------------------');
  console.log(' env : ' + JSON.stringify(env));
  console.log('---------------------');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.use('/gql', expressGraphql({
    schema: Schema,
    graphiql: true
  }));

  // this will setup the router with the apis
  api.forEach(function(route) {
    route(app, adapter);
  });

  var server = app.listen(env.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Bloggs server listening at http://%s:%s', host, port);
  });

};
