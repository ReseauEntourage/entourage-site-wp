<?php
/**
 * The template part for displaying section with "partners" type
 *
 */

	$post_type = wp_get_post_terms(get_the_ID(), ['section_type'])[1]->slug;

	$query = new WP_Query([
		'post_type' => 'partner',
		'partner_type' => $post_type,
	    'orderby' => 'menu_order',
	    'order' => 'ASC',
	]);

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class('bg-'.$custom_fields['couleur_fond'][0]); ?> >
	<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<div class="section-content"><?php the_content(); ?></div>
	<ul class="section-list">
		<?php 
		while ( $query->have_posts() ) : $query->the_post();
			$item_custom_fields = get_post_custom(get_the_ID());
		?>
			<li class="list-item">
				<a class="list-item-picture"
				<?php if (!empty($item_custom_fields['lien'][0])): ?>
					href="<?php echo $item_custom_fields['lien'][0]; ?>"
					target="_blank"
				<?php endif; ?> style="background-image: url(<?php echo the_post_thumbnail_url(); ?>);"></a>
			</li>
		<?php endwhile;
		?>
	</ul>

	<?php if (is_front_page()): ?>
		<a href="<?php echo get_page_link(115); ?>" class="link"><?php echo $custom_fields['bouton'][0]; ?></a>
	<?php endif; ?>


	<style type="text/css">

		
		section.section.section_type-partners {
			width: 960px;
			<?php if (!is_front_page()): ?>
				padding-bottom: 0;
			<?php endif; ?>
		}

		<?php if (!is_front_page()): ?>
			section.section.section_type-partners ul.section-list {
			    margin-top: 45px;
			}
		<?php endif; ?>

		section.section.section_type-partners li.list-item {
			display: inline-block;
			width: 210px;
			margin-right: 30px;
			margin-bottom: 30px;
			vertical-align: top;
		    background: #fff;
			box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
		}

		section.section.section_type-partners li.list-item:last-child {
			margin-right: 0;
		}

		section.section.section_type-partners li.list-item a.list-item-picture {
			display: block;
			height: 210px;
			background-size: 90%;
		    background-repeat: no-repeat;
		    background-position: center;
		}

		@media screen and (max-width: 900px) {
			section.section.section_type-partners ul.section-list {
				text-align: center;
			}

			section.section.section_type-partners li.list-item {
				margin-right: 0;
			}
		}

	</style>
</section>
