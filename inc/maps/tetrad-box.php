<div class="tetrad-meta state">
    <?php include('tetrad-message.php'); ?>
    <?php include('spinner.php'); ?>
    <?php include('map-error.php'); ?>
    <div class="tetrad-meta-wrapper">
        <h3 class="tetrad-title">Click on the map for tetrad information</h3>
        <form rel='tetrad-input'>
            <input class='tetrad-input input-inline' type="text" placeholder='Enter tetrad code'/>
            <input type="submit" value="Submit" class="input-inline-submit">
            <span class="tetrad-input-error">No tetrad found</span>
        </form>
        <div class="tet-sums">
            <ul class="tet-sums-list">
                <li>Present: <span class="tet-pres"></span></li>
                <li>Possible: <span class="tet-poss"></span></li>
                <li>Probable: <span class="tet-prob"></span></li>
                <li>Confirmed: <span class="tet-conf"></span></li>
            </ul>
        </div>
        <div class="gmap-link"></div>
        <div class="tetrad-list-wrapper"></div>
    </div>
</div>