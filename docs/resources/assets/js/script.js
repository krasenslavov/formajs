'use strict';
(($) => {
	$(document).ready(($) => {
		$('a.toplvl').on({
			click: (event) => {
				event.preventDefault();
				const self = $(event.currentTarget);
				self.next().slideToggle();
			}
		});
	});
})(jQuery);