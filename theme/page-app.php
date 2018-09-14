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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/png" href="<?php asset_url('img/fav.png'); ?>" />
    <title><?php
            echo get_bloginfo('name');
            if ( !empty($custom_fields['meta_titre']) )
                echo ' | '.$custom_fields['meta_titre'][0];
        ?></title>
    <meta name="description" content="<?php echo (!empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description')); ?>">
    <meta property="og:title" content="<?php echo htmlentities($og_title); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $og_url; ?>">
    <meta property="og:image" content="<?php asset_url('img/share-fb.png'); ?>">
    <meta property="og:description" content="<?php echo htmlentities($og_description); ?>">
    <meta property="fb:app_id" content="280727035774134">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link rel="stylesheet" href="<?php asset_url('css/countries.css'); ?>">
    <link rel="stylesheet" href="<?php asset_url('css/style.css'); ?>">
    <link rel="stylesheet" href="<?php asset_url('css/app.css'); ?>">
    <link rel="stylesheet" href="<?php asset_url('css/app-responsive.css'); ?>">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,500,100,300italic' rel='stylesheet' type='text/css'>

    <style id="inline-style" type="text/css"></style>

    <!-- Scripts -->
    <script src="<?php asset_url('js/lib/jquery.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/lib/angular.min.js'); ?>" type="text/javascript"></script>
    <!--script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min.js" type="text/javascript"></script-->
    <script src="<?php asset_url('js/lib/angular-sanitize.min.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/lib/ui-bootstrap-tpls-2.5.0.min.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/lib/image-crop.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/lib/jquery.csv.min.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/lib/phonenumber-js.min.js'); ?>" type="text/javascript"></script>
    
    <script src="<?php asset_url('js/functions.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/map.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/filters.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/directives.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/feed.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/action.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/action-participants-picture.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/user-name.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/login.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/messages.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-register.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/current-action.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-action.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-event.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-required.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-edit.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-user.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-message.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-picture.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-carousel.js'); ?>" type="text/javascript"></script>
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
            <div id="page-title-logo">
                <img
                    title="La carte des actions de la communauté d'Entourage"
                    src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange-big.png"
                    />
            </div>
            <h1>
                <a>Entourage</a>, <?php echo $custom_fields['titre'][0] ?>...
            </h1>
        </div>
    </div>

    <header
        id="site-header-fixed"
        ng-class="{'show': map.loaded, 'public': map.public}"
        >
        <a id="site-header-logo">
            <img
                src="<?php echo get_template_directory_uri(); ?>/img/logo-entourage-orange.png"
                alt="Logo de l'association Entourage"
            />
        </a>
        <div id="site-header-left">
            <div
                id="app-search"
                ng-class="{'active': searchFocus, 'enabled': map.currentAddress}"
                ng-click="map.currentAddress && map.clearAddress()"
                >
                <i class="icon material-icons">room</i>
                <span
                    id="app-search-address"
                    ng-bind="map.currentAddress"
                    ></span>
                <i
                    ng-if="map.currentAddress"
                    class="material-icons erase"
                    >
                    close 
                </i>
                <input
                    id="app-search-input"
                    type="text"
                    placeholder="Cherchez une ville..."
                    ng-hide="map.currentAddress"
                    ng-focus="searchFocus = true"
                    ng-blur="searchFocus = false"
                    autocomplete="nope"
                    >
                <i
                    id="ask-location"
                    ng-hide="map.hideAskLocation || map.currentAddress"
                    class="material-icons"
                    ng-click="map.askLocation()"
                    >my_location</i>
            </div>
            <div
                id="app-filters"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a
                        uib-dropdown-toggle
                        class="btn btn-icon"
                        >
                        <i class="material-icons">tune</i>
                        <div
                            class="badge"
                            ng-if="map.activatedFilters()"
                            ng-bind="map.activatedFilters()"
                            ></div>
                    </a>
                    <ul uib-dropdown-menu>
                        <li>
                            <a class="dropdown-toggle">
                                Date de création
                            </a>
                            <ul class="dropdown-menu">
                                <!--li>
                                    <a
                                        ng-if="map.public"
                                        ng-click="map.filterActions('period', '')"
                                        ng-class="{selected: !map.filters.period}"
                                        >
                                        Peu importe
                                    </a>
                                </li-->
                                <li>
                                    <a
                                        ng-click="map.filterActions('period', '7')"
                                        ng-class="{selected: map.filters.period == '7'}"
                                        >
                                        Moins d'une semaine
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.filterActions('period', '14')"
                                        ng-class="{selected: map.filters.period == '14'}"
                                        >
                                        Moins de 2 semaines
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.filterActions('period', '30')"
                                        ng-class="{selected: map.filters.period == '30'}"
                                        >
                                        Moins d'un mois
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.filterActions('period', '90')"
                                        ng-class="{selected: map.filters.period == '90'}"
                                        >
                                        Moins de 3 mois
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a class="dropdown-toggle">
                                Statut
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a
                                        ng-click="map.filterActions('status', '')"
                                        ng-class="{selected: !map.filters.status}"
                                        >
                                        Peu importe
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.filterActions('status', 'open')"
                                        ng-class="{selected: map.filters.status == 'open'}"
                                        >
                                        En cours
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.filterActions('status', 'closed')"
                                        ng-class="{selected: map.filters.status == 'closed'}"
                                        >
                                        Terminé
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li ng-if="!map.public">
                            <a class="dropdown-toggle">
                                Catégorie
                            </a>
                            <ul class="dropdown-menu">
                                <!--li ng-repeat="categoryType in map.categoryTypes">
                                    <a
                                        ng-bind="(categoryType.id == 'ask_for_help') ? 'Demandes' : 'Contributions'"
                                        ng-class="{selected: map.filters.types.indexOf(category.id) > -1}"
                                        ng-click="map.toggleFilterType(category.id)"
                                        ></a>
                                    <ul class="dropdown-menu">
                                        <li ng-repeat="category in map.categories">
                                            <a
                                                ng-click="map.toggleFilterType(categoryType.short_id + category.short_id)"
                                                ng-class="{selected: map.filters.types.indexOf(categoryType.short_id + category.short_id) > -1}"
                                                >
                                                <i
                                                    class="action-icon"
                                                    ng-class="categoryType.id + ' ' + category.id"
                                                    ></i>
                                                <span ng-bind="category[categoryType.id]"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </li-->
                                <li>
                                    <a
                                        ng-click="map.toggleFilterType(['as','ae','am','ar','ai','ak','ao','ah'])"
                                        ng-class="{selected: map.filters.types.indexOf('as') > -1}"
                                        >
                                        Demandes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.toggleFilterType(['cs','ce','cm','cr','ci','ck','co','ch'])"
                                        ng-class="{selected: map.filters.types.indexOf('cs') > -1}"
                                        >
                                        Contributions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        ng-click="map.toggleFilterType(['ou'])"
                                        ng-class="{selected: map.filters.types.indexOf('ou') > -1}"
                                        >
                                        Evénements
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div
            id="site-header-right"
            ng-if="!map.public"
            >
            <div
                id="help-menu"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a
                        uib-dropdown-toggle
                        class="btn"
                        >
                        <i class="material-icons">help</i> Besoin d'aide ?
                    </a>
                    <div uib-dropdown-menu>
                        <ul>
                            <!--li class="dropdown-menu-group">
                                <a ng-click="map.toggleModal('carousel')">
                                    <i class="material-icons">help_outline</i>Comment ça marche ?
                                </a>
                            </li-->
                            <li class="dropdown-menu-group">
                                <a href="https://blog.entourage.social/2017/04/28/quelles-actions-faire-avec-entourage/" target="_blank">
                                    <i class="material-icons">lightbulb_outline</i> Idées d'action
                                </a>
                                <a href="http://www.simplecommebonjour.org/" target="_blank">
                                    <i class="material-icons">question_answer</i> Conseils pour oser la rencontre
                                </a>
                                <a href="https://blog.entourage.social/2017/04/28/comment-utiliser-l-application-entourage/" target="_blank">
                                    <i class="material-icons">help</i> Questions fréquentes
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div
                id="btn-new-action"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a
                        uib-dropdown-toggle
                        class="btn orange-btn"
                        >
                        <i class="material-icons">add</i> Passer à l'action...
                    </a>
                    <div uib-dropdown-menu>
                        <ul>
                            <li class="dropdown-menu-group">
                                <a ng-click="map.toggleModal('newAction')">
                                    <i class="material-icons">record_voice_over</i> Créer une action solidaire
                                </a>
                                <a ng-click="map.toggleModal('newEvent')">
                                    <i class="material-icons">event</i> Créer un événement
                                </a>
                            </li>
                            <li class="dropdown-menu-group">
                                <a href="http://www.simplecommebonjour.org/" target="_blank">
                                    <i class="material-icons">question_answer</i> Se former à la rencontre 
                                </a>
                                <a href="https://www.facebook.com/pg/EntourageReseauCivique/events/?ref=page_internal" target="_blank">
                                    <i class="material-icons">people</i>Participer aux événements d'Entourage
                                </a>
                                <a href="https://www.entourage.social/don" target="_blank">
                                    <i class="material-icons">favorite</i>Soutenir Entourage
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <new-action
                ng-if="map.showModal.newAction"
                user="map.loggedUser"
                hide="map.toggleModal('newAction')"
                ></new-action>
            <new-event
                ng-if="map.showModal.newEvent"
                user="map.loggedUser"
                hide="map.toggleModal('newEvent')"
                ></new-event>
            <div
                id="user-messages"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a
                        uib-dropdown-toggle
                        class="btn btn-icon"
                        >
                        <i class="material-icons">mail</i>
                        <div
                            class="badge"
                            ng-if="map.loggedUser.unreadMessages"
                            ng-bind="map.loggedUser.unreadMessages"
                            ></div>
                    </a>
                    <messages
                        uib-dropdown-menu
                        user="map.loggedUser"
                        on-show-action="map.showAction(uuid)"
                    />
                </div>
            </div>
            <div
                id="user-menu"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a uib-dropdown-toggle>
                        <div class="action-participants-picture-container no-mobile">
                            <div class="action-participants-picture">
                                <div
                                    class="action-author-profile"
                                    ng-class="{'no-picture': !map.loggedUser.avatar_url}"
                                    ng-style="{'background-image': 'url(' + map.loggedUser.avatar_url + ')'}"
                                    ></div>
                            </div>
                            <div
                                ng-if="map.loggedUser.partner"
                                class="action-author-badge"
                                ng-style="{'background-image': 'url(' + map.loggedUser.partner.small_logo_url + ')'}"
                                ></div>
                        </div>
                    </a>
                    <div uib-dropdown-menu>
                        <ul>
                            <li class="dropdown-menu-group">
                                <a ng-click="map.toggleModal('profileEdit')">
                                    <i class="material-icons">person_pin</i> Modifier mon profil
                                </a>
                                <a ng-click="map.logout()">
                                    <i class="material-icons">power_settings_new</i> Me déconnecter
                                </a>
                            </li>
                            <li class="dropdown-menu-group">
                                <a href="http://www.entourage.social/" target="_blank">
                                    <i class="material-icons">question_answer</i> Visiter le site d'Entourage
                                </a>
                                <a href="https://blog.entourage.social/charte-ethique-grand-public/" target="_blank">
                                    <i class="material-icons">school</i> Charte éthique
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div
            id="site-header-right"
            ng-if="map.public"
            >
            <a
                id="site-header-info"
                class="btn no-mobile"
                href="https://www.entourage.social"
                target="_blank"
                title="Visiter le site de l'association Entourage"
                >
                <i class="material-icons">help</i>Entourage, c'est quoi ?
            </a>
            <div
                id="site-header-login"
                class="parent-dropdown"
                >
                <div
                    class="dropdown"
                    ng-class="{open: map.showModal.login}"
                    >
                    <a
                        class="dropdown-toggle link"
                        ng-click="map.toggleModal('login')"
                        >
                        <span class="no-mobile">Connectez-vous</span>
                        <span class="mobile-only">Connexion</span>
                    </a>
                    <div
                        id="login-window"
                        class="dropdown-menu"
                        >
                        <login ng-if="map.showModal.login"></login>
                    </div>
                </div>
            </div>
            <a
                class="btn orange-btn"
                ng-click="map.toggleModal('register', 'Header')"
                >
                <span class="no-mobile"><i class="material-icons">group_add</i><?php echo $custom_fields['bouton'][0] ?></span>
                <span class="mobile-only">Inscription</span>
            </a>
        </div>
    </header>

    <modal-profile-required
        ng-if="map.profileRequired()"
        user="map.loggedUser"
        reload-feed="map.getPrivateFeed(true)"
        ></modal-profile-required>

    <modal-profile-edit
        ng-if="map.showModal.profileEdit"
        user="map.loggedUser"
        reload-feed="map.getPrivateFeed()"
        hide="map.toggleModal('profileEdit')"
        ></modal-profile-edit>

    <modal-register
        ng-if="map.showModal.register"
        user="map.loggedUser"
        hide="map.toggleModal('register')"
        open-login="map.toggleModal('login')"
        ></modal-register>

    <modal-profile-user
        ng-if="map.currentProfileId"
        user="map.loggedUser"
        profile-id="map.currentProfileId"
        on-show-action="map.showAction(uuid)"
        ></modal-profile-user>

    <modal-carousel
        ng-if="map.showModal.carousel"
        hide="map.toggleModal('carousel')"
        ></modal-carousel>

    <div id="page-content">
        <div
            id="map"
            ng-class="{'loading': map.refreshing, 'full-width': map.public || (map.emptyArea && !map.refreshing)}"
            >
            <feed
                ng-if="!map.public && !map.emptyArea"
                user="map.loggedUser"
                actions="map.actions"
                on-show-action="map.showAction(uuid)"
                on-open-profile="map.toggleProfileEdit()"
                on-open-create-action="map.toggleModal('newAction')"
                ></feed>
            <div
                id="map-bottom-band"
                ng-class="{open: map.emptyArea && !map.refreshing}"
                >
                <i class="material-icons">error</i> Il y a peu d'action par ici... Et si vous y ajoutiez un peu de chaleur humaine en
                <a
                    ng-if="map.public"
                    ng-click="map.toggleModal('register', 'Bottom')"
                    >
                    rejoignant la communauté Entourage
                </a>
                <a
                    ng-if="!map.public"
                    ng-click="map.toggleModal('newAction')"
                    >
                    créant une action solidaire
                </a> ?!
            </div>
            <current-action
                ng-if="map.currentAction"
                map="map.mapObject"
                action="map.currentAction"
                public="map.public"
                show-register="map.toggleModal('register', token)"
                show-profile="map.showProfile(id)"
                user="map.loggedUser"
                ></current-action>

            <div id="map-container"></div>
        </div>
        <div id="popup-content"></div>
    </div>


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
        <img height="1" width="1" src="https://www.facebook.com/tr?id=1977352069219759&ev=PageView&noscript=1"/>
    </noscript>

    <!-- Facebook JS SDK -->
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.12&autoLogAppEvents=1&appId=280727035774134';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

    <!-- Your customer chat code -->
    <div
        ng-hide="map.mobileView && !map.public"
        class="fb-customerchat"
        attribution=setup_tool
        page_id="622067231241188"
        theme_color="#ff5100"
        logged_in_greeting="Bonjour ! Comment peut-on vous aider ?"
        logged_out_greeting="Bonjour ! Comment peut-on vous aider ?"
        greeting_dialog_display="hide"
        ></div>

    <script type="text/javascript">
        var _WEBSITE_DIRECTORY = '<?php echo get_template_directory_uri(); ?>';
    </script>

  </body>
</html>

