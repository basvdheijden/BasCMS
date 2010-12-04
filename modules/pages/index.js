var router = require('../router'),
		generate = require('../dev/generate');
		users = require('../users'),
		db = require('../db'),
		menus = require('../menus');

exports.init = function(app, sessions) { 
	var options = {
		table: 'pages', // ie. http://www.example.com/pages/
		fields: {
			'title': 'text',
			'body': 'textarea',
			'path': 'text'
		},
		index: 'title', // ie. http://www.example.com/pages/:title
		path: 'path' // ie. http://www.example.com/alias => http://www.example.com/pages/:title
	};

	var base = '/admin/' + options.table;
	options.crud = {
		middleware: {
			add: users.user_access,
			edit: users.user_access,
			edit_post: users.user_access,

			detail: [],
			overview: [],
			remove: users.user_access,
			remove_post: users.user_access
		},

		add: base + '/add',
		edit: base + '/edit/:' + options.index,
		remove: base + '/delete/:' + options.index,
		detail: base + '/:' + options.index
	};

	var e = menus.register(options);
	options.crud.middleware.add_post =  [users.user_access, router.not_exists(options), menus.add_to_menu(e)];

  router.crud(app, options);
  router.register(app, options, false, 'pages');
}
