<?php
/**
 * Template Name: App Page
 *
 */

    if (!empty($_GET['token'])) {
        $response = wp_remote_retrieve_body(wp_remote_get('https://api.entourage.social/api/v1/public/entourages/' . $_GET['token']));
        if (!empty($response)) {
            $response = json_decode($response);
            if (!empty($response->entourage->uuid))
                $entourage = $response->entourage;
        }
    }

    $custom_fields = get_post_custom($wp_query->post->ID);

    if (!empty($entourage)) {
        $og_url = get_bloginfo('url') . "/app?token=" . $_GET['token'];
        $og_title = $entourage->title;
        $og_description = "Vous voulez aider ? Rejoignez " . ucfirst($entourage->author->display_name) . " et les milliers de membres du réseau solidaire Entourage et passez vous aussi concrètement à l'action pour les personnes sans-abri près de chez vous";
    }
    else {
        $og_url = get_bloginfo('url') . "/app";
        $og_title = !empty($custom_fields['meta_titre']) ? $custom_fields['meta_titre'][0] : get_the_title($wp_query->post->ID);
        $og_description = !empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description');
    }

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/img/fav.png" />
    <title><?php
            echo get_bloginfo('name');
            if ( !empty($custom_fields['meta_titre']) )
                echo ' | '.$custom_fields['meta_titre'][0];
        ?></title>
    <meta name="description" content="<?php echo (!empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description')); ?>">
    <meta property="og:title" content="<?php echo htmlentities($og_title); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $og_url; ?>">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/img/share-fb.png">
    <meta property="og:description" content="<?php echo htmlentities($og_description); ?>">
    <meta property="fb:app_id" content="280727035774134">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/countries.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/style.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/responsive.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/app.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,500,100,300italic' rel='stylesheet' type='text/css'>

    <style id="inline-style" type="text/css"></style>
</head>

<body
    ng-app="entourageApp"
    ng-controller="MapController as map"
    ng-cloak
    >

    <div
        id="page-title"
        class="overlay"
        ng-class="{'fade-out': map.loaded}"
        >
        <div>
            <div>
                <img class="app-screenshot" title="Découvrez l'application Entourage" src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange.png"/>
            </div>
            <h1><a href="http://www.entourage.social/" target="_blank">Entourage</a>, <?php echo $custom_fields['titre'][0] ?>...</h1>
        </div>
    </div>

    <header
        id="site-header-fixed"
        ng-class="{'show': map.loaded}"
        >
            <a
                id="site-header-logo"
                href="/"
                title="Visiter le site d'Entourage"
                >
                <img
                    src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange.png"
                    alt="Logo de l'association Entourage"
                />
        </a>
        <ul id="app-filters">
            <li
                id="app-search"
                ng-class="{'active': searchFocus, 'enabled': map.currentAddress}"
                >
                <i class="filter-icon material-icons">room</i>
                <div
                    id="app-search-address"
                    ng-show="map.currentAddress"
                    >
                    <span ng-bind="map.currentAddress"></span>
                    <i
                        class="material-icons erase"
                        ng-click="map.clearAddress()"
                        >
                        close 
                    </i>
                        
                </div>
                <input
                    id="app-search-input"
                    type="text"
                    placeholder="Cherchez un lieu..."
                    ng-hide="map.currentAddress"
                    ng-focus="searchFocus = true"
                    ng-blur="searchFocus = false"
                    >
                <i
                    id="ask-location"
                    ng-hide="map.hideAskLocation || map.currentAddress"
                    class="material-icons"
                    ng-click="map.askLocation()"
                    >my_location</i>
            </li>
            <li
                id="app-filter-more"
                ng-class="{'active': showFilters, 'enabled': map.filters.period || map.filters.status}"
                >
                <div ng-click="showFilters = !showFilters">
                    <i
                        class="filter-icon material-icons"
                        ng-bind="showFilters ? 'close' : 'filter_list'"></i>
                    <span ng-hide="map.filters.period || map.filters.status">
                        Filtrez les actions
                    </span>
                    <span ng-show="map.filters.period || map.filters.status">
                        <span ng-show="map.filters.period && map.filters.status">Filtres actifs</span>
                        <span ng-hide="map.filters.period && map.filters.status">Filtre actif</span>
                    </span>
                </div>
                <ul class="dropdown-menu">
                    <li>
                        <label>
                            <i class="material-icons">history</i> Date de l'action
                        </label>
                        <select
                            ng-change="map.filterActions()"
                            ng-model="map.filters.period"
                            >
                            <option value="">Peu importe</option>
                            <option value="7">Cette semaine</option>
                            <option value="30">Ce mois-ci</option>
                            <option value="90">Ce trimestre</option>
                        </select>
                    </li>
                    <li>
                        <label> 
                            <i class="material-icons">done</i> Statut
                        </label>
                        <select
                            ng-change="map.filterActions()"
                            ng-model="map.filters.status"
                            >
                            <option value="">Peu importe</option>
                            <option value="open">En cours</option>
                            <option value="closed">Terminée</option>
                        </select>
                    </li>
                </ul>
            </li>
        </ul>
        <div id="site-header-right">
            <a href="<?php echo get_bloginfo('url'); ?>"><?php echo $custom_fields['bouton_2'][0] ?></a>
            <a
                class="btn orange-btn"
                ng-click="map.showRegistration()"
                >
                <?php echo $custom_fields['bouton'][0] ?>
            </a>
        </div>
    </header>

    <div id="page-content">
        <div
            id="page-registration"
            class="overlay fade-in"
            ng-show="map.registrationToggle"
            >
            <div>
                <div class="content" ng-class="{'valid': map.invitationSent}">
                    <div class="illu"></div>
                    <div class="text">
                        <h3 ng-hide="map.invitationSent">
                            Envie de passer à l'action&nbsp;? Super&nbsp;!<br>
                            Rejoignez-nous <span class="action-author" ng-bind="map.currentAction.first_name"></span> sur l'application Entourage.
                        </h3>
                        <h3 ng-show="map.invitationSent">
                            C'est envoyé ! Regardez vite vos SMS !
                        </h3>
                        <div class="registration-form">
                            <div ng-hide="map.invitationSent">
                                <p>Entrez votre numéro de téléphone pour vous inscrire et recevoir votre mot de passe par SMS&nbsp;:</p>
                                <div class="input-parent">
                                    <div class="country-selection" ng-click="map.countriesToggle = !map.countriesToggle">
                                        <i class="iti-flag" ng-class="map.country[1]"></i>
                                        <div ng-bind="'+' + map.country[2]"></div>
                                        <ul id="country-list" class="dropdown-menu" ng-if="map.countriesToggle">
                                            <li ng-repeat="country in map.countries" ng-click="map.selectCountry(country)">
                                                <i class="iti-flag" ng-class="country[1]"></i>
                                                <span ng-bind="country[0]"></span>
                                            </li>
                                        </ul>
                                    </div>
                                    <input type="text" ng-model="map.phone" placeholder="Numéro de téléphone" ng-keypress="map.isKeyEnter($event) && map.register()"/>
                                    <a class="btn" ng-click="map.register()">Envoyer</a>
                                </div>
                                <div class="error" ng-if="map.registrationError" ng-bind="map.registrationError"></div>
                            </div>
                            <div ng-show="map.invitationSent">
                                <p>Le SMS que vous allez recevoir contient toutes les informations dont vous avez besoin :</p>
                                <ul>
                                    <li>- <b><a href="https://api.entourage.social/store_redirection" target="_blank">le lien de téléchargement</a></b> de l'application</li>
                                    <li>- <b>votre code de connexion</b> pour vous identifier</li>
                                </ul>
                                <br><p>A tout de suite sur <a href="<?php echo get_bloginfo('url'); ?>">Entourage</a> !</p>
                            </div>
                        </div>
                        <a class="page-close" ng-click="map.registrationToggle = false">
                            <i class="material-icons">close</i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div id="map">
            <div id="map-right-band" ng-class="{open: map.currentAction}">
                <div>
                    <a class="action-close">
                        <i class="material-icons" ng-click="map.hideAction()">close</i>
                    </a>
                    <h3 class="action-title" ng-bind="map.currentAction.title"></h3>
                    <div class="action-content">
                        <div class="action-details">
                            <div class="action-author-picture" ng-style="{'background-image': 'url(' + map.currentAction.author_avatar_url + ')'}"></div><span class="action-author" ng-bind="map.currentAction.author_name"></span>, le
                            <span class="action-date" ng-bind="map.currentAction.created_at|date:'dd/MM/yy'"></span>
                        </div>
                        <p class="action-description" ng-if="map.currentAction.description" ng-bind-html="map.currentAction.description|trusted"></p>
                    </div>
                    <div class="action-buttons" ng-if="map.currentAction.status == 'open'">
                        <a id="join-btn" class="btn orange-btn" ng-click="map.showRegistration(map.currentAction.uuid)">Rejoignez <span ng-bind="map.currentAction.author_name"></span> !</a>
                        <a id="share-fb" class="btn" ng-click="map.shareFacebook(map.currentAction)">
                            <i class="material-icons">exit_to_app</i> Partagez sur Facebook
                        </a>
                    </div>
                    <div class="action-buttons" ng-if="map.currentAction.status == 'closed'">
                        <div id="closed">Cette action est terminée !</div>
                    </div>
                </div>
            </div>
            <div id="map-container"></div>
        </div>
    </div>
  <!-- Scripts -->
  <script src="<?php echo get_template_directory_uri(); ?>/js/jquery.js" type="text/javascript"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/angular.min.js" type="text/javascript"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/jquery.csv.min.js" type="text/javascript"></script>
  <script src="https://catamphetamine.github.io/libphonenumber-js/libphonenumber-js.min.js" type="text/javascript"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/app.js" type="text/javascript"></script>

  <!-- Analytics Code -->
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-68872992-1', 'auto');
        ga('send', 'pageview');
    </script>

    <!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', '1977352069219759'); 
        fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" 
    src="https://www.facebook.com/tr?id=1977352069219759&ev=PageView
    &noscript=1"/>
    </noscript>

    <!-- Facebook JS SDK -->
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.10&appId=280727035774134';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

  </body>
</html>

