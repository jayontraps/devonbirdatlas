/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
tenkSpecies.js
*/



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

MapModule.prototype.setOverviewMapState = function(state) {
    var parentEl = document.getElementById(this.context);

    if (state === 'idle') {
        parentEl.querySelector('.map-state-wrap').classList.remove('off');
        $('#' + this.context).addClass('data-off');
    }
    if (state === 'active') {
        $('#' + this.context).removeClass('data-off');
        this.startSpinner(['map']);
        parentEl.querySelector('.map-state-wrap').classList.add('off');
        this.getData();
    }
};


MapModule.prototype.getSpeciesAccount = function() {
    var obj = this;

    $.ajax({
        url: config.folder + '/wp-json/wp/v2/species?filter[name]=' + this.species,
        type: 'GET',
        dataType: 'json'
    })
    .done(function(data) {
        window.setTimeout(function(){
            var latinName = obj.getLatinName();
            obj.templateSpeciesAccount.call(obj, data, latinName);
        }, 800);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

};


MapModule.prototype.templateSpeciesAccount = function(data, latinName) {

    if (latinName) {
        $('.latin-name').html(latinName);
    } else {
        $('.latin-name').html('');
    }
    document.querySelector('.account-text').innerHTML = data[0].content.rendered;
    document.getElementById('species-name').innerHTML = this.species;
    $('.state').removeClass('update');
};

















