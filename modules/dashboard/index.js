var themer = require('../themer'),
    menus = require('../menus');

exports.init = function(app) {
	app.get('/admin', function(req, res) {
		menus.get_menus(function(menus) {
			themer.render(req, res, 'dashboard', { links: menus });
		});
	});

	app.get('/', function(req, res) {
		menus.render_menu(['system'], function(items){
			themer.render(req, res, 'menu', items);	
		});
	});
};
