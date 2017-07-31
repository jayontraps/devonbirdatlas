<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package devonatlas
 */

?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php
		// vars
		$panel_sub_image = get_field('panel-sub-image');
		$panel_sub_heading = get_field('panel-sub-heading');
		$panel_sub_button_link = get_field('panel-sub-btn-link');
		$panel_sub_btn_text = get_field('panel-sub-btn-text');

		?>

		<div id="js_slider" class="panel home-slider">

		<?php if( have_rows('slides') ): ?>

			<ul class="bxslider-home">

			<?php while( have_rows('slides') ): the_row();

				// vars
				$image = get_sub_field('image');
				$title = get_sub_field('title');
				$subtitle = get_sub_field('sub-title');
				$link = get_sub_field('link');
				$btn_text = get_sub_field('button_text');
				$align = get_sub_field('align_content');
				$color = get_sub_field('text_color');

				?>

				<li class="panel-feature slide">

					<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt'] ?>" />

					<div class="panel-feature__inner <?php echo $align . ' ' . $color; ?>">
						<h2 class="panel-feature__title"><?php echo $title; ?></h2>
						<h3 class="panel-feature__sub-title"><?php echo $subtitle; ?></h3>
						<div class="foll-hr"></div>
						<?php if( $link ): ?>
							<a href="<?php echo $link; ?>" class="panel-feature__btn devon-btn">
						<?php endif; ?>
							<?php echo $btn_text; ?>
						<?php if( $link ): ?>
							</a>
						<?php endif; ?>
					</div>

				</li>

			<?php endwhile; ?>

			</ul>

		<?php endif; ?>




		<?php
			$subSlidesTitle = get_field('sub-slides_title');
			$subSlidesContent = get_field('sub-slides_content');
		?>

			<div class="panel-feature-sub">
				<h2 class="panel-feature-sub__title"><?php echo $subSlidesTitle; ?></h2>
				<p class="panel-feature-sub__content"><?php echo $subSlidesContent; ?></p>
			</div>

		</div>




		<div class="panel panel-sub">
			<img class="panel-sub__img"
				src="<?php echo $panel_sub_image['url']; ?>" alt="<?php echo $feature_image['alt'] ?>" />

			<div class="panel-sub__inner">
				<h2 class="panel-sub__title"><?php echo $panel_sub_heading; ?></h2>
				<?php if($panel_sub_button_link ): ?>
					<a target="_blank" href="<?php echo $panel_sub_button_link; ?>" class="panel-sub__btn devon-btn">
				<?php endif; ?>
					<?php echo $panel_sub_btn_text; ?>
				<?php if($panel_sub_button_link ): ?>
					</a>
				<?php endif; ?>
			</div>
		</div>



		<div>
			<?php if( have_rows('home_panels') ): ?>
				<div class="h-panels">
				<?php while( have_rows('home_panels') ): the_row();
					// vars
					$heading = get_sub_field('heading');
					$copy = get_sub_field('copy');
					$link = get_sub_field('panel_link');
					$image = get_sub_field('panel_image');
				?>
				<div class="h-panel">
					<img class="h-panel-img" src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt'] ?>" />
						<h2 class="h-panel-title"><?php echo $heading; ?></h2>
						<div class="h-panel-inner">
							<p><?php echo $copy; ?></p>
						</div>
						<?php if( $link ): ?>
							<a class="devon-btn" href="<?php echo $link; ?>">Explore</a>
						<?php endif; ?>
				</div>
				<?php endwhile; ?>
				</div><!-- .home-panels -->
			<?php endif; ?>
		</div>

</div>
