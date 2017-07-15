<?php
/**
 * devonatlas functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package devonatlas
 */

if ( ! function_exists( 'devonatlas_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function devonatlas_setup() {

	// function my_init() {
	// 	if (!is_admin()) {
	// 		// comment out the next two lines to load the local copy of jQuery
	// 		wp_deregister_script('jquery');
	// 		wp_register_script('jquery',  get_template_directory_uri() . '/js/jquery-3.1.0.min.js', false, '1.3.2');
	// 		wp_enqueue_script('jquery');
	// 	}
	// }
	// add_action('init', 'my_init');


	/**
	* Add REST API support to an already registered post type.
	*/
	add_action( 'init', 'my_custom_post_type_rest_support', 25 );
	function my_custom_post_type_rest_support() {
		global $wp_post_types;

		//be sure to set this to the name of your post type!
		$post_type_name = 'species';
		if( isset( $wp_post_types[ $post_type_name ] ) ) {
			$wp_post_types[$post_type_name]->show_in_rest = true;
			$wp_post_types[$post_type_name]->rest_base = $post_type_name;
			$wp_post_types[$post_type_name]->rest_controller_class = 'WP_REST_Posts_Controller';
		}

	}	

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on devonatlas, use a find and replace
	 * to change 'devonatlas' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'devonatlas', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary', 'devonatlas' ),
		'mobile' => esc_html__( 'mobile', 'devonatlas' )
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'devonatlas_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif;
add_action( 'after_setup_theme', 'devonatlas_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function devonatlas_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'devonatlas_content_width', 640 );
}
add_action( 'after_setup_theme', 'devonatlas_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function devonatlas_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'devonatlas' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'devonatlas' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'devonatlas_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function devonatlas_scripts() {

	wp_deregister_script('jquery');
	wp_register_script('jquery',  get_template_directory_uri() . '/js/jquery-3.1.0.min.js', false, '1.3.2');
	wp_enqueue_script('jquery');

	 wp_enqueue_script( 'devonatlas-config', get_template_directory_uri() . '/js/config.js', array(), true );
	// wp_enqueue_style( 'devonatlas-style', get_stylesheet_uri() );

	// wp_enqueue_script( 'devonatlas-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );

	// wp_enqueue_script( 'devonatlas-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );

	// wp_enqueue_script( 'devonatlas-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'devonatlas_scripts' );


/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';
/**
 * Load custom functions.
 */
require get_template_directory() . '/inc/custom_functions.php';
