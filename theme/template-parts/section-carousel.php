<?php
/**
 * The template part for displaying section with "carousel" type
 *
 */

	$section_types = wp_get_post_terms(get_the_ID(), ['section_type']);
	foreach ($section_types as $section) {
		if ($section->parent)
			$post_type = $section->slug;
	}

	$query = new WP_Query([
		'post_type' => $post_type,
	    'orderby' => 'menu_order',
	    'order' => 'ASC',
	]);

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class() ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<ul class="section-carousel-list">
		<?php
		$i = 0;
		while ( $query->have_posts() ) : $query->the_post();
			$item_custom_fields = get_post_custom(get_the_ID());
		?>
			<li class="carousel-item">
				<a class="carousel-item-picture"
					<?php if (!empty($item_custom_fields['lien'][0])): ?>
						href="<?php echo $item_custom_fields['lien'][0]; ?>"
						target="_blank"
					<?php elseif (is_front_page() && $post_type == 'partner'): ?>
						href="<?php echo get_page_link(115).'?id='.$i; ?>"
					<?php endif; ?>>
					<div>
						<img src="<?php echo the_post_thumbnail_url(); ?>"/>
					</div>
				</a>
			</li>
		<?php
			$i += 1;
			endwhile;
		?>
	</ul>
	<?php if (is_front_page() && $post_type == 'partner'): ?>
		<a href="<?php echo get_page_link(115); ?>" class="link"><?php echo $custom_fields['bouton'][0]; ?></a>
	<?php endif; ?>

	<?php if (isset($carouselWithDetails)): ?>
		<ul class="section-carousel-details">
			<?php 
			while ( $query->have_posts() ) : $query->the_post();
				$item_custom_fields = get_post_custom(get_the_ID());
			?>
				<li class="carousel-detail">
					<a class="close">X Fermer</a>
					<h4><?php the_title(); ?></h4>
					<?php the_content(); ?>
				</li>
			<?php endwhile;
			?>
		</ul>

	<?php endif; ?>

</section>


<?php if ($carouselWithDetails): ?>
	<script src="<?php echo get_template_directory_uri(); ?>/js/carousel.js" type="text/javascript"></script>
<?php endif; ?>

<style type="text/css">

	section.section.section_type-carousel {
	    background: #ebebeb;
	    overflow: hidden;
	}

	section.section.section_type-carousel.section-carousel-with-details {
		position: relative;
		background: #fff;
		padding-bottom: 0;
	}

	section.section.section_type-carousel ul.section-carousel-details {
		position: absolute;
	    top: 100px;
	    width: 400px;
	    min-height: 100px;
		margin: 0px;
		z-index: 1000;
		background-color: #ebebeb;
	}

	section.section.section_type-carousel ul.section-carousel-list {
	    font-size: 0;
	}

	section.section.section_type-carousel ul.carousel-oneline {
		width: 20000px;
		text-align: left;
	}

	section.section.section_type-carousel li.carousel-detail {
		display: none;
		position: relative;
		padding: 60px 150px;
		text-align: left;
		font-size: 16px;
	}

	section.section.section_type-carousel li.carousel-detail a.close {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	section.section.section_type-carousel li.carousel-detail h4 {
		margin-bottom: 30px;
		font-size: 30px;
		text-transform: uppercase;
		word-break: break-word;
	}

	section.section.section_type-carousel li.carousel-item {
	    position: relative;
		display: inline-block;
		width: 180px;
		height: 150px;
		margin-left: 30px;
		margin-bottom: 30px;
		text-align: center;
	    vertical-align: top;
	    background: #fff;
		box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
		transition: box-shadow 0.3s;
	}

	section.section.section_type-carousel li.carousel-item.selected,
	section.section.section_type-carousel li.carousel-item:hover {
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-carousel li.carousel-item.selected:before {
		content: '';
		position: absolute;
	    bottom: -33px;
	    left: 70px;
	    border-style: solid;
	    border-width: 0 24px 18px 24px;
		border-color: transparent transparent #ebebeb transparent;
	}

	section.section.section_type-carousel li.carousel-item a {
    	display: table;
	    cursor: pointer;
	}

	section.section.section_type-carousel li.carousel-item a > div {
    	display: table-cell;
	    vertical-align: middle;
	    width: 180px;
		height: 150px;
	}

	section.section.section_type-carousel li.carousel-item a img {
        max-width: 90%;
        max-height: 90%;
	}

	section.section.section_type-carousel a.link {
	    margin-top: 30px;
	    margin-bottom: -30px;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-carousel ul.carousel-oneline {
			width: 100%;
			text-align: center;
			margin-left: 0px !important;
		}

		section.section.section_type-carousel li.carousel-item {
			display: block;
			margin: 0 auto 20px;
		}

		section.section.section_type-carousel li.carousel-item:last-child {
			margin-bottom: 0px;
		}

		section.section.section_type-carousel a.link {
		    margin-left: 17px;
		}

		section.section.section_type-carousel li.carousel-item.selected:before {
			display: none;
		}

		
	}

</style>