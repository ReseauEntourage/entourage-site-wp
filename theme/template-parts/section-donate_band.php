<?php
/**
 * The template part for displaying section with "black_band" type
 *
 */

	$custom_fields = get_post_custom(get_post()->ID);
?>

<section <?php post_class(); ?>>
	<div class="section-content">
		<?php if ( $custom_fields['icone'] ): ?>
			<i class="material-icons"><?php echo $custom_fields['icone'][0] ?></i>
		<?php endif ?>
		<?php the_content(); ?>
		<?php if ($custom_fields['bouton']): ?>
			<a href="<?php echo $custom_fields['lien'][0]; ?>" class="btn white-btn"><?php echo $custom_fields['bouton'][0]; ?></a>
		<?php endif; ?>
	</div>
</section>

<style type="text/css">

	section.section_type-donate_band {
		padding-bottom: 0;
		background: #f11616;
		color: #FFF;
		text-align: left;
	}

	section.section_type-donate_band .section-content {
	    display: flex;
		padding: 21px 0;
		width: 810px;
		margin: auto;
	    align-items: center;
	}

	section.section_type-donate_band p {
	    display: inline-block;
	    vertical-align: middle;
        margin: 0 20px;
	}

	section.section_type-donate_band i.material-icons {
	    font-size: 40px;	
	}

	section.section_type-donate_band a.btn {
		vertical-align: middle;
	    font-weight: bold;
	    color: #f11616;
		flex-shrink: 0;
	}

	@media screen and (max-width: 900px) {
		section.section_type-donate_band .section-content {
			display: block;
		    text-align: center;	
		}

		section.section_type-donate_band i.material-icons {
			display: block;
			margin-right: 0px;
			text-align: center;
		    font-size: 26px;
		}

		section.section_type-donate_band p {
		    margin: 10px 0 20px 0;
		}

		section.section_type-donate_band a.btn {
			display: block;
		    margin: 0 30px;
		}
	}

</style>