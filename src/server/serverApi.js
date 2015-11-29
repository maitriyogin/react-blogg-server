var isProduction = process.env.NODE_ENV === 'production';

var env = {
  isProduction : isProduction,
  port : isProduction ? process.env.PORT : 3001,
  connectionString : isProduction ? process.env.DATABASE_URL : "pg://stephenwhite:5432@localhost/stephenwhite"
}


module.exports = function() {
  var globSync = require('glob').sync;
  var bodyParser = require('body-parser');
  var api = globSync('./api/**/*.js', {cwd: __dirname}).map(require);
  var express = require('express');
  var adapter = require('./adapter');

  var app = express();
  
  adapter = adapter(env);

  console.log('---------------------');
  console.log(' env : ' + JSON.stringify(env));
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });


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
