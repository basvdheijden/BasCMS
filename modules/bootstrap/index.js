var express = require('express'),
		fs = require('fs'),
		url = require('url'),
    path = require('path'),
    helpers = require('../helpers'),
    modules = [],
    app = express.createServer(),
		themer,
    cache = true,
		root,
    buffer = {
      styles: '', 
      scripts: ''
    };

var memory_store = require('connect/middleware/session/memory'),
    sessions = new memory_store({ reapInterval: 60000 * 10 });

app.use(express.cookieDecoder());
app.use(express.session({store: sessions }));
app.use(express.bodyDecoder());
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

exports.require = function(module) {
  modules.push(require('../'+module));
  return exports;
};

exports.set_root = function(r) {
	root = r;
}
exports.get_root = function() {
	return root;
}

exports.init = function(port) {
  /* Get robots.txt */
  app.get('/robots.txt', function(req, res, next) {
    fs.readFile(process.cwd() + req.url, function(err, data) {
      if (err) throw err;
      res.header('Content-Type', 'text/plain');
      res.send(data);
    });
  });

  /* Static files server */
  app.get('/files/*', function(req, res, next) {
		if (!themer) themer = require('../themer');
		var folder = themer.get_theme();

    var uri = folder + req.url;
    path.exists(uri, function(exists) {
      if (!exists) res.send('404');
      
      fs.readFile(uri, function(err, data) {
        if (err) throw err;
        res.contentType(uri);
        res.send(data);
      });
    });
  });

  /* Get all scripts */
  app.get('/scripts', function(req, res, next) {
    if (cache && buffer.scripts.length) {
      res.send(buffer.scripts, {'Content-Type': 'text/javascript'});
      return;
    }
    else {
      buffer.scripts = '';
    }
    
    var script_path = process.cwd() + '/files/js/';
    helpers.readFiles(script_path, function(data){
      buffer.scripts = data;
      res.send(data, {'Content-Type': 'text/javascript'});
    });
  });

  /* Get all styles */
  app.get('/styles', function(req, res, next) {
    if (cache && buffer.styles.length) {
      res.send(buffer.styles, {'Content-Type': 'text/css'});
      return;
    }
    else {
      buffer.styles = '';
    }
    
    var script_path = process.cwd() + '/files/css/';
    helpers.readFiles(script_path, function(data){
      buffer.styles = data;
      res.send(data, {'Content-Type': 'text/css'});
    });
  });
  for(var i=0,l=modules.length;i<l;i++) {
    typeof modules[i].init === 'function' && modules[i].init(app, sessions);
  }
  
  app.listen(port);
  console.log('BAS @ CMS started. port='+port);
};

exports.get_app = function() {
  return app;
};

exports.set_cache = function(c) {
  cache = c;
};
