<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 */

get_header(); ?>

<section class="section section_type-products bg-gris">

	<?php if ( woocommerce_product_loop() ) : ?>

		<?php if ( wc_get_loop_prop( 'total' ) ) : ?>

			<h3 class="section-title">La boutique</h3>

			<ul class="product-list">
				<?php while ( have_posts() ) : ?>
					<?php the_post(); ?>
					<?php wc_get_template_part( 'content', 'product' ); ?>
				<?php endwhile; ?>
			</ul>

		<?php else : ?>
			<div class="clearfix">
				<a class="btn btn-back" href="/boutique">
					<i class="material-icons">arrow_back</i> Retour à la boutique
				</a>
				<?php while ( have_posts() ) : the_post(); ?>
					<?php wc_get_template_part( 'content', 'single-product' ); ?>
				<?php endwhile; ?>
			</div>

		<?php endif; ?>

	<?php endif; ?>

</section>

<?php get_footer();?>
