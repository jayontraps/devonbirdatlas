/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
mapModule.js
mapModule-richness.js
mapModule-overview.js
eventemitter2.js
init.js
*/
/* https://github.com/mkleehammer/gulp-deporder */

$(document).ready(function(){

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
});