var fs = require('fs');

exports.readFiles = function(directory, callback) {
  var callback = callback || function(){},
      data = [];
      
  fs.readdir(directory, function(err, files) {
    if (err) throw err;
    for(var i=0,l=files.length,k=0;i<l;i++) {
			data.push(fs.readFileSync(directory + files[i]));
		}
		callback(data.join(''));
  });
};

exports.urlify = function(str) {
	if (!/^\//i.test(str)) {
		str = '/' + str;	
	}	
	return str;
}
