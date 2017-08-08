/* requires:
modernizr-custom.js
classList.js
chosen.jquery.min.js
speciesListWithAccounts.js
eventemitter2.js
*/

window.EVT = new EventEmitter2();
console.log('setup');

// load from query string
function getUrlVar(key){
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
}


var overlay = (function ($) {
    function show(layer, $context) {
            var $layer = $('.' + layer);
        $context.find($layer).addClass('on');
    }

    function hide(layer, $context) {
            var $layer = $('.' + layer);
        $context.find($layer).removeClass('on');
    }
    return {
        show: show,
        hide: hide
    };
}(jQuery));



// overlay controls
$('.ov-toggle').on('click', function() {
    var $this = $(this),
        layer = $this.attr('name'),
        context = $this.closest('.container');
    $this.is(":checked") ? overlay.show(layer, context) : overlay.hide(layer, context);
});

// toogle double view
var $wrapper = $('#tetrad-maps');
var $m1_keyGroup = $('#m1_').find('.key-group'),
        $m2_keyGroup = $('#m2_').find('.key-group'),
        $m1_colMap = $('#m1_').find('.column-map'),
        $m2_colMap = $('#m2_').find('.column-map');

function doubleOn($btn) {
    $wrapper.addClass('double');
    $btn.addClass('active');
    $m1_keyGroup.appendTo( $m1_colMap );
    $m2_keyGroup.appendTo( $m2_colMap );
    EVT.emit('double-on');
    $btn.html('Single map view');
}
function doubleOff($btn) {
    $wrapper.removeClass('double');
    $btn.removeClass('active');
    $m1_keyGroup.appendTo('#m1_');
    $m2_keyGroup.appendTo('#m2_');
    $('#m2_').find('.select-data-set').val('dbreed');
    $btn.html('Compare maps');

    EVT.emit('double-off');
}




(function($) {

	$(document).ready(function() {

        // build the map elements
        var tetrads = ["E", "J", "P", "U", "Z", "D", "I", "N", "T", "Y", "C", "H", "M", "S", "X", "B", "G", "L", "R", "W", "A", "F", "K", "Q", "V"];

        function createTetrad(id, parent) {
            var tet = document.createElement("div");
            tet.setAttribute('id', id);
            tet.setAttribute('data-tetrad', "2K");
            parent.appendChild(tet);
        }

        $('.parent').each(function(index, el) {
            var parentId = el.id;
            for (var i = 0; i < tetrads.length; i++) {
                var tetId = parentId + tetrads[i];
                createTetrad(tetId, el);
            }
        });



        // template the species list and fire chosen
        for (var i = 0; i < speciesList.length; i++) {
            $('<option value="' + speciesList[i] + '" >' + speciesList[i] + '</option>')
            .appendTo('.select-species');
        }

        var media_query = window.matchMedia("(min-width: 1025px)");
        media_query.addListener(fireChosen);
        fireChosen(media_query);

        function fireChosen(media_query) {
          if (media_query.matches) {
                $(".select-species").chosen({
                    placeholder_text_single: "Select a species",
                    no_results_text: "Oops, nothing found!",
                    width: "95%"
                }).ready(function(argument) {
                    $(".select-species").addClass('select-on');

                    if ( typeof mapPage !== 'undefined' && mapPage) {
                        if (getUrlVar("speciesname") !== "") {
                            var chosenList = $('#m1_').find('.select-species');
                            chosenList.val(getUrlVar("speciesname"));
                            chosenList.trigger("chosen:updated");
                        }
                    }
                });
            }
        }


	});

})(jQuery);