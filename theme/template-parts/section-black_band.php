<?php
/**
 * The template part for displaying section with "black_band" type
 *
 */

	$custom_fields = get_post_custom(get_post()->ID);
?>

<section <?php post_class(); ?>>
	<?php if ( $custom_fields['icone'] ): ?>
		<i class="material-icons"><?php echo $custom_fields['icone'][0] ?></i>
	<?php endif ?>
	<?php the_content(); ?>
</section>

<style type="text/css">

	section.section_type-black_band {
		padding: 21px 0;	
		background: #333333;
    	font-size: 15px;
    	font-weight: 300;
		color: #FFF;
	}

	section.section_type-black_band a {
		display: block;
		font-weight: 400;
		text-decoration: underline;
	}

	section.section_type-black_band p {
		display: inline-block;
	}

	section.section_type-black_band i.material-icons {
		margin-right: 10px;
	}

	@media screen and (max-width: 900px) {
		section.section_type-black_band i.material-icons {
			display: block;
			margin-right: 0px;
			text-align: center;
		}

		section.section_type-black_band {
			padding: 15px;
			padding-bottom: 30px;
		}

		section.section_type-black_band a {
			display: block;
		}
	}

</style>