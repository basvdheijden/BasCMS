var router = require('../router');

exports.init = function(app, sessions) {
	var options = {
    table: 'content-types', 
    fields: {
      'title': 'text',
			'title-singular': 'text',
      'description': 'textarea',
			'table': 'text',
			'index': 'text',
			'fields': 'text' 
    },
    index: 'title'
  };
  
  router.crud(app, options);
}
