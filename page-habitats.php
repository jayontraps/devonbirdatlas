<?php
/**
 * Template name: habitats
 *
 */

get_header(); ?>

<script> var habitatPage = true; </script>

	<div id="primary" class="inner-wrap">

		<div class="habitat-row habitat-intro">
			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'habitats' );

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

			endwhile; // End of the loop.
			?>
		</div>

		<div class="habitat-row habitats">
			<?php
			$args = array(
				// arguments for your query
				'post_type' => 'habitats',
				'posts_per_page'=> -1,
				'orderby' => 'menu_order',
				'order' => 'ASC'
			);
			// the query
			$the_query = new WP_Query( $args ); ?>

			<?php if ( $the_query->have_posts() ) : ?>

				<!-- pagination here -->
				<ul class="habitat-list">
				<!-- the loop -->
				<?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
				<?php $post_id = get_the_ID(); ?>
				<li>
					<a
					href="<?php the_permalink(); ?>"
					data-post-id="<?php echo $post_id;?>""
					title="<?php the_title_attribute(); ?>">
					<?php the_title(); ?></a>
				</li>
				<?php endwhile; ?>
				<!-- end of the loop -->
				</ul>
				<!-- pagination here -->

				<?php wp_reset_postdata(); ?>

			<?php else : ?>
				<p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
			<?php endif; ?>

			<div id="habitat-wrapper" class="habitat-wrapper">
				<?php include('inc/maps/spinner.php'); ?>
			    <?php include('inc/maps/map-error.php'); ?>
				<div id="habitat-app" class="group habitat-app"></div>
			</div>

		</div>


	</div><!-- #primary -->

<?php

get_footer();
