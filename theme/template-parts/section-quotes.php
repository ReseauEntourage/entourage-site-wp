<?php
/**
 * The template part for displaying section with "quotes" type
 *
 */

	$query = new WP_Query([
		'post_type' => 'quote',
	    'section_page' => $wp_query->post->post_name,
	    'orderby' => 'menu_order',
	    'order' => 'ASC',
	    'posts_per_page' => 3,
	]);

?>

<section <?php post_class('bg-'.$custom_fields['couleur_fond'][0]); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<ul class="section-quotes-list">
		<?php 
		while ( $query->have_posts() ) : $query->the_post();
			$custom_fields = get_post_custom(get_the_ID());
		?>
			<li class="section-quote">
				<div class="quote-content">
					<?php the_content(); ?>
				</div>
				<div class="quote-author">
					<b class="quote-author-name"><?php the_title(); ?></b>
					<span class="quote-author-details"><?php echo $custom_fields['details'][0]; ?></span>
				</div>
				<?php if ( has_post_thumbnail() ): ?>
					<img class="quote-author-picture" src="<?php echo the_post_thumbnail_url(); ?>"/>
				<?php endif; ?>
			</li>
		<?php endwhile; ?>
	</ul>
</section>

<style type="text/css">

	section.section.section_type-quotes ul.section-quotes-list {
	    font-size: 0;
	}

	section.section.section_type-quotes li.section-quote {
	    position: relative;
		display: inline-block;
		width: 270px;
		height: 270px;
		margin-right: 60px;
	    vertical-align: top;
	    background: #fff;
		box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-quotes li.section-quote:last-child {
		margin-right: 0;
	}

	section.section.section_type-quotes li.section-quote:after {
		position: absolute;
	    bottom: 50px;
    	left: 80px;
		content: '';
		width: 26px;
		height: 21px;
		background: url(/wp-content/themes/entourage/img/sprite-main.png) -56px -3px;
		background-size: 250px;
	}

	section.section.section_type-quotes li.section-quote:last-child:after {
    	left: inherit;
    	right: 80px;
    	-ms-transform: rotateX(180deg);
	    -webkit-transform: rotateX(180deg);
	    transform: rotateX(180deg);
	}

	section.section.section_type-quotes div.quote-content {
		position: relative;
		padding: 23px 36px 0;
	    font-size: 16px;
        line-height: 23px;	
		text-align: justify;
	}

	section.section.section_type-quotes div.quote-content p {
		overflow: hidden;
		max-height: 164px;
	}

	section.section.section_type-quotes div.quote-content:before,
	section.section.section_type-quotes div.quote-content:after {
		content: '"';
		font-family: 'KG';
		display: block;
		font-size: 68px;
		color: #ff5100;
	    position: absolute;
	    line-height: 0;
        font-weight: 200;
	}

	section.section.section_type-quotes div.quote-content:before {
        top: 9px;
    	left: 10px;
		-ms-transform: rotate(180deg);
	    -webkit-transform: rotate(180deg);
	    transform: rotate(180deg);
	}

	section.section.section_type-quotes div.quote-content:after {
		bottom: -12px;
		right: 10px;
	}

	section.section.section_type-quotes div.quote-author {
	    position: absolute;
	    bottom: 18px;
	    right: 20px;
		font-size: 0;
	    text-align: right;
	}

	section.section.section_type-quotes li.section-quote:last-child div.quote-author {
		bottom: 18px;
	    left: 20px;
	    right: inherit;
	    max-width: 155px;	
		text-align: left;
	}

	section.section.section_type-quotes b.quote-author-name {
	    display: block;
	    font-size: 15px;
	    font-weight: 500;
	}

	section.section.section_type-quotes span.quote-author-details {
		font-size: 12px;
		color: #b3b2b2;
	}

	section.section.section_type-quotes img.quote-author-picture {
		position: absolute;
	    bottom: 0;
	    left: 0;
	    max-width: 75px;
	    max-height: 75px;
	}

	section.section.section_type-quotes li.section-quote:last-child img.quote-author-picture {
	    left: inherit;
	    right: 0;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-quotes ul.section-quotes-list {
			text-align: center;
		}

		section.section.section_type-quotes li.section-quote {
			display: block;
			margin: 0 auto 20px;
		}

		section.section.section_type-quotes li.section-quote:last-child {
			margin-bottom: 0;
			margin-right: auto;
		}
	}

</style>
