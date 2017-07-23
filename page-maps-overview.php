<?php
/**
 * Template name: species-overview
 *
 */
get_header(); ?>

<script>
    var ovPage = true;
</script>
<div id="primary">

    <div id="species-overview" class="ov group">

        <div class="ov-row group inner-wrap">
            <form class="map-options">
                <div class="select-controls">
                    <select class="map-select select-species">
                        <option></option>
                    </select>
                </div>
            </form>
        </div>

        <div class="ov-row group inner-wrap">
            <div class="ov-maps-wrap">
                <div class="ov-map-lg" data-set="dbreed">
                    <h4 class="ov-map-title">Breeding distribution 2007-13</h4>
                    <div id="m1_" class="container" >
                        <div class="map-border">
                            <div class="map-container clearfix">
                                <?php include('inc/maps/spinner.php'); ?>
                                <?php include('inc/maps/map-error.php'); ?>
                                <?php include('inc/maps/overlays-overview.php'); ?>
                                <?php include('inc/maps/map-grid-1.php'); ?>
                            </div>
                        </div>

                        <?php include 'inc/maps/map-key-dbreed.php'; ?>

                    </div>
                </div>

                <div class="ov-map-sm-wrap">

                    <div class="ov-map-sm" data-set="dbdensity">
                        <h4 class="ov-map-title">Breeding-period abundance 2007-13</h4>
                        <div id="m2_" class="container" >
                            <div class="map-border">
                                <div class="map-container clearfix">
                                    <?php include('inc/maps/spinner.php'); ?>
                                    <?php include('inc/maps/map-error.php'); ?>
                                    <?php include('inc/maps/overview-idle-map-state.php'); ?>
                                    <?php include('inc/maps/overlays-overview.php'); ?>
                                    <?php include('inc/maps/map-grid-2.php'); ?>
                                </div>
                            </div>
                            <?php include('inc/maps/map-key-density.php'); ?>
                            <?php include('inc/maps/map-key-density-sums.php'); ?>
                        </div>
                    </div>

                    <div class="ov-map-sm" data-set="dwdensity">
                        <h4 class="ov-map-title">Winter-period abundance 2007-13</h4>
                         <div id="m3_" class="container" >
                            <div class="map-border">
                                <div class="map-container clearfix">
                                    <?php include('inc/maps/spinner.php'); ?>
                                    <?php include('inc/maps/map-error.php'); ?>
                                    <?php include('inc/maps/overview-idle-map-state.php'); ?>
                                    <?php include('inc/maps/overlays-overview.php'); ?>
                                    <?php include('inc/maps/map-grid-3.php'); ?>
                                </div>
                            </div>
                            <?php include('inc/maps/map-key-density.php'); ?>
                            <?php include('inc/maps/map-key-density-sums.php'); ?>
                        </div>
                    </div>

                </div><!-- .ov-map-sm-wrap -->

            </div><!-- .ov-maps-wrap -->
        </div>

        <div class="ov-row group inner-wrap species-account state">
            <h1 class="species-title" id="species-name"></h1>
            <h3 class="latin-name"></h3>
            <div class="account-text group"></div>
        </div>

    </div>

</div>

<?php get_footer(); ?>
