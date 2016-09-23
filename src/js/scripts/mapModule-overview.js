/* requires:
mapModule.js
*/

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
