var themer = require('../themer'),
    menus = require('../menus');

exports.init = function(app) {
	/* HIER GEBLEVEN */
	/* HIER GEBLEVEN */
	/* HIER GEBLEVEN */
	/* HIER GEBLEVEN */
	/* HIER GEBLEVEN */
	app.get('/admin', function(req, res) {
		menus.get_menus(function(menus) {
			themer.render(req, res, 'dashboard', { links: menus });
		});
	});

	app.get('/', function(req, res) {
		menus.render_menu(['system'], function(html){
			res.send(html);
		});
	});
};
