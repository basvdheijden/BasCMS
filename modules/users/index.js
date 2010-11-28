var db = require('../db'),
    themer = require('../themer'),
    router = require('../router');

var sessions,
    logged_in = false;

exports.init = function(app, sess) {
  sessions = sess;
  
  app.get('/admin/users/login', function(req, res, next) {
    themer.render(req, res, 'users/login', {action: '/admin/users/login'});
  });
  app.post('/admin/users/login', exports.user_login, function(req, res, next) {
    res.redirect('/');
  });
  app.get('/admin/users/logout', exports.user_logout, function(req, res, next) {
    req.flash('info', 'You are no longer logged in');
    res.redirect('/');
  });
  
  var options = {
    table: 'users',
    fields: {
      'name': 'text',
      'password': 'password'
    },
    index: 'name',
		path: 'name'
  };
	
	var base = '/admin/' + options.table;
	options.crud = {
		middleware: {
			add: exports.user_access,
			edit: exports.user_access,
			edit_post: users.user_access,

			detail: [],
			overview: [],
			remove: exports.user_access,
			remove_post: exports.user_access
		},

		add: base + '/add',
		edit: base + '/edit/:' + options.index,
		remove: base + '/delete/:' + options.index,
		detail: base + '/:' + options.index
	};
	options.crud.middleware.add_post =  [exports.user_access, router.not_exists(options)];

  router.crud(app, options); 
	router.register(app, options);
};

exports.logged_in = function(callback) {
  sessions.get('user', function(err, result) {
		callback(!!result);
  });
};

exports.user_login = function(req, res, next) {
  var params = req.body || req;
  if (!params.name || !params.password) {
    req.flash('error', 'Please fill in a username and password...');
    res.redirect('/');
  }
  
  db.select('users', {name: params.name, password: params.password}, {limit: 1, _id: true}, function(result) {
    if (result.length) {
        sessions.set('user', result[0], function() {
            req.flash('info', 'You are succesfully logged in !');
            next();
        });
    }
    else {
      req.flash('error', 'User authentication failed.');
      next();
    }
  });
};

exports.user_logout = function(req, res, next) {
  var callback = (arguments.length === 1 ? req : next) || function(){};
  sessions.destroy('user', callback);
};

// @todo: fix this: should also give a certain role to be checked. not just checking if login = true
exports.user_access = function(req, res, next) {
  sessions.get('user', function(err, result) {
    if (!result) {
      req.flash('access', 'You don\'t have permission to access this page.');
			res.redirect('/');
    }
		else {
			next();	
		}
  });
};

exports.user_exists = function(req, res, next) {
  db.select('users', {name: req.params.name}, {limit: 1}, function(result) {
    if (result.length) {
			res.redirect('/');
			req.flash('There is already a user by that name');
    }
		else {
			next();	
		}
  });
};
