<?php
/**
 * The template part for displaying section with "text" type
 *
 */

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class('bg-'.$custom_fields['couleur_fond'][0]); ?>>
	<?php if (empty($custom_fields['masquer_titre'])): ?>
		<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<?php endif; ?>
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

	    section.section_type-text div.section-content h1 {
	    	font-size: 1.5em;
	    }

	    section.section_type-text div.section-content h2 {
	    	font-size: 1.4em;
	    }

	    section.section_type-text div.section-content h3 {
	    	font-size: 1.3em;
	    }

	    section.section_type-text div.section-content h4 {
	    	font-size: 1.2em;
	    }

	    section.section_type-text div.section-content h5 {
	    	font-size: 1.1em;
	    }

	    section.section_type-text div.section-content h1,
	    section.section_type-text div.section-content h2,
	    section.section_type-text div.section-content h3,
	    section.section_type-text div.section-content h4,
	    section.section_type-text div.section-content h5,
		section.section_type-text div.section-content h6 {
			font-weight: bold;
			margin: 40px 0 20px 0;
		}

		section.section_type-text div.section-content h1 a,
	    section.section_type-text div.section-content h2 a,
	    section.section_type-text div.section-content h3 a,
	    section.section_type-text div.section-content h4 a,
	    section.section_type-text div.section-content h5 a,
		section.section_type-text div.section-content h6 a {
			color: inherit;
			text-decoration: underline;
		}


		section.section_type-text div.section-content ul {
			margin-bottom: 20px;
			list-style: disc;
		  	margin-left: 20px;
		}

		section.section_type-text div.section-content ul li {
			margin-bottom: 10px;
		}

	    section.section_type-text + style + section.section_type-text h3,
	    section.section_type-quotes + style + section.section_type-text h3 {
	    	padding-top: 0;
	    }

	    img.alignleft {
	    	float: left;
	    }

	</style>

</section>
