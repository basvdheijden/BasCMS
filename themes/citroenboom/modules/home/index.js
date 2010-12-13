var events = require('events');

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
	var document = new events.EventEmitter(),
			count = 0,
			page = {};

	for(var i in data) {
		page[i] = data[i];	
	}

	var check = function(){
		count++;
		if (count >= 2) {
			document.emit('ready');
		}
	}

	document.addListener('ready', function() {
		exports.modules['themer'].render(req, res, '', page);	
	});

	exports.modules['menus'].render_menu(['primary'], function(items){
		page.menu = items;
		check();
	});

	console.log(typeof exports.modules['twitter'].render_tweets)
	exports.modules['twitter'].get_tweets(function(tweets) {
		page.tweets = tweets;
		check();
	});
};
