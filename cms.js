var bootstrap = require('./modules/bootstrap');
bootstrap.set_cache(false);

bootstrap.get_config(function(){
	bootstrap.require('db');
	bootstrap.require('themer');
	bootstrap.require('users');
	bootstrap.require('pages');
	bootstrap.require('menus');
	bootstrap.require('content-types');
	bootstrap.require('dashboard');
	bootstrap.require('twitter');
	bootstrap.init();
});
