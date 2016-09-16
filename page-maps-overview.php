<?php
/**
 * Template name: species-overview
 *
 */
get_header('maps'); ?>

<script>
    var ovPage = true;
</script>

<div id="species-overview" class="ov group">
    <div class="group">

        <div class="group inner-wrap">
            <form class="map-options">
                <div class="select-controls">
                    <select class="map-select select-species">
                        <option></option>
                    </select>
                </div>
            </form>
        </div>



        <div class="group inner-wrap">

            <div class="col-1-3">
                <div class="species-account state">
                    <h1 class="species-title" id="species-name">Species account</h1>
                    <h3 class="latin-name"></h3>
                    <div class="account-text">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus fugiat, illo quidem, consequatur praesentium similique quisquam quibusdam ipsum repudiandae aliquam culpa quo neque dolor? Quasi ullam nulla, enim. Tempore, rem.</p>
                    </div>
                </div>
            </div>

            <div class="ov-maps-wrap">

                <div class="ov-map-lg" data-set="dbreed">
                    <h4 class="ov-map-title">Breeding distribution 2007 - 13</h4>
                    <div id="m1_" class="container" >
                        <div class="map-border">
                            <div class="map-container clearfix">
                                <?php include('inc/maps/spinner.php'); ?>
                                <?php include('inc/maps/map-error.php'); ?>
                                <?php include('inc/maps/overlays-overview.php'); ?>
                                <?php include('inc/maps/map-grid-1.php'); ?>
                            </div>
                        </div>
                        <?php include('inc/maps/map-key-dbreed.php'); ?>
                    </div>
                </div>

                <div class="ov-map-sm-wrap">

                    <div class="ov-map-sm" data-set="dbdensity">
                        <h4 class="ov-map-title">Breeding-period abundance 2007 - 13</h4>
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
                        <h4 class="ov-map-title">Winter-period abundance 2007 - 13</h4>
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
</div>

<?php get_footer(); ?>
