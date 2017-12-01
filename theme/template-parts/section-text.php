<?php
/**
 * The template part for displaying section with "text" type
 *
 */

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class('bg-'.$custom_fields['couleur_fond'][0]); ?>>
	<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
	</div>

	<style type="text/css">

		section.section_type-text div.section-content {
		    width: 810px;
		    margin: auto;
		    text-align: left;
	    }

	    section.section_type-text div.section-content p {
	    	margin-bottom: 20px;
	    }

	    section.section_type-text + style + section.section_type-text h3,
	    section.section_type-quotes + style + section.section_type-text h3 {
	    	padding-top: 0;
	    }

	</style>

</section>
