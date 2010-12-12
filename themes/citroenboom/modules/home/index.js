exports.init = function(app) {
	app.get('/', function(req, res) {
		exports.modules['menus'].render_menu(['primary'], function(items){
			exports.modules['themer'].render(req, res, 'menu', items);	
		});
	});
}
