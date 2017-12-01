<?php
/**
 * Template Name: App Page
 *
 */

    $custom_fields = get_post_custom($wp_query->post->ID);

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/img/fav.png" />
    <title><?php echo get_bloginfo('name'); ?> | <?php echo $custom_fields['meta_titre'][0] ?></title>
    <meta name="description" content="<?php echo $custom_fields['meta_description'][0] ?>">
    <meta property="og:title" content="Entourage, un peu de chaleur humaine pour les personnes sans-abri">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo get_bloginfo('url'); ?>">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/img/share-fb.png">
    <meta property="og:description" content="<?php echo get_bloginfo('description'); ?>">
    <meta name="apple-mobile-web-app-capable" content="yes">

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

    <header
        id="site-header-fixed"
        ng-class="{'show': map.loaded}"
        >
        <a
            id="site-header-fixed-logo"
            href="/">
            <img
                src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange.png"
                title="Entourage, réseau de chaleur humaine"
                alt="Logo de l'association Entourage"
                title="Association Entourage"
                />
        </a>
        <ul id="app-filters">
            <li
                id="app-search"
                ng-class="{'active': searchFocus}"
                >
                <i class="material-icons">room</i>
                <div
                    id="app-search-address"
                    ng-show="map.currentAddress"
                    ng-click="map.clearAddress()"
                    >
                    <span ng-bind="map.currentAddress"></span>
                    <i class="material-icons">
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
                ng-class="{'active': showFilters}"
                ng-click="showFilters = !showFilters"
                >
                <i
                    class="material-icons"
                    ng-bind="showFilters ? 'close' : 'filter_list'"
                    >
                </i>
                <ul class="dropdown-menu">
                    <li>
                        <label>
                            <i class="material-icons">history</i> Date de l'action
                        </label>
                        <select
                            ng-change="map.filterActions()"
                            ng-model="map.filters.created_at"
                            >
                            <option >Peu importe</option>
                            <option ng-click="map.filterActions('created_at', '1 week')">< 1 semaine</option>
                            <option ng-click="map.filterActions('created_at', '1 month')">< 1 mois</option>
                            <option ng-click="map.filterActions('created_at', '3 month')">< 3 mois</option>
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
                            <option value="all">Peu importe</option>
                            <option value="open">En cours</option>
                            <option value="closed">Terminée</option>
                        </select>
                    </li>
                </ul>
            </li>
        </ul>
        <div id="site-header-fixed-right">
            <a href="<?php echo get_bloginfo('url'); ?>"><?php echo $custom_fields['bouton_2'][0] ?></a>
            <a class="btn orange-btn" ng-click="map.showRegistration()"><?php echo $custom_fields['bouton'][0] ?></a>
        </div>
    </header>

    <div id="page-content">

      <div id="page-title" class="overlay" ng-class="{'fade-out': map.loaded}">
        <div>
           <img class="app-screenshot" title="Découvrez l'application Entourage" src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange.png"/>
          <h1><a href="http://www.entourage.social/" target="_blank">Entourage</a>, le réseau de ceux qui n'ont plus de réseau...</h1>
        </div>
      </div>

      <div id="page-registration" class="overlay" ng-class="{'fade-in': map.registrationToggle}">
        <div>
          <div class="content">
            <h1 ng-hide="map.invitationSent">
              Envie de passer à l'action ? Super !<br>
              Rejoignez-nous <a class="action-author" ng-bind="map.currentAction.first_name"></a> sur l'application Entourage.
            </h1>
            <div ng-show="map.invitationSent">
              <h1>C'est tout bon ! Regardez vite vos SMS !</h1>
            </div>
            <img class="app-screenshot" title="Découvrez l'application Entourage" src="<?php echo get_template_directory_uri(); ?>/img/app-screenshot.png"/>
            <div class="registration-form">
              <div ng-hide="map.invitationSent">
                <p>Entrez votre numéro de téléphone pour vous inscrire et recevoir votre mot de passe par SMS :</p>
                <div class="input-parent">
                  <input type="text" ng-model="map.phone" placeholder="Numéro de téléphone" ng-keypress="map.isKeyEnter($event) && map.register()"/>
                  <a class="btn" ng-click="map.register()">Télécharger</a>
                </div>
                <div class="error" ng-if="map.registrationError" ng-bind="map.registrationError"></div>
              </div>
              <p ng-show="map.invitationSent">
                Le SMS que vous allez recevoir contient toutes les informations dont vous avez besoin :<br><br>
                - le lien de téléchargement de l'application<br>
                - votre mot de passe pour vous identifier<br><br>
                A tout de suite sur <a href="<?php echo get_bloginfo('url'); ?>">Entourage</a> !
              </p>
            </div>
            <a class="page-close" ng-click="map.registrationToggle = false">X</a>
          </div>
        </div>
      </div>

      <div id="map">
        <div id="map-right-band"
        ng-class="{open: map.currentAction}">
          <h3 class="action-title" ng-bind="map.currentAction.title"></h3>
          <div class="action-content">
            <p class="action-description" ng-if="map.currentAction.description" ng-bind-html="map.currentAction.description|trusted"></p>
            <a class="btn orange-btn" ng-click="map.showRegistration(map.currentAction.uuid)">Rejoindre cette action !</a>
          </div>
          <div class="action-details">
            <a class="action-close" ng-click="map.currentAction = null">Fermer</a>
            Par <div class="action-author-picture" ng-style="{'background-image': 'url(' + map.currentAction.author_avatar_url + ')'}"></div><a class="action-author" ng-bind="map.currentAction.author_name"></a>, le
            <span class="action-date" ng-bind="map.currentAction.created_at|date:'dd/MM'"></span>
          </div>
        </div>
        <div id="map-container"></div>
      </div>
    </div>
  <!-- Scripts -->
  <script src="<?php echo get_template_directory_uri(); ?>/js/jquery.js" type="text/javascript"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/angular.min.js" type="text/javascript"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/jquery.csv.min.js" type="text/javascript"></script>
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

  </body>
</html>

