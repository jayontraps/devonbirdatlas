(function($) {
    $(document).ready(function() {
        $('.bxslider-home').bxSlider({
            pager: false,
            mode: 'fade',
            auto: true,
            pause: 6000,
            speed: 1000,
            autoHover: true,
            onSliderLoad: function() {
                $('#js_slider').addClass('loaded');
            }
         });
    });
})(jQuery);