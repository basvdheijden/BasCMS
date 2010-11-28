var users = require('../users'),
		root = require('../bootstrap').get_root(),
    page = 'page',
		ajax = 'ajax',
		jade = require('jade'),
    xhr_enabled = true,
		themes = {};

themes.backend_theme = root + '/themes/backend',
themes.frontend_theme = root + '/themes/citroenboom';
themes.admin_active = false;

exports.init = function(app) {
	app.configure(function(){
		app.set('views', themes.backend_theme + '/views');
	});
}

var set_admin_active = function(req) {
	themes.admin_active = /\/admin/i.test(req.url);
	exports.set_theme(exports.get_theme());
}

exports.set_theme = function(theme) {
	themes.frontend_theme = theme;
}
exports.get_theme = function() {
	return themes.admin_active ? themes.backend_theme : themes.frontend_theme;
}

exports.render = function(req, res, view, data, callback) {
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

		set_admin_active(req);

		var template = xhr_enabled && req.xhr ? ajax : page;

		if (!callback) {
			res.render(themes.backend_theme + '/views/' + template + '.jade', { locals: locals });
		}
		else {
			jade.renderFile(themes.frontend_theme + '/views/' + view + '.jade', { locals: locals.locals }, function(err, html) {
				if (err) throw err;
				callback(html);	
			});
		}
  });
}

exports.set_template = function(other_template) {
  page = template;
}
exports.support_ajax = function(bool) {
  xhr_enabled = bool;
}
