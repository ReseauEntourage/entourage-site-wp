<?php
/**
 * The template part for displaying section with "download" type
 *
 */

	$custom_fields = get_post_custom(get_post()->ID);
?>

<section <?php post_class(); ?>>
	<img src="/wp-content/themes/entourage/img/app-screenshot.png" alt="Ecran de l'application mobile" title="Aperçu de l'application Entourage"/>
	<div class="download-btns">
		<?php 
			the_title( '<h4>', '</h4>');
			echo sprintf( '<a class="btn orange-btn iphone-btn" href="%s"><div>Télécharger sur <strong>iphone</strong></div></a>', link_with_url_parameters($custom_fields['lien_ios'][0], $_SERVER['QUERY_STRING']));
			echo sprintf( '<a class="btn orange-btn android-btn" href="%s"><div>Télécharger sur <strong>android</strong></div></a>', link_with_url_parameters($custom_fields['lien_android'][0], $_SERVER['QUERY_STRING']));
		?>
	</div>
</section>

<style type="text/css">

	section.section.section_type-download {
	    display: table;		
		width: 600px;
	    padding: 0;	
	    font-size: 0;		
	}

	section.section.section_type-download img {
	    display: inline-block;
	    width: 185px;
	}

	section.section.section_type-download div.download-btns {
	    display: table-cell;
	    vertical-align: middle;
		width: 415px;
	}

	section.section.section_type-download h4 {
		margin-bottom: 30px;
		padding: 0 20px;
		font-weight: 600;
		font-size: 18px;
	}

	section.section.section_type-download a.btn {
	    height: inherit;
	    line-height: 15px;
	    padding: 7px 20px;
	    margin-right: 10px;
	    font-size: 11px;
	}

	section.section.section_type-download a.btn:last-child {
		margin-right: 0px;
	}

	section.section.section_type-download a.btn.big-btn {
		width: 220px;
	}

	section.section.section_type-download a.btn:before {
	    content: '';
	    width: 24px;
	    height: 28px;
	    display: inline-block;
	    vertical-align: top;
	    margin-top: 2px;
	    margin-right: 8px;
	    background-image: url(/wp-content/themes/entourage/img/sprite-main.png);
	    background-size: 250px;
	    background-position: 0 0;
	}

	section.section.section_type-download a.btn div {
		display: inline-block;
	    vertical-align: top;
	}

	section.section.section_type-download a.btn.android-btn:before {
	    background-position: -26px 0;
	}

	section.section.section_type-download a.btn strong {
		display: block;
		font-weight: 600;
		font-size: 19px;
		text-transform: uppercase;
	}

	@media screen and (max-width: 900px) {
		section.section.section_type-download div.download-btns {
		    display: block;
		    width: 100%;
		    background: #eee;
		    padding: 20px;
		}

		section.section.section_type-download div.download-btns h4 {
			margin: 0 0 20px 0;
		}

		section.section.section_type-download div.download-btns .orange-btn {
			width: 180px;
		}

		section.section.section_type-download div.download-btns .iphone-btn {
			margin: 0 0 10px 0;
		}
	}
	
</style>
