/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
*/

// load from query string
function getUrlVar(key){
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
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