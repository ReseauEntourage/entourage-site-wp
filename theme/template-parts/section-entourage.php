<?php
/**
 * The template part for displaying section with "entourage" type
 *
 */

	$custom_fields = get_post_custom(get_the_ID());

?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<ul>
			<li>
				<a href="<?php echo$custom_fields['lien'][0]; ?>">
					<?php echo $custom_fields['bouton'][0]; ?>
				</a>
			</li>
			<li>
				<a href="<?php echo $custom_fields['lien_2'][0]; ?>">
					<?php echo $custom_fields['bouton_2'][0]; ?>
				</a>
			</li>
			<li>
				<a href="<?php echo $custom_fields['lien_3'][0]; ?>">
					<?php echo $custom_fields['bouton_3'][0]; ?>
				</a>
			</li>
		</ul>
	</div>
</section>

<style type="text/css">

	section.section.section_type-entourage ul {
	    font-size: 0;
	}

	section.section.section_type-entourage li {
		display: inline-block;
		width: 240px;
		height: 240px;
		margin-right: 60px;
	    vertical-align: top;
	    background: #fff;
	    font-size: 16px;
	    text-transform: uppercase;
	    background-size: 240px;
        background-position: center top;
		box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.21);
		background-image: url(/wp-content/themes/entourage/img/bg-mission.jpg);
		transition: box-shadow 0.3s;
	}

	section.section.section_type-entourage li:last-child {
		margin-right: 0;
	}

	section.section.section_type-entourage li:hover {
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-entourage li:nth-child(2) {
		background-image: url(/wp-content/themes/entourage/img/bg-equipe.jpg);
	}

	section.section.section_type-entourage li:nth-child(3) {
		background-image: url(/wp-content/themes/entourage/img/bg-histoire.jpg);
	}

	section.section.section_type-entourage li a {
		display: block;
		height: 100%;
		padding-top: 30px;
		color: #333;
	}

	section.section.section_type-entourage li a:hover {
		text-decoration: none;
	}

	section.section.section_type-entourage li b {
		display: block;
		font-size: 31px;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-entourage li {
		    display: block;
			margin: 0 auto 20px;
		}

		section.section.section_type-entourage li:last-child {
			margin-bottom: 0;
			margin-right: auto;
		}
	}

</style>