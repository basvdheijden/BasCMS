var bootstrap = require('./modules/bootstrap'),
    port  = 8080

bootstrap.set_cache(true);
bootstrap.set_root(__dirname);

bootstrap.require('themer');
bootstrap.require('users');
bootstrap.require('pages');
bootstrap.require('menus');
bootstrap.require('content-types');
bootstrap.require('dashboard');

var app = bootstrap.get_app();
app.set('views', __dirname + '/views');
bootstrap.init(port);
