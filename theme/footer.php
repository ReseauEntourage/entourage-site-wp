<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "site-content" div and all content after.
 */

	$post = get_post(140);
?>
	
		<section class="section-newsletter">
			<p><?php echo get_option('newsletter'); ?></p>
			<div class="parent-input with-icon email-icon">
				<input id="newsletter-email" type="text" placeholder="Votre adresse email"/>
				<a id="subscribe-newsletter" class="btn orange-btn">Ok</a>
			</div>
		</section>
	</div><!-- .site-content -->

	<footer class="site-footer">
		<div class="footer-links-lists">
			<?php echo $post->post_content; ?>
		</div>
		<div class="footer-address">
			<i class="material-icons">room</i>
			<a href="<?php echo get_option('footer_address_link'); ?>" target="_blank"><?php echo get_option('footer_address_text');?></a>
		</div>
	</footer><!-- .site-footer -->

</div><!-- .site -->

<?php wp_footer(); ?>

<script src="<?php asset_url('js/script.js'); ?>" type="text/javascript"></script>

<!-- Load Facebook SDK for JavaScript -->
<script>
    window.fbAsyncInit = function() {
        FB.init({
          appId            : '280727035774134',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v3.1'
        });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>

<!-- Your customer chat code -->
<div
    class="fb-customerchat"
    attribution=setup_tool
    page_id="622067231241188"
    theme_color="#ff5100"
    logged_in_greeting="Bonjour ! Comment peut-on vous aider ?"
    logged_out_greeting="Bonjour ! Comment peut-on vous aider ?"
    greeting_dialog_display="hide"
    ></div>

</body>
</html>
