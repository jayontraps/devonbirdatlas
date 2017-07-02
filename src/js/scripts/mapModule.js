/* requires:
modernizr-custom.js
classList.js
chosen.jquery.min.js
speciesList.js
latinNames.js
tenkSpecies.js
eventemitter2.js
*/



function MapModule(domContext) {
    this.context = domContext;
    this.tetradTotal = 1859;
    this.tetrad = {
        active: false,
        currentList: ''
    };
    this.sittersUnderlay = false;
    this.failedGetDataRequests = 0;
    this.failedGetTetradDataRequests = 0;
    this.failedsittersUnderlayRequest = 0;
};

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
        var url = '//' + window.location.hostname;
        var gMapLink = $('<a/>', {
            'href': url + '/gmap/?tetrad=' + this.tetrad.active,
            'target': '_blank',
            'class': 'gmap',
            'html': 'Generate Google Map'
        });

        gMapLink.appendTo(gMapWrap);
    }
};

MapModule.prototype.templateTetradList = function(data) {
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

    return tetradList;
};

MapModule.prototype.resetTetradInput = function() {
    $('#' + this.context).find('.tetrad-input').val('');
    $('#' + this.context).find('.tetrad-input-error').hide();
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
        // store on the MapModule object for DOM update later
        obj.tetrad.currentList = obj.templateTetradList(data);
        // reset obj.failedGetTetradDataRequests
        obj.failedGetTetradDataRequests = 0;
    })
    .done(function(data) {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['tetrad-meta']);
            // obj.updateStateEls.stop.call(obj, obj.context);
            obj.stopUpdatingEls();
            obj.setFetchingData(false);
        }, 800);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("getTetradData - error");
        console.log(jqXHR, textStatus, errorThrown);

        if (obj.failedGetTetradDataRequests < 2) {
            obj.failedGetTetradDataRequests++;
            // make a second attempt after a pause
            window.setTimeout(function(){
                obj.getTetradData();
            }, 1400);
        } else {
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['tetrad-meta']);
                obj.setMapErrorMsg(true, 'tetrad-request');
            }, 800);
        }
    });
};

MapModule.prototype.filterForTenkSpecies = function() {

    if (tenkSpecies.length && tenkSpecies.indexOf(this.species) >= 0) {
        if (this.dataset === 'dbreed') {
            this.tenkSpecies = true;
            this.setDataset('dbreed10');
        }

        return false;
    }

    // reset from dbreed10 to currently selected dataset
    /* todo */
    // this has the final say on setting dataset.. pulling from the DOM - not ideal
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
                var prevTetrad = document.getElementById(obj.context + prevResults[i]);
                if (prevTetrad) {
                    prevTetrad.className = '';
                }
            }
        }

        var tetArr = [];
        for (var i = 0; i < data.length; i++) {
            tetArr.push(data[i]['Tetrad']);
            sessionStorage.setItem(obj.context + "currentTetradArr", JSON.stringify(tetArr));
        }

        // add classes to matching tetrads
        for (var i = 0; i < tetArr.length; i++) {
            var tetrad = document.getElementById(obj.context + tetArr[i]);
            if (tetrad) {
                tetrad.classList.add('pres', 'code-' + data[i]['Code']);
            } else {
                // console.log(obj.context + tetArr[i] + ' not found!');
            }
        }

    })
    .done(function(data) {
        // refresh active tetrad
        if (obj.tetrad.active) {
            $('#' + obj.tetrad.domId).addClass('selected');
        }

        obj.counts = obj.getSums(data);

        // reset obj.failedGetDataRequests
        obj.failedGetDataRequests = 0;
    })
    .done(function() {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['map','tetrad-meta']);
            obj.stopUpdatingEls();
            obj.setFetchingData(false);
        }, 800);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("getData - error");
        console.log(jqXHR, textStatus, errorThrown);

        if (obj.failedGetDataRequests < 2) {
            obj.failedGetDataRequests++;
            // make a second attempt after a pause
            window.setTimeout(function(){
                obj.getData();
            }, 1400);
        } else {
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                obj.setMapErrorMsg(true, 'data-request');
            }, 800);
        }
    });
};

MapModule.prototype.getSums = function(data) {
    var confirmedSum = 0,
        probableSum = 0,
        possibleSum = 0,
        presentSum = 0;
    if (this.dataset !== 'dwdensity' || this.dataset !== 'dbdensity') {
        for (var i = 0; i < data.length; i++) {
            if (data[i]['Code'] === 'A') {confirmedSum++;}
            if (data[i]['Code'] === 'B') {probableSum++;}
            if (data[i]['Code'] === 'K') {possibleSum++;}
            if (data[i]['Code'] === 'N') {presentSum++;}
        }
    }
    var presentPercentage = ( presentSum / this.tetradTotal ) * 100,
        possiblePercentage = ( possibleSum / this.tetradTotal ) * 100,
        probablePercentage = ( probableSum / this.tetradTotal ) * 100,
        confimedPercentage = ( confirmedSum / this.tetradTotal ) * 100,
        totalPercentage = ( (data.length - presentSum) / this.tetradTotal ) * 100;

    return {
        total: data.length - presentSum,
        totalPercentage: totalPercentage.toFixed(),
        presentSum: presentSum,
        presentPercentage: presentPercentage.toFixed(),
        possibleSum: possibleSum,
        possiblePercentage: possiblePercentage.toFixed(),
        probableSum: probableSum,
        probablePercentage: probablePercentage.toFixed(),
        confirmedSum: confirmedSum,
        confimedPercentage: confimedPercentage.toFixed()
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
                $('#' + this.context).find('.tetrad-meta').addClass('loading-data');
            }
            if (els[i] === 'tetrad-results') {
                $('#' + this.context).find('.tetrad-results').addClass('loading-data');
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
                $('#' + this.context).find('.tetrad-meta').removeClass('loading-data');
            }
            if (els[i] === 'tetrad-results') {
                $('#' + this.context).find('.tetrad-results').removeClass('loading-data');
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
        var dataSetTitles = parentEl.querySelector('.dataset-titles');
        dataSetTitles.classList.add('update');

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
};

MapModule.prototype.stopUpdatingEls = function() {

    if (this.request === 'species') {
        this.updateHeadings();
        this.updateSums('dbreed');
        this.updateTetradsPresent(this.counts.total);
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'dataset') {
        this.updateDatasetHeadings();
        this.updateKeys();
        if (this.dataset === 'dbreed') {
            this.updateSums('dbreed');
        }
        if (this.dataset === 'sitters') {
            this.updateSums('sitters');
        }
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
            this.updateSums('dbreed');
        }
        if (this.dataset === 'dbdensity' || this.dataset === 'dwdensity') {
            this.updateTetradsPresent(this.counts.total);
        }

        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
};

MapModule.prototype.updateTeradBox = function () {

    var theList = $('#' + this.context).find('.tetrad-list-wrapper'),
        $parentEl = $('#' + this.context);

    $parentEl.find('.tetrad-title').html(this.tetrad.active);

    if (this.dataset === 'dbreed' || this.dataset === 'sitters') {
        $parentEl.find('.tet-pres').html(this.tetrad.counts.presentSum);
        $parentEl.find('.tet-poss').html(this.tetrad.counts.possibleSum);
        $parentEl.find('.tet-prob').html(this.tetrad.counts.probableSum);
        $parentEl.find('.tet-conf').html(this.tetrad.counts.confirmedSum);
        $parentEl.find('.tet-sums').show();
    } else {
        $parentEl.find('.tet-sums').hide();
    }
    $(theList).empty();

    $(this.tetrad.currentList).appendTo(theList);
};

MapModule.prototype.updateSums = function(datasetkey) {
    var sums,
        parentEl = document.getElementById(this.context),
        keyEl;

    if (datasetkey === 'sitters') {
        sums = this.counts;
        keyEl = parentEl.querySelector('[data-set-key=sitters]');
    }
    else if(datasetkey === 'sitters-underlay') {
        sums = this.countSitters;
        keyEl = parentEl.querySelector('[data-set-key=sitters-underlay]');
    }
    else {
        sums = this.counts;
        keyEl = parentEl.querySelector('[data-set-key=dbreed]');
    }
    keyEl.querySelector('.pres-target').innerHTML = sums.presentSum;
    keyEl.querySelector('.conf-target').innerHTML = sums.confirmedSum;
    keyEl.querySelector('.prob-target').innerHTML = sums.probableSum;
    keyEl.querySelector('.poss-target').innerHTML = sums.possibleSum;
    keyEl.querySelector('.sum-total-target').innerHTML = sums.total;

    keyEl.querySelector('.presentPercentage').innerHTML = ' (' + sums.presentPercentage + '%)';
    keyEl.querySelector('.confimedPercentage').innerHTML = ' (' + sums.confimedPercentage + '%)';
    keyEl.querySelector('.probablePercentage').innerHTML = ' (' + sums.probablePercentage + '%)';
    keyEl.querySelector('.possiblePercentage').innerHTML = ' (' + sums.possiblePercentage + '%)';
    keyEl.querySelector('.totalPercentage').innerHTML = ' (' + sums.totalPercentage + '%)';
};

MapModule.prototype.updateSpeciesSelect = function() {
    var chosenList = $('#' + this.context).find('.select-species');
    chosenList.val(this.species);
    chosenList.trigger("chosen:updated");
};

MapModule.prototype.updateTetradsPresent = function(length) {
    $('#' + this.context).find('.tet_pres').html(length);
};

MapModule.prototype.resetTetradsPresent = function(length) {
    $('#' + this.context).find('.tet_pres').html('');
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
        }
    });
};

MapModule.prototype.updateKeys = function() {

    var keyEls = $('#' + this.context).find('.key-container');

    $(keyEls).removeClass('active dwdensity dbdensity');

    if (this.dataset === 'dwdensity' || this.dataset === 'dbdensity') {
        $(keyEls[2]).addClass('active ' + this.dataset);
        return false;
    }
    if (this.dataset === 'sitters') {
        $(keyEls[1]).addClass('active');
        return false;
    }
    $(keyEls[0]).addClass('active');

};

MapModule.prototype.toggleDataLayer = function($el) {
    $el.is(":checked") ? $('#' + this.context).removeClass('data-off') : $('#' + this.context).addClass('data-off');
};

MapModule.prototype.resetDataLayer = function() {
    /* todo */
    // everytime species or dataset changes - move to event emitter
    $('#' + this.context).removeClass('data-off');
    $('#' + this.context).find('.data-layer-toggle').prop('checked', true);
};




/* sitters-underlay */
MapModule.prototype.setSittersUnderlay = function(status) {
    this.sittersUnderlay = status;
};

MapModule.prototype.unsetSittersUnderlay = function() {
    /* todo */
    // listen for and fire on any change in this.species or this.dataset - move to event emitter
    this.setSittersUnderlay(false);
    var $sittersLayer = $('#' + this.context).find('.sitters-underlay'),
        $sittersToggle = $('#' + this.context).find('.sitters-toggle'),
        $sittersKey =  $('#' + this.context).find('[data-set-key=sitters-underlay]');
    $sittersKey.css('visibility','hidden');
    $sittersLayer.hide(); // remove innerHTML
    $sittersToggle.prop('checked', false);
};

MapModule.prototype.toggleSittersUnderlay = function(target) {
    if (!this.species) {
        return false;
    }
    if(this.sittersUnderlay) {

        var $sittersLayer = $('#' + this.context).find('.sitters-underlay');
        var $sittersKey =  $('#' + this.context).find('[data-set-key=sitters-underlay]');

        if($(target).prop('checked')) {
            $sittersLayer.show();
            $sittersKey.css('visibility','visible');
        } else {
            $sittersLayer.hide();
            $sittersKey.css('visibility','hidden');
        }
    } else {
        this.getSittersUnderlayData();
    }
};


MapModule.prototype.getSittersUnderlayData = function(status) {

    this.startSpinner(['map']);
    var obj = this;

    var formData = {
        "species" : this.species,
        "data-set" : 'sitters'
    };

    $.ajax({
            url: config.folder + config.themeUrl + '/ajax/speciesData.php',
            type: 'POST',
            dataType: 'json',
            data:  formData,
            timeout: 12000
    })
    .done(function(data) {
        // remove previous results using currentTetradArrUnderlay
        var prevResults = JSON.parse(sessionStorage.getItem(obj.context + "currentTetradArrUnderlay"));

        if (Array.isArray(prevResults) && prevResults.length)  {
            for (var i = 0; i < prevResults.length; i++) {
                var prevTetrad = document.getElementById(obj.context + 'su_' + prevResults[i]);
                if (prevTetrad) {
                    prevTetrad.className = '';
                }
            }
        }

        var tetArr = [];
        for (var i = 0; i < data.length; i++) {
            tetArr.push(data[i]['Tetrad']);
            sessionStorage.setItem(obj.context + "currentTetradArrUnderlay", JSON.stringify(tetArr));
        }

        // add classes to matching tetrads
        for (var i = 0; i < tetArr.length; i++) {
            var tetrad = document.getElementById(obj.context + 'su_' + tetArr[i]);
            if (tetrad) {
                tetrad.classList.add('pres', 'code-' + data[i]['Code']);
            }
        }

        obj.countSitters = obj.getSums(data);

    })
     .done(function() {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['map']);
            obj.setSittersUnderlay(true);
            obj.setFetchingData(false);
            obj.updateSums('sitters-underlay');
            $('#' + obj.context).find('[data-set-key=sitters-underlay]').css('visibility', 'visible');
            $('#' + obj.context).find('.sitters-underlay').show();
        }, 800);
    })
     .done(function(){
        obj.failedsittersUnderlayRequest = 0;
        obj.logModule();
     })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("getSittersUnderlayData - error");
        console.log(jqXHR, textStatus, errorThrown);


        if (obj.failedsittersUnderlayRequest < 2) {
            obj.failedsittersUnderlayRequest++;
            // make a second attempt after a pause
            window.setTimeout(function(){
                obj.getSittersUnderlayData();
            }, 1400);
        } else {
           window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                obj.setMapErrorMsg(true, 'data-request');;
            }, 800);
        }

    });
};



