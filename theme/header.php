<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "site-content" div.
 *
 */

	$custom_fields = get_post_custom($wp_query->post->ID);

	if ( is_front_page() )
	{
		$og_title = !empty(get_option('facebook_title')) ? get_option('facebook_title') : $custom_fields['meta_titre'][0];
		$og_description = !empty(get_option('facebook_description')) ? get_option('facebook_description') : $custom_fields['meta_description'][0];
	}
	else {
		$og_title = !empty($custom_fields['meta_titre']) ? $custom_fields['meta_titre'][0] : get_the_title($wp_query->post->ID);
		$og_description = !empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description');
	}

	$custom_fields_home = get_post_custom('2');
	$download_btn_link = $custom_fields_home['lien'][0];
	$download_btn_text = $custom_fields_home['bouton_orange'][0];
?>


<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="icon" type="image/png" href="<?php asset_url('img/fav.png'); ?>" />
	<title>
		<?php
			echo get_bloginfo('name');
			echo ' | ';
			if ( !empty($custom_fields['meta_titre']) )
				echo $custom_fields['meta_titre'][0];
			else
				the_title();
		?>
	</title>
    <meta name="description" content="<?php echo (!empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description')); ?>">

	<meta property="og:title" content="<?php echo $og_title; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo wp_get_canonical_url(); ?>">
    <meta property="og:image" content="<?php asset_url('img/share-fb.png'); ?>">
    <meta property="og:description" content="<?php echo $og_description; ?>">
    <meta property="fb:app_id" content="280727035774134">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="google-site-verification" content="6EHu9r95V7L27wF49pEYrAovlGC0JPlECZ93h90Z0l0" />

	<link rel="stylesheet" href="<?php asset_url('css/style.css'); ?>">
	<link rel="stylesheet" href="<?php asset_url('css/responsive.css'); ?>">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Roboto:300,500,100,300italic' rel='stylesheet' type='text/css'>
	<!--[if lt IE 9]>
	<script src="<?php asset_url('js/html5.js'); ?>"></script>
	<![endif]-->
	<script src="<?php asset_url('js/jquery.js'); ?>" type="text/javascript"></script>

	<!-- Analytics Code -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-68872992-1', 'auto');
		ga('send', 'pageview');
	</script>

  <script>
    $(document).on('click', 'a[href^="/don"]', function(e) {
      var event, url;

      // ensure exact match because we only did a prefix match
      if (this.pathname !== '/don') {
        return
      }

      event = {
        hitType: 'event',
        eventCategory: 'Engagement',
        eventAction: 'don'
      }

      if  (this.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        // page will not open in this tab, no callback required
      }
      else {
        // cancel new page load and resume after event sent
        e.preventDefault()
        url = this.href
        event.hitCallback = function() {
          window.location = url
        }
      }

      ga('send', event);
    })
</script>

</head>

<body <?php body_class(); ?>>

	<header id="site-header" role="banner"
		<?php if ( has_post_thumbnail() ): ?>
			style="background-image: url(<?php echo the_post_thumbnail_url(); ?>);background-position: <?php echo $custom_fields['alignement_photo'][0]; ?>"
		<?php endif ?>
	>
		<div id="site-header-fixed">
			<a id="site-header-logo" href="/">
				<img src="<?php asset_url('img/logo-entourage-orange.png'); ?>" alt="Logo de l'association Entourage" title="Association Entourage"/>
			</a>
			<div id="site-header-nav">
				<a id="site-header-nav-mobile"><i class="material-icons">menu</i></a>
				<?php echo get_post(178)->post_content; ?>
			</div>
			<div id="site-header-right">
				<?php if ( $custom_fields['bouton_2'] ): ?>
					<a href="<?php echo $custom_fields['lien_2'][0] ?>"><?php echo $custom_fields['bouton_2'][0] ?></a>
				<?php endif ?>
				<?php if ( $custom_fields['bouton'] ): ?>
					<a class="btn" href="<?php echo $custom_fields['lien'][0]?: '#section-call-to-action' ?>"><?php echo $custom_fields['bouton'][0] ?></a>
				<?php elseif ( $custom_fields['bouton_orange'] ): ?>
					<a class="btn orange-btn" href="<?php echo $custom_fields['lien'][0]?: '#section-call-to-action' ?>"><?php echo $custom_fields['bouton_orange'][0] ?></a>
				<?php endif ?>
				<a id="header-download-btn" class="btn orange-btn" href="<?php echo $download_btn_link ?>"><?php echo $download_btn_text ?></a>
			</div>
			<?php if ($wp_query->post->ID != 417): ?>
				<a id="donate-btn" href="/don" target="_blank">
					<i class="material-icons">favorite</i>
					<span><?php echo get_option('donate_text'); ?></span>
				</a>
			<?php endif ?>
		</div>

		<div id="site-header-title">
			<h1><?php echo $custom_fields['titre'][0] ?></h1>

			<?php if ( $custom_fields['sous_titre'] ): ?>
				<h2><?php echo $custom_fields['sous_titre'][0] ?></h2>
			<?php endif ?>

			<?php if ( is_front_page() ): ?>
				<div id="site-header-search">
					<input id="site-header-input" type="text" placeholder="<?php echo $custom_fields['recherche'][0] ?>"/>
					<a id="ask-location" class="material-icons" title="Partager automatiquement ma position">my_location</a>
				</div>
			<?php endif ?>

			<?php if ( $custom_fields['sous_sous_titre'] ): ?>
				<div class="orange-band">
					<h3><?php echo $custom_fields['sous_sous_titre'][0] ?></h3>
				</div>
			<?php endif ?>
		</div>

	</header>

	<div id="entourage-window"></div>

	<div id="site-content">
