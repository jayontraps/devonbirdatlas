(function($) {

    $(document).ready(function() {

        // off canvas nav
        var $offCanvasNav = $('#js_off_canvas'),
            $overlay = $('#js_overlay');

        function closeNav() {
            $offCanvasNav.removeClass('opened')
                        .scrollTop( 0 );
            $overlay.removeClass('active')
                    .css('height','0');
        }

        $('#js_open_nav').on('click', function() {
            $offCanvasNav.addClass('opened');
            var documentHeight = $(document).height();
            $overlay.addClass('active')
                 .css('height', documentHeight);
        });

        $('#js_close_nav').on('click', closeNav );

        $('#js_close_nav_col').on('click', closeNav );
    });

})(jQuery);