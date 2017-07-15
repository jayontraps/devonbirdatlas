<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
<style type="text/css">
    <?php include 'inc/critical-css/critical-global.php' ;?>
</style>
</head>

<body <?php body_class(); ?>>
<?php include "inc/inc-svg-defs.php"; ?>
<div id="page" class="site">

	<header id="masthead" class="header" role="banner">
        <div class="inner-wrap group">

            <?php include "inc/branding.php";?>
            <?php include "inc/main-nav.php";?>
            <?php include "inc/sub-nav.php";?>

            <div id="js_open_nav"  class="menu-toggle">
                <svg class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg>
            </div>

        </div>
    </header>