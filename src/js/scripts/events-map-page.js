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
    if ( typeof mapPage !== 'undefined' && mapPage) {

        $('#js-compare-toggle').on('click', function() {
            var $btn = $(this);
            $(this).hasClass('active') ? doubleOff($btn) : doubleOn($btn);
        });

        // setup the mapModules
        var maps = {};
        maps.m1_ = new MapModule('m1_');
        maps.m2_ = new MapModule('m2_');

        // set defaults
        maps.m1_.setDataset('dbreed');
        maps.m2_.setDataset('dbreed');


        jQuery(document).ready(function($) {
            if (getUrlVar("speciesname") !== "") {
                $('#m1_ .species-titles').addClass('update');
                var nameFromQueryString = getUrlVar("speciesname");
                maps.m1_.request = 'species';
                maps.m1_.startSpinner(['map']);
                maps.m1_.setSpecies(nameFromQueryString);

                window.setTimeout(function(){
                    maps.m1_.getData();
                    maps.m1_.logModule();
                }, 400);
            }
        });


        $('.container').on('change', '.select-species', function(event) {
            var currentMap = event.delegateTarget.id;
            var species = this.value.trim();

            if (maps[currentMap].fetchingData) {
                return false;
            }

            maps[currentMap].request = 'species';
            maps[currentMap].setSpecies(species);

            EVT.emit('species-selected', currentMap, species);

            maps[currentMap].setFetchingData(true);
            maps[currentMap].resetDataLayer();
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].getData();
            maps[currentMap].unsetSittersUnderlay();
            maps[currentMap].logModule();
        });



        $('.container').on('change', '.select-data-set', function(event) {
            var currentMap = event.delegateTarget.id;
            var dataset = this.value;

            if (maps[currentMap].fetchingData) {
                return false;
            }

            maps[currentMap].request = 'dataset';
            maps[currentMap].setDataset(dataset);

            EVT.emit('dataset-selected', currentMap, dataset);

            maps[currentMap].setFetchingData(true);
            maps[currentMap].resetDataLayer();
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].getData();
            maps[currentMap].getTetradData();
            maps[currentMap].unsetSittersUnderlay();
            maps[currentMap].logModule();
        });



        $('.container').on('click', '.data-wrap [data-tetrad="2K"]', function(event) {
            var currentMap = event.delegateTarget.id;
            if (maps[currentMap].fetchingData) {
                return false;
            }

            var isSelected = $(this).hasClass('selected');
                tetradId = event.target.id,
                tetradName = event.target.id.slice(3, 8);

            if (isSelected) {
                maps[currentMap].hideCurrentlySelectedTetradInfo(tetradId);
                return false;
            }
            maps[currentMap].request = 'tetrad';
            maps[currentMap].updateSelectedTetrad(tetradId);

            EVT.emit('tetrad-selected', currentMap, tetradId);

            maps[currentMap].setFetchingData(true);
            maps[currentMap].setTetradStatus(tetradName, tetradId);
            maps[currentMap].getTetradData();
            maps[currentMap].logModule();
        });



        $('.container').on('click', '.tetrad-list li', function(event) {
            var currentMap = event.delegateTarget.id;
            var species = $(this).text();

            if (maps[currentMap].fetchingData) {
                return false;
            }

            maps[currentMap].request = 'species';
            maps[currentMap].setSpecies(species);

            EVT.emit('species-selected', currentMap, species);

            maps[currentMap].setFetchingData(true);
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].getData();
            maps[currentMap].updateSpeciesSelect();
            maps[currentMap].unsetSittersUnderlay();
            maps[currentMap].logModule();
        });



        $('.container').on('click', '.data-layer-toggle', function(event) {
            var currentMap = event.delegateTarget.id;
            var $this = $(this);
            maps[currentMap].toggleDataLayer($this);
        });

        $('.container').on('click', '.sitters-toggle', function(event) {
            var currentMap = event.delegateTarget.id;
            maps[currentMap].toggleSittersUnderlay(event.target);
        });


        /* test eventemitter2 */

        EVT.on('species-selected', function(currentMap, species){
            console.log('species-selected: ', maps[currentMap], species);
        });
        EVT.on('dataset-selected', function(currentMap, dataset){
            console.log('dataset-selected: ', maps[currentMap], dataset);
        });
        EVT.on('tetrad-selected', function(currentMap, tetrad){
            console.log('tetrad-selected: ', maps[currentMap], tetrad);
        });


    }

});
