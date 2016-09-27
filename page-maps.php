<?php
/**
 * Template name: tetrad-maps
 *
 */
get_header(); ?>

<script>
    var mapPage = true;
</script>

<div id="primary">

	<div class="inner-wrap group">
        <div id="js-compare-toggle" class="devon-btn">Compare Maps</div>
    </div>

	<div class="inner-wrap group">
		<div id="tetrad-maps" class="tetrad-maps group">
		    <div id="m1_" class="container" data-set="">
		        <div class="map-full">
		            <div class="column-map">

		                <?php include('inc/maps/map-controls.php'); ?>
		                <?php include('inc/maps/data-set-heading.php'); ?>
		                <div class="map-border">
		                    <div class="map-container clearfix">
		                        <?php include('inc/maps/spinner.php'); ?>
		                        <?php include('inc/maps/map-error.php'); ?>

								<div class="sitters-underlay" style="display:none">
								     <?php include('inc/maps/map-grid-1-underlay.php'); ?>
								</div>

		                        <?php include('inc/maps/overlays.php'); ?>
		                        <?php include('inc/maps/map-grid-1.php'); ?>
		                    </div>
		                </div>
		                <?php include('inc/maps/map-keys.php'); ?>
		            </div>
		            <div class="column-meta">
		                <?php include('inc/maps/map-title.php'); ?>
		                <?php include('inc/maps/overlay-controls.php'); ?>
		                <?php include('inc/maps/tetrad-box.php'); ?>
		            </div>
		        </div>
		    </div>


		    <div id="m2_" class="container" data-set="">

		        <div class="map-full">
		            <div class="column-map">
		                <?php include('inc/maps/map-controls.php'); ?>
		                <?php include('inc/maps/data-set-heading.php'); ?>
		                <div class="map-border">
		                    <div class="map-container clearfix">
		                        <?php include('inc/maps/spinner.php'); ?>
		                        <?php include('inc/maps/map-error.php'); ?>

								<div class="sitters-underlay" style="display:none">
								     <?php include('inc/maps/map-grid-2-underlay.php'); ?>
								</div>

		                        <?php include('inc/maps/overlays.php'); ?>
		                        <?php include('inc/maps/map-grid-2.php'); ?>
		                    </div>
		                </div>
		                <?php include('inc/maps/map-keys.php'); ?>
		            </div>

		            <div class="column-meta">
		                <?php include('inc/maps/map-title.php'); ?>
		                <?php include('inc/maps/overlay-controls.php'); ?>
		                <?php include('inc/maps/tetrad-box.php'); ?>
		            </div>
		        </div>
		    </div>

		</div>
	</div>

</div>


<?php get_footer(); ?>
