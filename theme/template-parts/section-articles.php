<?php
/**
 * The template part for displaying section with "team" type
 *
 */

	$post_type = wp_get_post_terms(get_the_ID(), ['section_type'])[1]->slug;

	$query = new WP_Query([
		'post_type' => 'article',
	    'orderby' => 'date',
	    'order' => 'DESC',
	]);
?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<ul class="section-article-list">
			<?php 
			while ( $query->have_posts() ) : $query->the_post();
				$item_custom_fields = get_post_custom(get_the_ID());
			?>
				<li class="section-article">
					<h3 class="section-article-author"><?php echo $item_custom_fields['details'][0]; ?></h3>
					<span class="section-article-date"><?php the_date(); ?></span>
					<h2 class="section-article-title"><?php echo  the_title(); ?></h2>
					<article>
						<?php the_content(); ?>
					</article>
					<?php if ( $item_custom_fields['lien'] ): ?>
						<a class="section-article-link" href="<?php echo $item_custom_fields['lien'][0]; ?>" target="_blank">Lire la suite</a>
					<?php endif; ?>
				</li>
			<?php endwhile;
			?>
		</ul>
	</div>

</section>

<style type="text/css">

	section.section_type-articles div.section-content {
	    width: 810px;
	    margin: auto;
	    text-align: left;
    }

    section.section_type-articles div.section-content li.section-article {
    	position: relative;
		display: inline-block;
		margin-bottom: 20px;
		padding: 20px 30px 20px 75px;
		font-size: 16px;
	  	box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
	  	text-align: left;
	  	background: #FFF;
    }

    section.section_type-articles div.section-content h3.section-article-author {
    	display: inline-block;
    	font-size: 16px;
    	font-weight: bold;
    	color: #ff5100;
    	margin-right: 20px;
    }

    section.section_type-articles div.section-content span.section-article-date {
    	font-size: 12px;
    	color: #c3c3c3;
    }

    section.section_type-articles div.section-content h2.section-article-title {
    	font-size: 16px;
    	font-weight: bold;
    	text-transform: uppercase;
    	margin: 20px 0 15px;
    }

    section.section_type-articles div.section-content a.section-article-link {
    	display: inline-block;
    	margin-top: 20px;
    	text-decoration: underline;
    }

</style>
