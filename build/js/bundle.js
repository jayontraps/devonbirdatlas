(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var MapModule = require('./modules/mapModule');
var overlay = require('./modules/overlay');

(function($) {
$(document).ready(function() {


// console.log('rigsConservationList :', rigsConservationList.length);
// console.log('speciesList: ', speciesList.length);

// var count = 0;
// var presentInSpeciesList = [];
// var justNames = [];
// for (var i = 0; i < rigsConservationList.length; i++) {
//     if (speciesList.indexOf(rigsConservationList[i].speciesName) >= 0) {
//         presentInSpeciesList.push(rigsConservationList[i]);
//         justNames.push(rigsConservationList[i].speciesName);
//         count++;
//     }
// }


// var NOTpresentInSpeciesList = [];

// for (var i = 0; i < speciesList.length; i++) {

//     if (justNames.indexOf(speciesList[i]) < 0 ) {
//        NOTpresentInSpeciesList.push({
//         "speciesName" : speciesList[i],
//         "latinName": "",
//         "conservationStatus": ""}
//         );
//     }

// }








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
        maps.m1_.setSpecies('Alpine Swift');
        maps.m1_.setDataset('dbreed');

        maps.m2_.setSpecies('Alpine Swift');
        maps.m2_.setDataset('dbreed');


        $('.container').on('change', '.select-species', function(event) {
            var currentMap = event.delegateTarget.id;
            if (maps[currentMap].fetchingData) {
                return false;
            }
            maps[currentMap].setFetchingData(true);
            maps[currentMap].request = 'species';
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].setSpecies(this.value.trim());
            maps[currentMap].getData();

            maps[currentMap].logModule();
        });



        $('.container').on('change', '.select-data-set', function(event) {
            var currentMap = event.delegateTarget.id;
            if (maps[currentMap].fetchingData) {
                return false;
            }
            maps[currentMap].setFetchingData(true);
            maps[currentMap].request = 'dataset';
            maps[currentMap].startSpinner(['map']);
            maps[currentMap].setDataset(this.value);
            maps[currentMap].getData();
            maps[currentMap].getTetradData();
            maps[currentMap].logModule();
        });



        $('.container').on('click', '[data-tetrad="2K"]', function(event) {
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
            maps[currentMap].logModule();
        });



        $('.container').on('click', '.data-later-toggle', function(event) {
            var currentMap = event.delegateTarget.id;
            var $this = $(this);
            maps[currentMap].toggleDataLayer($this);
        });

    }













    if ( typeof ovPage !== 'undefined' && ovPage) {
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


         $('.container').on('click', '.data-later-toggle', function(event) {
            richnessMap.toggleDataLayer($(this));
        });

    }




});
})(jQuery);

},{"./modules/overlay":2}],2:[function(require,module,exports){
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


module.exports = overlay;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwL2VudHJ5Iiwic3JjL2pzL2FwcC9tb2R1bGVzL292ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyB2YXIgTWFwTW9kdWxlID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcE1vZHVsZScpO1xudmFyIG92ZXJsYXkgPSByZXF1aXJlKCcuL21vZHVsZXMvb3ZlcmxheScpO1xuXG4oZnVuY3Rpb24oJCkge1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblxuLy8gY29uc29sZS5sb2coJ3JpZ3NDb25zZXJ2YXRpb25MaXN0IDonLCByaWdzQ29uc2VydmF0aW9uTGlzdC5sZW5ndGgpO1xuLy8gY29uc29sZS5sb2coJ3NwZWNpZXNMaXN0OiAnLCBzcGVjaWVzTGlzdC5sZW5ndGgpO1xuXG4vLyB2YXIgY291bnQgPSAwO1xuLy8gdmFyIHByZXNlbnRJblNwZWNpZXNMaXN0ID0gW107XG4vLyB2YXIganVzdE5hbWVzID0gW107XG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IHJpZ3NDb25zZXJ2YXRpb25MaXN0Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgaWYgKHNwZWNpZXNMaXN0LmluZGV4T2Yocmlnc0NvbnNlcnZhdGlvbkxpc3RbaV0uc3BlY2llc05hbWUpID49IDApIHtcbi8vICAgICAgICAgcHJlc2VudEluU3BlY2llc0xpc3QucHVzaChyaWdzQ29uc2VydmF0aW9uTGlzdFtpXSk7XG4vLyAgICAgICAgIGp1c3ROYW1lcy5wdXNoKHJpZ3NDb25zZXJ2YXRpb25MaXN0W2ldLnNwZWNpZXNOYW1lKTtcbi8vICAgICAgICAgY291bnQrKztcbi8vICAgICB9XG4vLyB9XG5cblxuLy8gdmFyIE5PVHByZXNlbnRJblNwZWNpZXNMaXN0ID0gW107XG5cbi8vIGZvciAodmFyIGkgPSAwOyBpIDwgc3BlY2llc0xpc3QubGVuZ3RoOyBpKyspIHtcblxuLy8gICAgIGlmIChqdXN0TmFtZXMuaW5kZXhPZihzcGVjaWVzTGlzdFtpXSkgPCAwICkge1xuLy8gICAgICAgIE5PVHByZXNlbnRJblNwZWNpZXNMaXN0LnB1c2goe1xuLy8gICAgICAgICBcInNwZWNpZXNOYW1lXCIgOiBzcGVjaWVzTGlzdFtpXSxcbi8vICAgICAgICAgXCJsYXRpbk5hbWVcIjogXCJcIixcbi8vICAgICAgICAgXCJjb25zZXJ2YXRpb25TdGF0dXNcIjogXCJcIn1cbi8vICAgICAgICAgKTtcbi8vICAgICB9XG5cbi8vIH1cblxuXG5cblxuXG5cblxuXG4gICAgLy8gb3ZlcmxheSBjb250cm9sc1xuICAgICQoJy5vdi10b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGxheWVyID0gJHRoaXMuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgY29udGV4dCA9ICR0aGlzLmNsb3Nlc3QoJy5jb250YWluZXInKTtcbiAgICAgICAgJHRoaXMuaXMoXCI6Y2hlY2tlZFwiKSA/IG92ZXJsYXkuc2hvdyhsYXllciwgY29udGV4dCkgOiBvdmVybGF5LmhpZGUobGF5ZXIsIGNvbnRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gdG9vZ2xlIGRvdWJsZSB2aWV3XG4gICAgdmFyICR3cmFwcGVyID0gJCgnI3RldHJhZC1tYXBzJyk7XG4gICAgZnVuY3Rpb24gZG91YmxlT24oJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5hZGRDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb3VibGVPZmYoJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8vIG1hcCBwYWdlXG4gICAgaWYgKCB0eXBlb2YgbWFwUGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbWFwUGFnZSkge1xuXG4gICAgICAgICQoJyNqcy1jb21wYXJlLXRvZ2dsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRidG4gPSAkKHRoaXMpO1xuICAgICAgICAgICAgJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykgPyBkb3VibGVPZmYoJGJ0bikgOiBkb3VibGVPbigkYnRuKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0dXAgdGhlIG1hcE1vZHVsZXNcbiAgICAgICAgdmFyIG1hcHMgPSB7fTtcbiAgICAgICAgbWFwcy5tMV8gPSBuZXcgTWFwTW9kdWxlKCdtMV8nKTtcbiAgICAgICAgbWFwcy5tMl8gPSBuZXcgTWFwTW9kdWxlKCdtMl8nKTtcblxuICAgICAgICAvLyBzZXQgZGVmYXVsdHNcbiAgICAgICAgbWFwcy5tMV8uc2V0U3BlY2llcygnQWxwaW5lIFN3aWZ0Jyk7XG4gICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuXG4gICAgICAgIG1hcHMubTJfLnNldFNwZWNpZXMoJ0FscGluZSBTd2lmdCcpO1xuICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2hhbmdlJywgJy5zZWxlY3Qtc3BlY2llcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAnc3BlY2llcyc7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0U3BlY2llcyh0aGlzLnZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2hhbmdlJywgJy5zZWxlY3QtZGF0YS1zZXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ2RhdGFzZXQnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldERhdGFzZXQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldERhdGEoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0VGV0cmFkRGF0YSgpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnW2RhdGEtdGV0cmFkPVwiMktcIl0nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSAkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHRldHJhZElkID0gZXZlbnQudGFyZ2V0LmlkLFxuICAgICAgICAgICAgICAgIHRldHJhZE5hbWUgPSBldmVudC50YXJnZXQuaWQuc2xpY2UoMywgOCk7XG5cbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5oaWRlQ3VycmVudGx5U2VsZWN0ZWRUZXRyYWRJbmZvKHRldHJhZElkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAndGV0cmFkJztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0udXBkYXRlU2VsZWN0ZWRUZXRyYWQodGV0cmFkSWQpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRUZXRyYWRTdGF0dXModGV0cmFkTmFtZSwgdGV0cmFkSWQpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXRUZXRyYWREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcudGV0cmFkLWxpc3QgbGknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ3NwZWNpZXMnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFNwZWNpZXMoJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnVwZGF0ZVNwZWNpZXNTZWxlY3QoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJy5kYXRhLWxhdGVyLXRvZ2dsZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0udG9nZ2xlRGF0YUxheWVyKCR0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBpZiAoIHR5cGVvZiBvdlBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG92UGFnZSkge1xuICAgICAgICAvLyBzZXR1cCB0aGUgbWFwTW9kdWxlc1xuICAgICAgICB2YXIgbWFwcyA9IHt9O1xuICAgICAgICBtYXBzLm0xXyA9IG5ldyBNYXBNb2R1bGUoJ20xXycpO1xuICAgICAgICBtYXBzLm0xXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuICAgICAgICBtYXBzLm0yXyA9IG5ldyBNYXBNb2R1bGUoJ20yXycpO1xuICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcblxuICAgICAgICBtYXBzLm0zXyA9IG5ldyBNYXBNb2R1bGUoJ20zXycpO1xuICAgICAgICBtYXBzLm0zXy5zZXREYXRhc2V0KCdkd2RlbnNpdHknKTtcblxuICAgICAgICAkKCcuc2VsZWN0LXNwZWNpZXMnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG1hcHMubTFfLnNldFNwZWNpZXModGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzLm0xXy5yZXF1ZXN0ID0gJ292ZXJ2aWV3JztcbiAgICAgICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuICAgICAgICAgICAgbWFwcy5tMV8uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwcy5tMV8uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzLm0yXy5zZXRTcGVjaWVzKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwcy5tMl8ucmVxdWVzdCA9ICdvdmVydmlldyc7XG4gICAgICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcbiAgICAgICAgICAgIG1hcHMubTJfLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2lkbGUnKTtcblxuICAgICAgICAgICAgbWFwcy5tM18uc2V0U3BlY2llcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHMubTNfLnJlcXVlc3QgPSAnb3ZlcnZpZXcnO1xuICAgICAgICAgICAgbWFwcy5tM18uc2V0RGF0YXNldCgnZHdkZW5zaXR5Jyk7XG4gICAgICAgICAgICBtYXBzLm0zXy5zZXRPdmVydmlld01hcFN0YXRlKCdpZGxlJyk7XG5cbiAgICAgICAgICAgICQoJy5zdGF0ZScpLmFkZENsYXNzKCd1cGRhdGUnKTtcbiAgICAgICAgICAgIG1hcHMubTFfLmdldFNwZWNpZXNBY2NvdW50KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLmlkbGUtYnRuJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIGlmICggdHlwZW9mIHJpY2huZXNzUGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmljaG5lc3NQYWdlKSB7XG5cbiAgICAgICAgdmFyIHJpY2huZXNzTWFwID0gbmV3IE1hcE1vZHVsZSgnbTFfJyk7XG4gICAgICAgIHJpY2huZXNzTWFwLmxvZ01vZHVsZSgpO1xuXG4gICAgICAgICQoJ1tyZWw9anMtcmljaG5lc3MtdG9nZ2xlXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICByaWNobmVzc01hcC50b2dnbGVEYXRhTGF5ZXIoJHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAoJHRoaXMucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCgnLnJpY2huZXNzLXRvZ2dsZScpLm5vdCgkdGhpcykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldERhdGFzZXQoJHRoaXMuZGF0YSgnc2V0JykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEJyZWVkaW5nUmFuZ2UoJHRoaXMuZGF0YSgncmFuZ2UnKSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0Q29uc2VydmF0aW9uU3RhdHVzKCR0aGlzLmRhdGEoJ3N0YXR1cycpKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5nZXRSaWNobmVzc0RhdGEoKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5nZXRSaWNobmVzc1RldHJhZERhdGEoKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC51cGRhdGVTZWxlY3RlZFRldHJhZCgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmxvZ01vZHVsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdbcmVsPWpzLXJpY2huZXNzLXRvZ2dsZS1zdGF0dXNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnRvZ2dsZURhdGFMYXllcigkdGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkdGhpcy5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcucmljaG5lc3MtdG9nZ2xlJykubm90KCR0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0RGF0YXNldCgkdGhpcy5kYXRhKCdzZXQnKSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0QnJlZWRpbmdSYW5nZSgkdGhpcy5kYXRhKCdyYW5nZScpKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRDb25zZXJ2YXRpb25TdGF0dXMoJHRoaXMuZGF0YSgnc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmdldFJpY2huZXNzRGF0YSgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmdldFJpY2huZXNzVGV0cmFkRGF0YSgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnVwZGF0ZVNlbGVjdGVkVGV0cmFkKCk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAubG9nTW9kdWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gd2ludGVyIGFsbFxuICAgICAgICAkKCcjanNfd2ludGVyX2RhdGEnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgcmljaG5lc3NNYXAudG9nZ2xlRGF0YUxheWVyKCR0aGlzKTtcblxuICAgICAgICAgICAgaWYgKCR0aGlzLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICQoJy5yaWNobmVzcy10b2dnbGUnKS5ub3QoJHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXREYXRhc2V0KCdkd2RlbnNpdHknKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRCcmVlZGluZ1JhbmdlKCR0aGlzLmRhdGEoJ3JhbmdlJykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldENvbnNlcnZhdGlvblN0YXR1cygkdGhpcy5kYXRhKCdzdGF0dXMnKSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuZ2V0UmljaG5lc3NEYXRhKCk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuZ2V0UmljaG5lc3NUZXRyYWREYXRhKCk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAubG9nTW9kdWxlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnW2RhdGEtdGV0cmFkPVwiMktcIl0nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChyaWNobmVzc01hcC5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWNobmVzc01hcC5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICBpZiAoIXJpY2huZXNzTWFwLmRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9ICR0aGlzLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHRldHJhZElkID0gZXZlbnQudGFyZ2V0LmlkLFxuICAgICAgICAgICAgICAgIHRldHJhZE5hbWUgPSBldmVudC50YXJnZXQuaWQuc2xpY2UoMywgOCk7XG5cbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuaGlkZUN1cnJlbnRseVNlbGVjdGVkVGV0cmFkSW5mbyh0ZXRyYWRJZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmljaG5lc3NNYXAuc3RhcnRTcGlubmVyKFsndGV0cmFkLXJlc3VsdHMnXSk7XG4gICAgICAgICAgICByaWNobmVzc01hcC5yZXF1ZXN0ID0gJ3RldHJhZCc7XG4gICAgICAgICAgICByaWNobmVzc01hcC51cGRhdGVTZWxlY3RlZFRldHJhZCh0ZXRyYWRJZCk7XG4gICAgICAgICAgICByaWNobmVzc01hcC5zZXRUZXRyYWRTdGF0dXModGV0cmFkTmFtZSwgdGV0cmFkSWQpO1xuICAgICAgICAgICAgcmljaG5lc3NNYXAuZ2V0UmljaG5lc3NUZXRyYWREYXRhKCk7XG4gICAgICAgICAgICByaWNobmVzc01hcC5sb2dNb2R1bGUoKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgICQoJy50b2dnbGUtdG90YWwtbGlzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKHRoaXMpLm5leHQoKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJy5kYXRhLWxhdGVyLXRvZ2dsZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByaWNobmVzc01hcC50b2dnbGVEYXRhTGF5ZXIoJCh0aGlzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cblxuXG59KTtcbn0pKGpRdWVyeSk7XG4iLCJ2YXIgb3ZlcmxheSA9IChmdW5jdGlvbiAoJCkge1xuICAgIGZ1bmN0aW9uIHNob3cobGF5ZXIsICRjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgJGxheWVyID0gJCgnLicgKyBsYXllcik7XG4gICAgICAgICRjb250ZXh0LmZpbmQoJGxheWVyKS5hZGRDbGFzcygnb24nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlKGxheWVyLCAkY29udGV4dCkge1xuICAgICAgICAgICAgdmFyICRsYXllciA9ICQoJy4nICsgbGF5ZXIpO1xuICAgICAgICAkY29udGV4dC5maW5kKCRsYXllcikucmVtb3ZlQ2xhc3MoJ29uJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHNob3c6IHNob3csXG4gICAgICAgIGhpZGU6IGhpZGVcbiAgICB9O1xufShqUXVlcnkpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJsYXk7Il19
