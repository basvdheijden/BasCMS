var http = require('http'),
		tweets;

exports.init = function() {
	exports.get_tweets();
};

// @todo: use timeout/interval to fetch latest tweets. else no feed update until reboot.
exports.get_tweets = function(callback) {
	var callback = callback || function() {};
	if (tweets) return callback(tweets);

	var data = [];

	var twitter = http.createClient(80, 'search.twitter.com');
	var req = twitter.request('GET', '/search.json?q=from%3ACitroenboom', { host: 'search.twitter.com' });
	req.end();

	req.on('response', function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			data.push(chunk);
		});
		res.on('end', function() {
			var res = JSON.parse(data.join(''));
			tweets = res;

			for(var i in tweets.results) {
				tweets.results[i].text.replace(/^((www|http).+\.\w{2,4})$/gi, '<a href="$1">$1</a>');
			}

			callback(tweets);
		});
	});
};
