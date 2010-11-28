$(document).ready(function(){
	var routed = false,
			$content = $('#content').css('position', 'relative');
	var app = $.sammy(function(){
		this.element_selector = '#content';
		var sam = this;

		this.get(/\#\/ajax\/(.*)/, function(){
			if (!routed) routed = true;
			var id = '/' + this.params['splat'];
			if (id === '/home') id = '/';
			$content.css({top: '-50px', opacity: 0});
			$.get(id, {}, function(html) {
				$content.html(html).animate({top:0,opacity:1},300);
			});
		});
		this.get('#/', function(){
			if (!routed) return;
			routed = true;
			var loc = window.location;
			window.location = loc.href.substr(0, loc.href.length-loc.hash.length) + '#/ajax/home';
		})

		 $("a").live('click', function(e){
			e.stopPropagation();
			var $this = $(this);
			if ($this.hasClass('no-ajax')) return true;
			e.preventDefault();
			var href = $this.attr('href'),
					loc = window.location;
			window.location = loc.href.substr(0, loc.href.length-loc.hash.length) + '#/ajax' + href;
		});
		
	});

	app.run('#/');
});
