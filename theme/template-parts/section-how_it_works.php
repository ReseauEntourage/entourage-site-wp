<?php
/**
 * The template part for displaying section with "how_it_works" type
 *
 */
?>

<?php $custom_fields = get_post_custom(get_post()->ID); ?>

<section id="how-it-works" <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
		<a class="btn orange-btn" href="<?php echo $custom_fields['lien'][0] ?>" ga-event="Engagement AppView SectionHowItWorks">
			<i class="material-icons"><?php echo $custom_fields['icone'][0] ?></i><?php echo $custom_fields['bouton_orange'][0] ?>
		</a>
	<div>
</section>

<style type="text/css">

	section.section.section_type-how_it_works {
		padding: 0;
	}

	section.section.section_type-how_it_works div.section-content {
		position: relative;
		margin: 70px auto 0;
		width: 803px;
		height: 450px;
		background: url(/wp-content/themes/entourage/img/bg-how-it-works.png);
		background-size: 803px;
	}

	section.section.section_type-how_it_works ol li {
		position: absolute;
		max-width: 390px;
	}

	section.section.section_type-how_it_works ol li:nth-child(1) {
	    top: -32px;
    	left: -80px;
	}

	section.section.section_type-how_it_works ol li:nth-child(2) {
		top: 108px;
		right: 50px;
	}

	section.section.section_type-how_it_works ol li:nth-child(3) {
	    top: 245px;
    	left: 70px;
	}

	section.section.section_type-how_it_works a.btn {
		position: absolute;
		top: 340px;
	    left: 190px;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-how_it_works div.section-content {
			width: 100%;
			height: inherit;
			margin-top: 0;
			margin-bottom: 40px;
			background: none;
		}

		section.section.section_type-how_it_works ol li {
		    position: relative;
		    width: 100%;
		}

		section.section.section_type-how_it_works ol li:nth-child(1),
		section.section.section_type-how_it_works ol li:nth-child(2),
		section.section.section_type-how_it_works ol li:nth-child(3) {
		    top: inherit;
	    	left: inherit;
	    	right: inherit;
		}

		section.section.section_type-how_it_works a.btn {
			position: inherit;
		    top: inherit;
		    left: inherit;
		}
	}

</style>
