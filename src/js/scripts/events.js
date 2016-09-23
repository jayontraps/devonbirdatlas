/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
mapModule.js
mapModule-richness.js
mapModule-overview.js
init.js
*/
/* https://github.com/mkleehammer/gulp-deporder */



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
function doubleOn($btn) {
    $wrapper.addClass('double');
    $btn.addClass('active');
}
function doubleOff($btn) {
    $wrapper.removeClass('double');
    $btn.removeClass('active');
}



// map page
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
        if (maps[currentMap].fetchingData) {
            return false;
        }
        maps[currentMap].setFetchingData(true);
        maps[currentMap].request = 'species';
        maps[currentMap].resetDataLayer();
        maps[currentMap].startSpinner(['map']);
        maps[currentMap].setSpecies(this.value.trim());
        maps[currentMap].getData();
        maps[currentMap].unsetSittersUnderlay();
        maps[currentMap].logModule();
    });



    $('.container').on('change', '.select-data-set', function(event) {
        var currentMap = event.delegateTarget.id;
        if (maps[currentMap].fetchingData) {
            return false;
        }
        maps[currentMap].setFetchingData(true);
        maps[currentMap].request = 'dataset';
        maps[currentMap].resetDataLayer();
        maps[currentMap].startSpinner(['map']);
        maps[currentMap].setDataset(this.value);
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
        maps[currentMap].setFetchingData(true);
        var isSelected = $(this).hasClass('selected');
            tetradId = event.target.id,
            tetradName = event.target.id.slice(3, 8);

        if (isSelected) {
            maps[currentMap].hideCurrentlySelectedTetradInfo(tetradId);
            return false;
        }
        maps[currentMap].request = 'tetrad';
        maps[currentMap].updateSelectedTetrad(tetradId);
        maps[currentMap].setTetradStatus(tetradName, tetradId);
        maps[currentMap].getTetradData();
        maps[currentMap].logModule();
    });



    $('.container').on('click', '.tetrad-list li', function(event) {
        var currentMap = event.delegateTarget.id;
        if (maps[currentMap].fetchingData) {
            return false;
        }
        maps[currentMap].setFetchingData(true);
        maps[currentMap].request = 'species';
        maps[currentMap].startSpinner(['map']);
        maps[currentMap].setSpecies($(this).text());
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

}













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

















if ( typeof richnessPage !== 'undefined' && richnessPage) {

    var richnessMap = new MapModule('m1_');
    richnessMap.logModule();

    $('[rel=js-richness-toggle]').on('click', function() {

        var $this = $(this);

        richnessMap.toggleDataLayer($this);

        if ($this.prop('checked')) {
            $('.richness-toggle').not($this).prop('checked', false);
            richnessMap.setFetchingData(true);
            richnessMap.startSpinner(['map']);
            richnessMap.setDataset($this.data('set'));
            richnessMap.setBreedingRange($this.data('range'));
            richnessMap.setConservationStatus($this.data('status'));
            richnessMap.getRichnessData();
            richnessMap.getRichnessTetradData();
            richnessMap.updateSelectedTetrad();
            richnessMap.logModule();
        }
    });

    $('[rel=js-richness-toggle-status]').on('click', function() {

        var $this = $(this);

        richnessMap.toggleDataLayer($this);

        if ($this.prop('checked')) {
            $('.richness-toggle').not($this).prop('checked', false);
            richnessMap.setFetchingData(true);
            richnessMap.startSpinner(['map']);
            richnessMap.setDataset($this.data('set'));
            richnessMap.setBreedingRange($this.data('range'));
            richnessMap.setConservationStatus($this.data('status'));
            richnessMap.getRichnessData();
            richnessMap.getRichnessTetradData();
            richnessMap.updateSelectedTetrad();
            richnessMap.logModule();
        }
    });


    // winter all
    $('#js_winter_data').on('click', function() {

        var $this = $(this);

        richnessMap.toggleDataLayer($this);

        if ($this.prop('checked')) {
            $('.richness-toggle').not($this).prop('checked', false);
            richnessMap.setFetchingData(true);
            richnessMap.startSpinner(['map']);
            richnessMap.setDataset('dwdensity');
            richnessMap.setBreedingRange($this.data('range'));
            richnessMap.setConservationStatus($this.data('status'));
            richnessMap.getRichnessData();
            richnessMap.getRichnessTetradData();
            richnessMap.logModule();
        }

    });



    $('.container').on('click', '[data-tetrad="2K"]', function(event) {
        var $this = $(this);
        if (richnessMap.fetchingData) {
            return false;
        }
        richnessMap.setFetchingData(true);
        if (!richnessMap.dataset) {
            return false;
        }
        var isSelected = $this.hasClass('selected');
            tetradId = event.target.id,
            tetradName = event.target.id.slice(3, 8);

        if (isSelected) {
            richnessMap.hideCurrentlySelectedTetradInfo(tetradId);
            return false;
        }
        richnessMap.startSpinner(['tetrad-results']);
        richnessMap.request = 'tetrad';
        richnessMap.updateSelectedTetrad(tetradId);
        richnessMap.setTetradStatus(tetradName, tetradId);
        richnessMap.getRichnessTetradData();
        richnessMap.logModule();

    });


    $('.toggle-total-list').on('click', function(){
        $(this).next().slideToggle('fast');
    });


     $('.container').on('click', '.data-latey-toggle', function(event) {
        richnessMap.toggleDataLayer($(this));
    });

}
