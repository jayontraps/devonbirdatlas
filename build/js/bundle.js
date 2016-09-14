(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MapModule = require('./modules/mapModule');
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
            maps.m2_.startSpinner(['map']);
            maps.m2_.getData();

            maps.m3_.setSpecies(this.value);
            maps.m3_.request = 'overview';
            maps.m3_.setDataset('dwdensity');
            maps.m3_.startSpinner(['map']);
            maps.m3_.getData();
        });
    }

});
})(jQuery);

},{"./modules/mapModule":2,"./modules/overlay":3}],2:[function(require,module,exports){
function MapModule(domContext) {
    this.context = domContext;
    this.tetrad = {
        active: false,
        currentList: ''
    };
}

MapModule.prototype.setDataset = function(dataset) {
    this.dataset = dataset;
    document.getElementById(this.context).setAttribute('data-set', dataset);
};

MapModule.prototype.setSpecies = function(species) {
    this.species = species;
};

MapModule.prototype.setFetchingData = function(status) {
    this.fetchingData = status;
};

MapModule.prototype.setTetradStatus = function(tetradId, id) {
    this.tetrad = {
        active : tetradId,
        domId : id
    };

    document.getElementById(this.context).classList.add('tetrad-active');
};

MapModule.prototype.logModule = function() {
    console.log(this);
};

MapModule.prototype.setGoogleMapLink = function() {

    var gMapWrap = $('#' + this.context).find('.gmap-link');
    gMapWrap.empty();

    if (this.tetrad.active) {
        var url = window.location.href;
        var gMapLink = $('<a/>', {
            'href': url + 'gmap/?tetrad=' + this.tetrad.active + '',
            'target': '_blank',
            'class': 'gmap',
            'html': 'Generate Google Map'
        });

        gMapLink.appendTo(gMapWrap);
    }
};

/* GETTING DATA */

MapModule.prototype.getTetradData = function() {

    if (!this.tetrad.active) { return false; }

    this.startSpinner(['tetrad-meta']);

    this.tetrad.currentList = "";

    var obj = this;

    this.startUpdatingEls();

    var postData = {
        "tetradId" : this.tetrad.active,
        "data-set" : this.dataset
    };

    $.ajax({
        url: config.folder + config.themeUrl + '/ajax/tetradData.php',
        type: 'POST',
        dataType: 'json',
        data: postData,
        timeout: 12000
    })
    .done(function(data){
        obj.tetrad.counts = obj.getSums(data);

        var tetradList = document.createElement('ol');
        tetradList.classList.add('tetrad-list');

        // lookup the index, retreive the Code value and template the list item
        var theCode, el, spanEl;
        for (var i = 0; i < data.length; i++) {
            theCode = data[i].Code;
            el = document.createElement('li');
            el.innerHTML = data[i].Species.trim();
            spanEl = document.createElement('span');
            spanEl.classList.add('code-' + theCode);
            el.appendChild(spanEl);
            tetradList.appendChild(el);
        }

        obj.tetrad.currentList = tetradList;

        //  A procedure for soting the list alphabetically
        // // get the list of names
        // var orginalList = [];

        // for (var i = 0; i < data.length; i++) {
        //     orginalList.push(data[i]['Species']);
        // }
        // // sort the list to new arr
        // var sortList = [];
        // for (var i = 0; i < data.length; i++) {
        //     sortList.push(data[i]['Species']);
        // }
        // sortList.sort();

        // var tetradList = document.createElement('ol');
        // tetradList.classList.add('tetrad-list');

        // // lookup the index, retreive the Code value and template the list item
        // var theCode, el, spanEl;
        // for (var i = 0; i < sortList.length; i++) {
        //     theCode = data[orginalList.indexOf(sortList[i])]['Code'];
        //     el = document.createElement('li');
        //     el.innerHTML = sortList[i].trim();
        //     spanEl = document.createElement('span');
        //     spanEl.classList.add('code-' + theCode);
        //     el.appendChild(spanEl);
        //     tetradList.appendChild(el);
        // }

        // obj.tetrad.currentList = tetradList;
        // // truncate arrays
        // orginalList.length = 0;
        // sortList.length = 0;

    })
    .done(function(data) {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['tetrad-meta']);
            // obj.updateStateEls.stop.call(obj, obj.context);
            obj.stopUpdatingEls();
            obj.setFetchingData(false);
        }, 800);
    })
    .fail(function() {
        console.log("getTetradData - error");
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['tetrad-meta']);
            obj.setMapErrorMsg(true, 'tetrad-request');
        }, 800);
    })
    .always(function() {
        // console.log("getTetradData - complete");
    });

};

MapModule.prototype.filterForTenkSpecies = function() {

    if (tenkSpecies.length && tenkSpecies.indexOf(this.species) >= 0) {
        if (this.dataset === 'dbreed') {
            this.tenkSpecies = true;
            this.setDataset('dbreed10');
            console.log('filterForTenkSpecies: ', this.dataset);
        }

        return false;
    }

    
    this.tenkSpecies = false;
    if ( typeof mapPage !== 'undefined' && mapPage ) {
        var currentDataSet = document.getElementById(this.context).querySelector('.select-data-set');
        this.setDataset(currentDataSet.value);
    }

};


MapModule.prototype.getData = function() {

    this.filterForTenkSpecies();

    var obj = this;

    var formData = {
        "species" : this.species,
        "data-set" : this.dataset
    };

    this.startUpdatingEls();

    $.ajax({
            url: config.folder + config.themeUrl + '/ajax/speciesData.php',
            type: 'POST',
            dataType: 'json',
            data:  formData,
            timeout: 12000
        })
        .done(function(data) {
            // remove previous results using currentTetradArr
            var prevResults = JSON.parse(sessionStorage.getItem(obj.context + "currentTetradArr"));

            if (Array.isArray(prevResults) && prevResults.length)  {
                for (var i = 0; i < prevResults.length; i++) {
                    document.getElementById(obj.context + prevResults[i]).className = '';
                }
            }
            tetArr = [];
            for (var i = 0; i < data.length; i++) {
                tetArr.push(data[i]['Tetrad']);
                sessionStorage.setItem(obj.context + "currentTetradArr", JSON.stringify(tetArr));
            }

            // store an indicator of results belonging to 10K or 2K species
            // var speciesStatus = obj.tenkSpecies ? '10K' : '2K';
            // sessionStorage.setItem('status', speciesStatus);

            // add classes to matching tetrads
            for (var i = 0; i < tetArr.length; i++) {
                    document.getElementById(obj.context + tetArr[i]).classList.add('pres', 'code-' + data[i]['Code']);
            }

        })
        .done(function(data) {
            // refresh active tetrad
            if (obj.tetrad.active) {
                $('#' + obj.tetrad.domId).addClass('selected');
            }

            obj.counts = obj.getSums(data);
        })
        .done(function() {
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                // obj.updateStateEls.stop.call(obj, obj.context);
                obj.stopUpdatingEls();
                obj.setFetchingData(false);
            }, 800);
        })
        .done(function(){
            obj.logModule();
        })
        .fail(function() {
            console.log("getData - error");
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                obj.setMapErrorMsg(true, 'data-request');
            }, 800);
        })
        .always(function() {
        });

};

MapModule.prototype.getSums = function(data) {
    var sumConfirmed = 0,
        sumProbable = 0,
        sumPossible = 0,
        sumPresent = 0;
    if (this.dataset === 'dbreed' || this.dataset === 'sitters') {
        for (var i = 0; i < data.length; i++) {
            if (data[i]['Code'] === 'A') {sumConfirmed++;}
            if (data[i]['Code'] === 'B') {sumProbable++;}
            if (data[i]['Code'] === 'K') {sumPossible++;}
            if (data[i]['Code'] === 'N') {sumPresent++;}
        }
    }

    return {
        total: data.length + 1,
        sumPresent: sumPresent,
        sumPossible: sumPossible,
        sumProbable: sumProbable,
        sumConfirmed: sumConfirmed
    };
};

MapModule.prototype.getLatinName = function() {

    if (typeof latinNames !== 'undefined' && latinNames.length) {

        for (var i = 0; i < latinNames.length; i++) {

            for(var key in latinNames[i]) {

                if( latinNames[i].hasOwnProperty(key)) {
                    if (key == this.species) {
                        return latinNames[i][key];
                    }
                }
            }
        }
    }
    return false;
};



/* DOM */

MapModule.prototype.setMapErrorMsg = function(status, context) {

    var $container;

    context === "tetrad-request" ? $container = $('.tetrad-meta') : $container = $('.map-container');

    var $errorMsg = $('#' + this.context).find($container).find('.error-wrap');
    if (status) {
        $errorMsg.css('display', 'flex');
        return false;
    }
    $errorMsg.css('display', 'none');
};

MapModule.prototype.startSpinner = function(els) {
    if (Array.isArray(els) && els.length) {
        for (var i = 0; i < els.length; i++) {
            if (els[i] === 'map') {
                $('#' + this.context).find('.map-container').addClass('loading-data');
            }
            if (els[i] === 'tetrad-meta') {
                $('#' + this.context).find('.tetrad-meta ').addClass('loading-data');
            }
        }
    }
};

MapModule.prototype.stopSpinner = function(els) {
    if (Array.isArray(els) && els.length) {
        for (var i = 0; i < els.length; i++) {
            if (els[i] === 'map') {
                $('#' + this.context).find('.map-container').removeClass('loading-data');
            }
            if (els[i] === 'tetrad-meta') {
                $('#' + this.context).find('.tetrad-meta ').removeClass('loading-data');
            }
        }
    }
};

MapModule.prototype.startUpdatingEls = function() {
    console.log('context: ', this.context);
    var parentEl = document.getElementById(this.context);

    if (this.request === 'species') {
        var speciesTitle = parentEl.querySelector('.species-titles');
        speciesTitle.classList.add('update');
        var counts = parentEl.querySelector('.counts');
        counts.classList.add('update');
        return false;
    }
    if (this.request === 'dataset') {
        // var dataSetTitles = parentEl.querySelector('.dataset-titles');
        // dataSetTitles.classList.add('update');
        // scrapped as no layering datasets currently

        var keyGroup = parentEl.querySelector('.key-group');
        keyGroup.classList.add('update');

        if (this.tetrad.active) {
            var tetradMeta = parentEl.querySelector('.tetrad-meta');
            tetradMeta.classList.add('update');
        }
        return false;
    }
    if (this.request === 'tetrad') {
        var tetradMeta = parentEl.querySelector('.tetrad-meta');
        tetradMeta.classList.add('update');
        return false;
    }
}

MapModule.prototype.stopUpdatingEls = function() {

    if (this.request === 'species') {
        this.updateHeadings();
        this.updateSums();
        this.updateTetradsPresent(this.counts.total);
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'dataset') {
        this.updateDatasetHeadings();
        this.updateKeys();
        this.updateSums();
        this.updateTetradsPresent(this.counts.total);
        if (this.tetrad.active) {
            this.updateTeradBox();
            this.setGoogleMapLink();
        }
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'tetrad') {
        this.updateTeradBox();
        this.setGoogleMapLink();
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'overview') {
        if (this.dataset === 'dbreed') {
            this.updateSums();
        }
        if (this.dataset === 'dbdensity' || this.dataset === 'dwdensity') {
            this.updateTetradsPresent(this.counts.total);
        }
        document.getElementById('species-name').innerHTML = this.species;
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
}


MapModule.prototype.updateTeradBox = function () {

    var theList = $('#' + this.context).find('.tetrad-list-wrapper'),
        $parentEl = $('#' + this.context);

    $parentEl.find('.tetrad-title').html(this.tetrad.active);

    if (this.dataset === 'dbreed' || this.dataset === 'sitters') {
        $parentEl.find('.tet-pres').html(this.tetrad.counts.sumPresent);
        $parentEl.find('.tet-poss').html(this.tetrad.counts.sumPossible);
        $parentEl.find('.tet-prob').html(this.tetrad.counts.sumProbable);
        $parentEl.find('.tet-conf').html(this.tetrad.counts.sumConfirmed);
        $parentEl.find('.tet-sums').show();
    } else {
        $parentEl.find('.tet-sums').hide();
    }
    $(theList).empty();

    $(this.tetrad.currentList).appendTo(theList);
};

MapModule.prototype.updateSums = function() {
    var sums = this.counts;
    var parentEl = document.getElementById(this.context);
    parentEl.querySelector('.pres-target').innerHTML = sums.sumPresent;
    parentEl.querySelector('.conf-target').innerHTML = sums.sumConfirmed;
    parentEl.querySelector('.prob-target').innerHTML = sums.sumProbable;
    parentEl.querySelector('.poss-target').innerHTML = sums.sumPossible;
};

MapModule.prototype.updateSpeciesSelect = function() {
    var chosenList = $('#' + this.context).find('.select-species');
    chosenList.val(this.species);
    chosenList.trigger("chosen:updated");
};

MapModule.prototype.updateTetradsPresent = function(length) {
    $('#' + this.context).find('.tet_pres').html(length);
};

MapModule.prototype.updateSelectedTetrad = function(tetradId) {
    // reveal the info box if hidden
    $('#' + this.context).find('.tetrad-meta-wrapper').removeClass('hide');
    var $tetrad = $('#' + tetradId);
    if (this.tetrad.active) {
        var $prevTetrad = $('#' + this.tetrad.domId);
        $prevTetrad.removeClass('selected');
        $tetrad.addClass('selected');
    } else {
        $('#' + tetradId).addClass('selected');
    }
};

MapModule.prototype.hideCurrentlySelectedTetradInfo = function(tetradId) {
    var $tetrad = $('#' + tetradId);
    $('#' + this.context).find('.tetrad-meta-wrapper').addClass('hide');
    $tetrad.removeClass('selected');
    $('#' + this.context).removeClass('tetrad-active');
    this.tetrad.active = false;
    this.setFetchingData(false);
};



MapModule.prototype.updateHeadings = function () {
    $('#' + this.context).find('.species-title').html(this.species);
    var latinName = this.getLatinName();
    if (latinName) {
        $('#' + this.context).find('.latin-name').html(latinName);
    }
};

MapModule.prototype.updateDatasetHeadings = function() {
    var obj = this;
    var $els = $('#' + this.context).find('.d-set');
    $els.removeClass('current');
    $els.each(function(index, el) {
        if (obj.dataset === $(el).attr('data-dset-title')) {
            $(el).addClass('current');
            return false;
        }
        if($(el).hasClass('d-set-breeding')) {
            $(this).addClass('current');
        }

    });
};

MapModule.prototype.updateKeys = function() {
    var keyEls = $('#' + this.context).find('.key-container');
    $(keyEls).removeClass('active dwdensity dbdensity');
    if (this.dataset === 'dwdensity' || this.dataset === 'dbdensity') {
        $(keyEls[1]).addClass('active ' + this.dataset);
        return false;
    }
    $(keyEls[0]).addClass('active');
};

MapModule.prototype.toggleDataLayer = function($el) {
    $el.is(":checked") ? $('#' + this.context).removeClass('data-off') : $('#' + this.context).addClass('data-off');
};

module.exports = MapModule;
},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwL2VudHJ5Iiwic3JjL2pzL2FwcC9tb2R1bGVzL21hcE1vZHVsZS5qcyIsInNyYy9qcy9hcHAvbW9kdWxlcy9vdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNYXBNb2R1bGUgPSByZXF1aXJlKCcuL21vZHVsZXMvbWFwTW9kdWxlJyk7XG52YXIgb3ZlcmxheSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9vdmVybGF5Jyk7XG5cbihmdW5jdGlvbigkKSB7XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXG4gICAgLy8gb3ZlcmxheSBjb250cm9sc1xuICAgICQoJy5vdi10b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGxheWVyID0gJHRoaXMuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgY29udGV4dCA9ICR0aGlzLmNsb3Nlc3QoJy5jb250YWluZXInKTtcbiAgICAgICAgJHRoaXMuaXMoXCI6Y2hlY2tlZFwiKSA/IG92ZXJsYXkuc2hvdyhsYXllciwgY29udGV4dCkgOiBvdmVybGF5LmhpZGUobGF5ZXIsIGNvbnRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gdG9vZ2xlIGRvdWJsZSB2aWV3XG4gICAgdmFyICR3cmFwcGVyID0gJCgnI3RldHJhZC1tYXBzJyk7XG4gICAgZnVuY3Rpb24gZG91YmxlT24oJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5hZGRDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb3VibGVPZmYoJGJ0bikge1xuICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnZG91YmxlJyk7XG4gICAgICAgICRidG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cblxuXG4gICAgLy8gbWFwIHBhZ2VcbiAgICBpZiAoIHR5cGVvZiBtYXBQYWdlICE9PSAndW5kZWZpbmVkJyAmJiBtYXBQYWdlKSB7XG5cbiAgICAgICAgJCgnI2pzLWNvbXBhcmUtdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJGJ0biA9ICQodGhpcyk7XG4gICAgICAgICAgICAkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSA/IGRvdWJsZU9mZigkYnRuKSA6IGRvdWJsZU9uKCRidG4pO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIHNldHVwIHRoZSBtYXBNb2R1bGVzXG4gICAgICAgIHZhciBtYXBzID0ge307XG4gICAgICAgIG1hcHMubTFfID0gbmV3IE1hcE1vZHVsZSgnbTFfJyk7XG4gICAgICAgIG1hcHMubTJfID0gbmV3IE1hcE1vZHVsZSgnbTJfJyk7XG5cbiAgICAgICAgLy8gc2V0IGRlZmF1bHRzXG4gICAgICAgIG1hcHMubTFfLnNldFNwZWNpZXMoJ0FscGluZSBTd2lmdCcpO1xuICAgICAgICBtYXBzLm0xXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcblxuICAgICAgICBtYXBzLm0yXy5zZXRTcGVjaWVzKCdBbHBpbmUgU3dpZnQnKTtcbiAgICAgICAgbWFwcy5tMl8uc2V0RGF0YXNldCgnZGJyZWVkJyk7XG5cblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NoYW5nZScsICcuc2VsZWN0LXNwZWNpZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ3NwZWNpZXMnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFNwZWNpZXModGhpcy52YWx1ZS50cmltKCkpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG5cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2hhbmdlJywgJy5zZWxlY3QtZGF0YS1zZXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ2RhdGFzZXQnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldERhdGFzZXQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldERhdGEoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0VGV0cmFkRGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJy50ZW5rID4gZGl2JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICdbZGF0YS10ZXRyYWQ9XCIyS1wiXScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgaWYgKG1hcHNbY3VycmVudE1hcF0uZmV0Y2hpbmdEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRGZXRjaGluZ0RhdGEodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9ICQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgdGV0cmFkSWQgPSBldmVudC50YXJnZXQuaWQsXG4gICAgICAgICAgICAgICAgdGV0cmFkTmFtZSA9IGV2ZW50LnRhcmdldC5pZC5zbGljZSgzLCA4KTtcblxuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmhpZGVDdXJyZW50bHlTZWxlY3RlZFRldHJhZEluZm8odGV0cmFkSWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICd0ZXRyYWQnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS51cGRhdGVTZWxlY3RlZFRldHJhZCh0ZXRyYWRJZCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFRldHJhZFN0YXR1cyh0ZXRyYWROYW1lLCB0ZXRyYWRJZCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldFRldHJhZERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcudGV0cmFkLWxpc3QgbGknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5yZXF1ZXN0ID0gJ3NwZWNpZXMnO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldFNwZWNpZXMoJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnVwZGF0ZVNwZWNpZXNTZWxlY3QoKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLmRhdGEtbGF0ZXItdG9nZ2xlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS50b2dnbGVEYXRhTGF5ZXIoJHRoaXMpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgaWYgKCB0eXBlb2Ygb3ZQYWdlICE9PSAndW5kZWZpbmVkJyAmJiBvdlBhZ2UpIHtcbiAgICAgICAgLy8gc2V0dXAgdGhlIG1hcE1vZHVsZXNcbiAgICAgICAgdmFyIG1hcHMgPSB7fTtcbiAgICAgICAgbWFwcy5tMV8gPSBuZXcgTWFwTW9kdWxlKCdtMV8nKTtcbiAgICAgICAgbWFwcy5tMV8uc2V0RGF0YXNldCgnZGJyZWVkJyk7XG5cbiAgICAgICAgbWFwcy5tMl8gPSBuZXcgTWFwTW9kdWxlKCdtMl8nKTtcbiAgICAgICAgbWFwcy5tMl8uc2V0RGF0YXNldCgnZGJkZW5zaXR5Jyk7XG5cbiAgICAgICAgbWFwcy5tM18gPSBuZXcgTWFwTW9kdWxlKCdtM18nKTtcbiAgICAgICAgbWFwcy5tM18uc2V0RGF0YXNldCgnZHdkZW5zaXR5Jyk7XG5cbiAgICAgICAgJCgnLnNlbGVjdC1zcGVjaWVzJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBtYXBzLm0xXy5zZXRTcGVjaWVzKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwcy5tMV8ucmVxdWVzdCA9ICdvdmVydmlldyc7XG4gICAgICAgICAgICBtYXBzLm0xXy5zZXREYXRhc2V0KCdkYnJlZWQnKTtcbiAgICAgICAgICAgIG1hcHMubTFfLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHMubTFfLmdldERhdGEoKTtcblxuICAgICAgICAgICAgbWFwcy5tMl8uc2V0U3BlY2llcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHMubTJfLnJlcXVlc3QgPSAnb3ZlcnZpZXcnO1xuICAgICAgICAgICAgbWFwcy5tMl8uc2V0RGF0YXNldCgnZGJkZW5zaXR5Jyk7XG4gICAgICAgICAgICBtYXBzLm0yXy5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzLm0yXy5nZXREYXRhKCk7XG5cbiAgICAgICAgICAgIG1hcHMubTNfLnNldFNwZWNpZXModGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzLm0zXy5yZXF1ZXN0ID0gJ292ZXJ2aWV3JztcbiAgICAgICAgICAgIG1hcHMubTNfLnNldERhdGFzZXQoJ2R3ZGVuc2l0eScpO1xuICAgICAgICAgICAgbWFwcy5tM18uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwcy5tM18uZ2V0RGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pO1xufSkoalF1ZXJ5KTtcbiIsImZ1bmN0aW9uIE1hcE1vZHVsZShkb21Db250ZXh0KSB7XG4gICAgdGhpcy5jb250ZXh0ID0gZG9tQ29udGV4dDtcbiAgICB0aGlzLnRldHJhZCA9IHtcbiAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgY3VycmVudExpc3Q6ICcnXG4gICAgfTtcbn1cblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zZXREYXRhc2V0ID0gZnVuY3Rpb24oZGF0YXNldCkge1xuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250ZXh0KS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0JywgZGF0YXNldCk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnNldFNwZWNpZXMgPSBmdW5jdGlvbihzcGVjaWVzKSB7XG4gICAgdGhpcy5zcGVjaWVzID0gc3BlY2llcztcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuc2V0RmV0Y2hpbmdEYXRhID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgdGhpcy5mZXRjaGluZ0RhdGEgPSBzdGF0dXM7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnNldFRldHJhZFN0YXR1cyA9IGZ1bmN0aW9uKHRldHJhZElkLCBpZCkge1xuICAgIHRoaXMudGV0cmFkID0ge1xuICAgICAgICBhY3RpdmUgOiB0ZXRyYWRJZCxcbiAgICAgICAgZG9tSWQgOiBpZFxuICAgIH07XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRleHQpLmNsYXNzTGlzdC5hZGQoJ3RldHJhZC1hY3RpdmUnKTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUubG9nTW9kdWxlID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2codGhpcyk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnNldEdvb2dsZU1hcExpbmsgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBnTWFwV3JhcCA9ICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuZ21hcC1saW5rJyk7XG4gICAgZ01hcFdyYXAuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLnRldHJhZC5hY3RpdmUpIHtcbiAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB2YXIgZ01hcExpbmsgPSAkKCc8YS8+Jywge1xuICAgICAgICAgICAgJ2hyZWYnOiB1cmwgKyAnZ21hcC8/dGV0cmFkPScgKyB0aGlzLnRldHJhZC5hY3RpdmUgKyAnJyxcbiAgICAgICAgICAgICd0YXJnZXQnOiAnX2JsYW5rJyxcbiAgICAgICAgICAgICdjbGFzcyc6ICdnbWFwJyxcbiAgICAgICAgICAgICdodG1sJzogJ0dlbmVyYXRlIEdvb2dsZSBNYXAnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdNYXBMaW5rLmFwcGVuZFRvKGdNYXBXcmFwKTtcbiAgICB9XG59O1xuXG4vKiBHRVRUSU5HIERBVEEgKi9cblxuTWFwTW9kdWxlLnByb3RvdHlwZS5nZXRUZXRyYWREYXRhID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoIXRoaXMudGV0cmFkLmFjdGl2ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHRoaXMuc3RhcnRTcGlubmVyKFsndGV0cmFkLW1ldGEnXSk7XG5cbiAgICB0aGlzLnRldHJhZC5jdXJyZW50TGlzdCA9IFwiXCI7XG5cbiAgICB2YXIgb2JqID0gdGhpcztcblxuICAgIHRoaXMuc3RhcnRVcGRhdGluZ0VscygpO1xuXG4gICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICBcInRldHJhZElkXCIgOiB0aGlzLnRldHJhZC5hY3RpdmUsXG4gICAgICAgIFwiZGF0YS1zZXRcIiA6IHRoaXMuZGF0YXNldFxuICAgIH07XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGNvbmZpZy5mb2xkZXIgKyBjb25maWcudGhlbWVVcmwgKyAnL2FqYXgvdGV0cmFkRGF0YS5waHAnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHBvc3REYXRhLFxuICAgICAgICB0aW1lb3V0OiAxMjAwMFxuICAgIH0pXG4gICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIG9iai50ZXRyYWQuY291bnRzID0gb2JqLmdldFN1bXMoZGF0YSk7XG5cbiAgICAgICAgdmFyIHRldHJhZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xuICAgICAgICB0ZXRyYWRMaXN0LmNsYXNzTGlzdC5hZGQoJ3RldHJhZC1saXN0Jyk7XG5cbiAgICAgICAgLy8gbG9va3VwIHRoZSBpbmRleCwgcmV0cmVpdmUgdGhlIENvZGUgdmFsdWUgYW5kIHRlbXBsYXRlIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgdmFyIHRoZUNvZGUsIGVsLCBzcGFuRWw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhlQ29kZSA9IGRhdGFbaV0uQ29kZTtcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IGRhdGFbaV0uU3BlY2llcy50cmltKCk7XG4gICAgICAgICAgICBzcGFuRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBzcGFuRWwuY2xhc3NMaXN0LmFkZCgnY29kZS0nICsgdGhlQ29kZSk7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChzcGFuRWwpO1xuICAgICAgICAgICAgdGV0cmFkTGlzdC5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBvYmoudGV0cmFkLmN1cnJlbnRMaXN0ID0gdGV0cmFkTGlzdDtcblxuICAgICAgICAvLyAgQSBwcm9jZWR1cmUgZm9yIHNvdGluZyB0aGUgbGlzdCBhbHBoYWJldGljYWxseVxuICAgICAgICAvLyAvLyBnZXQgdGhlIGxpc3Qgb2YgbmFtZXNcbiAgICAgICAgLy8gdmFyIG9yZ2luYWxMaXN0ID0gW107XG5cbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBvcmdpbmFsTGlzdC5wdXNoKGRhdGFbaV1bJ1NwZWNpZXMnXSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8gc29ydCB0aGUgbGlzdCB0byBuZXcgYXJyXG4gICAgICAgIC8vIHZhciBzb3J0TGlzdCA9IFtdO1xuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIHNvcnRMaXN0LnB1c2goZGF0YVtpXVsnU3BlY2llcyddKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBzb3J0TGlzdC5zb3J0KCk7XG5cbiAgICAgICAgLy8gdmFyIHRldHJhZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xuICAgICAgICAvLyB0ZXRyYWRMaXN0LmNsYXNzTGlzdC5hZGQoJ3RldHJhZC1saXN0Jyk7XG5cbiAgICAgICAgLy8gLy8gbG9va3VwIHRoZSBpbmRleCwgcmV0cmVpdmUgdGhlIENvZGUgdmFsdWUgYW5kIHRlbXBsYXRlIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgLy8gdmFyIHRoZUNvZGUsIGVsLCBzcGFuRWw7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgc29ydExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIHRoZUNvZGUgPSBkYXRhW29yZ2luYWxMaXN0LmluZGV4T2Yoc29ydExpc3RbaV0pXVsnQ29kZSddO1xuICAgICAgICAvLyAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAvLyAgICAgZWwuaW5uZXJIVE1MID0gc29ydExpc3RbaV0udHJpbSgpO1xuICAgICAgICAvLyAgICAgc3BhbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAvLyAgICAgc3BhbkVsLmNsYXNzTGlzdC5hZGQoJ2NvZGUtJyArIHRoZUNvZGUpO1xuICAgICAgICAvLyAgICAgZWwuYXBwZW5kQ2hpbGQoc3BhbkVsKTtcbiAgICAgICAgLy8gICAgIHRldHJhZExpc3QuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gb2JqLnRldHJhZC5jdXJyZW50TGlzdCA9IHRldHJhZExpc3Q7XG4gICAgICAgIC8vIC8vIHRydW5jYXRlIGFycmF5c1xuICAgICAgICAvLyBvcmdpbmFsTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICAvLyBzb3J0TGlzdC5sZW5ndGggPSAwO1xuXG4gICAgfSlcbiAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICAvLyBvYmoudXBkYXRlU3RhdGVFbHMuc3RvcC5jYWxsKG9iaiwgb2JqLmNvbnRleHQpO1xuICAgICAgICAgICAgb2JqLnN0b3BVcGRhdGluZ0VscygpO1xuICAgICAgICAgICAgb2JqLnNldEZldGNoaW5nRGF0YShmYWxzZSk7XG4gICAgICAgIH0sIDgwMCk7XG4gICAgfSlcbiAgICAuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRUZXRyYWREYXRhIC0gZXJyb3JcIik7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICBvYmouc2V0TWFwRXJyb3JNc2codHJ1ZSwgJ3RldHJhZC1yZXF1ZXN0Jyk7XG4gICAgICAgIH0sIDgwMCk7XG4gICAgfSlcbiAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldFRldHJhZERhdGEgLSBjb21wbGV0ZVwiKTtcbiAgICB9KTtcblxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5maWx0ZXJGb3JUZW5rU3BlY2llcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRlbmtTcGVjaWVzLmxlbmd0aCAmJiB0ZW5rU3BlY2llcy5pbmRleE9mKHRoaXMuc3BlY2llcykgPj0gMCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZGJyZWVkJykge1xuICAgICAgICAgICAgdGhpcy50ZW5rU3BlY2llcyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldERhdGFzZXQoJ2RicmVlZDEwJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmlsdGVyRm9yVGVua1NwZWNpZXM6ICcsIHRoaXMuZGF0YXNldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgXG4gICAgdGhpcy50ZW5rU3BlY2llcyA9IGZhbHNlO1xuICAgIGlmICggdHlwZW9mIG1hcFBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG1hcFBhZ2UgKSB7XG4gICAgICAgIHZhciBjdXJyZW50RGF0YVNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGV4dCkucXVlcnlTZWxlY3RvcignLnNlbGVjdC1kYXRhLXNldCcpO1xuICAgICAgICB0aGlzLnNldERhdGFzZXQoY3VycmVudERhdGFTZXQudmFsdWUpO1xuICAgIH1cblxufTtcblxuXG5NYXBNb2R1bGUucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuZmlsdGVyRm9yVGVua1NwZWNpZXMoKTtcblxuICAgIHZhciBvYmogPSB0aGlzO1xuXG4gICAgdmFyIGZvcm1EYXRhID0ge1xuICAgICAgICBcInNwZWNpZXNcIiA6IHRoaXMuc3BlY2llcyxcbiAgICAgICAgXCJkYXRhLXNldFwiIDogdGhpcy5kYXRhc2V0XG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnRVcGRhdGluZ0VscygpO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogY29uZmlnLmZvbGRlciArIGNvbmZpZy50aGVtZVVybCArICcvYWpheC9zcGVjaWVzRGF0YS5waHAnLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6ICBmb3JtRGF0YSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDEyMDAwXG4gICAgICAgIH0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBwcmV2aW91cyByZXN1bHRzIHVzaW5nIGN1cnJlbnRUZXRyYWRBcnJcbiAgICAgICAgICAgIHZhciBwcmV2UmVzdWx0cyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShvYmouY29udGV4dCArIFwiY3VycmVudFRldHJhZEFyclwiKSk7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByZXZSZXN1bHRzKSAmJiBwcmV2UmVzdWx0cy5sZW5ndGgpICB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2UmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvYmouY29udGV4dCArIHByZXZSZXN1bHRzW2ldKS5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXRBcnIgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRldEFyci5wdXNoKGRhdGFbaV1bJ1RldHJhZCddKTtcbiAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKG9iai5jb250ZXh0ICsgXCJjdXJyZW50VGV0cmFkQXJyXCIsIEpTT04uc3RyaW5naWZ5KHRldEFycikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSBhbiBpbmRpY2F0b3Igb2YgcmVzdWx0cyBiZWxvbmdpbmcgdG8gMTBLIG9yIDJLIHNwZWNpZXNcbiAgICAgICAgICAgIC8vIHZhciBzcGVjaWVzU3RhdHVzID0gb2JqLnRlbmtTcGVjaWVzID8gJzEwSycgOiAnMksnO1xuICAgICAgICAgICAgLy8gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnc3RhdHVzJywgc3BlY2llc1N0YXR1cyk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBjbGFzc2VzIHRvIG1hdGNoaW5nIHRldHJhZHNcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV0QXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iai5jb250ZXh0ICsgdGV0QXJyW2ldKS5jbGFzc0xpc3QuYWRkKCdwcmVzJywgJ2NvZGUtJyArIGRhdGFbaV1bJ0NvZGUnXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8gcmVmcmVzaCBhY3RpdmUgdGV0cmFkXG4gICAgICAgICAgICBpZiAob2JqLnRldHJhZC5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAkKCcjJyArIG9iai50ZXRyYWQuZG9tSWQpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvYmouY291bnRzID0gb2JqLmdldFN1bXMoZGF0YSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsnbWFwJywndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICAgICAgLy8gb2JqLnVwZGF0ZVN0YXRlRWxzLnN0b3AuY2FsbChvYmosIG9iai5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICBvYmouc3RvcFVwZGF0aW5nRWxzKCk7XG4gICAgICAgICAgICAgICAgb2JqLnNldEZldGNoaW5nRGF0YShmYWxzZSk7XG4gICAgICAgICAgICB9LCA4MDApO1xuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgb2JqLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0RGF0YSAtIGVycm9yXCIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsnbWFwJywndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICAgICAgb2JqLnNldE1hcEVycm9yTXNnKHRydWUsICdkYXRhLXJlcXVlc3QnKTtcbiAgICAgICAgICAgIH0sIDgwMCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgIH0pO1xuXG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLmdldFN1bXMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHN1bUNvbmZpcm1lZCA9IDAsXG4gICAgICAgIHN1bVByb2JhYmxlID0gMCxcbiAgICAgICAgc3VtUG9zc2libGUgPSAwLFxuICAgICAgICBzdW1QcmVzZW50ID0gMDtcbiAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZGJyZWVkJyB8fCB0aGlzLmRhdGFzZXQgPT09ICdzaXR0ZXJzJykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2ldWydDb2RlJ10gPT09ICdBJykge3N1bUNvbmZpcm1lZCsrO31cbiAgICAgICAgICAgIGlmIChkYXRhW2ldWydDb2RlJ10gPT09ICdCJykge3N1bVByb2JhYmxlKys7fVxuICAgICAgICAgICAgaWYgKGRhdGFbaV1bJ0NvZGUnXSA9PT0gJ0snKSB7c3VtUG9zc2libGUrKzt9XG4gICAgICAgICAgICBpZiAoZGF0YVtpXVsnQ29kZSddID09PSAnTicpIHtzdW1QcmVzZW50Kys7fVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG90YWw6IGRhdGEubGVuZ3RoICsgMSxcbiAgICAgICAgc3VtUHJlc2VudDogc3VtUHJlc2VudCxcbiAgICAgICAgc3VtUG9zc2libGU6IHN1bVBvc3NpYmxlLFxuICAgICAgICBzdW1Qcm9iYWJsZTogc3VtUHJvYmFibGUsXG4gICAgICAgIHN1bUNvbmZpcm1lZDogc3VtQ29uZmlybWVkXG4gICAgfTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuZ2V0TGF0aW5OYW1lID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAodHlwZW9mIGxhdGluTmFtZXMgIT09ICd1bmRlZmluZWQnICYmIGxhdGluTmFtZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRpbk5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGxhdGluTmFtZXNbaV0pIHtcblxuICAgICAgICAgICAgICAgIGlmKCBsYXRpbk5hbWVzW2ldLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PSB0aGlzLnNwZWNpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXRpbk5hbWVzW2ldW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG5cbi8qIERPTSAqL1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnNldE1hcEVycm9yTXNnID0gZnVuY3Rpb24oc3RhdHVzLCBjb250ZXh0KSB7XG5cbiAgICB2YXIgJGNvbnRhaW5lcjtcblxuICAgIGNvbnRleHQgPT09IFwidGV0cmFkLXJlcXVlc3RcIiA/ICRjb250YWluZXIgPSAkKCcudGV0cmFkLW1ldGEnKSA6ICRjb250YWluZXIgPSAkKCcubWFwLWNvbnRhaW5lcicpO1xuXG4gICAgdmFyICRlcnJvck1zZyA9ICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCRjb250YWluZXIpLmZpbmQoJy5lcnJvci13cmFwJyk7XG4gICAgaWYgKHN0YXR1cykge1xuICAgICAgICAkZXJyb3JNc2cuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAkZXJyb3JNc2cuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuc3RhcnRTcGlubmVyID0gZnVuY3Rpb24oZWxzKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWxzKSAmJiBlbHMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZWxzW2ldID09PSAnbWFwJykge1xuICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcubWFwLWNvbnRhaW5lcicpLmFkZENsYXNzKCdsb2FkaW5nLWRhdGEnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbHNbaV0gPT09ICd0ZXRyYWQtbWV0YScpIHtcbiAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnRldHJhZC1tZXRhICcpLmFkZENsYXNzKCdsb2FkaW5nLWRhdGEnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuc3RvcFNwaW5uZXIgPSBmdW5jdGlvbihlbHMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbHMpICYmIGVscy5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbHNbaV0gPT09ICdtYXAnKSB7XG4gICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5tYXAtY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmctZGF0YScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsc1tpXSA9PT0gJ3RldHJhZC1tZXRhJykge1xuICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcudGV0cmFkLW1ldGEgJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmctZGF0YScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zdGFydFVwZGF0aW5nRWxzID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbnRleHQ6ICcsIHRoaXMuY29udGV4dCk7XG4gICAgdmFyIHBhcmVudEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250ZXh0KTtcblxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICdzcGVjaWVzJykge1xuICAgICAgICB2YXIgc3BlY2llc1RpdGxlID0gcGFyZW50RWwucXVlcnlTZWxlY3RvcignLnNwZWNpZXMtdGl0bGVzJyk7XG4gICAgICAgIHNwZWNpZXNUaXRsZS5jbGFzc0xpc3QuYWRkKCd1cGRhdGUnKTtcbiAgICAgICAgdmFyIGNvdW50cyA9IHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHMnKTtcbiAgICAgICAgY291bnRzLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICdkYXRhc2V0Jykge1xuICAgICAgICAvLyB2YXIgZGF0YVNldFRpdGxlcyA9IHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy5kYXRhc2V0LXRpdGxlcycpO1xuICAgICAgICAvLyBkYXRhU2V0VGl0bGVzLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICAvLyBzY3JhcHBlZCBhcyBubyBsYXllcmluZyBkYXRhc2V0cyBjdXJyZW50bHlcblxuICAgICAgICB2YXIga2V5R3JvdXAgPSBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcua2V5LWdyb3VwJyk7XG4gICAgICAgIGtleUdyb3VwLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuXG4gICAgICAgIGlmICh0aGlzLnRldHJhZC5hY3RpdmUpIHtcbiAgICAgICAgICAgIHZhciB0ZXRyYWRNZXRhID0gcGFyZW50RWwucXVlcnlTZWxlY3RvcignLnRldHJhZC1tZXRhJyk7XG4gICAgICAgICAgICB0ZXRyYWRNZXRhLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gJ3RldHJhZCcpIHtcbiAgICAgICAgdmFyIHRldHJhZE1ldGEgPSBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcudGV0cmFkLW1ldGEnKTtcbiAgICAgICAgdGV0cmFkTWV0YS5jbGFzc0xpc3QuYWRkKCd1cGRhdGUnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zdG9wVXBkYXRpbmdFbHMgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICdzcGVjaWVzJykge1xuICAgICAgICB0aGlzLnVwZGF0ZUhlYWRpbmdzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3VtcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRldHJhZHNQcmVzZW50KHRoaXMuY291bnRzLnRvdGFsKTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5zdGF0ZScpLnJlbW92ZUNsYXNzKCd1cGRhdGUnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSAnZGF0YXNldCcpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEYXRhc2V0SGVhZGluZ3MoKTtcbiAgICAgICAgdGhpcy51cGRhdGVLZXlzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3VtcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRldHJhZHNQcmVzZW50KHRoaXMuY291bnRzLnRvdGFsKTtcbiAgICAgICAgaWYgKHRoaXMudGV0cmFkLmFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXJhZEJveCgpO1xuICAgICAgICAgICAgdGhpcy5zZXRHb29nbGVNYXBMaW5rKCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5zdGF0ZScpLnJlbW92ZUNsYXNzKCd1cGRhdGUnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSAndGV0cmFkJykge1xuICAgICAgICB0aGlzLnVwZGF0ZVRlcmFkQm94KCk7XG4gICAgICAgIHRoaXMuc2V0R29vZ2xlTWFwTGluaygpO1xuICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnN0YXRlJykucmVtb3ZlQ2xhc3MoJ3VwZGF0ZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICdvdmVydmlldycpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YXNldCA9PT0gJ2RicmVlZCcpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3VtcygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRhdGFzZXQgPT09ICdkYmRlbnNpdHknIHx8IHRoaXMuZGF0YXNldCA9PT0gJ2R3ZGVuc2l0eScpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV0cmFkc1ByZXNlbnQodGhpcy5jb3VudHMudG90YWwpO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGVjaWVzLW5hbWUnKS5pbm5lckhUTUwgPSB0aGlzLnNwZWNpZXM7XG4gICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuc3RhdGUnKS5yZW1vdmVDbGFzcygndXBkYXRlJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVUZXJhZEJveCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciB0aGVMaXN0ID0gJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy50ZXRyYWQtbGlzdC13cmFwcGVyJyksXG4gICAgICAgICRwYXJlbnRFbCA9ICQoJyMnICsgdGhpcy5jb250ZXh0KTtcblxuICAgICRwYXJlbnRFbC5maW5kKCcudGV0cmFkLXRpdGxlJykuaHRtbCh0aGlzLnRldHJhZC5hY3RpdmUpO1xuXG4gICAgaWYgKHRoaXMuZGF0YXNldCA9PT0gJ2RicmVlZCcgfHwgdGhpcy5kYXRhc2V0ID09PSAnc2l0dGVycycpIHtcbiAgICAgICAgJHBhcmVudEVsLmZpbmQoJy50ZXQtcHJlcycpLmh0bWwodGhpcy50ZXRyYWQuY291bnRzLnN1bVByZXNlbnQpO1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1wb3NzJykuaHRtbCh0aGlzLnRldHJhZC5jb3VudHMuc3VtUG9zc2libGUpO1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1wcm9iJykuaHRtbCh0aGlzLnRldHJhZC5jb3VudHMuc3VtUHJvYmFibGUpO1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1jb25mJykuaHRtbCh0aGlzLnRldHJhZC5jb3VudHMuc3VtQ29uZmlybWVkKTtcbiAgICAgICAgJHBhcmVudEVsLmZpbmQoJy50ZXQtc3VtcycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1zdW1zJykuaGlkZSgpO1xuICAgIH1cbiAgICAkKHRoZUxpc3QpLmVtcHR5KCk7XG5cbiAgICAkKHRoaXMudGV0cmFkLmN1cnJlbnRMaXN0KS5hcHBlbmRUbyh0aGVMaXN0KTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUudXBkYXRlU3VtcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdW1zID0gdGhpcy5jb3VudHM7XG4gICAgdmFyIHBhcmVudEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250ZXh0KTtcbiAgICBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcucHJlcy10YXJnZXQnKS5pbm5lckhUTUwgPSBzdW1zLnN1bVByZXNlbnQ7XG4gICAgcGFyZW50RWwucXVlcnlTZWxlY3RvcignLmNvbmYtdGFyZ2V0JykuaW5uZXJIVE1MID0gc3Vtcy5zdW1Db25maXJtZWQ7XG4gICAgcGFyZW50RWwucXVlcnlTZWxlY3RvcignLnByb2ItdGFyZ2V0JykuaW5uZXJIVE1MID0gc3Vtcy5zdW1Qcm9iYWJsZTtcbiAgICBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcucG9zcy10YXJnZXQnKS5pbm5lckhUTUwgPSBzdW1zLnN1bVBvc3NpYmxlO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVTcGVjaWVzU2VsZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNob3Nlbkxpc3QgPSAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnNlbGVjdC1zcGVjaWVzJyk7XG4gICAgY2hvc2VuTGlzdC52YWwodGhpcy5zcGVjaWVzKTtcbiAgICBjaG9zZW5MaXN0LnRyaWdnZXIoXCJjaG9zZW46dXBkYXRlZFwiKTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUudXBkYXRlVGV0cmFkc1ByZXNlbnQgPSBmdW5jdGlvbihsZW5ndGgpIHtcbiAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnRldF9wcmVzJykuaHRtbChsZW5ndGgpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVTZWxlY3RlZFRldHJhZCA9IGZ1bmN0aW9uKHRldHJhZElkKSB7XG4gICAgLy8gcmV2ZWFsIHRoZSBpbmZvIGJveCBpZiBoaWRkZW5cbiAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnRldHJhZC1tZXRhLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgIHZhciAkdGV0cmFkID0gJCgnIycgKyB0ZXRyYWRJZCk7XG4gICAgaWYgKHRoaXMudGV0cmFkLmFjdGl2ZSkge1xuICAgICAgICB2YXIgJHByZXZUZXRyYWQgPSAkKCcjJyArIHRoaXMudGV0cmFkLmRvbUlkKTtcbiAgICAgICAgJHByZXZUZXRyYWQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICR0ZXRyYWQuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnIycgKyB0ZXRyYWRJZCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5oaWRlQ3VycmVudGx5U2VsZWN0ZWRUZXRyYWRJbmZvID0gZnVuY3Rpb24odGV0cmFkSWQpIHtcbiAgICB2YXIgJHRldHJhZCA9ICQoJyMnICsgdGV0cmFkSWQpO1xuICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcudGV0cmFkLW1ldGEtd3JhcHBlcicpLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgJHRldHJhZC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAkKCcjJyArIHRoaXMuY29udGV4dCkucmVtb3ZlQ2xhc3MoJ3RldHJhZC1hY3RpdmUnKTtcbiAgICB0aGlzLnRldHJhZC5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnNldEZldGNoaW5nRGF0YShmYWxzZSk7XG59O1xuXG5cblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVIZWFkaW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnNwZWNpZXMtdGl0bGUnKS5odG1sKHRoaXMuc3BlY2llcyk7XG4gICAgdmFyIGxhdGluTmFtZSA9IHRoaXMuZ2V0TGF0aW5OYW1lKCk7XG4gICAgaWYgKGxhdGluTmFtZSkge1xuICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLmxhdGluLW5hbWUnKS5odG1sKGxhdGluTmFtZSk7XG4gICAgfVxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVEYXRhc2V0SGVhZGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb2JqID0gdGhpcztcbiAgICB2YXIgJGVscyA9ICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuZC1zZXQnKTtcbiAgICAkZWxzLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICAgJGVscy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICBpZiAob2JqLmRhdGFzZXQgPT09ICQoZWwpLmF0dHIoJ2RhdGEtZHNldC10aXRsZScpKSB7XG4gICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnY3VycmVudCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCQoZWwpLmhhc0NsYXNzKCdkLXNldC1icmVlZGluZycpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVLZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGtleUVscyA9ICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcua2V5LWNvbnRhaW5lcicpO1xuICAgICQoa2V5RWxzKS5yZW1vdmVDbGFzcygnYWN0aXZlIGR3ZGVuc2l0eSBkYmRlbnNpdHknKTtcbiAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZHdkZW5zaXR5JyB8fCB0aGlzLmRhdGFzZXQgPT09ICdkYmRlbnNpdHknKSB7XG4gICAgICAgICQoa2V5RWxzWzFdKS5hZGRDbGFzcygnYWN0aXZlICcgKyB0aGlzLmRhdGFzZXQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgICQoa2V5RWxzWzBdKS5hZGRDbGFzcygnYWN0aXZlJyk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnRvZ2dsZURhdGFMYXllciA9IGZ1bmN0aW9uKCRlbCkge1xuICAgICRlbC5pcyhcIjpjaGVja2VkXCIpID8gJCgnIycgKyB0aGlzLmNvbnRleHQpLnJlbW92ZUNsYXNzKCdkYXRhLW9mZicpIDogJCgnIycgKyB0aGlzLmNvbnRleHQpLmFkZENsYXNzKCdkYXRhLW9mZicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBNb2R1bGU7IiwidmFyIG92ZXJsYXkgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICBmdW5jdGlvbiBzaG93KGxheWVyLCAkY29udGV4dCkge1xuICAgICAgICAgICAgdmFyICRsYXllciA9ICQoJy4nICsgbGF5ZXIpO1xuICAgICAgICAkY29udGV4dC5maW5kKCRsYXllcikuYWRkQ2xhc3MoJ29uJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZShsYXllciwgJGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciAkbGF5ZXIgPSAkKCcuJyArIGxheWVyKTtcbiAgICAgICAgJGNvbnRleHQuZmluZCgkbGF5ZXIpLnJlbW92ZUNsYXNzKCdvbicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93OiBzaG93LFxuICAgICAgICBoaWRlOiBoaWRlXG4gICAgfTtcbn0oalF1ZXJ5KSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVybGF5OyJdfQ==
