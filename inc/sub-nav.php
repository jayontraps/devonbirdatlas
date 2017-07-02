<?php
    if ( $page = get_page_by_path( 'distribution-maps' ) ){
        echo "<ul class='nav sub-menu-nav'>";
        // // wp_list_pages( array('title_li'=>'','include'=>get_post_top_ancestor_id()) );
        wp_list_pages( array('title_li'=>'','depth'=>1,'child_of'=> $page->ID) );
        echo "</ul>";
    }
?>