<?php
/**
 * The template part for displaying section with "team" type
 *
 */

	$post_type = wp_get_post_terms(get_the_ID(), ['section_type'])[1]->slug;

	$query = new WP_Query([
		'post_type' => 'team',
		'team_type' => $post_type,
	    'orderby' => 'menu_order',
	    'order' => 'ASC',
	]);
?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<div class="section-content"><?php the_content(); ?></div>
	<ul class="section-list">
		<?php 
		while ( $query->have_posts() ) : $query->the_post();
			$item_custom_fields = get_post_custom(get_the_ID());
		?>
			<li class="list-item">
				<div class="list-item-picture" style="background-image: url(<?php echo the_post_thumbnail_url(); ?>);"></div>
				<div class="list-item-details">
					<strong><?php the_title(); ?></strong>
					<?php echo $item_custom_fields['details'][0]; ?>
				</div>
			</li>
		<?php endwhile;
		?>
	</ul>

</section>

<style type="text/css">

	
	section.section.section_type-team {
		width: 800px;
		padding-bottom: 0;
	}

	section.section.section_type-team ul.section-list {
	    margin-top: 45px;
	}

	section.section.section_type-team li.list-item {
		display: inline-block;
		width: 210px;
		margin-right: 30px;
		margin-bottom: 30px;
		vertical-align: top;
	    background: #fff;
		box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-team li.list-item:nth-child(3n) {
		margin-right: 0;
	}

	section.section.section_type-team li.list-item div.list-item-picture {
		height: 210px;
		background-size: cover;
	}

	section.section.section_type-team li.list-item div.list-item-details {
		padding: 10px;
		background-size: cover;
		font-size: 11px;
		color: #b3b2b2;
	}

	section.section.section_type-team li.list-item div.list-item-details strong {
		display: block;
		font-size: 14px;
		color: #333;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-team ul.section-list {
			text-align: center;
		}

		section.section.section_type-team li.list-item {
			display: block;
			margin: 0 auto 20px;
		}

		section.section.section_type-team li.list-item:last-child {
			margin-bottom: 0;
			margin-right: auto;
		}
	}

</style>
