<?php
/**
 * The template part for displaying section with "text" type
 *
 */
?>

<section <?php post_class(); ?>>
	<h3 class="section-title"><?php the_title(); ?></h3>
	<div class="section-content">
		<?php the_content(); ?>
	</div>
</section>

<style type="text/css">

	section.section.section_type-objectives .section-content {
		position: relative;
	    margin: auto;
	    font-size: 0;
	}

	section.section.section_type-objectives .section-content:before {
		position: absolute;
		top: 0;
		left: 50%;
		margin-left: -1px;
		content: '';
		width: 3px;
		height: 100%;
		background-color: #ebebeb;
	}

	section.section.section_type-objectives ul {
		display: inline-block;
		vertical-align: top;
		text-align: right;
		width: 50%;
	}

	section.section.section_type-objectives ul:last-child {
		margin-top: 45px;
		text-align: left;
	}

	section.section.section_type-objectives li {
		position: relative;
		display: inline-block;
		margin-top: 30px;
		margin-right: 22px;
	    padding: 0 15px;
	    line-height: 60px;
	    font-size: 16px;
		background-color: #fff;
		vertical-align: top;
		box-shadow: 2px 1px 15px 0px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-objectives ul:last-child li {
		margin-right: 0;
		margin-left: 22px;
		box-shadow: -2px 1px 15px 0px rgba(0, 0, 0, 0.21);
	}

	section.section.section_type-objectives li:first-child {
		margin-top: 0;
	}

	section.section.section_type-objectives li:before {
		content: '';
		position: absolute;
		top: 24px;
		right: -29px;
		width: 13px;
		height: 13px;
		background-color: #fff;
		border: 3px solid #ebebeb;
		border-radius: 100%;
	}

	section.section.section_type-objectives ul:last-child li:before {
		right: inherit;
		left: -28px;
	}

	section.section.section_type-objectives li:after {
		content: '';
		position: absolute;
		top: 23px;
		right: -7px;
		border-style: solid;
		border-width: 7px 0 7px 7px;
		border-color: transparent transparent transparent #ffffff;
	}

	section.section.section_type-objectives ul:last-child li:after {
		right: inherit;
		left: -7px;
		border-width: 7px 7px 7px 0;
		border-color: transparent #ffffff transparent transparent;
	}

	section.section.section_type-objectives li i.material-icons {
		color: #fb5507;
		font-size: 35px;
		margin-right: 10px;
	}

	@media screen and (max-width: 900px) {

		section.section.section_type-objectives .section-content:before,
		section.section.section_type-objectives li:before,
		section.section.section_type-objectives li:after {
			display: none;
		}

		section.section.section_type-objectives ul {
			width: inherit;
			text-align: center;
		}

		section.section.section_type-objectives li {
			display: block;
		    margin-top: 10px;
			margin-right: 0;
			font-size: 15px;
			padding: 15px;
			line-height: inherit;
		}

		section.section.section_type-objectives ul:last-child li {
			margin-left: 0;
		}

		section.section.section_type-objectives li i.material-icons {
			display: block;
			margin-right: 0;
			margin-bottom: 10px;
			line-height: 23px;
		}

		section.section.section_type-objectives ul:last-child {
			margin-top: 10px;
			text-align: center;
		}

	}

</style>
