<?php
/**
 * The template part for displaying section with "orange" type
 *
 */

	$query = new WP_Query([
		'post_type' => 'contact',
	    'section_page' => $wp_query->post->post_name,
	]);

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
		<a href="<?php echo link_with_url_parameters($custom_fields['lien'][0], $_SERVER['QUERY_STRING']); ?>" class="btn white-btn"><?php echo $custom_fields['bouton'][0]; ?></a>
		<img class="section-character" src="/wp-content/themes/entourage/img/character-1.png" />
	</div>
</section>

<style type="text/css">

	section.section.section_type-simple_comme_bonjour {
		margin-top: -4px;
	    padding-bottom: 40px;
	    background: url(/wp-content/themes/entourage/img/bg-simple-comme-bonjour.jpg);
	    background-size: cover;
		background-color: #ff5100;
		color: #FFF;
	}

	section.section.section_type-simple_comme_bonjour .section-content {
		position: relative;
		width: 600px;
		margin: auto;
		font-weight: 300;
	}

	section.section.section_type-simple_comme_bonjour .btn {
		margin-top: 30px;
		padding: 0 30px;
		width: 215px;
		height: 53px;
		line-height: 53px;
		color: #333333;
		font-family: 'KG';
		font-weight: 600;
		font-size: 24px;
		background: url(/wp-content/themes/entourage/img/sprite-main.png);
		background-position: 0 -88px;
		background-size: 250px;
	}

	section.section.section_type-simple_comme_bonjour .section-character {
		width: 199px;
		position: absolute;
	    bottom: -40px;
	    left: -200px;
	}

	section.section.section_type-simple_comme_bonjour h3.section-title {
		color: #FFF;
	}

	section.section.section_type-simple_comme_bonjour blockquote {
	    position: relative;
		text-transform: uppercase;
		font-size: 16px;
		font-weight: 600;
	}

	section.section.section_type-simple_comme_bonjour blockquote:before,
	section.section.section_type-simple_comme_bonjour blockquote:after {
		content: '"';
		font-family: 'KG';
		display: block;
		font-size: 98px;
		color: #171717;
	    position: absolute;
	    line-height: 0;
        font-weight: 200;
	}

	section.section.section_type-simple_comme_bonjour blockquote:before {
		top: -20px;
	    left: -30px;
		-ms-transform: rotate(180deg);
	    -webkit-transform: rotate(180deg);
	    transform: rotate(180deg);
	}

	section.section.section_type-simple_comme_bonjour blockquote:after {
		bottom: -20px;
		right: -30px;
	}

	
	@media screen and (max-width: 900px) {
		section.section.section_type-simple_comme_bonjour blockquote:before,
		section.section.section_type-simple_comme_bonjour blockquote:after,
		section.section.section_type-simple_comme_bonjour .section-character {
			display: none;
		}
	}

</style>
