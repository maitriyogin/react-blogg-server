module.exports = function() {

  var connectionString = process.env.NODE_ENV === 'production' ?
    process.env.DATABASE_URL :
    'pg://stephenwhite:5432@localhost/stephenwhite';

  var pg = require('pg');
  var Promise = require('promise');
  var insertSql = function(tableName, payload, method) {
    console.log("payload" +tableName + ', ' + JSON.stringify(payload));
    var _id;

    if (method == 'post' && payload._id !== undefined) {
      _id = payload._id;
      delete payload._id;
    }
    // create update
    var columns = '(';
    var values = ' VALUES(';
    var returning = '_id,';
    var i = 0;
    for (var property in payload) {
      if (payload.hasOwnProperty(property)) {
        if (i > 0) {
          values += ',';
          columns += ',';
          returning += ',';
        }
        i++;
        var val = payload[property];
        if(isNaN(val)){
          values += '\'' + val + '\'';
        } else {
          values += payload[property];
        }

        columns += property;
        returning += property;
      }
    }
    values += ')';
    columns += ')';

    var sql = 'INSERT INTO ' + tableName + ' ' + columns + values;
    sql += ' RETURNING ' + returning;

    console.log('post sql : ' + sql);
    return sql;
  }
  var findById = function(name, id, res) {
    return new Promise((resolve, reject) => {
      pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM ' + name + ' WHERE _id=' + id, function(err, result) {
          done();
          var ret = {};
          if (err) {
            console.error(err);
            resolve(err);
          }
          else {
            ret[name] = result.rows;
            resolve(ret);
          }
        });
      });
    });
  }

  return {
    findById: findById,

    find: function(name, query, res) {
      var qs = '';
      if(!query) query = {};
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
      return new Promise((resolve, reject) =>
      {
        pg.connect(connectionString, function(err, client, done) {
          try {
            client.query(qs, function(err, result) {
              done();
              var ret = {};
              if (err) {
                console.error(err);
                reject(err)
              }
              else {
                ret[name] = result.rows;
                resolve(ret)
              }
            });
          } catch (err) {
            console.error(err);
            reject(err)
          }
        });

      });
    },

    put: function(name, res, req) {
      if (req.body && req.body[name]) {

        var payload = req.body[name];
        console.log("payload" + JSON.stringify(payload));
        var _id;
        var that = this;
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
            var value = payload[property];
            if(isNaN(value)){
              value = '\'' + value + '\'';
            }

            sets += property + '=' + value;
          }
        }
        var sql = 'UPDATE ' + name + ' ' + sets + ' WHERE _id=' + _id;
        console.log(sql);
        return new Promise((resolve, reject) => {
          pg.connect(connectionString, function(err, client, done) {
            client.query(sql, function(err, result) {
              done();
              var ret = {};
              if (err) {
                console.error(err);
                resolve(err);
              }
              else {
                findById(name, _id, res).then((val)=>{
                  console.log('after put ' + JSON.stringify(val));
                  if(val.users && val.users.length > 0){
                    resolve(val.users[0]);
                  } else {
                    resolve(val);
                  }

                })
              }
            });
          });
        });

      } else {
        return new Promise((resolve, reject) => {
          var obj = {};
          obj[name] = '';
          resolve(obj);
        });
      }
    },

    post: function(name, res, req) {
      if (req.body && req.body[name]) {
        var payload = req.body[name];

        console.log('post ad: ' + JSON.stringify(req));
        var sql = insertSql(name, payload);
        return new Promise((resolve, reject) => {
          pg.connect(connectionString, function(err, client, done) {
            client.query(sql, function(err, result) {
              done();
              var ret = {};
              if (err) {
                console.error(err);
                resolve(err);
              }
              else {
                console.log('after post ' + JSON.stringify(result));
                  if(result.rows && result.rows.length > 0){
                    resolve(result.rows[0]);
                  } else {
                    resolve(result);
                  }
              }
            });
          });
        });

      } else {
        var obj = {};
        obj[name] = '';
        if(res) res.send(obj);
      }
    },

    delete: function(name, id, res) {
      console.log(`delete : name-${name}, id-${id}`);
      pg.connect(connectionString, function(err, client, done) {
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
              if(res) res.send("Error " + err);
            }
            else {
              if(res) res.send((result === 1) ? {} : {msg: 'error: ' + err});
            }
          });
        }
      });
    },

    clean: function(data, res) {
      console.log(JSON.stringify(data));
      pg.connect(connectionString, function(err, client, done) {
        data.forEach(function(table) {
          var sql = 'DELETE FROM ' + table.name;
          client.query(sql, function(err, result) {
            var ret = {};
            if (err) {
              console.error(err);
              if(res) res.send("Error " + err);
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
      pg.connect(connectionString, function(err, client, done) {
        data.forEach(function(table) {
            table.data.forEach(function(data) {
              console.log(JSON.stringify(data));

              var sql = insertSql(table.name, data, 'put');
              client.query(sql, function(err, result) {
                var ret = {};
                if (err) {
                  console.error(err);
                  if(res) res.send("Error " + err);
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
