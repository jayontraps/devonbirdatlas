

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

