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
                richnessMap.logModule();
            }

        });

        $('.container').on('click', '[data-tetrad="2K"]', function(event) {
            var $this = $(this);

            if (richnessMap.fetchingData) {
                return false;
            }
            richnessMap.setFetchingData(true);

            var isSelected = $this.hasClass('selected');
                tetradId = event.target.id,
                tetradName = event.target.id.slice(3, 8);

            if (isSelected) {
                // richnessMap.hideCurrentlySelectedTetradInfo(tetradId);
                $this.removeClass('selected');
                return false;
            }
            richnessMap.startSpinner(['tetrad-results']);

            $('[data-tetrad="2K"]').removeClass('selected');
            $this.addClass('selected');
            richnessMap.request = 'tetrad';
            // richnessMap.updateSelectedTetrad(tetradId);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwL2VudHJ5Iiwic3JjL2pzL2FwcC9tb2R1bGVzL292ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyB2YXIgTWFwTW9kdWxlID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcE1vZHVsZScpO1xudmFyIG92ZXJsYXkgPSByZXF1aXJlKCcuL21vZHVsZXMvb3ZlcmxheScpO1xuXG4oZnVuY3Rpb24oJCkge1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblxuLy8gY29uc29sZS5sb2coJ3JpZ3NDb25zZXJ2YXRpb25MaXN0IDonLCByaWdzQ29uc2VydmF0aW9uTGlzdC5sZW5ndGgpO1xuLy8gY29uc29sZS5sb2coJ3NwZWNpZXNMaXN0OiAnLCBzcGVjaWVzTGlzdC5sZW5ndGgpO1xuXG4vLyB2YXIgY291bnQgPSAwO1xuLy8gdmFyIHByZXNlbnRJblNwZWNpZXNMaXN0ID0gW107XG4vLyB2YXIganVzdE5hbWVzID0gW107XG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IHJpZ3NDb25zZXJ2YXRpb25MaXN0Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgaWYgKHNwZWNpZXNMaXN0LmluZGV4T2Yocmlnc0NvbnNlcnZhdGlvbkxpc3RbaV0uc3BlY2llc05hbWUpID49IDApIHtcbi8vICAgICAgICAgcHJlc2VudEluU3BlY2llc0xpc3QucHVzaChyaWdzQ29uc2VydmF0aW9uTGlzdFtpXSk7XG4vLyAgICAgICAgIGp1c3ROYW1lcy5wdXNoKHJpZ3NDb25zZXJ2YXRpb25MaXN0W2ldLnNwZWNpZXNOYW1lKTtcbi8vICAgICAgICAgY291bnQrKztcbi8vICAgICB9XG4vLyB9XG5cblxuLy8gdmFyIE5PVHByZXNlbnRJblNwZWNpZXNMaXN0ID0gW107XG5cbi8vIGZvciAodmFyIGkgPSAwOyBpIDwgc3BlY2llc0xpc3QubGVuZ3RoOyBpKyspIHtcblxuLy8gICAgIGlmIChqdXN0TmFtZXMuaW5kZXhPZihzcGVjaWVzTGlzdFtpXSkgPCAwICkge1xuLy8gICAgICAgIE5PVHByZXNlbnRJblNwZWNpZXNMaXN0LnB1c2goe1xuLy8gICAgICAgICBcInNwZWNpZXNOYW1lXCIgOiBzcGVjaWVzTGlzdFtpXSxcbi8vICAgICAgICAgXCJsYXRpbk5hbWVcIjogXCJcIixcbi8vICAgICAgICAgXCJjb25zZXJ2YXRpb25TdGF0dXNcIjogXCJcIn1cbi8vICAgICAgICAgKTtcbi8vICAgICB9XG5cbi8vIH1cblxuXG5cblxuXG5cblxuXG4gICAgLy8gb3ZlcmxheSBjb250cm9sc1xuICAgICQoJy5vdi10b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGxheWVyID0gJHRoaXMuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgY29udGV4dCA9ICR0aGlzLmNsb3Nlc3QoJy5jb250YWluZXInKTtcbiAgICAgICAgJHRoaXMuaXMoXCI6Y2hlY2tlZFwiKSA/IG92ZXJsYXkuc2hvdyhsYXllciwgY29udGV4dCkgOiBvdmVybGF5LmhpZGUobGF5ZXIsIGNvbnRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gdG9vZ2xlIGRvdWJsZSB2aWV3XG4gICAgdmFyICR3cmFwcGVyID0gJCgnI3RldHJhZC1tYXBzJyk7XG4gICAgZnVuY3Rpb24gZG91YmxlT24oJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5hZGRDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb3VibGVPZmYoJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cblxuXG4gICAgLy8gbWFwIHBhZ2VcbiAgICBpZiAoIHR5cGVvZiBtYXBQYWdlICE9PSAndW5kZWZpbmVkJyAmJiBtYXBQYWdlKSB7XG5cbiAgICAgICAgJCgnI2pzLWNvbXBhcmUtdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJGJ0biA9ICQodGhpcyk7XG4gICAgICAgICAgICAkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSA/IGRvdWJsZU9mZigkYnRuKSA6IGRvdWJsZU9uKCRidG4pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXR1cCB0aGUgbWFwTW9kdWxlc1xuICAgICAgICB2YXIgbWFwcyA9IHt9O1xuICAgICAgICBtYXBzLm0xXyA9IG5ldyBNYXBNb2R1bGUoJ20xXycpO1xuICAgICAgICBtYXBzLm0yXyA9IG5ldyBNYXBNb2R1bGUoJ20yXycpO1xuXG4gICAgICAgIC8vIHNldCBkZWZhdWx0c1xuICAgICAgICBtYXBzLm0xXy5zZXRTcGVjaWVzKCdBbHBpbmUgU3dpZnQnKTtcbiAgICAgICAgbWFwcy5tMV8uc2V0RGF0YXNldCgnZGJyZWVkJyk7XG5cbiAgICAgICAgbWFwcy5tMl8uc2V0U3BlY2llcygnQWxwaW5lIFN3aWZ0Jyk7XG4gICAgICAgIG1hcHMubTJfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuXG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1zcGVjaWVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICdzcGVjaWVzJztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRTcGVjaWVzKHRoaXMudmFsdWUudHJpbSgpKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NoYW5nZScsICcuc2VsZWN0LWRhdGEtc2V0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICdkYXRhc2V0JztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXREYXRhc2V0KHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldFRldHJhZERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICdbZGF0YS10ZXRyYWQ9XCIyS1wiXScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9ICQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgdGV0cmFkSWQgPSBldmVudC50YXJnZXQuaWQsXG4gICAgICAgICAgICAgICAgdGV0cmFkTmFtZSA9IGV2ZW50LnRhcmdldC5pZC5zbGljZSgzLCA4KTtcblxuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmhpZGVDdXJyZW50bHlTZWxlY3RlZFRldHJhZEluZm8odGV0cmFkSWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICd0ZXRyYWQnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS51cGRhdGVTZWxlY3RlZFRldHJhZCh0ZXRyYWRJZCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFRldHJhZFN0YXR1cyh0ZXRyYWROYW1lLCB0ZXRyYWRJZCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldFRldHJhZERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcudGV0cmFkLWxpc3QgbGknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ3NwZWNpZXMnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFNwZWNpZXMoJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnVwZGF0ZVNwZWNpZXNTZWxlY3QoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLmRhdGEtbGF0ZXItdG9nZ2xlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS50b2dnbGVEYXRhTGF5ZXIoJHRoaXMpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICBpZiAoIHR5cGVvZiBvdlBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG92UGFnZSkge1xuICAgICAgICAvLyBzZXR1cCB0aGUgbWFwTW9kdWxlc1xuICAgICAgICB2YXIgbWFwcyA9IHt9O1xuICAgICAgICBtYXBzLm0xXyA9IG5ldyBNYXBNb2R1bGUoJ20xXycpO1xuICAgICAgICBtYXBzLm0xXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuICAgICAgICBtYXBzLm0yXyA9IG5ldyBNYXBNb2R1bGUoJ20yXycpO1xuICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcblxuICAgICAgICBtYXBzLm0zXyA9IG5ldyBNYXBNb2R1bGUoJ20zXycpO1xuICAgICAgICBtYXBzLm0zXy5zZXREYXRhc2V0KCdkd2RlbnNpdHknKTtcblxuICAgICAgICAkKCcuc2VsZWN0LXNwZWNpZXMnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG1hcHMubTFfLnNldFNwZWNpZXModGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzLm0xXy5yZXF1ZXN0ID0gJ292ZXJ2aWV3JztcbiAgICAgICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuICAgICAgICAgICAgbWFwcy5tMV8uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwcy5tMV8uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzLm0yXy5zZXRTcGVjaWVzKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwcy5tMl8ucmVxdWVzdCA9ICdvdmVydmlldyc7XG4gICAgICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcbiAgICAgICAgICAgIG1hcHMubTJfLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2lkbGUnKTtcblxuICAgICAgICAgICAgbWFwcy5tM18uc2V0U3BlY2llcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHMubTNfLnJlcXVlc3QgPSAnb3ZlcnZpZXcnO1xuICAgICAgICAgICAgbWFwcy5tM18uc2V0RGF0YXNldCgnZHdkZW5zaXR5Jyk7XG4gICAgICAgICAgICBtYXBzLm0zXy5zZXRPdmVydmlld01hcFN0YXRlKCdpZGxlJyk7XG5cbiAgICAgICAgICAgICQoJy5zdGF0ZScpLmFkZENsYXNzKCd1cGRhdGUnKTtcbiAgICAgICAgICAgIG1hcHMubTFfLmdldFNwZWNpZXNBY2NvdW50KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLmlkbGUtYnRuJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cblxuICAgIGlmICggdHlwZW9mIHJpY2huZXNzUGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmljaG5lc3NQYWdlKSB7XG5cbiAgICAgICAgdmFyIHJpY2huZXNzTWFwID0gbmV3IE1hcE1vZHVsZSgnbTFfJyk7XG5cbiAgICAgICAgJCgnW3JlbD1qcy1yaWNobmVzcy10b2dnbGVdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnRvZ2dsZURhdGFMYXllcigkdGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkdGhpcy5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcucmljaG5lc3MtdG9nZ2xlJykubm90KCR0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0RGF0YXNldCgkdGhpcy5kYXRhKCdzZXQnKSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0QnJlZWRpbmdSYW5nZSgkdGhpcy5kYXRhKCdyYW5nZScpKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRDb25zZXJ2YXRpb25TdGF0dXMoJHRoaXMuZGF0YSgnc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmdldFJpY2huZXNzRGF0YSgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmxvZ01vZHVsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdbcmVsPWpzLXJpY2huZXNzLXRvZ2dsZS1zdGF0dXNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnRvZ2dsZURhdGFMYXllcigkdGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkdGhpcy5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcucmljaG5lc3MtdG9nZ2xlJykubm90KCR0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0RGF0YXNldCgkdGhpcy5kYXRhKCdzZXQnKSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0QnJlZWRpbmdSYW5nZSgkdGhpcy5kYXRhKCdyYW5nZScpKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRDb25zZXJ2YXRpb25TdGF0dXMoJHRoaXMuZGF0YSgnc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmdldFJpY2huZXNzRGF0YSgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmxvZ01vZHVsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIHdpbnRlciBhbGxcbiAgICAgICAgJCgnI2pzX3dpbnRlcl9kYXRhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnRvZ2dsZURhdGFMYXllcigkdGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkdGhpcy5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcucmljaG5lc3MtdG9nZ2xlJykubm90KCR0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0RGF0YXNldCgnZHdkZW5zaXR5Jyk7XG4gICAgICAgICAgICAgICAgcmljaG5lc3NNYXAuc2V0QnJlZWRpbmdSYW5nZSgkdGhpcy5kYXRhKCdyYW5nZScpKTtcbiAgICAgICAgICAgICAgICByaWNobmVzc01hcC5zZXRDb25zZXJ2YXRpb25TdGF0dXMoJHRoaXMuZGF0YSgnc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmdldFJpY2huZXNzRGF0YSgpO1xuICAgICAgICAgICAgICAgIHJpY2huZXNzTWFwLmxvZ01vZHVsZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnW2RhdGEtdGV0cmFkPVwiMktcIl0nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKHJpY2huZXNzTWFwLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcblxuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSAkdGhpcy5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB0ZXRyYWRJZCA9IGV2ZW50LnRhcmdldC5pZCxcbiAgICAgICAgICAgICAgICB0ZXRyYWROYW1lID0gZXZlbnQudGFyZ2V0LmlkLnNsaWNlKDMsIDgpO1xuXG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIC8vIHJpY2huZXNzTWFwLmhpZGVDdXJyZW50bHlTZWxlY3RlZFRldHJhZEluZm8odGV0cmFkSWQpO1xuICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpY2huZXNzTWFwLnN0YXJ0U3Bpbm5lcihbJ3RldHJhZC1yZXN1bHRzJ10pO1xuXG4gICAgICAgICAgICAkKCdbZGF0YS10ZXRyYWQ9XCIyS1wiXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICByaWNobmVzc01hcC5yZXF1ZXN0ID0gJ3RldHJhZCc7XG4gICAgICAgICAgICAvLyByaWNobmVzc01hcC51cGRhdGVTZWxlY3RlZFRldHJhZCh0ZXRyYWRJZCk7XG4gICAgICAgICAgICByaWNobmVzc01hcC5zZXRUZXRyYWRTdGF0dXModGV0cmFkTmFtZSwgdGV0cmFkSWQpO1xuXG4gICAgICAgICAgICByaWNobmVzc01hcC5nZXRSaWNobmVzc1RldHJhZERhdGEoKTtcblxuICAgICAgICAgICAgcmljaG5lc3NNYXAubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy50b2dnbGUtdG90YWwtbGlzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKHRoaXMpLm5leHQoKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuZGF0YS1sYXRlci10b2dnbGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmljaG5lc3NNYXAudG9nZ2xlRGF0YUxheWVyKCQodGhpcykpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG5cblxufSk7XG59KShqUXVlcnkpO1xuIiwidmFyIG92ZXJsYXkgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICBmdW5jdGlvbiBzaG93KGxheWVyLCAkY29udGV4dCkge1xuICAgICAgICAgICAgdmFyICRsYXllciA9ICQoJy4nICsgbGF5ZXIpO1xuICAgICAgICAkY29udGV4dC5maW5kKCRsYXllcikuYWRkQ2xhc3MoJ29uJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZShsYXllciwgJGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciAkbGF5ZXIgPSAkKCcuJyArIGxheWVyKTtcbiAgICAgICAgJGNvbnRleHQuZmluZCgkbGF5ZXIpLnJlbW92ZUNsYXNzKCdvbicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93OiBzaG93LFxuICAgICAgICBoaWRlOiBoaWRlXG4gICAgfTtcbn0oalF1ZXJ5KSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVybGF5OyJdfQ==
