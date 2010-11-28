var db = require('../db'),
    router = require('../router'),
		Event = require('events').EventEmitter,
		helpers = require('../helpers'),
		themer = require('../themer'),
    menus = [];

exports.clear_cache = function(callback) {
  db.select('menus', {}, {_id: false, tags: true, title: true, url: true}, function(result) {
    if (result.length) {
      menus = result;
      if (typeof callback === 'function') {
        callback(menus);
      }
    }
  });
}    

exports.init = function(app) {
  exports.clear_cache();
  
  var options = {
    table: 'menus',
    fields: {
      'title': 'text',
      'url': 'text',
      'tags': 'text'
    },
    index: 'title'
  };
  
  router.crud(app, options);
	exports.clear_cache();
};

exports.get_menus = function(callback) {
  if (menus.length) {
    callback(menus);
  }
	else {
		exports.clear_cache(function(menus) {
			callback(menus);
		});
	}
};

// render a menu with jade.
exports.render_menu = function(tags, callback) {
	var callback = callback || function() {};
	var ret = [];
	for(var i=0,l=tags.length;i<l;i++) {
		var tag = tags[i];
		for(var j=0,k=menus.length;j<k;j++) {
			if (!menus[j].tags) continue;
			if (menus[j].tags.indexOf(tag) > -1) {
				ret.push(menus[j]);
			}
		}
	}

	if (!ret.length) callback('');
	themer.render(false,false, 'menu', ret, function(html) {
		callback(html);	
	});
};

exports.register = function(options, callback) {
	var add_new = new Event();
	add_new.on('add', function(req) {
		var data = {
			'url': helpers.urlify(req.body[options['path']]),
			'title': req.body[options['index']]
		}

		db.insert('menus', [data], function() {
			exports.clear_cache();
		});
	});
	return add_new;
}

exports.add_to_menu = function(e) {
	return function(req, res, next) {
		e.emit('add', req);
		next();
	}
}
