/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
mapModule.js
mapModule-richness.js
mapModule-overview.js
eventemitter2.js
init.js
*/
/* https://github.com/mkleehammer/gulp-deporder */

$(document).ready(function(){

    if ( typeof ovPage !== 'undefined' && ovPage) {

        var $launchLink = $("#launch-maps-link"),
            $launchLinkHref = $launchLink.attr('href');

        function appendSpeciesToLink(species) {
            var queryStr = '?speciesname='+ species;
            $launchLink.attr("href", $launchLinkHref + queryStr);
        }


        // setup the mapModules
        var maps = {};
        maps.m1_ = new MapModule('m1_');
        maps.m1_.setDataset('dbreed');

        maps.m2_ = new MapModule('m2_');
        maps.m2_.setDataset('dbdensity');

        maps.m3_ = new MapModule('m3_');
        maps.m3_.setDataset('dwdensity');

        $('.select-species').on('change', function(event) {
            maps.m1_.setSpecies(this.value);
            maps.m1_.request = 'overview';
            maps.m1_.setDataset('dbreed');
            maps.m1_.startSpinner(['map']);
            maps.m1_.getData();

            appendSpeciesToLink(this.value);

            maps.m2_.setSpecies(this.value);
            maps.m2_.request = 'overview';
            maps.m2_.setDataset('dbdensity');
            maps.m2_.setOverviewMapState('idle');

            maps.m3_.setSpecies(this.value);
            maps.m3_.request = 'overview';
            maps.m3_.setDataset('dwdensity');
            maps.m3_.setOverviewMapState('idle');

            $('.state').addClass('update');
            maps.m1_.getSpeciesAccount();
        });

        $('.container').on('click', '.idle-btn', function(event) {
            var currentMap = event.delegateTarget.id;
            maps[currentMap].setOverviewMapState('active');
        });
    }

});