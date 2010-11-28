var bootstrap = require('./modules/bootstrap'),
    port  = 8080

bootstrap.get_config(function(){
	bootstrap.require('db');
	bootstrap.require('themer');
	bootstrap.require('users');
	bootstrap.require('pages');
	bootstrap.require('menus');
	bootstrap.require('content-types');
	bootstrap.require('dashboard');
	bootstrap.init(port);
});
