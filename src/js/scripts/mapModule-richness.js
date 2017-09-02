/* requires:
mapModule.js
eventemitter2.js
*/
MapModule.prototype.setBreedingRange = function(breedingRange) {
    this.breedingRange = breedingRange;
};

MapModule.prototype.setConservationStatus = function(conservationStatus) {
    this.conservationStatus = conservationStatus;
}

MapModule.prototype.getRichnessData = function() {

    var obj = this;
    var url;
    if (this.conservationStatus === 'red' || this.conservationStatus === 'amber') {
        url = config.folder + config.themeUrl + '/ajax/richness/richnessDataPrepared.php';;
    } else {
        url = config.folder + config.themeUrl + '/ajax/richness/richnessData.php';
    }

    var postData = {
            'dataset' : this.dataset,
            'status' : this.conservationStatus,
            'range' : this.breedingRange
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data:  postData,
        timeout: 12000
    })
    .done(function(data) {
        // get the data for richnessDataPrepared:
        // console.log(JSON.stringify(data));
        obj.templateRichnessData(data);
    })
    .done(function() {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['map']);
            obj.setFetchingData(false);
        }, 800);
    })
    .done(function(data) {
        // refresh active tetrad
        if (obj.tetrad.active) {
            $('#' + obj.tetrad.domId).addClass('selected');
        }
    })
    .fail(function() {
        console.log("getRichnessData - error");
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['map']);
            obj.setMapErrorMsg(true, 'data-request', obj.errorMsg.general);
        }, 800);
    })
    .always(function() {
        console.log("complete");
    });

};


MapModule.prototype.getRichnessTetradData = function() {

    if (!this.tetrad.active) { return false; }

    this.startSpinner(['tetrad-results']);

    var titleEl = document.getElementById('js-richness-tetrad');
    titleEl.innerHTML = this.tetrad.active;

    if (!this.dataset) { return false; }

    var obj = this,
        url = config.folder + config.themeUrl + '/ajax/richness/richnessTetradData.php';
        postData = {
            "tetradId" : this.tetrad.active,
            'dataset' : this.dataset,
            'status' : this.conservationStatus,
            'range' : this.breedingRange
        };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: postData
    })
    .done(function(data) {
        window.setTimeout(function(){

            if (data.length > 0) {
                $("#js-richness-sum-total").html(data.length);
            } else {
                $("#js-richness-sum-total").html('0');
            }

            obj.setGoogleMapLink();
            $('#js-tet-list').empty().append(obj.templateTetradList(data));
            obj.stopSpinner(['tetrad-results']);
        }, 800);
    })
    .done(function() {
        obj.setFetchingData(false);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });








    // this.tetrad.currentList = "";

    // var obj = this;

    // this.startUpdatingEls();

    // var postData = {
    //     "tetradId" : this.tetrad.active,
    //     "data-set" : this.dataset
    // };

    // $.ajax({
    //     url: config.folder + config.themeUrl + '/ajax/tetradData.php',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: postData,
    //     timeout: 12000
    // })
    // .done(function(data){
    //     obj.tetrad.counts = obj.getSums(data);

    //     var tetradList = document.createElement('ol');
    //     tetradList.classList.add('tetrad-list');

    //     // lookup the index, retreive the Code value and template the list item
    //     var theCode, el, spanEl;
    //     for (var i = 0; i < data.length; i++) {
    //         theCode = data[i].Code;
    //         el = document.createElement('li');
    //         el.innerHTML = data[i].Species.trim();
    //         spanEl = document.createElement('span');
    //         spanEl.classList.add('code-' + theCode);
    //         el.appendChild(spanEl);
    //         tetradList.appendChild(el);
    //     }

    //     obj.tetrad.currentList = tetradList;

    //     //  A procedure for soting the list alphabetically
    //     // // get the list of names
    //     // var orginalList = [];

    //     // for (var i = 0; i < data.length; i++) {
    //     //     orginalList.push(data[i]['Species']);
    //     // }
    //     // // sort the list to new arr
    //     // var sortList = [];
    //     // for (var i = 0; i < data.length; i++) {
    //     //     sortList.push(data[i]['Species']);
    //     // }
    //     // sortList.sort();

    //     // var tetradList = document.createElement('ol');
    //     // tetradList.classList.add('tetrad-list');

    //     // // lookup the index, retreive the Code value and template the list item
    //     // var theCode, el, spanEl;
    //     // for (var i = 0; i < sortList.length; i++) {
    //     //     theCode = data[orginalList.indexOf(sortList[i])]['Code'];
    //     //     el = document.createElement('li');
    //     //     el.innerHTML = sortList[i].trim();
    //     //     spanEl = document.createElement('span');
    //     //     spanEl.classList.add('code-' + theCode);
    //     //     el.appendChild(spanEl);
    //     //     tetradList.appendChild(el);
    //     // }

    //     // obj.tetrad.currentList = tetradList;
    //     // // truncate arrays
    //     // orginalList.length = 0;
    //     // sortList.length = 0;

    // })
    // .done(function(data) {
    //     window.setTimeout(function(){
    //         obj.stopSpinner.call(obj, ['tetrad-meta']);
    //         // obj.updateStateEls.stop.call(obj, obj.context);
    //         obj.stopUpdatingEls();
    //         obj.setFetchingData(false);
    //     }, 800);
    // })
    // .fail(function() {
    //     console.log("getTetradData - error");
    //     window.setTimeout(function(){
    //         obj.stopSpinner.call(obj, ['tetrad-meta']);
    //         obj.setMapErrorMsg(true, 'tetrad-request');
    //     }, 800);
    // })
    // .always(function() {
    //     // console.log("getTetradData - complete");
    // });

};


MapModule.prototype.templateRichnessData = function(data) {
    // remove previous results using richnessTetradArr
    var prevResults = JSON.parse(sessionStorage.getItem(this.context + "richnessTetradArr"));

    if (Array.isArray(prevResults) && prevResults.length)  {
        for (var i = 0; i < prevResults.length; i++) {
            var prevTetrad = document.getElementById(this.context + prevResults[i]);
            if (prevTetrad) {
                prevTetrad.className = '';
            }
        }
    }
    tetArr = [];
    for (var i = 0; i < data.length; i++) {
        tetArr.push(data[i]['Tetrad']);
        sessionStorage.setItem(this.context + "richnessTetradArr", JSON.stringify(tetArr));
    }

    var range;
    for (var i = 0; i < tetArr.length; i++) {
            var count = data[i].CountOf;

            if (count <= 9) {
                range = '1';
            } else if (count >9 && count <= 29) {
                range = '2';
            } else if (count >29 && count <= 49) {
                range = '4';
            } else if (count >49 && count <= 69) {
                range = '5';
            } else if (count >69 && count <= 89) {
                range = '7';
            } else if (count >89 && count <= 109) {
                range = '8';
            } else if (count >109) {
                range = '9';
            } else {
                range = '0'
            }

            var tetrad = document.getElementById(this.context + tetArr[i]);

            if (tetrad) {
                tetrad.classList.add('pres', 'code-' + range);
            }
            // else {
                    // generate a list of tetrads in the sitters file which don't exist on our grid!
            //     console.log('false: ' + tetArr[i]);
            // }
    }
};


















