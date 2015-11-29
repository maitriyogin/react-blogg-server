module.exports = function(env) {
  var pg = require('pg');

  var insertSql = function(tableName, payload, method) {
    console.log("payload" + JSON.stringify(payload));
    var _id;

    if (method == 'post' && payload._id !== undefined) {
      _id = payload._id;
      delete payload._id;
    }
    // create update
    var columns = '(';
    var values = ' VALUES(';
    var i = 0;
    for (var property in payload) {
      if (payload.hasOwnProperty(property)) {
        if (i > 0) {
          values += ',';
          columns += ',';
        }
        i++;
        var val = payload[property];
        if(isNaN(val)){
          values += '\'' + val + '\'';
        } else {
          values += payload[property];
        }

        columns += property;
      }
    }
    values += ')';
    columns += ')';

    var sql = 'INSERT INTO ' + tableName + ' ' + columns + values;
    console.log('post sql : ' + sql);
    return sql;
  }

  return {
    findById: function(name, id, res) {

      pg.connect(env.connectionString, function(err, client, done) {

        client.query('SELECT * FROM ' + name + ' WHERE _id=' + id, function(err, result) {
          done();
          var ret = {};
          if (err) {
            console.error(err);
            res.send("Error " + err);
          }
          else {
            ret[name] = result.rows;
            res.send(ret);
          }
        });
      });
    },

    find: function(name, query, res) {
      var qs = '';
      // convert query into sql, should be name values
      console.log('query : ' + JSON.stringify(query, null, 2));
      var i = 0;
      for (var property in query) {
        if (i == 0) {
          qs += ' WHERE ';
        }
        if (i > 0) {
          qs += ' AND ';
        }
        if (isNaN(query[property])) {
          qs += property + ' LIKE \'%' + query[property] + '%\'';
        } else {
          qs += property + '=' + query[property];
        }
        i++;
      }
      qs = 'SELECT * FROM ' + name + qs;
      console.log('find : ' + qs);
      pg.connect(env.connectionString, function(err, client, done) {
        try {
          client.query(qs, function(err, result) {
            done();
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
            }
            else {
              ret[name] = result.rows;
              res.send(ret);
            }
          });
        } catch (err) {
          console.error(err);
          res.send("Error " + err);
        }
      });
    },

    put: function(name, res, req) {
      if (req.body && req.body[name]) {

        var payload = req.body[name];
        console.log("payload" + JSON.stringify(payload));
        var _id;
        if (payload._id !== undefined) {
          _id = payload._id;
          delete payload._id;
        }
        // create update
        var sets = 'SET ';
        var i = 0;
        for (var property in payload) {
          if (payload.hasOwnProperty(property)) {
            if (i > 0) {
              sets += ','
            }
            i++;
            sets += property + '=' + payload[property];
          }
        }
        var sql = 'UPDATE ' + name + sets + ' WHERE _id=' + _id;
        pg.connect(env.connectionString, function(err, client, done) {
          client.query(sql, function(err, result) {
            done();
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
            }
            else {
              pg.findById(name, _id, res);
            }
          });
        });

      } else {
        var obj = {};
        obj[name] = '';
        res.send(obj);
      }
    },

    post: function(name, res, req) {
      if (req.body && req.body[name]) {

        var payload = req.body[name];
        var sql = insertSql(payload);
        pg.connect(env.connectionString, function(err, client, done) {
          client.query(sql, function(err, result) {
            done();
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
            }
            else {
              pg.findById(name, _id, res);
            }
          });
        });

      } else {
        var obj = {};
        obj[name] = '';
        res.send(obj);
      }
    },

    delete: function(name, id, res) {
      console.log(`delete : name-${name}, id-${id}`);
      pg.connect(env.connectionString, function(err, client, done) {
        if (id) {
          let queryString = `DELETE FROM ${name}`;
          if (id) {
            queryString = `DELETE FROM ${name} WHERE _id=${id}`;
          }
          client.query('DELETE FROM ' + name + ' WHERE _id=' + id, function(err, result) {
            done();
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
            }
            else {
              res.send((result === 1) ? {} : {msg: 'error: ' + err});
            }
          });
        }
      });
    },

    clean: function(data, res) {

      pg.connect(env.connectionString, function(err, client, done) {
        data.forEach(function(table) {
          var sql = 'DELETE FROM ' + table.name;
          client.query(sql, function(err, result) {
            var ret = {};
            if (err) {
              console.error(err);
              res.send("Error " + err);
              done();
            }
            else {
              console.log('cleaned : ' + sql);

            }
          });
        });
        done();

      });
    },

    insertAll: function(data, res) {
      pg.connect(env.connectionString, function(err, client, done) {
        data.forEach(function(table) {
            table.data.forEach(function(data) {
              console.log(JSON.stringify(data));

              var sql = insertSql(table.name, data, 'put');
              client.query(sql, function(err, result) {
                var ret = {};
                if (err) {
                  console.error(err);
                  res.send("Error " + err);
                  done();
                } else {
                  console.log('inserted : ' + sql);
                }
              });
            });
        });
        done();
      });

    }
  }
}
