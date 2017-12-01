<?php
/**
 * The template part for displaying section with "text" type
 *
 */
?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
		<iframe
			id="donation-form"
			border="0"
			src="<?php echo link_with_url_parameters(get_option('donate_link'), $_SERVER['QUERY_STRING']); ?>"
			></iframe>
	</div>
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
	    width: 810px;
	    margin: auto;
	    text-align: left;
    }

    section.section_type-donation div.section-content iframe {
	    width: 100%;
	    min-height: 658px;
        margin-top: 20px;
    }

    #fixed-donate-btn {
    	display: none;
    }

    @media screen and (max-width: 900px) {
    	section.section_type-adherer form fieldset {
    		margin-bottom: 0;
    	}
    	section.section_type-adherer form fieldset .parent-input {
    		display: block;
    		margin-bottom: 20px;
    	}

	    section.section_type-adherer input[type=text] {
	    	width: 100%;
	    	margin-right: 0;
	    }

	    section.section_type-adherer label {
	    	margin: 0;
	    	width: 100%;
	    }
    }

</style>
