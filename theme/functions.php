<?php
	add_theme_support( 'post-thumbnails' );

	@ini_set( 'upload_max_size' , '64M' );
	@ini_set( 'post_max_size', '64M');
	@ini_set( 'max_execution_time', '300' );

	add_filter( 'jetpack_enable_open_graph', '__return_false' );
	

	/*** CUSTOM POST TYPES + taxonomies OPTIONS ***/

	add_action( 'init', 'init_custom_post_types' );

	function init_custom_post_types() {
		register_post_type( 'section', [
			'labels' => [
				'name' => __( 'Sections' ),
				'singular_name' => __( 'Section' ),
				'add_new' => __( 'Nouvelle section' ),
				'add_new_item' => __( 'Nouvelle section' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'section'],
			'supports' => [ 'title', 'editor', 'custom-fields','page-attributes'],
		]);

		register_taxonomy( 'section_type', 'section', [
			'labels' => [
				'name' => __( 'Type de section' ),
				'singular_name' => __( 'Type de section' ),
				'menu_name' => __( 'Tous les types de section' ),
				'all_items' => __( 'Tous les types' ),
				'edit_item' => __( 'Editer le type' ),
				'view_item' => __( 'Voir le type' ),
				'update_item' => __( 'Mettre à jour le type' ),
				'add_new_item' => __( 'Nouveau type' ),
				'new_item_name' => __( 'Nom du nouveau type' ),
				'search_items' => __( 'Chercher un type' ),
			],
			'hierarchical' => true,
		]);

		register_taxonomy( 'section_page', ['section', 'quote', 'contact'], [
			'labels' => [
				'name' => __( 'Pages' ),
				'singular_name' => __( 'Page' ),
				'menu_name' => __( 'Toutes les pages' ),
				'all_items' => __( 'Toutes les pages' ),
				'edit_item' => __( 'Editer la page' ),
				'view_item' => __( 'Voir la page' ),
				'update_item' => __( 'Mettre à jour la page' ),
				'add_new_item' => __( 'Nouvelle page' ),
				'new_item_name' => __( 'Nom de la page' ),
				'search_items' => __( 'Chercher une page' ),
			],
			'hierarchical' => true,
		]);

		register_post_type( 'quote', [
			'labels' => [
				'name' => __( 'Témoignages' ),
				'singular_name' => __( 'Témoignage' ),
				'add_new' => __( 'Nouveau témoignage' ),
				'add_new_item' => __( 'Nouveau témoignage' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'quote'],
			'supports' => [ 'title', 'editor', 'custom-fields', 'thumbnail', 'page-attributes'],
		]);

		register_post_type( 'team', [
			'labels' => [
				'name' => __( 'Equipe' ),
				'singular_name' => __( 'Personne' ),
				'add_new' => __( 'Nouvelle personne' ),
				'add_new_item' => __( 'Nouvelle personne' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'team'],
			'supports' => [ 'title', 'editor', 'custom-fields', 'thumbnail', 'page-attributes'],
		]);

		register_taxonomy( 'team_type', ['team'], [
			'labels' => [
				'name' => __( 'Equipes' ),
				'singular_name' => __( 'Equipe' ),
				'menu_name' => __( 'Toutes les équipes' ),
				'all_items' => __( 'Toutes les équipes' ),
				'edit_item' => __( 'Editer l\'équipe' ),
				'view_item' => __( 'Voir l\'équipe' ),
				'update_item' => __( 'Mettre à jour l\'équipe' ),
				'add_new_item' => __( 'Nouvelle équipe' ),
				'new_item_name' => __( 'Nom de l\'équipe' ),
				'search_items' => __( 'Chercher une équipe' ),
			],
			'hierarchical' => true,
		]);

		register_post_type( 'partner', [
			'labels' => [
				'name' => __( 'Partenaires' ),
				'singular_name' => __( 'Partenaire' ),
				'add_new' => __( 'Nouveau partenaire' ),
				'add_new_item' => __( 'Nouveau partenaire' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'partner'],
			'supports' => [ 'title', 'editor', 'custom-fields', 'thumbnail', 'page-attributes'],
		]);

		register_taxonomy( 'partner_type', ['partner'], [
			'labels' => [
				'name' => __( 'Types' ),
				'singular_name' => __( 'Type' ),
				'menu_name' => __( 'Tous les types' ),
				'all_items' => __( 'Tous les types' ),
				'edit_item' => __( 'Editer le type' ),
				'view_item' => __( 'Voir le type' ),
				'update_item' => __( 'Mettre à jour le type' ),
				'add_new_item' => __( 'Nouveau type' ),
				'new_item_name' => __( 'Nom du type' ),
				'search_items' => __( 'Chercher un type' ),
			],
			'hierarchical' => true,
		]);

		register_post_type( 'association', [
			'labels' => [
				'name' => __( 'Associations' ),
				'singular_name' => __( 'Association' ),
				'add_new' => __( 'Nouvelle Association' ),
				'add_new_item' => __( 'Nouvelle Association' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'association'],
			'supports' => [ 'title', 'custom-fields', 'thumbnail', 'page-attributes'],
		]);

		register_post_type( 'company', [
			'labels' => [
				'name' => __( 'Entreprises' ),
				'singular_name' => __( 'Entreprise' ),
				'add_new' => __( 'Nouvelle entreprise' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'company'],
			'supports' => [ 'title', 'custom-fields', 'thumbnail'],
		]);

		register_post_type( 'article', [
			'labels' => [
				'name' => __( 'Presse' ),
				'singular_name' => __( 'Article' ),
				'add_new' => __( 'Nouvel article' ),
				'add_new_item' => __( 'Nouvel article' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'article'],
			'supports' => [ 'title', 'editor', 'custom-fields'],
		]);

		register_post_type( 'contact', [
			'labels' => [
				'name' => __( 'Contacts' ),
				'singular_name' => __( 'Contact' ),
				'add_new' => __( 'Nouveau contact' ),
			],
			'menu_position' => 2,
			'public' => true,
			'rewrite' => ['slug' => 'contact'],
			'supports' => [ 'title', 'custom-fields', 'thumbnail'],
		]);
	}


	/*** CUSTOM FUNCTIONS ***/


	function the_custom_html_title() {
    	$title = get_the_title();
    	$title = preg_replace('/\*\*(.*)\*\*/', '<b class="highlight-word">$1</b>', $title);
    	echo $title;
	}

	function the_custom_html_content() {
    	$content = get_the_content();
    	$content = apply_filters( 'the_content', $content );
    	$content = str_replace( ']]>', ']]&gt;', $content );
    	$content = preg_replace('/\*\*(.*)\*\*/', '<b class="highlight-word">$1</b>', $content);
    	echo $content;
	}

	function link_with_url_parameters($link, $params) {
		if (empty($params))
			return $link;
		if (strpos($link, '?'))
			return $link.'&'.$params;
		return $link.'?'.$params; 
	}

	function asset_url($path) {
		$version = filemtime(path_join(get_stylesheet_directory(), $path));
		echo esc_url(path_join(get_template_directory_uri(), $path).'?'.$version);
	}

	/*** EMAIL ***/


	function send_email_to_admin() {
	    if (empty($_POST['name']))
	        $return = "Merci d'indiquer votre nom.";
	    else if (empty($_POST['email']))
	        $return = "Merci d'indiquer votre email.";
	    else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
	        $return = "Merci d'entrer une adresse mail valide.";
	    else if (empty($_POST['subject']))
	        $return = "Merci d'indiquer un sujet à votre message.";
	    else if (empty($_POST['message']))
	        $return = "Sans message il sera difficile de vous répondre !";
	    else if (empty($_POST['g-recaptcha-response']))
	    	$return = "Veuillez cocher la case 'Je ne suis pas un robot'";
	    else {
		    $url = 'https://www.google.com/recaptcha/api/siteverify';
			$data = [
				'secret' => '6Lct6k8UAAAAAPLiJ06OYiZkfCTzCuiQqSwekmXg',
				'response' => $_POST['g-recaptcha-response']
			];

			$options = [
			    'http' => [
			        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			        'method'  => 'POST',
			        'content' => http_build_query($data)
			    ]
			];
			$context  = stream_context_create($options);
			$result = json_decode(file_get_contents($url, false, $context), true);

			if (!$result['success'])
				$return = "Vous êtes un robot d'après Google Re-catcha !";
		}

	    if (!isset($return))
	    {
	        $headers  = 'MIME-Version: 1.0' . "\r\n";
	        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	        $headers .= 'From: entourage.social <'.get_option('admin_email').'>' . "\r\n";
	        $headers .= 'Reply-To: '.$_POST['email']. "\r\n";

	        $message = 'Message de : <b>'.$_POST['name'].'</b> '.$_POST['email'].'';
	        $message .= '<br><br>'.nl2br($_POST['message']);

	        wp_mail(get_option('admin_email'), 'CONTACT - '.$_POST['subject'], $message, $headers);
	        $return = 'success';
	    }
	    echo $return;
	}
	add_action( 'admin_post_nopriv_contact_form', 'send_email_to_admin' );
	add_action( 'admin_post_contact_form', 'send_email_to_admin' );

	function direct_email() {
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= 'From: entourage.social <'.get_option('admin_email').'>' . "\r\n";
        $headers .= 'Reply-To: '.$_POST['email']. "\r\n";

        $message .= nl2br($_POST['message']);

        wp_mail(get_option('admin_email'), $_POST['title'], $message, $headers);
	    echo 'success';
	}
	add_action( 'admin_post_nopriv_direct_email', 'direct_email' );
	add_action( 'admin_post_direct_email', 'direct_email' );


	/*** ADMIN OPTIONS ***/

	/**
	* Remove some menu
	*/

	function custom_menu_page_removing() {
	    remove_menu_page('edit-comments.php');
	    remove_menu_page('edit.php');
	    remove_menu_page('tools.php');
	    remove_menu_page('index.php');
	}
	add_action( 'admin_menu', 'custom_menu_page_removing' );


	/**
	* Replace columns to admin listing screen for sections
	*/

	add_filter('manage_section_posts_columns' , 'set_section_columns');

	function set_section_columns() {
	    return array(
    		'page' => "Page",
	        'title' => "Titre",
	        'order' => "Ordre d'affichage",
	    );
	}


	/**
	* Show custom order column values
	*/

	add_action('manage_section_posts_custom_column', 'show_order_column');

	function show_order_column($name) {
		global $post;

		switch ($name) {
			case 'order':
			  echo  $post->menu_order;
			  break;
		  	case 'page':
			  echo wp_get_post_terms($post->ID, ['section_page'])[0]->name;
			  break;
			default:
			  break;
		}
	}
	

	/**
	* Make columns sortable
	*/

	function order_column_register_sortable($columns) {
		$columns['order'] = 'order';
		$columns['page'] = 'page';
		return $columns;
	}

	add_filter('manage_edit-section_sortable_columns', 'order_column_register_sortable');


	/**
	* Add filter by page
	*/

	add_action('restrict_manage_posts', 'tsm_filter_post_type_by_taxonomy');

	function tsm_filter_post_type_by_taxonomy() {
		global $typenow;
		$post_type = 'section'; // change to your post type
		$taxonomy  = 'section_page'; // change to your taxonomy
		if ($typenow == $post_type) {
			$selected      = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
			$info_taxonomy = get_taxonomy($taxonomy);
			wp_dropdown_categories(array(
				'show_option_all' => __("{$info_taxonomy->label}"),
				'taxonomy'        => $taxonomy,
				'name'            => $taxonomy,
				'orderby'         => 'name',
				'selected'        => $selected,
				'show_count'      => true,
				'hide_empty'      => true,
			));
		};
	}


	/**
	* Filter posts by taxonomy in admin
	*/

	add_filter('parse_query', 'tsm_convert_id_to_term_in_query');

	function tsm_convert_id_to_term_in_query($query) {
		global $pagenow;
		$post_type = 'section'; // change to your post type
		$taxonomy  = 'section_page'; // change to your taxonomy
		$q_vars    = &$query->query_vars;
		if ( $pagenow == 'edit.php' && isset($q_vars['post_type']) && $q_vars['post_type'] == $post_type && isset($q_vars[$taxonomy]) && is_numeric($q_vars[$taxonomy]) && $q_vars[$taxonomy] != 0 ) {
			$term = get_term_by('id', $q_vars[$taxonomy], $taxonomy);
			$q_vars[$taxonomy] = $term->slug;
		}
	}


	/**
	* Add custom interface for global custom fields
	*/

	add_action('admin_menu', 'add_gcf_interface');

	function add_gcf_interface() {
		add_options_page('Textes du site', 'Textes du site', 'manage_options', 'global_custom_fields', 'edit_global_custom_fields');
	}

	function edit_global_custom_fields() {
		?>
		<div class='wrap'>
			<h2>Textes du site</h2>
			<form method="post" action="options.php">
				<?php wp_nonce_field('update-options') ?>

				<h2>Haut de page</h2>

				<p><strong>Icone bouton orange à droite :</strong><br />
				<input type="text" name="open_app_icon" size="150" value="<?php echo get_option('open_app_icon'); ?>" /></p>

				<p><strong>Bouton orange à droite :</strong><br />
				<input type="text" name="open_app_text" size="150" value="<?php echo get_option('open_app_text'); ?>" /></p>

				<p><strong>Lien bouton orange à droite :</strong><br />
				<input type="text" name="open_app_link" size="150" value="<?php echo get_option('open_app_link'); ?>" /></p>

				<p><strong>[MOBILE] Bouton orange à droite (max 15 caractères):</strong><br />
				<input type="text" name="open_app_text_mobile" size="150" value="<?php echo get_option('open_app_text_mobile'); ?>" /></p>

				<h2>Don</h2>

				<p><strong>Bouton "faire un don" (max 10 caractères) :</strong><br />
				<input type="text" name="donate_text" size="150" value="<?php echo get_option('donate_text'); ?>" /></p>

				<p><strong>Lien formulaire de don :</strong><br />
				<input type="text" name="donate_link" size="150" value="<?php echo get_option('donate_link'); ?>" /></p>

				<h2>Textes de partage Facebok (page d'accueil seulement)</h2>

				<p><strong>Titre :</strong><br />
				<input type="text" name="facebook_title" size="150" value="<?php echo get_option('facebook_title'); ?>" /></p>

				<p><strong>Description :</strong><br />
				<input type="text" name="facebook_description" size="150" value="<?php echo get_option('facebook_description'); ?>" /></p>

				<h2>Bas de page</h2>

				<p><strong>Message newsletter :</strong><br />
				<input type="text" name="newsletter" size="150" value="<?php echo get_option('newsletter'); ?>" /></p>

				<p><strong>Message adresse :</strong><br />
				<input type="text" name="footer_address_text" size="150" value="<?php echo get_option('footer_address_text'); ?>" /></p>

				<p><strong>Lien adresse :</strong><br />
				<input type="text" name="footer_address_link" size="150" value="<?php echo get_option('footer_address_link'); ?>" /></p>

				<p><input type="submit" name="Submit" value="Enregistrer les textes" /></p>

				<input type="hidden" name="action" value="update" />
				<input type="hidden" name="page_options" value="open_app_icon,open_app_text,  open_app_link, open_app_text_mobile, newsletter, donate_text, donate_link, footer_address_text, footer_address_link,facebook_title,facebook_description" />

			</form>
		</div>
		<?php
	}



	/**
	* Add text format in text editor
	*/

	function my_mce_buttons_2( $buttons ) {
		array_unshift( $buttons, 'styleselect' );
		return $buttons;
	}
	add_filter( 'mce_buttons_2', 'my_mce_buttons_2' );

	function my_mce_before_init_insert_formats( $init_array ) {  
		$style_formats = array(  
			array(  
				'title' => 'Bouton orange',  
				'classes' => 'btn orange-btn',
				'exact' => true,
				'inline' => 'a',
				'wrapper' => false,
				
			),
			array(  
				'title' => 'Bouton blanc',  
				'classes' => 'btn white-btn',
				'exact' => true,
				'inline' => 'a',
				'wrapper' => false,
				
			), 
		);  
		$init_array['style_formats'] = json_encode( $style_formats );  
		
		return $init_array;  
	  
	} 
	add_filter( 'tiny_mce_before_init', 'my_mce_before_init_insert_formats' ); 