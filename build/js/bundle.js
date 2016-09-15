(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var MapModule = require('./modules/mapModule');
var overlay = require('./modules/overlay');

(function($) {
$(document).ready(function() {


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

        // $('.container').on('click', '.tenk > div', function(event) {
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
            // maps.m2_.startSpinner(['map']);
            // maps.m2_.getData();

            maps.m3_.setSpecies(this.value);
            maps.m3_.request = 'overview';
            maps.m3_.setDataset('dwdensity');
            maps.m3_.setOverviewMapState('idle');
            // maps.m3_.startSpinner(['map']);
            // maps.m3_.getData();
        });

        $('.container').on('click', '.idle-btn', function(event) {
            var currentMap = event.delegateTarget.id;
            maps[currentMap].setOverviewMapState('active');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwL2VudHJ5Iiwic3JjL2pzL2FwcC9tb2R1bGVzL292ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gdmFyIE1hcE1vZHVsZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tYXBNb2R1bGUnKTtcbnZhciBvdmVybGF5ID0gcmVxdWlyZSgnLi9tb2R1bGVzL292ZXJsYXknKTtcblxuKGZ1bmN0aW9uKCQpIHtcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cbiAgICAvLyBvdmVybGF5IGNvbnRyb2xzXG4gICAgJCgnLm92LXRvZ2dsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgbGF5ZXIgPSAkdGhpcy5hdHRyKCduYW1lJyksXG4gICAgICAgICAgICBjb250ZXh0ID0gJHRoaXMuY2xvc2VzdCgnLmNvbnRhaW5lcicpO1xuICAgICAgICAkdGhpcy5pcyhcIjpjaGVja2VkXCIpID8gb3ZlcmxheS5zaG93KGxheWVyLCBjb250ZXh0KSA6IG92ZXJsYXkuaGlkZShsYXllciwgY29udGV4dCk7XG4gICAgfSk7XG5cbiAgICAvLyB0b29nbGUgZG91YmxlIHZpZXdcbiAgICB2YXIgJHdyYXBwZXIgPSAkKCcjdGV0cmFkLW1hcHMnKTtcbiAgICBmdW5jdGlvbiBkb3VibGVPbigkYnRuKSB7XG4gICAgICAgICR3cmFwcGVyLmFkZENsYXNzKCdkb3VibGUnKTtcbiAgICAgICAgJGJ0bi5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvdWJsZU9mZigkYnRuKSB7XG4gICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdkb3VibGUnKTtcbiAgICAgICAgJGJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuXG5cbiAgICAvLyBtYXAgcGFnZVxuICAgIGlmICggdHlwZW9mIG1hcFBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG1hcFBhZ2UpIHtcblxuICAgICAgICAkKCcjanMtY29tcGFyZS10b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkYnRuID0gJCh0aGlzKTtcbiAgICAgICAgICAgICQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpID8gZG91YmxlT2ZmKCRidG4pIDogZG91YmxlT24oJGJ0bik7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gc2V0dXAgdGhlIG1hcE1vZHVsZXNcbiAgICAgICAgdmFyIG1hcHMgPSB7fTtcbiAgICAgICAgbWFwcy5tMV8gPSBuZXcgTWFwTW9kdWxlKCdtMV8nKTtcbiAgICAgICAgbWFwcy5tMl8gPSBuZXcgTWFwTW9kdWxlKCdtMl8nKTtcblxuICAgICAgICAvLyBzZXQgZGVmYXVsdHNcbiAgICAgICAgbWFwcy5tMV8uc2V0U3BlY2llcygnQWxwaW5lIFN3aWZ0Jyk7XG4gICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuXG4gICAgICAgIG1hcHMubTJfLnNldFNwZWNpZXMoJ0FscGluZSBTd2lmdCcpO1xuICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2hhbmdlJywgJy5zZWxlY3Qtc3BlY2llcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAnc3BlY2llcyc7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0U3BlY2llcyh0aGlzLnZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1kYXRhLXNldCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAnZGF0YXNldCc7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RGF0YXNldCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0RGF0YSgpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXRUZXRyYWREYXRhKCk7XG5cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLnRlbmsgPiBkaXYnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJ1tkYXRhLXRldHJhZD1cIjJLXCJdJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkID0gJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB0ZXRyYWRJZCA9IGV2ZW50LnRhcmdldC5pZCxcbiAgICAgICAgICAgICAgICB0ZXRyYWROYW1lID0gZXZlbnQudGFyZ2V0LmlkLnNsaWNlKDMsIDgpO1xuXG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uaGlkZUN1cnJlbnRseVNlbGVjdGVkVGV0cmFkSW5mbyh0ZXRyYWRJZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ3RldHJhZCc7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnVwZGF0ZVNlbGVjdGVkVGV0cmFkKHRldHJhZElkKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0VGV0cmFkU3RhdHVzKHRldHJhZE5hbWUsIHRldHJhZElkKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0VGV0cmFkRGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJy50ZXRyYWQtbGlzdCBsaScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAnc3BlY2llcyc7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0U3BlY2llcygkKHRoaXMpLnRleHQoKSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldERhdGEoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0udXBkYXRlU3BlY2llc1NlbGVjdCgpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuZGF0YS1sYXRlci10b2dnbGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnRvZ2dsZURhdGFMYXllcigkdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICBpZiAoIHR5cGVvZiBvdlBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG92UGFnZSkge1xuICAgICAgICAvLyBzZXR1cCB0aGUgbWFwTW9kdWxlc1xuICAgICAgICB2YXIgbWFwcyA9IHt9O1xuICAgICAgICBtYXBzLm0xXyA9IG5ldyBNYXBNb2R1bGUoJ20xXycpO1xuICAgICAgICBtYXBzLm0xXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuICAgICAgICBtYXBzLm0yXyA9IG5ldyBNYXBNb2R1bGUoJ20yXycpO1xuICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcblxuICAgICAgICBtYXBzLm0zXyA9IG5ldyBNYXBNb2R1bGUoJ20zXycpO1xuICAgICAgICBtYXBzLm0zXy5zZXREYXRhc2V0KCdkd2RlbnNpdHknKTtcblxuICAgICAgICAkKCcuc2VsZWN0LXNwZWNpZXMnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG1hcHMubTFfLnNldFNwZWNpZXModGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzLm0xXy5yZXF1ZXN0ID0gJ292ZXJ2aWV3JztcbiAgICAgICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuICAgICAgICAgICAgbWFwcy5tMV8uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwcy5tMV8uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzLm0yXy5zZXRTcGVjaWVzKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwcy5tMl8ucmVxdWVzdCA9ICdvdmVydmlldyc7XG4gICAgICAgICAgICBtYXBzLm0yXy5zZXREYXRhc2V0KCdkYmRlbnNpdHknKTtcbiAgICAgICAgICAgIG1hcHMubTJfLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2lkbGUnKTtcbiAgICAgICAgICAgIC8vIG1hcHMubTJfLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIC8vIG1hcHMubTJfLmdldERhdGEoKTtcblxuICAgICAgICAgICAgbWFwcy5tM18uc2V0U3BlY2llcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHMubTNfLnJlcXVlc3QgPSAnb3ZlcnZpZXcnO1xuICAgICAgICAgICAgbWFwcy5tM18uc2V0RGF0YXNldCgnZHdkZW5zaXR5Jyk7XG4gICAgICAgICAgICBtYXBzLm0zXy5zZXRPdmVydmlld01hcFN0YXRlKCdpZGxlJyk7XG4gICAgICAgICAgICAvLyBtYXBzLm0zXy5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICAvLyBtYXBzLm0zXy5nZXREYXRhKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLmlkbGUtYnRuJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldE92ZXJ2aWV3TWFwU3RhdGUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xufSkoalF1ZXJ5KTtcbiIsInZhciBvdmVybGF5ID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgZnVuY3Rpb24gc2hvdyhsYXllciwgJGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciAkbGF5ZXIgPSAkKCcuJyArIGxheWVyKTtcbiAgICAgICAgJGNvbnRleHQuZmluZCgkbGF5ZXIpLmFkZENsYXNzKCdvbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpZGUobGF5ZXIsICRjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgJGxheWVyID0gJCgnLicgKyBsYXllcik7XG4gICAgICAgICRjb250ZXh0LmZpbmQoJGxheWVyKS5yZW1vdmVDbGFzcygnb24nKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvdzogc2hvdyxcbiAgICAgICAgaGlkZTogaGlkZVxuICAgIH07XG59KGpRdWVyeSkpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlcmxheTsiXX0=
