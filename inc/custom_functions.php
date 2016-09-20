<?php

function enqueue_styles_scripts() {

   // wp_enqueue_script( 'devonatlas-modenizr', get_template_directory_uri() . '/js/vendor/modernizr.custom.98000.js', array(), false);
    wp_enqueue_style( 'devonatlas-style', get_template_directory_uri() . '/build/css/main.css', array(), '133' );

    wp_enqueue_script( 'devonatlas-main', get_template_directory_uri() . '/build/js/all.min.js', array('jquery'),'133', true);


    // if ( is_page_template( 'page-search-app.php' ) ) {
    //     wp_enqueue_script( 'devonatlas-app', get_template_directory_uri() . '/build/app.min.js', array('jquery'), '125', true);
    // }

    // wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css');
    // wp_enqueue_style('gfonts', 'http://fonts.googleapis.com/css?family=Roboto|Roboto+Slab');
}

add_action('wp_enqueue_scripts', 'enqueue_styles_scripts');


// https://codex.wordpress.org/Function_Reference/wp_list_pages#List_topmost_ancestor_and_its_immediate_children
if(!function_exists('get_post_top_ancestor_id')){
/**
 * Gets the id of the topmost ancestor of the current page. Returns the current
 * page's id if there is no parent.
 *
 * @uses object $post
 * @return int
 */
function get_post_top_ancestor_id(){
    global $post;

    if($post->post_parent){
        $ancestors = array_reverse(get_post_ancestors($post->ID));
        return $ancestors[0];
    }

    return $post->ID;
}}



//https://codex.wordpress.org/Function_Reference/the_excerpt
// Make the "read more" link to the post
function new_excerpt_more( $more ) {
    return ' <a class="read-more" href="' . get_permalink( get_the_ID() ) . '">' . __( '... read more', 'your-text-domain' ) . '</a>';
}
add_filter( 'excerpt_more', 'new_excerpt_more' );




?>
