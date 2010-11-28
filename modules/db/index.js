var mongodb = require('mongodb'),
    client;

var open_client = function() {
  client = new mongodb.Db('users', new mongodb.Server('localhost', 27017, {}), {});
  client.addListener('error', function(err) {
    console.log('Error connecting to MongoDB');
  });
}

exports.update = function(table, where, field, callback) {
  var callback = callback || function(){};
  
  if (!client) {
    open_client();
  }
  
  client.open(function(err, db) {
    client.collection(table, function(err, collection) {
      collection.update(where, field, function(err, updated_docs) {
        callback(err, updated_docs);
      });
    });
  });
};

exports.select = function(table, where, fields, callback) {
  var callback = callback || function() {};
  
  if (!client) {
    open_client();
  }
  
  client.open(function(err, db) {
    client.collection(table, function(err, collection) {
      collection.find(where, fields, function(err, cursor) {
        cursor.toArray(function(err, results) {
          callback(results);
        });
      });
    });
  });
};

exports.insert = function(table, data, callback) {
  callback = callback || function() {};
  
  if (!client) {
    open_client();
  }

  client.open(function(err, db) {
    client.collection(table, function(err, collection) {
      if (collection) {
        collection.insert(data, function(docs){
          callback(docs);
        });
      }
    });
  });
};

exports.remove = function(table, where, callback) {
  var callback = callback || function() {};
  
  if (!client) { 
    open_client(); 
  }
  
	console.log(table);
  client.open(function(err, db) {
    client.collection(table, function(err, collection) {
      if (collection) {
				if (where) {
	        collection.remove(where);
				}
        callback();
      }
    });
  });
};
