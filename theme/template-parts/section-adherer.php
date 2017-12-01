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
		<form id="asso-form" method="POST">
			<fieldset>
				<div class="parent-input with-icon person-icon">
					<input type="text" id="registration_form-2-first_name" placeholder="Prénom *" required>
				</div>
				<div class="parent-input with-icon person-icon">
					<input type="text" id="registration_form-2-last_name" placeholder="Nom *" required>
				</div>
			</fieldset>
			<fieldset>
				<div class="parent-input with-icon phone-icon">
					<input type="text" id="registration_form-2-phone" placeholder="Téléphone mobile *" required>
				</div>
				<div class="parent-input with-icon email-icon">
					<input type="text" id="registration_form-2-email" placeholder="Email *" required>
				</div>
			</fieldset>
			<fieldset>
				<div class="parent-input with-icon book-icon">
					<input type="text" id="registration_form-1-name" placeholder="Nom de l'association *" required>
				</div>
				<div class="parent-input with-icon pin-icon">
					<input type="text" id="registration_form-1-local_entity" placeholder="Antenne locale">
				</div>
			</fieldset>
			<fieldset>
				<div class="parent-input with-icon address-icon">
					<input type="text" id="registration_form-1-address" placeholder="Adresse (locale) *" required>
				</div>
				<!--div class="parent-input with-icon link-icon">
					<input type="text" id="registration_form-1-website_url" placeholder="Site internet">
				</div-->
			</fieldset>
			<!--fieldset>
				<a class="btn orange-btn file-btn">
					<input id="registration_form-1-logo-input" type="file" accept="image/png, image/jpeg">
					Télécharger votre logo
				</a>
			</fieldset->
			<!--textarea id="registration_form-1-description" placeholder="Description de l'association *" required></textarea-->
			<label>
				<input type="checkbox" id="registration_form-2-agreement" required>
				J'ai lu, j'accepte et j'engage mon association à respecter <a href="https://s3-eu-west-1.amazonaws.com/entourage-ressources/charte.pdf" target="_blank">la charte de solidarité Entourage</a> et <a href="https://s3-eu-west-1.amazonaws.com/entourage-ressources/EntouragePRO-CGU.pdf" target="_blank">les conditions générales d'utilisation</a>
			</label>
			<div id="form-errors">
				<ul id="form-errors-list"></ul>
			</div>
			<input type="submit" class="btn orange-btn" value="Inscrire mon association">
		</form>
	</div>
</section>

<style type="text/css">

	section.section_type-adherer div.section-content {
	    width: 810px;
	    margin: auto;
	    text-align: left;
    }

    section.section_type-adherer form {
    	background: #eee;
	    margin-top: 20px;
	    padding: 20px;
    }

    section.section_type-adherer form.success {
    	background: #1ac811;
	    color: #fff;
	    font-weight: bold;
	    text-align: center;
	    border-radius: 5px;
    }

    section.section_type-adherer .form-part {
    	margin-bottom: 30px;
	    text-align: center;
    }

    section.section_type-adherer .form-part h4 {
    	font-weight: bold;
    	text-align: center;
    	border-bottom: 1px solid #333;
    	padding-bottom: 10px;
    	margin-bottom: 20px;
    }

    section.section_type-adherer .form-part h4 p {
    	display: block;
    	font-weight: normal;
    	font-size: 13px;
    	line-height: 20px;
    }

    section.section_type-adherer form fieldset {
    	margin-bottom: 20px;
    }

    section.section_type-adherer form fieldset .parent-input {
    	display: inline-block;
    }

    section.section_type-adherer input[type=text] {
    	width: 340px;
    	margin-right: 10px;
    }

    section.section_type-adherer .file-btn {
    	position: relative;
    	cursor: pointer;
    }

    section.section_type-adherer input[type=file] {
	    opacity: 0;
	    z-index: 10;
	    width: 100%;
	    cursor: pointer;
	    position: absolute;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
    }

    section.section_type-adherer textarea {
    	width: 100%;
    	height: 100px;
    	padding-top: 10px;
    }

    section.section_type-adherer label {
    	display: block;
    	margin: auto;
    	width: 400px;
    	margin-top: 30px;
    	cursor: pointer;
    	font-size: 13px;
    }

    section.section_type-adherer label a {
    	color: #ff5100;
    }

    section.section_type-adherer input[type=submit] {
    	display: block;
	    width: 100%;
	    height: 40px;
    }

    #form-errors {
    	display: none;
	    background: #333;
	    color: #fff;
	    padding: 20px;
	    margin-top: 20px;
	    font-size: 14px;
    }

    #form-errors-list {
	    display: inline-block;
    	vertical-align: middle;
    	list-style: circle;
    	padding-left: 40px;
    }

    #form-errors:before {
    	content: 'error';
    	font-family: 'Material Icons';
    	font-size: 32px;
    	display: inline-block;
    	vertical-align: middle;
    }

    @media screen and (max-width: 900px) {
    	section.section_type-adherer form fieldset {
    		margin-bottom: 0;
    	}
    	section.section_type-adherer form fieldset .parent-input {
    		display: block;
    		margin-bottom: 20px;
    	}

	    section.section_type-adherer input[type=text] {
	    	width: 100%;
	    	margin-right: 0;
	    }

	    section.section_type-adherer label {
	    	margin: 0;
	    	width: 100%;
	    }
    }

</style>
