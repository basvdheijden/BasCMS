var db = require('../db'),
    themer = require('../themer'),
		helpers = require('../helpers'),
		buffer = {};

exports.crud = function(app, options) {
  var fields = options.fields,
      index  = options.index,
      table = options.table,
      base = options.base || '/admin/' + table,
      table_singular = options.table_singular || table.substr(0,table.length-1),
      crud = options.crud || {
        add: base + '/add',
        edit: base + '/edit/:' + index,
        remove: base + '/delete/:' + index,
        detail: base + '/:' + index,

				middleware: {
					add: [],
					add_post: [],
					edit: [],
					edit_post: [],
					remove: [],
					remove_post: [],
					detail: [],
					overview: []
				}
      },
      templates = options.templates || {
        base: 'router/list',
        add: 'router/add',
        edit: 'router/edit',
        remove: 'router/delete',
        detail: 'router/detail'
      };

  // Keys
  var keys = {};
  for(var i in fields) {
    keys[i] = true;
  }
  // turn off _id
  keys._id = false;
	buffer[table] = options;
	buffer[table].keys = keys;
	buffer[table].base = base;
	buffer[table_singular] = table_singular;
  
  /* overview page */
  app.get(base, crud.middleware.overview, function(req, res, next) {
    db.select(table, {}, keys, function(result) {
      var data = {items: result, type: table, type_singular: table_singular, index: index};
      themer.render(req, res, templates.base, data);
    });
  });
  
  /* add page */
  app.get(crud.add, crud.middleware.add, function(req, res, next) {
    var data = {fields: fields, type: table, type_singular: table_singular, action: crud.add, index: index};
    themer.render(req, res, templates.add, data);
  });
  
  /* add form */
  app.post(crud.add, crud.middleware.add_post, function(req, res, next) {
		exports.trigger.add(req,res,table);
  });
  
  /* detail page */
  app.get(crud.detail, crud.middleware.detail, function(req, res, next) {
    var where = {};
    where[index] = req.params[index];
    db.select(table, where, keys, function(result){
      if (!result.length) {
        req.flash('error', 'A '+table_singular+' called \''+req.params[index]+'\' does not exist.');
        res.redirect('/');
        return;
      }
      var data = {type: table, type_singular: table_singular, index: index, fields: result[0]};
      themer.render(req, res, templates.detail, data);
    });
  });

  /* edit page */
  app.get(crud.edit, crud.middleware.edit, function(req, res, next) {
    var where = {};
    where[index] = req.params[index];
    db.select(table, where, keys, function(result){
      if (!result.length) {
        req.flash('error', 'A '+table_singular+' called \''+req.params.name+'\' does not exist.');
        res.redirect('/');
        return;
      }
      var data = {type: table, type_singular: table_singular, action: req.url, index: index, data: result[0], fields: fields};
      themer.render(req, res, templates.edit, data);
    });
  });
  
  /* post edit  */
  app.post(crud.edit, crud.middleware.edit_post, function(req, res, next) {
    var post = req.body,
        data = {},
        where = {};

    where[index] = req.params[index];
    for(var i in fields) {
      data[i] = post[i];
    }
   	
    db.update(table, where, data, function(err, data) {
      if (err) throw err;
      req.flash('info', table_singular + ' ' + data[index] + ' succesfully updated !');
      res.redirect(base);
    });
  });
  
  /* BROKEN */
  /* @todo: add are u sure? */
  /* delete a user */
  app.get(crud.remove, crud.middleware.remove, function(req, res, next) {
    var where = {};
    where[index] = req.params[index];
    
    db.remove(table, where, function() {
      console.log('yay');
      res.send('yay');
    });
  });

	app.post(crud.remove, crud.middleware.remove_post, function(req, res, next) {
		console.log('not implemented');	
	});
};

exports.not_exists = function(options) {
	return function(req,res,next) {
		var where = {};
		where[options.index] = req.body[options.index]; 
		db.select(options.table, where, {limit:1}, function(result) {
			if (result.length) {
				res.redirect('/');
				req.flash('error', 'A '+options.table+' with that '+options.index+' already exists.');
			}	
			else {
				next();
			}
		});
	};
}

exports.register = function(app, options, callback, template) {
  var keys = {};
  keys[options.path] = true;
  keys[options.index] = true;

	for(var f in options.fields) {
		keys[f] = true;	
	}
  
  db.select(options.table, {}, keys, function(result) {
    if (typeof callback === 'function') {
      callback(result);
    }
    else {
      var buffer = {};
      for(var i=0,l=result.length;i<l;i++) {
				var p = result[i][options.path];

				p = helpers.urlify(p);

        buffer[p] = result[i][options.index];
        
        app.get(p, function(req, res, next) {
					if (template) {
						themer.render(req, res, template, result[i]);
					}
					else {
          	res.redirect('/'+options.table+'/'+buffer[req.url]);
					}
        });
      }
    }
  });
};

exports.trigger = {};
exports.trigger.add = function(req, res, table) {
		var b = buffer[table];

    var post = req.body,
        data = {};
    for(var i in b.keys) {
      data[i] = req.body[i];
    }
    db.insert(b.table, [data]);
    req.flash('info', 'New \''+b.table_singular+'\' succesfully added.');
    res.redirect(b.base);
};
