var users = require('../users'),
		bootstrap = require('../bootstrap'),
		root = bootstrap.get_root(),
    page = 'page',
		ajax = 'ajax',
		jade = require('jade'),
    xhr_enabled = true,
		themes = {},
		app;

exports.init = function(application) {
	app = application;
	bootstrap.get_config(function(cfg) {
		themes.backend_theme = root + '/themes/' + cfg.themes.backend,
		themes.frontend_theme = root + '/themes/' + cfg.themes.frontend;
		themes.active = themes.frontend_theme;

		app.configure(function(){
			app.set('views', themes.backend_theme + '/views');
		});
	});
}

var set_active = function(req) {
	exports.set_theme(/^(\/admin|\/ajax\/admin)/i.test(req.url) ? themes.backend_theme : themes.frontend_theme);
}

exports.set_theme = function(theme) {
	themes.active = theme;
	app.configure(function(){
		app.set('views', themes.active + '/views');
	});
}

exports.get_theme = function() {
	return themes.active;
}

exports.render = function(req, res, view, data) {
	var callback = callback || false,
			req = req || {flash:function(){return [];}};

  users.logged_in(function(logged_in){ 
    var messages = req.flash() || [];
    
    var locals = {
      locals: {
        logged_in: logged_in,
        view: view, 
        data: data,
        messages: messages
      }
    };

		set_active(req);

		var template = xhr_enabled && req.xhr ? ajax : page;
		res.render(themes.active + '/views/' + template + '.jade', { locals: locals });
  });
}

exports.set_template = function(other_template) {
  page = template;
}
exports.support_ajax = function(bool) {
  xhr_enabled = bool;
}
