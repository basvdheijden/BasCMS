var themer = require('../themer'),
    menus = require('../menus');

exports.init = function(app) {
	app.get('/admin', function(req, res) {
		menus.render_menu(['system'], function(menus) {
			themer.render(req, res, 'dashboard', { links: menus });
		});
	});
};
