var db = require('../../db');

exports.generate = function(num, options) {
	for(var i=0;i<num;i++) {
		var fields = {};
		for(item in options.fields) {
			if (options.fields[item] === 'text' || options.fields[item] === 'password') {
				fields[item] = exports.generate_word();
			}
			else if (options.fields[item] === 'textarea') {
				fields[item] = exports.generate_content();
			}
		}
		db.insert(options.table, fields);
	}
}

exports.generate_word = function(options) {
  var settings = options || {
    length: 5,
    dutch: true,
    dutch_probability: 0.5
  };

  var vowels = ["a", "e", "i", "o", "u", "eu", "oe", "ui"],
      cons = ["b", "bb", "bl", "br", "c", "ch", "cr", "d", "dd", "dr", "f", "ff", "fl", "fr", "g", "gl", "gr", "h", "j", "k", "kl", "kk", "kr", "l", "ll", "mm", "m", "nn", "n", "pp", "p", "pl", "pr", "r","rr", "s","ss", "sch", "sh", "sl", "sp", "st", "sw", "t", "tt", "th", "tr", "v", "w"],
      dutch = ["ng", "heid", "achtig", "erd", "dt", "ig", "erig", "loos", "ing", "baar", "je", "schap", "dom", "theek", "iseren", "lijk", "elijk", "loos", "eloos", "en"];

  cons.push('b', 'c', 'd', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't');

  var num_vowels = vowels.length-1,
      num_cons = cons.length-1,
      num_dutch = dutch.length-1,
      word = '',
      dutch_enabled = Math.random() > settings.dutch_probability;
      
  if (dutch_enabled) {
    settings.length-=1;
  }

  while(word.length < settings.length){
    word += cons[Math.round(Math.random()*num_cons)] + vowels[Math.round(Math.random()*num_vowels)];
  }

  if (dutch_enabled) {
    word += dutch[Math.round(Math.random()*num_dutch)];	
  }

  return word;
};

exports.generate_content = function(options) {
	var content = '';
	for(var i=0, l=10; i<=l; i++) {
	  var sentence_length = Math.round(Math.random()*20)+3,
				sentence = exports.generate_word();
		for (var j=0; j<sentence_length; j++){
			sentence += exports.generate_word() + ' ';
		}
		sentence += '. ';
		content += sentence;
	}
	return content;
}
