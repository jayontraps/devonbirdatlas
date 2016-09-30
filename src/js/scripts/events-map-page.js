/* requires:
modernizr-custom.js
classList.js
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

        // setup the mapModules
        var maps = {};
        maps.m1_ = new MapModule('m1_');
        maps.m2_ = new MapModule('m2_');
        // set defaults
        maps.m1_.setDataset('dbreed');
        maps.m2_.setDataset('dbreed');

        $('#js-compare-toggle').on('click', function() {
            var $btn = $(this);
            $(this).hasClass('active') ? doubleOff($btn) : doubleOn($btn);
        });

        // get species from query string and load data
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
            maps[currentMap].setFetchingData(true);
            maps[currentMap].resetDataLayer();
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].getData();
            maps[currentMap].unsetSittersUnderlay();
            // maps[currentMap].logModule();
        });



        $('.container').on('change', '.select-data-set', function(event) {
            var currentMap = event.delegateTarget.id;
            var dataset = this.value;

            if (maps[currentMap].fetchingData) {
                return false;
            }

            maps[currentMap].request = 'dataset';
            maps[currentMap].setDataset(dataset);
            maps[currentMap].setFetchingData(true);
            maps[currentMap].resetDataLayer();
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].getData();
            maps[currentMap].getTetradData();
            maps[currentMap].unsetSittersUnderlay();
            // maps[currentMap].logModule();
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
            maps[currentMap].setFetchingData(true);
            maps[currentMap].setTetradStatus(tetradName, tetradId);
            maps[currentMap].getTetradData();
            // maps[currentMap].logModule();
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
            // maps[currentMap].logModule();
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


        /* use eventemitter2 to load second map on btn click */

        EVT.on('double-on', function(currentMap, species){
            console.log('double-on');
            if (maps.m1_.species) {
                if (maps.m2_.fetchingData) {
                    return false;
                }
                maps.m2_.request = 'species';
                maps.m2_.setDataset('dbreed');
                maps.m2_.setSpecies(maps.m1_.species);
                maps.m2_.setFetchingData(true);
                maps.m2_.resetDataLayer();
                maps.m2_.startSpinner(['map']);
                maps.m2_.getData();
                maps.m2_.unsetSittersUnderlay();
                maps.m2_.updateSpeciesSelect();
                maps.m2_.logModule();
            }
        });

        EVT.on('double-off', function(currentMap, dataset){
            console.log('double-off');
        });




        // EVT.on('tetrad-selected', function(currentMap, tetrad){
        //     console.log('tetrad-selected: ', maps[currentMap], tetrad);
        // });



        // test ajax - test page
        $('#test-call').on('click', testAjax);

        function testAjax(e){
            maps.m1_.request = 'species';
            maps.m1_.setSpecies('Nuthatch');

            var formData = {
                "species" : 'Nuthatch',
                "data-set" : 'dbreed'
            };

            $.ajax({
                    url: config.folder + config.themeUrl + '/ajax/speciesData.php',
                    type: 'POST',
                    dataType: 'json',
                    data:  formData,
                    timeout: 12000
            })
            .done(function(data) {
                console.log(data);
                $('<div/>', {
                    html: data.length
                }).appendTo('#primary');
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                $('#count').html('error');
            });

            maps.m1_.logModule();
        };
    }

});
