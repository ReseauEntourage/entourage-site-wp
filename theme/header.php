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
	$download_btn_text = $custom_fields_home['bouton_orange'][0];
	$download_btn_link = $custom_fields_home['lien'][0];
	$custom_fields_downloads = get_post_custom('20');
?>


<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MQRM8TN');</script>
  <!-- End Google Tag Manager -->
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
    <meta property="og:image" content="<?php if (!empty($custom_fields['facebook_image'])) echo $custom_fields['facebook_image'][0]; else asset_url('img/share-fb-2.png'); ?>">
    <meta property="og:description" content="<?php echo $og_description; ?>">
    <meta property="fb:app_id" content="280727035774134">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="google-site-verification" content="6EHu9r95V7L27wF49pEYrAovlGC0JPlECZ93h90Z0l0" />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Roboto:300,500,100,300italic' rel='stylesheet' type='text/css'>
	<script src="<?php asset_url('js/lib/jquery.js'); ?>" type="text/javascript"></script>

  <!-- Global Site Tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-68872992-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-68872992-1', {
      'linker': {
        'domains': [
          'www.entourage.social',
          'effet.entourage.social',
          'don.entourage.social',
          'entourage.iraiser.eu'
        ]
      }
    });
  </script>

	<script src='https://www.google.com/recaptcha/api.js'></script>
	<?php wp_head(); ?>
	<link rel="stylesheet" href="<?php asset_url('css/style.css'); ?>">
	<link rel="stylesheet" href="<?php asset_url('css/custom-pages.css'); ?>">
	<link rel="stylesheet" href="<?php asset_url('css/responsive.css'); ?>">
	<link rel="stylesheet" href="<?php asset_url('css/woocommerce.css'); ?>">
</head>

<body id="page-<?php echo get_post_field( 'post_name', get_post() ) ?>" <?php body_class( true ? "" : "show-banner-top"); ?>>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQRM8TN"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

	<header id="site-header" role="banner"
		<?php if ( has_post_thumbnail() ): ?>
			style="background-image: url(<?php echo the_post_thumbnail_url(); ?>);background-position: <?php echo $custom_fields['alignement_photo'][0]; ?>"
		<?php endif ?>
		>
		<div id="banner-app-download">
			<i class="close material-icons">close</i>
			<div class="app-picture">
				<img src="<?php asset_url('img/logo-entourage-app.jpg'); ?>" alt="Logo de l'application Entourage" title="Téléchargez l'application Entourage, réseau solidaire">
			</div>
			<div class="app-details">
				<strong class="app-name">Entourage</strong>
				<img class="app-rating" src="<?php asset_url('img/rating-stars.png'); ?>">
				<span class="app-downloads">Plus de 50.000 téléchargements</span>
			</div>
			<?php
				echo sprintf( '<a class="app-download-btn iphone-btn" href="%s">Télécharger</a>', link_with_url_parameters($custom_fields_downloads['lien_ios'][0], $_SERVER['QUERY_STRING']));
				echo sprintf( '<a class="app-download-btn android-btn" href="%s">Télécharger</a>', link_with_url_parameters($custom_fields_downloads['lien_android'][0], $_SERVER['QUERY_STRING']));
			?>
		</div>

		<div id="site-header-fixed">
			<a id="site-header-logo" href="/">
				<img src="<?php asset_url('img/logo-entourage-orange.png'); ?>" alt="Logo de l'association Entourage" title="Association Entourage"/>
			</a>
			<div id="site-header-nav">
				<a id="site-header-nav-mobile">
					<i class="material-icons">menu</i>
					<i class="material-icons close">close</i>
				</a>
				<?php echo get_post(178)->post_content; ?>
			</div>
			<div id="site-header-right">
				<?php if ( $custom_fields['bouton_2'] ): ?>
					<a class="link no-mobile" href="<?php echo $custom_fields['lien_2'][0] ?>"><?php echo $custom_fields['bouton_2'][0] ?></a>
				<?php endif ?>
        <?php if ( $custom_fields['don'] ): ?>
          <a class="btn orange-btn no-mobile" href="<?php echo get_option('donate_link'); ?>">
            <?php echo $custom_fields['don'][0] ?>
          </a>
				<?php elseif ( $custom_fields['bouton'] ): ?>
					<a class="btn no-mobile" href="<?php echo $custom_fields['lien'][0]?: '#section-call-to-action' ?>">
						<?php echo $custom_fields['bouton'][0] ?>
					</a>
				<?php elseif ( $custom_fields['bouton_orange'] ): ?>
					<a class="btn orange-btn no-mobile" href="<?php echo $custom_fields['lien'][0]?: '#section-call-to-action' ?>">
						<?php echo $custom_fields['bouton_orange'][0] ?>
					</a>
				<?php else: ?>
					<!--a id="header-download-btn" class="btn orange-btn iphone-btn" href="<?php echo link_with_url_parameters($custom_fields_downloads['lien_ios'][0], $_SERVER['QUERY_STRING']) ?>"><?php echo $download_btn_text ?></a>
					<a id="header-download-btn" class="btn orange-btn android-btn" href="<?php echo link_with_url_parameters($custom_fields_downloads['lien_android'][0], $_SERVER['QUERY_STRING']) ?>"><?php echo $download_btn_text ?></a-->
					<a class="btn orange-btn header-download-btn web-app-link-tracker no-mobile" title="Ouvrir la carte des actions du réseau solidaire Entourage" href="<?php echo get_option('open_app_link'); ?>" target="_blank" ga-event="Engagement AppView Header">
						<i class="material-icons"><?php echo get_option('open_app_icon'); ?></i><?php echo get_option('open_app_text'); ?>
					</a>
				<?php endif ?>
        <?php if ( $custom_fields['don'] ): ?>
          <a class="btn orange-btn header-download-btn mobile-only" href="<?php echo get_option('donate_link'); ?>">
            <?php echo $custom_fields['don'][0] ?>
          </a>
        <?php else: ?>
          <a class="btn orange-btn header-download-btn mobile-only" title="Ouvrir la carte des actions du réseau solidaire Entourage" href="<?php echo get_option('open_app_link'); ?>" ga-event="Engagement AppView Header">
            <i class="material-icons"><?php echo get_option('open_app_icon'); ?></i><?php echo get_option('open_app_text_mobile'); ?>
          </a>
        <?php endif ?>
      </div>
		</div>

		<!--<?php if ($wp_query->post->ID != 417): ?>
			<div id="banner-top">
				<div id="heart" class="no-mobile"><i class="material-icons">favorite</i></div>
				<span class="no-mobile">Pour Noël, réchauffons le coeur des sans-abri</span>
				<span class="mobile-only">#LeDonDeChaleurHumaine</span>
				<a class="btn white-btn" href="/le-don-de-chaleur-humaine?src=banner">Je fais un don</a>
			</div>
		<?php endif ?>-->

		<div id="site-header-title">
			<h1><?php echo $custom_fields['titre'][0] ?></h1>

			<?php if ( $custom_fields['sous_titre'] ): ?>
				<h2><?php echo $custom_fields['sous_titre'][0] ?></h2>
			<?php endif ?>

			<?php if ( is_front_page() ): ?>
				<div id="site-header-search">
					<input id="site-header-input" type="text" placeholder="<?php echo $custom_fields['recherche'][0] ?>"/>
					<a id="ask-location" class="btn orange-btn" title="Rechercher les actions de mes voisins" ga-event="Engagement AppView Search">
						<i class="material-icons">search</i>
					</a>
					<div id="cities-example">
						Ex :
						<a href="/app/?ville=Paris,%20France" target="_blank" ga-event="Engagement AppView Search">Paris</a>,
						<a href="/app/?ville=Lyon,%20France" target="_blank" ga-event="Engagement AppView Search">Lyon</a>,
						<a href="/app/?ville=Lille,%20France" target="_blank" ga-event="Engagement AppView Search">Lille</a>,
						<a href="/app/?ville=Grenoble,%20France" target="_blank" ga-event="Engagement AppView Search">Grenoble</a>
					</div>
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
