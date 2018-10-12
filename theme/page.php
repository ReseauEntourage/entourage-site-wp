<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 */

get_header(); 

	$query = new WP_Query([
		'post_type' => 'section',
	    'section_page' => get_post()->post_name,
	    'orderby' => 'menu_order',
	    'order' => 'ASC',
	]);

	if ($query->have_posts()) {
		while ( $query->have_posts() ) : $query->the_post();
			$section_types = wp_get_post_terms(get_the_ID(), ['section_type']);
			foreach ($section_types as $section) {
				if (!$section->parent || !isset($section_type))
					$section_type = $section->slug;
			}
			get_template_part( 'template-parts/section', $section_type ?: 'text' );
		endwhile;
	}
	elseif (have_posts()) {
		while ( have_posts() ) : the_post();
			the_content();
		endwhile;
	}

get_footer();

?>
