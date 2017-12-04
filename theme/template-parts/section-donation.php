<?php
/**
 * The template part for displaying section with "text" type
 *
 */

	$url_parameters = $_SERVER['QUERY_STRING'];

?>

<section <?php post_class(); ?>>
	<div class="section-content">
		<?php the_content(); ?>
	</div>
	<iframe
		id="donation-form"
		border="0"
		src="<?php echo link_with_url_parameters(get_option('donate_link'), $url_parameters); ?>"
		></iframe>
</section>

<script type="text/javascript">
	jQuery(document).ready(function($) {
		iFrameResize({
			messageCallback: function(messageData){ // Callback fn when message is received
				var height = $('#donation-form').offset().top
				if (messageData.message == 'paypal') {
					height += 80;
					$('#donation-form').height(658);
				}
				$('html, body').animate( { scrollTop:  height}, 500 );
			},
		}, '#donation-form');
	});
</script>

<script src="<?php echo get_template_directory_uri(); ?>/js/iframeResizer.min.js" type="text/javascript"></script>

<style type="text/css">

	section.section_type-donation div.section-content {
		margin-top: -65px;
	    background: #fb5507;
	    color: #fff;
	    padding: 20px;
    }

    #donate-btn {
    	display: none;
    }

    #donation-form {
    	width: 100%;
	    min-height: 658px;
        margin-top: 20px;
    }

    @media screen and (max-width: 1000px) {

    }

</style>
