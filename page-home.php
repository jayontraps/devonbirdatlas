<?php
/**
 * Template name: home-page
 *
 */
get_header(); ?>

<div id="primary" class="inner-wrap">

        <?php
        while ( have_posts() ) : the_post();

            get_template_part( 'template-parts/content', 'home' );

        endwhile; // End of the loop.
        ?>

    </div><!-- #primary -->


<?php
// get_sidebar();
get_footer();
