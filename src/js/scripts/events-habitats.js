/* requires:
modernizr-custom.js
classList.js
*/

$(document).ready(function(){

    if ( typeof habitatPage !== 'undefined' && habitatPage) {

        $('.habitat-list').on('click', 'a', function(e){
            e.preventDefault();
            $('.habitat-list a').removeClass('active');
            $(this).addClass('active');
            $('#habitat-wrapper').addClass('loading-data');

            var postId = $(this).attr('data-post-id');
            $.ajax({
                url: config.folder + '/wp-json/wp/v2/habitats/' + postId,
                type: 'GET',
                dataType: 'json'
            })
            .done(function(data) {

                var imgUrl = data.better_featured_image.source_url,
                    title = data.title.rendered,
                    content = data.content.rendered;

                var $template = $('<div/>', {
                    'class': 'habitat-inner'
                });

                var $h1El = $('<h1/>', {
                    'class': 'habitat-title',
                    html: title
                });

                var $contentEl = $('<div/>', {
                    'class': 'habitat-content',
                    html: content
                });

                $h1El.appendTo($template);
                $contentEl.appendTo($template);

                var $imgEl = $('<img/>', {
                    'class': 'habitat-img',
                    'src' : imgUrl
                });

                window.setTimeout(function(){
                    $('#habitat-app').empty().append($template).append($imgEl);
                    $('#habitat-wrapper').removeClass('loading-data');
                }, 400);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
        });


        $('.habitat-list li').eq(0).find('a').trigger('click');


    }
});