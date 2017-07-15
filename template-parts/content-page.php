<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package devonatlas
 */

?>
<?php 

$banner = get_field('banner_image');

if( !empty($banner) ): ?>
<div class="banner-image group">

	<img class="banner-image__img" src="<?php echo $banner['url']; ?>" alt="<?php echo $banner['alt']; ?>" />

	<?php $banner_caption = $banner['caption']; ?>
	<?php if( $banner_caption ): ?>
		<div class="banner-image__caption"><?php echo $banner_caption; ?></div>
	<?php endif; ?>
</div>
<?php endif; ?>


<div class="main-col site-column">
	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<header class="entry-header">
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</header><!-- .entry-header -->

		<div class="entry-content">
			<?php
				the_content();

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'devonatlas' ),
					'after'  => '</div>',
				) );
			?>
		</div><!-- .entry-content -->

		<?php if ( get_edit_post_link() ) : ?>
			<footer class="entry-footer">
				<?php
					edit_post_link(
						sprintf(
							/* translators: %s: Name of current post */
							esc_html__( 'Edit %s', 'devonatlas' ),
							the_title( '<span class="screen-reader-text">"', '"</span>', false )
						),
						'<span class="edit-link">',
						'</span>'
					);
				?>
			</footer><!-- .entry-footer -->
		<?php endif; ?>
	</article><!-- #post-## -->
</div>

<div class="side-col site-column">

	<?php if( have_rows('right_column_image') ): ?>

		<?php while( have_rows('right_column_image') ): the_row();

			// vars
			$image = get_sub_field('image');
			$caption = get_sub_field('caption');
			$link = get_sub_field('link');
			?>


			<div class="image-panel">
				<?php if( $link ): ?>
					<a href="<?php echo $link; ?>" class="image-panel__link">
				<?php endif; ?>

				<img class="image-panel__img" src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt'] ?>" />

				<?php if( $caption ): ?>
					<div class="image-panel__caption"><?php echo $caption; ?></div>
				<?php endif; ?>

				<?php if( $link ): ?>
					<div class="tint"></div>
					</a>
				<?php endif; ?>

			</div>

		<?php endwhile; ?>

	<?php endif; ?>

</div>
















