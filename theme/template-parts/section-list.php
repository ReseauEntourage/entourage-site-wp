<?php
/**
 * The template part for displaying section with "text" type
 *
 */

	$custom_fields = get_post_custom(get_the_ID());
?>

<?php $blurclass = empty($custom_fields['blur']) ? '' : 'blur' ?>

<section <?php post_class($blurclass.' bg-'.$custom_fields['couleur_fond'][0]); ?>>
	<header>

	<h3 class="section-title"><?php the_custom_html_title(); ?></h3>
	<div class="section-content">
		<?php the_custom_html_content(); ?>
	</div>
	</header>

	<style type="text/css">

<?php if ( has_post_thumbnail() ): ?>
	<?php $alignement = empty($custom_fields['alignement_photo']) ? 'center' : $custom_fields['alignement_photo'][0] ?>

	.section.blur {
	  background: url(<?php echo the_post_thumbnail_url(); ?>);
	  background-position: <?php echo $alignement; ?>;
	  background-attachment: fixed;
	  background-size: cover;
	  height: 500px;
	  position: relative;
	  overflow: hidden;
	}
	.section.blur > header {
	  background: inherit;
	}
	.section.blur > header::before {
	  content: "";
	  position: absolute;
	  top: 0;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  margin: auto;
	  width: 810px;
	  height: 100%;
	  background: inherit;
	  background-attachment: fixed;
	  -webkit-filter: blur(8px);
	  filter: blur(8px);
	}
	.section.blur > header > h1, .section.blur > header > .section-title, .section.blur > header > .section-content {
	  margin: 0;
	  color: white;
	  position: relative;
	  z-index: 1;
	}
	.section.blur > header > .section-content .highlight-word {
		text-shadow: none;
	}
<?php endif ?>

		section.section.section_type-list div.section-content {
		    width: 810px;
		    margin: auto;
	    }

		section.section.section_type-list ul {
			display: inline-block;
			margin-top: 10px;
			font-size: 16px;
			text-align: left;
		}

		section.section.section_type-list li {
			margin-top: 20px;
		    line-height: 33px;
		}

		section.section.section_type-list li:not(.list-style-none):before {
			display: inline-block;
			content: '';
			width: 7px;
			height: 7px;
			background: #333;
			margin-right: 10px;
		}

		section.section.section_type-list hr {
			opacity: 0;
			margin: 0;
		}

		section.section.section_type-list li img.alignleft {
	    	float: left;
	    	width: 80px;
	    	margin-right: 20px;
	    }

		@media screen and (max-width: 900px) {
			section.section.section_type-list b.highlight-word {
				max-width: 260px;
				margin-bottom: 6px;
			}

			section.section.section_type-list li {
			    line-height: 25px;
			}
		}

	</style>
</section>
