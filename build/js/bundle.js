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
    this.configs = {
        folder: '',
        themeUrl: '/wp-content/themes/devonatlas',
        mapAjaxUrl: '/wp-content/themes/devonatlas/ajax/'
    };
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
        url: this.configs.folder + this.configs.mapAjaxUrl + 'tetradData.php',
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
            url: this.configs.subdomain + this.configs.mapAjaxUrl + 'speciesData.php',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwL2VudHJ5Iiwic3JjL2pzL2FwcC9tb2R1bGVzL21hcE1vZHVsZS5qcyIsInNyYy9qcy9hcHAvbW9kdWxlcy9vdmVybGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTWFwTW9kdWxlID0gcmVxdWlyZSgnLi9tb2R1bGVzL21hcE1vZHVsZScpO1xudmFyIG92ZXJsYXkgPSByZXF1aXJlKCcuL21vZHVsZXMvb3ZlcmxheScpO1xuXG4oZnVuY3Rpb24oJCkge1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblxuICAgIC8vIG92ZXJsYXkgY29udHJvbHNcbiAgICAkKCcub3YtdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICBsYXllciA9ICR0aGlzLmF0dHIoJ25hbWUnKSxcbiAgICAgICAgICAgIGNvbnRleHQgPSAkdGhpcy5jbG9zZXN0KCcuY29udGFpbmVyJyk7XG4gICAgICAgICR0aGlzLmlzKFwiOmNoZWNrZWRcIikgPyBvdmVybGF5LnNob3cobGF5ZXIsIGNvbnRleHQpIDogb3ZlcmxheS5oaWRlKGxheWVyLCBjb250ZXh0KTtcbiAgICB9KTtcblxuICAgIC8vIHRvb2dsZSBkb3VibGUgdmlld1xuICAgIHZhciAkd3JhcHBlciA9ICQoJyN0ZXRyYWQtbWFwcycpO1xuICAgIGZ1bmN0aW9uIGRvdWJsZU9uKCRidG4pIHtcbiAgICAgICAgJHdyYXBwZXIuYWRkQ2xhc3MoJ2RvdWJsZScpO1xuICAgICAgICAkYnRuLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG91YmxlT2ZmKCRidG4pIHtcbiAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2RvdWJsZScpO1xuICAgICAgICAkYnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9XG5cblxuICAgIC8vIG1hcCBwYWdlXG4gICAgaWYgKCB0eXBlb2YgbWFwUGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbWFwUGFnZSkge1xuXG4gICAgICAgICQoJyNqcy1jb21wYXJlLXRvZ2dsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRidG4gPSAkKHRoaXMpO1xuICAgICAgICAgICAgJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykgPyBkb3VibGVPZmYoJGJ0bikgOiBkb3VibGVPbigkYnRuKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyBzZXR1cCB0aGUgbWFwTW9kdWxlc1xuICAgICAgICB2YXIgbWFwcyA9IHt9O1xuICAgICAgICBtYXBzLm0xXyA9IG5ldyBNYXBNb2R1bGUoJ20xXycpO1xuICAgICAgICBtYXBzLm0yXyA9IG5ldyBNYXBNb2R1bGUoJ20yXycpO1xuXG4gICAgICAgIC8vIHNldCBkZWZhdWx0c1xuICAgICAgICBtYXBzLm0xXy5zZXRTcGVjaWVzKCdBbHBpbmUgU3dpZnQnKTtcbiAgICAgICAgbWFwcy5tMV8uc2V0RGF0YXNldCgnZGJyZWVkJyk7XG5cbiAgICAgICAgbWFwcy5tMl8uc2V0U3BlY2llcygnQWxwaW5lIFN3aWZ0Jyk7XG4gICAgICAgIG1hcHMubTJfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuXG5cbiAgICAgICAgJCgnLmNvbnRhaW5lcicpLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1zcGVjaWVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICdzcGVjaWVzJztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRTcGVjaWVzKHRoaXMudmFsdWUudHJpbSgpKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NoYW5nZScsICcuc2VsZWN0LWRhdGEtc2V0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICdkYXRhc2V0JztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXREYXRhc2V0KHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXREYXRhKCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmdldFRldHJhZERhdGEoKTtcblxuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5sb2dNb2R1bGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gJCgnLmNvbnRhaW5lcicpLm9uKCdjbGljaycsICcudGVuayA+IGRpdicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnW2RhdGEtdGV0cmFkPVwiMktcIl0nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXAgPSBldmVudC5kZWxlZ2F0ZVRhcmdldC5pZDtcbiAgICAgICAgICAgIGlmIChtYXBzW2N1cnJlbnRNYXBdLmZldGNoaW5nRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc2V0RmV0Y2hpbmdEYXRhKHRydWUpO1xuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSAkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHRldHJhZElkID0gZXZlbnQudGFyZ2V0LmlkLFxuICAgICAgICAgICAgICAgIHRldHJhZE5hbWUgPSBldmVudC50YXJnZXQuaWQuc2xpY2UoMywgOCk7XG5cbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5oaWRlQ3VycmVudGx5U2VsZWN0ZWRUZXRyYWRJbmZvKHRldHJhZElkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnJlcXVlc3QgPSAndGV0cmFkJztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0udXBkYXRlU2VsZWN0ZWRUZXRyYWQodGV0cmFkSWQpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRUZXRyYWRTdGF0dXModGV0cmFkTmFtZSwgdGV0cmFkSWQpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5nZXRUZXRyYWREYXRhKCk7XG5cbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2snLCAnLnRldHJhZC1saXN0IGxpJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFwID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuaWQ7XG4gICAgICAgICAgICBpZiAobWFwc1tjdXJyZW50TWFwXS5mZXRjaGluZ0RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLnNldEZldGNoaW5nRGF0YSh0cnVlKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0ucmVxdWVzdCA9ICdzcGVjaWVzJztcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS5zZXRTcGVjaWVzKCQodGhpcykudGV4dCgpKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0uZ2V0RGF0YSgpO1xuICAgICAgICAgICAgbWFwc1tjdXJyZW50TWFwXS51cGRhdGVTcGVjaWVzU2VsZWN0KCk7XG4gICAgICAgICAgICBtYXBzW2N1cnJlbnRNYXBdLmxvZ01vZHVsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuY29udGFpbmVyJykub24oJ2NsaWNrJywgJy5kYXRhLWxhdGVyLXRvZ2dsZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1hcCA9IGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmlkO1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIG1hcHNbY3VycmVudE1hcF0udG9nZ2xlRGF0YUxheWVyKCR0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuICAgIGlmICggdHlwZW9mIG92UGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgb3ZQYWdlKSB7XG4gICAgICAgIC8vIHNldHVwIHRoZSBtYXBNb2R1bGVzXG4gICAgICAgIHZhciBtYXBzID0ge307XG4gICAgICAgIG1hcHMubTFfID0gbmV3IE1hcE1vZHVsZSgnbTFfJyk7XG4gICAgICAgIG1hcHMubTFfLnNldERhdGFzZXQoJ2RicmVlZCcpO1xuXG4gICAgICAgIG1hcHMubTJfID0gbmV3IE1hcE1vZHVsZSgnbTJfJyk7XG4gICAgICAgIG1hcHMubTJfLnNldERhdGFzZXQoJ2RiZGVuc2l0eScpO1xuXG4gICAgICAgIG1hcHMubTNfID0gbmV3IE1hcE1vZHVsZSgnbTNfJyk7XG4gICAgICAgIG1hcHMubTNfLnNldERhdGFzZXQoJ2R3ZGVuc2l0eScpO1xuXG4gICAgICAgICQoJy5zZWxlY3Qtc3BlY2llcycpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgbWFwcy5tMV8uc2V0U3BlY2llcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIG1hcHMubTFfLnJlcXVlc3QgPSAnb3ZlcnZpZXcnO1xuICAgICAgICAgICAgbWFwcy5tMV8uc2V0RGF0YXNldCgnZGJyZWVkJyk7XG4gICAgICAgICAgICBtYXBzLm0xXy5zdGFydFNwaW5uZXIoWydtYXAnXSk7XG4gICAgICAgICAgICBtYXBzLm0xXy5nZXREYXRhKCk7XG5cbiAgICAgICAgICAgIG1hcHMubTJfLnNldFNwZWNpZXModGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBtYXBzLm0yXy5yZXF1ZXN0ID0gJ292ZXJ2aWV3JztcbiAgICAgICAgICAgIG1hcHMubTJfLnNldERhdGFzZXQoJ2RiZGVuc2l0eScpO1xuICAgICAgICAgICAgbWFwcy5tMl8uc3RhcnRTcGlubmVyKFsnbWFwJ10pO1xuICAgICAgICAgICAgbWFwcy5tMl8uZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgICBtYXBzLm0zXy5zZXRTcGVjaWVzKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgbWFwcy5tM18ucmVxdWVzdCA9ICdvdmVydmlldyc7XG4gICAgICAgICAgICBtYXBzLm0zXy5zZXREYXRhc2V0KCdkd2RlbnNpdHknKTtcbiAgICAgICAgICAgIG1hcHMubTNfLnN0YXJ0U3Bpbm5lcihbJ21hcCddKTtcbiAgICAgICAgICAgIG1hcHMubTNfLmdldERhdGEoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KTtcbn0pKGpRdWVyeSk7XG4iLCJmdW5jdGlvbiBNYXBNb2R1bGUoZG9tQ29udGV4dCkge1xuICAgIHRoaXMuY29uZmlncyA9IHtcbiAgICAgICAgZm9sZGVyOiAnJyxcbiAgICAgICAgdGhlbWVVcmw6ICcvd3AtY29udGVudC90aGVtZXMvZGV2b25hdGxhcycsXG4gICAgICAgIG1hcEFqYXhVcmw6ICcvd3AtY29udGVudC90aGVtZXMvZGV2b25hdGxhcy9hamF4LydcbiAgICB9O1xuICAgIHRoaXMuY29udGV4dCA9IGRvbUNvbnRleHQ7XG4gICAgdGhpcy50ZXRyYWQgPSB7XG4gICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgIGN1cnJlbnRMaXN0OiAnJ1xuICAgIH07XG59XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuc2V0RGF0YXNldCA9IGZ1bmN0aW9uKGRhdGFzZXQpIHtcbiAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGV4dCkuc2V0QXR0cmlidXRlKCdkYXRhLXNldCcsIGRhdGFzZXQpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zZXRTcGVjaWVzID0gZnVuY3Rpb24oc3BlY2llcykge1xuICAgIHRoaXMuc3BlY2llcyA9IHNwZWNpZXM7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnNldEZldGNoaW5nRGF0YSA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgIHRoaXMuZmV0Y2hpbmdEYXRhID0gc3RhdHVzO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zZXRUZXRyYWRTdGF0dXMgPSBmdW5jdGlvbih0ZXRyYWRJZCwgaWQpIHtcbiAgICB0aGlzLnRldHJhZCA9IHtcbiAgICAgICAgYWN0aXZlIDogdGV0cmFkSWQsXG4gICAgICAgIGRvbUlkIDogaWRcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250ZXh0KS5jbGFzc0xpc3QuYWRkKCd0ZXRyYWQtYWN0aXZlJyk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLmxvZ01vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zZXRHb29nbGVNYXBMaW5rID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgZ01hcFdyYXAgPSAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLmdtYXAtbGluaycpO1xuICAgIGdNYXBXcmFwLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy50ZXRyYWQuYWN0aXZlKSB7XG4gICAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgdmFyIGdNYXBMaW5rID0gJCgnPGEvPicsIHtcbiAgICAgICAgICAgICdocmVmJzogdXJsICsgJ2dtYXAvP3RldHJhZD0nICsgdGhpcy50ZXRyYWQuYWN0aXZlICsgJycsXG4gICAgICAgICAgICAndGFyZ2V0JzogJ19ibGFuaycsXG4gICAgICAgICAgICAnY2xhc3MnOiAnZ21hcCcsXG4gICAgICAgICAgICAnaHRtbCc6ICdHZW5lcmF0ZSBHb29nbGUgTWFwJ1xuICAgICAgICB9KTtcblxuICAgICAgICBnTWFwTGluay5hcHBlbmRUbyhnTWFwV3JhcCk7XG4gICAgfVxufTtcblxuLyogR0VUVElORyBEQVRBICovXG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuZ2V0VGV0cmFkRGF0YSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKCF0aGlzLnRldHJhZC5hY3RpdmUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB0aGlzLnN0YXJ0U3Bpbm5lcihbJ3RldHJhZC1tZXRhJ10pO1xuXG4gICAgdGhpcy50ZXRyYWQuY3VycmVudExpc3QgPSBcIlwiO1xuXG4gICAgdmFyIG9iaiA9IHRoaXM7XG5cbiAgICB0aGlzLnN0YXJ0VXBkYXRpbmdFbHMoKTtcblxuICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgXCJ0ZXRyYWRJZFwiIDogdGhpcy50ZXRyYWQuYWN0aXZlLFxuICAgICAgICBcImRhdGEtc2V0XCIgOiB0aGlzLmRhdGFzZXRcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLmNvbmZpZ3MuZm9sZGVyICsgdGhpcy5jb25maWdzLm1hcEFqYXhVcmwgKyAndGV0cmFkRGF0YS5waHAnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHBvc3REYXRhLFxuICAgICAgICB0aW1lb3V0OiAxMjAwMFxuICAgIH0pXG4gICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIG9iai50ZXRyYWQuY291bnRzID0gb2JqLmdldFN1bXMoZGF0YSk7XG5cbiAgICAgICAgdmFyIHRldHJhZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xuICAgICAgICB0ZXRyYWRMaXN0LmNsYXNzTGlzdC5hZGQoJ3RldHJhZC1saXN0Jyk7XG5cbiAgICAgICAgLy8gbG9va3VwIHRoZSBpbmRleCwgcmV0cmVpdmUgdGhlIENvZGUgdmFsdWUgYW5kIHRlbXBsYXRlIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgdmFyIHRoZUNvZGUsIGVsLCBzcGFuRWw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhlQ29kZSA9IGRhdGFbaV0uQ29kZTtcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IGRhdGFbaV0uU3BlY2llcy50cmltKCk7XG4gICAgICAgICAgICBzcGFuRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBzcGFuRWwuY2xhc3NMaXN0LmFkZCgnY29kZS0nICsgdGhlQ29kZSk7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChzcGFuRWwpO1xuICAgICAgICAgICAgdGV0cmFkTGlzdC5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBvYmoudGV0cmFkLmN1cnJlbnRMaXN0ID0gdGV0cmFkTGlzdDtcblxuICAgICAgICAvLyAgQSBwcm9jZWR1cmUgZm9yIHNvdGluZyB0aGUgbGlzdCBhbHBoYWJldGljYWxseVxuICAgICAgICAvLyAvLyBnZXQgdGhlIGxpc3Qgb2YgbmFtZXNcbiAgICAgICAgLy8gdmFyIG9yZ2luYWxMaXN0ID0gW107XG5cbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBvcmdpbmFsTGlzdC5wdXNoKGRhdGFbaV1bJ1NwZWNpZXMnXSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8gc29ydCB0aGUgbGlzdCB0byBuZXcgYXJyXG4gICAgICAgIC8vIHZhciBzb3J0TGlzdCA9IFtdO1xuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIHNvcnRMaXN0LnB1c2goZGF0YVtpXVsnU3BlY2llcyddKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBzb3J0TGlzdC5zb3J0KCk7XG5cbiAgICAgICAgLy8gdmFyIHRldHJhZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvbCcpO1xuICAgICAgICAvLyB0ZXRyYWRMaXN0LmNsYXNzTGlzdC5hZGQoJ3RldHJhZC1saXN0Jyk7XG5cbiAgICAgICAgLy8gLy8gbG9va3VwIHRoZSBpbmRleCwgcmV0cmVpdmUgdGhlIENvZGUgdmFsdWUgYW5kIHRlbXBsYXRlIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgLy8gdmFyIHRoZUNvZGUsIGVsLCBzcGFuRWw7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgc29ydExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIHRoZUNvZGUgPSBkYXRhW29yZ2luYWxMaXN0LmluZGV4T2Yoc29ydExpc3RbaV0pXVsnQ29kZSddO1xuICAgICAgICAvLyAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAvLyAgICAgZWwuaW5uZXJIVE1MID0gc29ydExpc3RbaV0udHJpbSgpO1xuICAgICAgICAvLyAgICAgc3BhbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAvLyAgICAgc3BhbkVsLmNsYXNzTGlzdC5hZGQoJ2NvZGUtJyArIHRoZUNvZGUpO1xuICAgICAgICAvLyAgICAgZWwuYXBwZW5kQ2hpbGQoc3BhbkVsKTtcbiAgICAgICAgLy8gICAgIHRldHJhZExpc3QuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gb2JqLnRldHJhZC5jdXJyZW50TGlzdCA9IHRldHJhZExpc3Q7XG4gICAgICAgIC8vIC8vIHRydW5jYXRlIGFycmF5c1xuICAgICAgICAvLyBvcmdpbmFsTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICAvLyBzb3J0TGlzdC5sZW5ndGggPSAwO1xuXG4gICAgfSlcbiAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICAvLyBvYmoudXBkYXRlU3RhdGVFbHMuc3RvcC5jYWxsKG9iaiwgb2JqLmNvbnRleHQpO1xuICAgICAgICAgICAgb2JqLnN0b3BVcGRhdGluZ0VscygpO1xuICAgICAgICAgICAgb2JqLnNldEZldGNoaW5nRGF0YShmYWxzZSk7XG4gICAgICAgIH0sIDgwMCk7XG4gICAgfSlcbiAgICAuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRUZXRyYWREYXRhIC0gZXJyb3JcIik7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvYmouc3RvcFNwaW5uZXIuY2FsbChvYmosIFsndGV0cmFkLW1ldGEnXSk7XG4gICAgICAgICAgICBvYmouc2V0TWFwRXJyb3JNc2codHJ1ZSwgJ3RldHJhZC1yZXF1ZXN0Jyk7XG4gICAgICAgIH0sIDgwMCk7XG4gICAgfSlcbiAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldFRldHJhZERhdGEgLSBjb21wbGV0ZVwiKTtcbiAgICB9KTtcblxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5maWx0ZXJGb3JUZW5rU3BlY2llcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRlbmtTcGVjaWVzLmxlbmd0aCAmJiB0ZW5rU3BlY2llcy5pbmRleE9mKHRoaXMuc3BlY2llcykgPj0gMCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZGJyZWVkJykge1xuICAgICAgICAgICAgdGhpcy50ZW5rU3BlY2llcyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldERhdGFzZXQoJ2RicmVlZDEwJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmlsdGVyRm9yVGVua1NwZWNpZXM6ICcsIHRoaXMuZGF0YXNldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgXG4gICAgdGhpcy50ZW5rU3BlY2llcyA9IGZhbHNlO1xuICAgIGlmICggdHlwZW9mIG1hcFBhZ2UgIT09ICd1bmRlZmluZWQnICYmIG1hcFBhZ2UgKSB7XG4gICAgICAgIHZhciBjdXJyZW50RGF0YVNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGV4dCkucXVlcnlTZWxlY3RvcignLnNlbGVjdC1kYXRhLXNldCcpO1xuICAgICAgICB0aGlzLnNldERhdGFzZXQoY3VycmVudERhdGFTZXQudmFsdWUpO1xuICAgIH1cblxufTtcblxuXG5NYXBNb2R1bGUucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuZmlsdGVyRm9yVGVua1NwZWNpZXMoKTtcblxuICAgIHZhciBvYmogPSB0aGlzO1xuXG4gICAgdmFyIGZvcm1EYXRhID0ge1xuICAgICAgICBcInNwZWNpZXNcIiA6IHRoaXMuc3BlY2llcyxcbiAgICAgICAgXCJkYXRhLXNldFwiIDogdGhpcy5kYXRhc2V0XG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnRVcGRhdGluZ0VscygpO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpcy5jb25maWdzLnN1YmRvbWFpbiArIHRoaXMuY29uZmlncy5tYXBBamF4VXJsICsgJ3NwZWNpZXNEYXRhLnBocCcsXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YTogIGZvcm1EYXRhLFxuICAgICAgICAgICAgdGltZW91dDogMTIwMDBcbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzIHJlc3VsdHMgdXNpbmcgY3VycmVudFRldHJhZEFyclxuICAgICAgICAgICAgdmFyIHByZXZSZXN1bHRzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKG9iai5jb250ZXh0ICsgXCJjdXJyZW50VGV0cmFkQXJyXCIpKTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldlJlc3VsdHMpICYmIHByZXZSZXN1bHRzLmxlbmd0aCkgIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXZSZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iai5jb250ZXh0ICsgcHJldlJlc3VsdHNbaV0pLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRldEFyciA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGV0QXJyLnB1c2goZGF0YVtpXVsnVGV0cmFkJ10pO1xuICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0ob2JqLmNvbnRleHQgKyBcImN1cnJlbnRUZXRyYWRBcnJcIiwgSlNPTi5zdHJpbmdpZnkodGV0QXJyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIGFuIGluZGljYXRvciBvZiByZXN1bHRzIGJlbG9uZ2luZyB0byAxMEsgb3IgMksgc3BlY2llc1xuICAgICAgICAgICAgLy8gdmFyIHNwZWNpZXNTdGF0dXMgPSBvYmoudGVua1NwZWNpZXMgPyAnMTBLJyA6ICcySyc7XG4gICAgICAgICAgICAvLyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdzdGF0dXMnLCBzcGVjaWVzU3RhdHVzKTtcblxuICAgICAgICAgICAgLy8gYWRkIGNsYXNzZXMgdG8gbWF0Y2hpbmcgdGV0cmFkc1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXRBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2JqLmNvbnRleHQgKyB0ZXRBcnJbaV0pLmNsYXNzTGlzdC5hZGQoJ3ByZXMnLCAnY29kZS0nICsgZGF0YVtpXVsnQ29kZSddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyByZWZyZXNoIGFjdGl2ZSB0ZXRyYWRcbiAgICAgICAgICAgIGlmIChvYmoudGV0cmFkLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICQoJyMnICsgb2JqLnRldHJhZC5kb21JZCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9iai5jb3VudHMgPSBvYmouZ2V0U3VtcyhkYXRhKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG9iai5zdG9wU3Bpbm5lci5jYWxsKG9iaiwgWydtYXAnLCd0ZXRyYWQtbWV0YSddKTtcbiAgICAgICAgICAgICAgICAvLyBvYmoudXBkYXRlU3RhdGVFbHMuc3RvcC5jYWxsKG9iaiwgb2JqLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIG9iai5zdG9wVXBkYXRpbmdFbHMoKTtcbiAgICAgICAgICAgICAgICBvYmouc2V0RmV0Y2hpbmdEYXRhKGZhbHNlKTtcbiAgICAgICAgICAgIH0sIDgwMCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvYmoubG9nTW9kdWxlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXREYXRhIC0gZXJyb3JcIik7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG9iai5zdG9wU3Bpbm5lci5jYWxsKG9iaiwgWydtYXAnLCd0ZXRyYWQtbWV0YSddKTtcbiAgICAgICAgICAgICAgICBvYmouc2V0TWFwRXJyb3JNc2codHJ1ZSwgJ2RhdGEtcmVxdWVzdCcpO1xuICAgICAgICAgICAgfSwgODAwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgfSk7XG5cbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuZ2V0U3VtcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgc3VtQ29uZmlybWVkID0gMCxcbiAgICAgICAgc3VtUHJvYmFibGUgPSAwLFxuICAgICAgICBzdW1Qb3NzaWJsZSA9IDAsXG4gICAgICAgIHN1bVByZXNlbnQgPSAwO1xuICAgIGlmICh0aGlzLmRhdGFzZXQgPT09ICdkYnJlZWQnIHx8IHRoaXMuZGF0YXNldCA9PT0gJ3NpdHRlcnMnKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV1bJ0NvZGUnXSA9PT0gJ0EnKSB7c3VtQ29uZmlybWVkKys7fVxuICAgICAgICAgICAgaWYgKGRhdGFbaV1bJ0NvZGUnXSA9PT0gJ0InKSB7c3VtUHJvYmFibGUrKzt9XG4gICAgICAgICAgICBpZiAoZGF0YVtpXVsnQ29kZSddID09PSAnSycpIHtzdW1Qb3NzaWJsZSsrO31cbiAgICAgICAgICAgIGlmIChkYXRhW2ldWydDb2RlJ10gPT09ICdOJykge3N1bVByZXNlbnQrKzt9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0b3RhbDogZGF0YS5sZW5ndGggKyAxLFxuICAgICAgICBzdW1QcmVzZW50OiBzdW1QcmVzZW50LFxuICAgICAgICBzdW1Qb3NzaWJsZTogc3VtUG9zc2libGUsXG4gICAgICAgIHN1bVByb2JhYmxlOiBzdW1Qcm9iYWJsZSxcbiAgICAgICAgc3VtQ29uZmlybWVkOiBzdW1Db25maXJtZWRcbiAgICB9O1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5nZXRMYXRpbk5hbWUgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0eXBlb2YgbGF0aW5OYW1lcyAhPT0gJ3VuZGVmaW5lZCcgJiYgbGF0aW5OYW1lcy5sZW5ndGgpIHtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluTmFtZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gbGF0aW5OYW1lc1tpXSkge1xuXG4gICAgICAgICAgICAgICAgaWYoIGxhdGluTmFtZXNbaV0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09IHRoaXMuc3BlY2llcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhdGluTmFtZXNbaV1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuLyogRE9NICovXG5cbk1hcE1vZHVsZS5wcm90b3R5cGUuc2V0TWFwRXJyb3JNc2cgPSBmdW5jdGlvbihzdGF0dXMsIGNvbnRleHQpIHtcblxuICAgIHZhciAkY29udGFpbmVyO1xuXG4gICAgY29udGV4dCA9PT0gXCJ0ZXRyYWQtcmVxdWVzdFwiID8gJGNvbnRhaW5lciA9ICQoJy50ZXRyYWQtbWV0YScpIDogJGNvbnRhaW5lciA9ICQoJy5tYXAtY29udGFpbmVyJyk7XG5cbiAgICB2YXIgJGVycm9yTXNnID0gJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJGNvbnRhaW5lcikuZmluZCgnLmVycm9yLXdyYXAnKTtcbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICRlcnJvck1zZy5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgICRlcnJvck1zZy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zdGFydFNwaW5uZXIgPSBmdW5jdGlvbihlbHMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbHMpICYmIGVscy5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbHNbaV0gPT09ICdtYXAnKSB7XG4gICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5tYXAtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2xvYWRpbmctZGF0YScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsc1tpXSA9PT0gJ3RldHJhZC1tZXRhJykge1xuICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcudGV0cmFkLW1ldGEgJykuYWRkQ2xhc3MoJ2xvYWRpbmctZGF0YScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS5zdG9wU3Bpbm5lciA9IGZ1bmN0aW9uKGVscykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGVscykgJiYgZWxzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGVsc1tpXSA9PT0gJ21hcCcpIHtcbiAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLm1hcC1jb250YWluZXInKS5yZW1vdmVDbGFzcygnbG9hZGluZy1kYXRhJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZWxzW2ldID09PSAndGV0cmFkLW1ldGEnKSB7XG4gICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy50ZXRyYWQtbWV0YSAnKS5yZW1vdmVDbGFzcygnbG9hZGluZy1kYXRhJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnN0YXJ0VXBkYXRpbmdFbHMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnY29udGV4dDogJywgdGhpcy5jb250ZXh0KTtcbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRleHQpO1xuXG4gICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gJ3NwZWNpZXMnKSB7XG4gICAgICAgIHZhciBzcGVjaWVzVGl0bGUgPSBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcuc3BlY2llcy10aXRsZXMnKTtcbiAgICAgICAgc3BlY2llc1RpdGxlLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICB2YXIgY291bnRzID0gcGFyZW50RWwucXVlcnlTZWxlY3RvcignLmNvdW50cycpO1xuICAgICAgICBjb3VudHMuY2xhc3NMaXN0LmFkZCgndXBkYXRlJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gJ2RhdGFzZXQnKSB7XG4gICAgICAgIC8vIHZhciBkYXRhU2V0VGl0bGVzID0gcGFyZW50RWwucXVlcnlTZWxlY3RvcignLmRhdGFzZXQtdGl0bGVzJyk7XG4gICAgICAgIC8vIGRhdGFTZXRUaXRsZXMuY2xhc3NMaXN0LmFkZCgndXBkYXRlJyk7XG4gICAgICAgIC8vIHNjcmFwcGVkIGFzIG5vIGxheWVyaW5nIGRhdGFzZXRzIGN1cnJlbnRseVxuXG4gICAgICAgIHZhciBrZXlHcm91cCA9IHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy5rZXktZ3JvdXAnKTtcbiAgICAgICAga2V5R3JvdXAuY2xhc3NMaXN0LmFkZCgndXBkYXRlJyk7XG5cbiAgICAgICAgaWYgKHRoaXMudGV0cmFkLmFjdGl2ZSkge1xuICAgICAgICAgICAgdmFyIHRldHJhZE1ldGEgPSBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcudGV0cmFkLW1ldGEnKTtcbiAgICAgICAgICAgIHRldHJhZE1ldGEuY2xhc3NMaXN0LmFkZCgndXBkYXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSAndGV0cmFkJykge1xuICAgICAgICB2YXIgdGV0cmFkTWV0YSA9IHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy50ZXRyYWQtbWV0YScpO1xuICAgICAgICB0ZXRyYWRNZXRhLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5NYXBNb2R1bGUucHJvdG90eXBlLnN0b3BVcGRhdGluZ0VscyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gJ3NwZWNpZXMnKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSGVhZGluZ3MoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdW1zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGV0cmFkc1ByZXNlbnQodGhpcy5jb3VudHMudG90YWwpO1xuICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnN0YXRlJykucmVtb3ZlQ2xhc3MoJ3VwZGF0ZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICdkYXRhc2V0Jykge1xuICAgICAgICB0aGlzLnVwZGF0ZURhdGFzZXRIZWFkaW5ncygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUtleXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdW1zKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGV0cmFkc1ByZXNlbnQodGhpcy5jb3VudHMudG90YWwpO1xuICAgICAgICBpZiAodGhpcy50ZXRyYWQuYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRlcmFkQm94KCk7XG4gICAgICAgICAgICB0aGlzLnNldEdvb2dsZU1hcExpbmsoKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnN0YXRlJykucmVtb3ZlQ2xhc3MoJ3VwZGF0ZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlcXVlc3QgPT09ICd0ZXRyYWQnKSB7XG4gICAgICAgIHRoaXMudXBkYXRlVGVyYWRCb3goKTtcbiAgICAgICAgdGhpcy5zZXRHb29nbGVNYXBMaW5rKCk7XG4gICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuc3RhdGUnKS5yZW1vdmVDbGFzcygndXBkYXRlJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gJ292ZXJ2aWV3Jykge1xuICAgICAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZGJyZWVkJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdW1zKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0YXNldCA9PT0gJ2RiZGVuc2l0eScgfHwgdGhpcy5kYXRhc2V0ID09PSAnZHdkZW5zaXR5Jykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXRyYWRzUHJlc2VudCh0aGlzLmNvdW50cy50b3RhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWNpZXMtbmFtZScpLmlubmVySFRNTCA9IHRoaXMuc3BlY2llcztcbiAgICAgICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5zdGF0ZScpLnJlbW92ZUNsYXNzKCd1cGRhdGUnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZVRlcmFkQm94ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHRoZUxpc3QgPSAkKCcjJyArIHRoaXMuY29udGV4dCkuZmluZCgnLnRldHJhZC1saXN0LXdyYXBwZXInKSxcbiAgICAgICAgJHBhcmVudEVsID0gJCgnIycgKyB0aGlzLmNvbnRleHQpO1xuXG4gICAgJHBhcmVudEVsLmZpbmQoJy50ZXRyYWQtdGl0bGUnKS5odG1sKHRoaXMudGV0cmFkLmFjdGl2ZSk7XG5cbiAgICBpZiAodGhpcy5kYXRhc2V0ID09PSAnZGJyZWVkJyB8fCB0aGlzLmRhdGFzZXQgPT09ICdzaXR0ZXJzJykge1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1wcmVzJykuaHRtbCh0aGlzLnRldHJhZC5jb3VudHMuc3VtUHJlc2VudCk7XG4gICAgICAgICRwYXJlbnRFbC5maW5kKCcudGV0LXBvc3MnKS5odG1sKHRoaXMudGV0cmFkLmNvdW50cy5zdW1Qb3NzaWJsZSk7XG4gICAgICAgICRwYXJlbnRFbC5maW5kKCcudGV0LXByb2InKS5odG1sKHRoaXMudGV0cmFkLmNvdW50cy5zdW1Qcm9iYWJsZSk7XG4gICAgICAgICRwYXJlbnRFbC5maW5kKCcudGV0LWNvbmYnKS5odG1sKHRoaXMudGV0cmFkLmNvdW50cy5zdW1Db25maXJtZWQpO1xuICAgICAgICAkcGFyZW50RWwuZmluZCgnLnRldC1zdW1zJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRwYXJlbnRFbC5maW5kKCcudGV0LXN1bXMnKS5oaWRlKCk7XG4gICAgfVxuICAgICQodGhlTGlzdCkuZW1wdHkoKTtcblxuICAgICQodGhpcy50ZXRyYWQuY3VycmVudExpc3QpLmFwcGVuZFRvKHRoZUxpc3QpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVTdW1zID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN1bXMgPSB0aGlzLmNvdW50cztcbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRleHQpO1xuICAgIHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy5wcmVzLXRhcmdldCcpLmlubmVySFRNTCA9IHN1bXMuc3VtUHJlc2VudDtcbiAgICBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcuY29uZi10YXJnZXQnKS5pbm5lckhUTUwgPSBzdW1zLnN1bUNvbmZpcm1lZDtcbiAgICBwYXJlbnRFbC5xdWVyeVNlbGVjdG9yKCcucHJvYi10YXJnZXQnKS5pbm5lckhUTUwgPSBzdW1zLnN1bVByb2JhYmxlO1xuICAgIHBhcmVudEVsLnF1ZXJ5U2VsZWN0b3IoJy5wb3NzLXRhcmdldCcpLmlubmVySFRNTCA9IHN1bXMuc3VtUG9zc2libGU7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZVNwZWNpZXNTZWxlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hvc2VuTGlzdCA9ICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuc2VsZWN0LXNwZWNpZXMnKTtcbiAgICBjaG9zZW5MaXN0LnZhbCh0aGlzLnNwZWNpZXMpO1xuICAgIGNob3Nlbkxpc3QudHJpZ2dlcihcImNob3Nlbjp1cGRhdGVkXCIpO1xufTtcblxuTWFwTW9kdWxlLnByb3RvdHlwZS51cGRhdGVUZXRyYWRzUHJlc2VudCA9IGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcudGV0X3ByZXMnKS5odG1sKGxlbmd0aCk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkVGV0cmFkID0gZnVuY3Rpb24odGV0cmFkSWQpIHtcbiAgICAvLyByZXZlYWwgdGhlIGluZm8gYm94IGlmIGhpZGRlblxuICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcudGV0cmFkLW1ldGEtd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgdmFyICR0ZXRyYWQgPSAkKCcjJyArIHRldHJhZElkKTtcbiAgICBpZiAodGhpcy50ZXRyYWQuYWN0aXZlKSB7XG4gICAgICAgIHZhciAkcHJldlRldHJhZCA9ICQoJyMnICsgdGhpcy50ZXRyYWQuZG9tSWQpO1xuICAgICAgICAkcHJldlRldHJhZC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgJHRldHJhZC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjJyArIHRldHJhZElkKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLmhpZGVDdXJyZW50bHlTZWxlY3RlZFRldHJhZEluZm8gPSBmdW5jdGlvbih0ZXRyYWRJZCkge1xuICAgIHZhciAkdGV0cmFkID0gJCgnIycgKyB0ZXRyYWRJZCk7XG4gICAgJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy50ZXRyYWQtbWV0YS13cmFwcGVyJykuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAkdGV0cmFkLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5yZW1vdmVDbGFzcygndGV0cmFkLWFjdGl2ZScpO1xuICAgIHRoaXMudGV0cmFkLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuc2V0RmV0Y2hpbmdEYXRhKGZhbHNlKTtcbn07XG5cblxuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZUhlYWRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcuc3BlY2llcy10aXRsZScpLmh0bWwodGhpcy5zcGVjaWVzKTtcbiAgICB2YXIgbGF0aW5OYW1lID0gdGhpcy5nZXRMYXRpbk5hbWUoKTtcbiAgICBpZiAobGF0aW5OYW1lKSB7XG4gICAgICAgICQoJyMnICsgdGhpcy5jb250ZXh0KS5maW5kKCcubGF0aW4tbmFtZScpLmh0bWwobGF0aW5OYW1lKTtcbiAgICB9XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZURhdGFzZXRIZWFkaW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvYmogPSB0aGlzO1xuICAgIHZhciAkZWxzID0gJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5kLXNldCcpO1xuICAgICRlbHMucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICAkZWxzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIGlmIChvYmouZGF0YXNldCA9PT0gJChlbCkuYXR0cignZGF0YS1kc2V0LXRpdGxlJykpIHtcbiAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYoJChlbCkuaGFzQ2xhc3MoJ2Qtc2V0LWJyZWVkaW5nJykpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG59O1xuXG5NYXBNb2R1bGUucHJvdG90eXBlLnVwZGF0ZUtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIga2V5RWxzID0gJCgnIycgKyB0aGlzLmNvbnRleHQpLmZpbmQoJy5rZXktY29udGFpbmVyJyk7XG4gICAgJChrZXlFbHMpLnJlbW92ZUNsYXNzKCdhY3RpdmUgZHdkZW5zaXR5IGRiZGVuc2l0eScpO1xuICAgIGlmICh0aGlzLmRhdGFzZXQgPT09ICdkd2RlbnNpdHknIHx8IHRoaXMuZGF0YXNldCA9PT0gJ2RiZGVuc2l0eScpIHtcbiAgICAgICAgJChrZXlFbHNbMV0pLmFkZENsYXNzKCdhY3RpdmUgJyArIHRoaXMuZGF0YXNldCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgJChrZXlFbHNbMF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcbn07XG5cbk1hcE1vZHVsZS5wcm90b3R5cGUudG9nZ2xlRGF0YUxheWVyID0gZnVuY3Rpb24oJGVsKSB7XG4gICAgJGVsLmlzKFwiOmNoZWNrZWRcIikgPyAkKCcjJyArIHRoaXMuY29udGV4dCkucmVtb3ZlQ2xhc3MoJ2RhdGEtb2ZmJykgOiAkKCcjJyArIHRoaXMuY29udGV4dCkuYWRkQ2xhc3MoJ2RhdGEtb2ZmJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcE1vZHVsZTsiLCJ2YXIgb3ZlcmxheSA9IChmdW5jdGlvbiAoJCkge1xuICAgIGZ1bmN0aW9uIHNob3cobGF5ZXIsICRjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgJGxheWVyID0gJCgnLicgKyBsYXllcik7XG4gICAgICAgICRjb250ZXh0LmZpbmQoJGxheWVyKS5hZGRDbGFzcygnb24nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlKGxheWVyLCAkY29udGV4dCkge1xuICAgICAgICAgICAgdmFyICRsYXllciA9ICQoJy4nICsgbGF5ZXIpO1xuICAgICAgICAkY29udGV4dC5maW5kKCRsYXllcikucmVtb3ZlQ2xhc3MoJ29uJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHNob3c6IHNob3csXG4gICAgICAgIGhpZGU6IGhpZGVcbiAgICB9O1xufShqUXVlcnkpKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJsYXk7Il19
