exports.init = function(app) {
	var home = {
		pages: {
			title: 'Home',
			body: 'Ik ben thuis',
		}
	};

	app.get('/', function(req, res) {
		exports.format(req, res, home);
	});
}

exports.format = function(req, res, data, callback) {
	exports.modules['menus'].render_menu(['primary'], function(items){
		var page = {
			menu: items,
		};

		for(var i in data) {
			page[i] = data[i];	
		}

		exports.modules['themer'].render(req, res, '', page);	
	});
};
