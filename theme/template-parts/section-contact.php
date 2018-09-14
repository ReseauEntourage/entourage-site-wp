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

		<form id="contact-form" method="POST" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>">
			<div class="parent-input with-icon person-icon">
				<input type="text" name="name" placeholder="Votre nom" required>
			</div>
			<div class="parent-input with-icon email-icon">
				<input type="text" name="email" placeholder="Votre email" required>
			</div>
			<div class="parent-input with-icon text-icon">
				<input type="text" name="subject" placeholder="Sujet de votre message" required>
			</div>
			<div>
				<textarea name="message" placeholder="Votre message" required></textarea>
			</div>
			<div class="g-recaptcha" data-sitekey="6Lct6k8UAAAAAJLtjH9Uthp-2zPTXCMtvfd6imSY"></div>
			<input type="submit" class="btn orange-btn" value="Envoyer !">
			<input type="hidden" name="action" value="contact_form">
		</form>
	</div>
</section>

<style type="text/css">

	section.section_type-contact div.section-content {
	    width: 810px;
	    margin: auto;
	    text-align: left;
    }

    section.section_type-contact form {
    	background: #eee;
	    margin-top: 20px;
	    padding: 20px;
    }

    section.section_type-contact form.success {
    	background: #1ac811;
	    color: #fff;
	    font-weight: bold;
	    text-align: center;
	    border-radius: 5px;
    }

    section.section_type-contact input[type=text] {
    	width: 300px;
    	margin-bottom: 20px;
    }

    section.section_type-contact textarea {
    	width: 100%;
    	height: 100px;
    	padding-top: 10px;
    }

    section.section_type-contact .g-recaptcha {
    	margin-top: 20px;
    }

    @media screen and (max-width: 900px) {
	    section.section_type-contact input[type=text] {
	    	width: 100%;
	    }
    }

</style>
