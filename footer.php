<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package devonatlas
 */

?>


    <footer id="colophon" class="footer clearfix" role="contentinfo">
        <div class="inner-wrap">
            <p>Copyright &copy; Devon Bird Atlas. All rights reserved.</p>
        </div>
    </footer>


</div><!-- #page -->

<div id="js_off_canvas" class="off-canvas">
  <div id="js_close_nav" class="close-nav">
    <svg class='icon icon-close'>
      <use xlink:href='#icon-open-menu'></use>
    </svg>
  </div>
  <div id="js_close_nav_col" class="close-nav-col"></div>
  <div class="off-canvas__wrap">
    <div class="off-canvas__menu">
        <nav role="navigation" class="cf mobile-nav-wrap" id="sm-screen-nav" itemscope itemtype='https://schema.org/SiteNavigationElement'>
      <?php wp_nav_menu( array(
      'theme_location' => 'mobile',
      'menu_class'      => 'mobile-nav' ) ); ?>
  </nav>
    </div>
  </div>
</div>

<div id="js_overlay" class="body-overlay"></div>

<?php wp_footer(); ?>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-85552977-1', 'auto');
  ga('send', 'pageview');

</script>


</body>
</html>
