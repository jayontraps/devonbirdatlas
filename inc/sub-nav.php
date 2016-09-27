<?php
      if (is_404() || is_search() || is_archive() || is_page("contact-us")) {
        // do nothing
      }  else {
        echo "<ul class='nav sub-menu-nav'>";
        // wp_list_pages( array('title_li'=>'','include'=>get_post_top_ancestor_id()) );
        wp_list_pages( array('title_li'=>'','depth'=>1,'child_of'=>get_post_top_ancestor_id()) );
        echo "</ul>";
      }

?>