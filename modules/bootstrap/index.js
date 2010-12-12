var express = require('express'),
		fs = require('fs'),
		url = require('url'),
    path = require('path'),
    helpers = require('../helpers'),
		iniparser = require('iniparser'),
    modules = {},
    app = express.createServer(),
    cache = true,
		themer,
		theme,
		root,
    buffer = {
      styles: '', 
      scripts: ''
    },
		config;


//parse and/or return config file
exports.get_config = function(callback) {
	if (config) {
		callback(config);
	}
	else {
		iniparser.parse(process.cwd() + '/config.ini', function(data) {
			config = data;
			callback(config);
		});
	}
}

//initialize cookies/sessions support
var memory_store = require('connect/middleware/session/memory'),
    sessions = new memory_store({ reapInterval: 60000 * 10 });
app.use(express.cookieDecoder());
app.use(express.session({store: sessions }));

//initialize body decoding for forms
app.use(express.bodyDecoder());

//turn debugging on
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

//set theming engine to jade.
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

//abstraction of require
exports.require = function(module) {
  modules[module] = require('../'+module);
  return exports;
};

//set the root of the program
exports.set_root = function(r) {
	root = r;
}

//get the root of the program
exports.get_root = function() {
	return root;
}

//explicitly set root
exports.set_root(process.cwd());

//initialize all modules
exports.init = function() {
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

	//initialize all contrib modules
  for(var i in modules) {
    typeof modules[i].init === 'function' && modules[i].init(app, sessions);
  }

	//set current theme
	themer = modules["themer"]; 
	theme = themer.get_theme();

	//load all theme specific modules, and run their init functions
	exports.init_theme(function(mods) {
		for(var module in mods) {
			//expose modules to theme module
			mods[module].modules = modules;
			typeof mods[module].init === 'function' && mods[module].init(app, sessions);	
		}
	});
  
	//start the server
  app.listen(config.port);
  console.log('BAS @ CMS started. port='+config.port);
};

exports.init_theme = function(callback) {
	if (!theme) return;
	var modules_path = theme + '/modules';
	var theme_modules = {};
	fs.readdir(modules_path, function(err, files) {
		if (err) return;

		files.forEach(function(file){
			theme_modules[file] = require(modules_path + '/' + file);
		});
		callback(theme_modules);
	});
}

//function to fetch the global application
exports.get_app = function() {
  return app;
};

//turn cache on or off
exports.set_cache = function(c) {
  cache = c;
};
