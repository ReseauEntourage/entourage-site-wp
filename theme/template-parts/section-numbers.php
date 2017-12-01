<?php
/**
 * The template part for displaying section with "numbers" type
 *
 */
?>

<section <?php post_class(); ?>>
	<?php the_content(); ?>
</section>

<style type="text/css">

	section.section_type-numbers {
		padding: 0;
		background: #ebebeb;
		color: #333333;
		font-size: 0;
	}

	section.section_type-numbers ul {
		display: inline-block;
		width: 600px;
		padding: 20px 0;
	}

	section.section_type-numbers li {
		display: inline-block;
		width: 200px;
		border-right: 1px solid #dadada;
		font-size: 18px;
	    font-weight: 300;	
	}

	section.section_type-numbers li:last-child {
		border: none;
	}

	section.section_type-numbers strong {
		display: block;
		font-size: 40px;
		font-weight: 800;
	}

	@media screen and (max-width: 900px) {
		section.section_type-numbers ul {
			width: 100%;
		}

		section.section_type-numbers li {
			font-size: 12px;
		    width: 33%;
		}

		section.section_type-numbers strong {
			font-size: 25px;
		}
	}

</style>
