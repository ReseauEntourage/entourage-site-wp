<?php
/**
 * The template part for displaying section with "text" type
 *
 */

  $presets = [
    'S1' => [
      'once'      => [10, 15, 25, 35],
      'regular'   => [ 2,  5,  8, 15],
      'selected'  =>  15,
    ],
    'S2' => [
      'once'      => [15, 35, 50, 80],
      'regular'   => [ 5, 10, 15, 25],
      'selected'  =>  35,
    ],
    'S3' => [
      'once'      => [ 5, 15, 25, 35, 50],
      'regular'   => [ 2,  5,  8, 15],
      'selected'  =>  15,
    ],
    'S4' => [
      'once'      => [10, 25, 50, 80, 150],
      'regular'   => [10, 15, 25, 30],
      'selected'  =>  50,
    ],
  ];

  if (preg_match('/.+-(S[1-4])$/', $_GET['utm_source'], $match)) {
    $preset = $presets[$match[1]];
  }

  function to_cents($amount) { return $amount * 100; }

  if ($preset) {
    $url_parameters = [
      'once_grid'    => array_map(to_cents, $preset['once']),
      'regular_grid' => array_map(to_cents, $preset['regular']),
      'amount'       => to_cents($preset['selected'])
    ];
  } else {
    $url_parameters = [];
  }

  $url_parameters = array_merge($_GET, $url_parameters);
  $url_parameters = http_build_query($url_parameters);
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
<<<<<<< HEAD
		margin-top: -65px;
	    background: #fb5507;
	    color: #fff;
	    padding: 20px;
=======
	    width: 810px;
	    margin: auto;
	    text-align: left;
        border-bottom: 1px solid #eee;
    	padding-bottom: 30px;
<<<<<<< HEAD
>>>>>>> Donation + global fixes
=======
>>>>>>> Donation + global fixes
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
