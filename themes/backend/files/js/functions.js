$(document).ready(function() {
	var $list_items = $('ul.list li');
	$list_items.live('click', function(e){
			$(this).find('a').eq(0).trigger('click');	
	});
});
