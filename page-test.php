<?php
/**
 * Template name: test
 *
 */
get_header(); ?>

<script>
    var mapPage = true;
</script>

<div id="primary">

	<div id="m1_" class="container" data-set="">
		<div class="select-controls">
            <select class="select map-select select-data-set">
                <option selected value="dbreed">Breeding Status 2007-13</option>
                <option value="sitters">Breeding Status 1977 - 85</option>
                <option value="dbdensity">Breeding Abundance</option>
                <option value="dwdensity">Winter Abundance</option>
            </select>
        </div>
	</div>
	<div id="m2_" class="container" data-set="">
		<div class="select-controls">
            <select class="select map-select select-data-set">
                <option selected value="dbreed">Breeding Status 2007-13</option>
                <option value="sitters">Breeding Status 1977 - 85</option>
                <option value="dbdensity">Breeding Abundance</option>
                <option value="dwdensity">Winter Abundance</option>
            </select>
        </div>
	</div>

<button id="test-call">Ajax call</button><h1 id="count"></h1>



</div>


<?php get_footer(); ?>
