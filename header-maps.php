 <!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">

	<header id="masthead" class="header" role="banner">
		<div class="inner-wrap">
            <div class="logo">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/build/img/DB_Logo_Blue-min.png">
            </div>
            <ul class="main-nav nav">
                <li><a href="<?php bloginfo('url'); ?>/species-overview">Species overview</a></li>
                <li><a id="launch-maps-link" href="<?php bloginfo('url'); ?>/tetrad-maps">Tetrad maps</a></li>
                <li><a href="<?php bloginfo('url'); ?>/species-richness">Species Richness</a></li>
            </ul>
        </div>
	</header>

