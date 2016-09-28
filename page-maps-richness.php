<?php
/**
 * Template name: species-richness
 *
 */
get_header(); ?>

	<script>
	    var richnessPage = true;
	</script>
<div id="primary">

	<div class="inner-wrap group">
		<div class="ov-row group inner-wrap">
            <h1 class="no-m-p">Species Richness</h1>
        </div>
		<div id="tetrad-maps" class="species-richness group">
		    <div id="m1_" class="container data-off" data-set="">
		        <div class="map-full">
		            <div class="column-map">
		                <div class="map-border">
		                    <div class="map-container clearfix">
		                        <?php include('inc/maps/spinner.php'); ?>
		                        <?php include('inc/maps/map-error.php'); ?>
		                        <?php include('inc/maps/overlays.php'); ?>
		                        <?php include('inc/maps/map-grid-1.php'); ?>
		                    </div>
		                </div>
		                <div class="richness-keys">
							<table class="key-table">
							    <tbody>
							        <tr class="key-scale">
							            <td>> 9<span class="keysq code-1"></span></td>
							            <td>10-29<span class="keysq code-2"></span></td>
							            <td>30-49 <span class="keysq code-4"></span></td>
							            <td>50-69<span class="keysq code-5"></span></td>
							            <td>70-89<span class="keysq code-7"></span></td>
							            <td>90-109<span class="keysq code-8"></span></td>
							            <td>> 109<span class="keysq code-9"></span></td>
							        </tr>
							    </tbody>
							</table>
						</div>

		            </div>
		            <div class="column-meta">
		                <?php include('inc/maps/overlay-controls.php'); ?>
		                <?php include('inc/maps/richness-controls.php'); ?>

						<div id="js-richness-tetrad-data" class="tetrad-results">
							<?php include('inc/maps/spinner.php'); ?>
							<div class="tetrad-results-inner-wrap">
								<div class="gmap-link"></div>
								<h4 class="tet-res-name" id="js-richness-tetrad">Click on the map for tetrad information</h4>
								<div class="toggle-total-list">
									Total number of species: <span id="js-richness-sum-total"></span>
									<span class="caret"></span>
								</div>
								<div id="js-tet-list"></div>
							</div>
						</div>
		            </div>
		        </div>
		    </div>
		</div>
	</div>
	
</div>

<?php get_footer(); ?>
