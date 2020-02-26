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
        $(window).on({
            hashchange: (event) => {
                $('nav.navbar .subnav a').removeClass('active');
                $(`a[href$="${window.location.hash}"]`).addClass('active');
            }
        })
    });
})(jQuery);