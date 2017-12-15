<?php
/**
 * The template part for displaying section with "orange" type
 *
 */

	$query = new WP_Query([
		'post_type' => 'contact',
	    'section_page' => $wp_query->post->post_name,
	]);

	$custom_fields = get_post_custom(get_the_ID());
?>

<section <?php post_class(); ?> id="section-call-to-action">
	<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
		<?php if ($custom_fields['bouton']): ?>
			<a href="<?php echo $custom_fields['lien'][0]; ?>" class="btn white-btn"><?php echo $custom_fields['bouton'][0]; ?></a>
		<?php endif; ?>
		<?php
		while ( $query->have_posts() ) : $query->the_post();
			$custom_fields = get_post_custom(get_the_ID());
		?>
			<div class="section-contact">
				<p>Pour tout renseignement, <?php the_title(); ?> se tient à disposition :</p>
				<div class="section-contact-details">
					<div class="section-contact-picture" style="background-image: url(<?php echo the_post_thumbnail_url(); ?>);"></div>
					<ul>
						<?php if ($custom_fields['email']): ?>
							<li>
								<a href="mailto:<?php echo $custom_fields['email'][0]; ?>"><i class="material-icons">email</i><?php echo $custom_fields['email'][0]; ?></a>
							</li>
						<?php endif; ?>
						<?php if ($custom_fields['telephone']): ?>
							<li>
								<a href="tel:<?php echo $custom_fields['telephone'][0]; ?>"><i class="material-icons">phone</i><?php echo $custom_fields['telephone'][0]; ?></a>
								</li>
						<?php endif; ?>
					</ul>
				</div>
			</div>
		<?php endwhile; ?>
	</div>
</section>

<style type="text/css">

	section.section.section_type-orange {
		background-color: #ff5100;
		color: #FFF;
	}

	section.section.section_type-orange .section-content {
		position: relative;
		width: 600px;
		margin: auto;
		font-weight: 300;
	}

	section.section.section_type-orange h3.section-title {
		color: #FFF;
	}

	section.section.section_type-orange a:not(.btn) {
		color: #fff;
	}

	section.section.section_type-orange a.btn {
		padding: 0 30px;
		margin-right: 10px;
	    height: 43px;
    	line-height: 43px;
	 	font-weight: 600;
    	font-size: 16px;
	    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-orange p + a.btn {
		margin-top: 30px;
	}

	section.section.section_type-orange a.btn:last-child {
		margin-right: 0;
	}

	section.section.section_type-orange p + div.section-contact,
	section.section.section_type-orange .btn + div.section-contact {
		margin-top: 30px;
	}

	section.section.section_type-orange div.section-contact-details {
		display: inline-block;
    	margin-top: 20px;
    	padding: 15px;
    	font-size: 0;
	    background: #e84d04;
	    border-radius: 3px;
	}

	section.section.section_type-orange div.section-contact-details div.section-contact-picture {
		display: inline-block;
		width: 63px;
		height: 63px;
		margin-right: 10px;
		background-size: cover;
		border-radius: 100%;
		vertical-align: top;
	}

	section.section.section_type-orange div.section-contact-details ul {
		display: inline-block;
		font-size: 18px;
    	font-weight: bold;
    	vertical-align: top;
    	text-align: left;
	}

	section.section.section_type-orange div.section-contact-details ul li {
		line-height: 31px;
	}

	section.section.section_type-orange div.section-contact-details i.material-icons {
		margin-right: 10px;
		font-size: 21px;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-orange blockquote:before,
		section.section.section_type-orange blockquote:after {
			display: none;
		}

		section.section.section_type-orange div.section-contact-details ul {
			    font-size: 15px;
		}

		section.section.section_type-orange div.section-contact-details {
		    padding: 10px;
		}
	}

</style>
