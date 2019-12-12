<?php
/**
 * Template Name: App Page
 *
 */

    if (!empty($_GET['token'])) {
        $response = wp_remote_retrieve_body(wp_remote_get('https://api.entourage.social/api/v1/public/entourages/' . $_GET['token']));
        if (!empty($response)) {
            $response = json_decode($response);
            if (!empty($response->entourage->uuid)) {
                $entourage = $response->entourage;
            }
        }
    }

    $custom_fields = get_post_custom($wp_query->post->ID);

    if (!empty($entourage)) {
        $og_url = get_bloginfo('url') . "/app/?token=" . $_GET['token'];
        $og_title = $entourage->title;
        if ($entourage->group_type == "outing") {
            $og_description = "Rejoignez " . ucfirst($entourage->author->display_name) . " à cet événement convivial sur le réseau solidaire Entourage, pour ressentir la chaleur humaine des moments entre ";
            $og_image = 'img/share-fb-event.jpg';
        } else {
            $og_description = "Vous pouvez aider ? Rejoignez " . ucfirst($entourage->author->display_name) . " et les 50.000 membres du réseau solidaire Entourage et passez vous aussi concrètement à l'action pour les personnes sans-abri près de chez vous";
            $og_image = 'img/share-fb-2.png';
        }
    }
    else {
        $og_url = get_bloginfo('url') . "/app";
        $og_title = !empty($custom_fields['meta_titre']) ? $custom_fields['meta_titre'][0] : get_the_title($wp_query->post->ID);
        $og_description = !empty($custom_fields['meta_description']) ? $custom_fields['meta_description'][0] : get_bloginfo('description');
        $og_image = 'img/share-fb-2.png';
    }

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MQRM8TN');</script>
    <!-- End Google Tag Manager -->
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
    <meta property="og:image" content="<?php echo asset_url($og_image); ?>">
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
    <script src="<?php asset_url('js/lib/angular-touch.min.js'); ?>" type="text/javascript"></script>
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
    <script src="<?php asset_url('js/components/user-picture.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/user-name.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/login.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/messages.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-register.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/current-action.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/current-poi.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-action.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-event.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-required.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-edit.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-profile-user.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-message.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-new-picture.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-carousel.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-calendar.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-action-share.js'); ?>" type="text/javascript"></script>
    <script src="<?php asset_url('js/components/modal-search.js'); ?>" type="text/javascript"></script>
</head>

<body
    ng-app="entourageApp"
    ng-controller="MapController as map"
    ng-cloak
    ng-class="{'public-page': map.public}"
    >
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQRM8TN"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

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
                <span
                    class="title"
                    ng-bind-html="map.verbatim.title|trusted"
                    ></span>
                <span
                    ng-if="map.verbatim.subtitle"
                    class="subtitle"
                    ng-bind-html="map.verbatim.subtitle|trusted"
                    ></span>
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
                id="app-location"
                class="parent-dropdown"
                >
                <div
                    uib-dropdown
                    auto-close="outsideClick"
                    >
                    <a
                        uib-dropdown-toggle
                        class="btn site-header-btn select-custom"
                        >
                        <i class="material-icons">room</i>
                        <span
                            class="ellipsis"
                            ng-if="map.currentLocation"
                            ng-bind="map.currentLocation.short_name"
                            ></span>
                    </a>
                    <ul uib-dropdown-menu>
                        <li
                            id="app-location-search"
                            class="dropdown-menu-group"
                            >
                            <a>
                                <i class="material-icons">search</i>
                                <form autocomplete="off">
                                    <input
                                        id="app-location-search-input"
                                        type="text"
                                        ng-model="map.searchPlace"
                                        placeholder="Cherchez une ville..."
                                        />
                                </form>
                            </a>
                        </li>
                        <li
                            ng-if="map.showAskLocation"
                            class="dropdown-menu-group"
                            >
                            <a ng-click="map.askLocation()">
                                <i class="material-icons">my_location</i>Ma position
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <label class="no-mobile">Filtres :</label>
            <div
                id="app-filters"
                class="parent-dropdown"
                >
                <div
                    uib-dropdown
                    auto-close="outsideClick"
                    >
                    <a
                        uib-dropdown-toggle
                        class="btn site-header-btn select-custom"
                        >
                        <i class="material-icons">accessibility_new</i>
                        Actions
                    </a>
                    <ul uib-dropdown-menu>
                        <li
                            ng-if="!map.public"
                            class="dropdown-menu-group"
                            >
                            <a
                                ng-click="map.toggleFilterIds('types', ['as','ae','am','ar','ai','ak','ao','ah'])"
                                ng-class="{
                                    selected: map.filters.types.indexOf('as') > -1,
                                    unselected: map.filters.types.indexOf('as') == -1
                                }"
                                >
                                <i class="material-icons">error</i>
                                Demandes d'aide
                            </a>
                            <a
                                ng-click="map.toggleFilterIds('types', ['cs','ce','cm','cr','ci','ck','co','ch'])"
                                ng-class="{
                                    selected: map.filters.types.indexOf('cs') > -1,
                                    unselected: map.filters.types.indexOf('cs') == -1
                                }"
                                >
                                <i class="material-icons">people</i>
                                Offres d'aide
                            </a>
                            <a
                                ng-click="map.toggleFilterIds('types', ['ou'])"
                                ng-class="{
                                    selected: map.filters.types.indexOf('ou') > -1,
                                    unselected: map.filters.types.indexOf('ou') == -1
                                }"
                                >
                                <i class="material-icons">event</i>
                                Evénements solidaires
                            </a>
                        </li>
                        <li
                            ng-if="map.filters.types.length"
                            class="dropdown-menu-group"
                            >
                            <a class="dropdown-toggle">
                                <span ng-if="!map.public">Dernière mise à jour</span>
                                <span ng-if="map.public">Date de création</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li ng-repeat="period in map.availableFilters.periods">
                                    <a
                                        ng-click="map.filterMarkers('period', period.value)"
                                        ng-class="{
                                            selected: map.filters.period == period.value,
                                            unselected: map.filters.period != period.value
                                        }"
                                        ng-bind="period.label"
                                        >
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                id="pois-filter"
                class="parent-dropdown"
                >
                <div
                    uib-dropdown
                    auto-close="outsideClick"
                    >
                    <a
                        uib-dropdown-toggle
                        class="btn site-header-btn select-custom"
                        > 
                        <i class="material-icons">location_city</i> Structures solidaires
                    </a>
                    <ul uib-dropdown-menu>
                        <li class="dropdown-menu-group">
                             <a ng-click="map.toggleModal('search')">
                                <i class="material-icons">search</i> Rechercher
                            </a>    
                        </li>
                        <li class="dropdown-menu-group">
                            <a
                                ng-repeat="category in map.poisCategories"
                                ng-click="map.toggleFilterIds('pois', [category.id])"
                                ng-class="{
                                    selected: map.filters.pois.indexOf(category.id) > -1,
                                    unselected: map.filters.pois.indexOf(category.id) == -1
                                }"
                                >
                                <i
                                    class="action-icon poi-icon"
                                    ng-class="'category-' + category.id"
                                    ></i>
                                <span ng-bind="category.label"></span>
                            </a>
                        </li>
                        <li class="bottom-actions">
                            <a ng-click="map.toggleAllFilters('pois')">
                                <span ng-if="!map.filters.pois.length">Tout afficher</span>
                                <span ng-if="map.filters.pois.length">Tout cacher</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <a
                id="btn-calendar"
                class="btn dark-btn"
                ng-click="map.toggleModal('calendar')"
                >
                <i class="material-icons">event</i> Calendrier
            </a>
        </div>
        <div id="site-header-right">
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
                    <ul uib-dropdown-menu>
                        <li class="dropdown-menu-group">
                            <a ng-click="map.toggleModal('carousel')">
                                <i class="material-icons">info</i> Comment ça marche ?
                            </a>
                            <a href="http://www.entourage.social/" target="_blank">
                                <i class="material-icons">call_made</i> Visiter le site d'Entourage
                            </a>
                        </li>
                        <li class="dropdown-menu-group">
                            <a href="https://blog.entourage.social/2017/04/28/quelles-actions-faire-avec-entourage/" target="_blank">
                                <i class="material-icons">lightbulb_outline</i> Idées d'action
                            </a>
                            <a href="http://www.simplecommebonjour.org/" target="_blank">
                                <i class="material-icons">question_answer</i> Conseils pour oser la rencontre
                            </a>
                            <a href="https://blog.entourage.social/2017/04/28/comment-utiliser-l-application-entourage/" target="_blank">
                                <i class="material-icons">contact_support</i> Questions fréquentes
                            </a>
                        </li>
                        <li class="dropdown-menu-group">
                            <a href="https://blog.entourage.social/charte-ethique-grand-public/" target="_blank">
                                <i class="material-icons">school</i> Charte éthique
                            </a>
                            <a href="/contact/" target="_blank">
                                <i class="material-icons">email</i> Nous contacter
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                ng-if="!map.public"
                id="btn-new-action"
                class="parent-dropdown"
                >
                <div
                    uib-dropdown
                    class="right-align"
                    >
                    <a
                        uib-dropdown-toggle
                        class="btn orange-btn"
                        >
                        <i class="material-icons">add</i> Passer à l'action...
                    </a>
                    <ul uib-dropdown-menu>
                        <li class="dropdown-menu-group">
                            <a ng-click="map.toggleModal('newAction')">
                                <i class="material-icons">record_voice_over</i> Créer une action solidaire
                            </a>
                            <a ng-click="map.toggleModal('newEvent')">
                                <i class="material-icons">event</i> Créer un événement
                            </a>
                        </li>
                        <li class="dropdown-menu-group">
                            <a href="https://www.entourage.social/devenir-ambassadeur/" target="_blank">
                                <i class="material-icons">mic</i> Devenir ambassadeur d'Entourage
                            </a>
                            <a href="http://www.simplecommebonjour.org/" target="_blank">
                                <i class="material-icons">question_answer</i> Se former à la rencontre 
                            </a>
                            <a href="https://www.facebook.com/pg/EntourageReseauCivique/events/?ref=page_internal" target="_blank">
                                <i class="material-icons">people</i>Participer à nos événements
                            </a>
                            <a href="<?php echo get_option('donate_link'); ?>" target="_blank">
                                <i class="material-icons">favorite</i>Soutenir Entourage
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                ng-if="!map.public"
                id="user-messages"
                class="parent-dropdown"
                >
                <div
                    uib-dropdown
                    auto-close="outsideClick"
                    is-open="map.showMessages"
                    >
                    <a
                        uib-dropdown-toggle
                        class="btn btn-icon"
                        >
                        <i class="material-icons">mail</i>
                        <div
                            class="badge"
                            ng-if="map.loggedUser.notifications && map.loggedUser.notifications.length"
                            ng-bind="map.loggedUser.notifications.length"
                            ></div>
                    </a>
                    <messages
                        uib-dropdown-menu
                        user="map.loggedUser"
                        show="map.showMessages"
                        on-show-action="map.showAction(uuid)"
                        ></messages>
                </div>
            </div>
            <div
                ng-if="!map.public"
                id="user-menu"
                class="parent-dropdown"
                >
                <div uib-dropdown>
                    <a uib-dropdown-toggle>
                        <user-picture
                            class="no-mobile"
                            user="map.loggedUser"
                            clickable="false"
                            show-as-user="true"
                            ></user-picture>
                    </a>
                    <ul uib-dropdown-menu>
                        <li class="dropdown-menu-group mobile-only">
                            <a ng-click="map.toggleModal('profileEdit')">
                                <i class="material-icons">person_pin</i> Modifier mon profil
                            </a>
                            <a ng-click="map.logout()">
                                <i class="material-icons">power_settings_new</i> Me déconnecter
                            </a>
                        </li>
                        <li class="dropdown-menu-group mobile-only">
                            <a ng-click="map.toggleModal('carousel')">
                                <i class="material-icons">info</i> Comment ça marche ?
                            </a>
                            <a href="http://www.entourage.social/" target="_blank">
                                <i class="material-icons">call_made</i> Visiter le site d'Entourage
                            </a>
                        </li>
                        <li class="dropdown-menu-group mobile-only">
                            <a href="https://blog.entourage.social/2017/04/28/quelles-actions-faire-avec-entourage/" target="_blank">
                                <i class="material-icons">lightbulb_outline</i> Idées d'action
                            </a>
                            <a href="http://www.simplecommebonjour.org/" target="_blank">
                                <i class="material-icons">question_answer</i> Conseils pour oser la rencontre
                            </a>
                            <a href="https://blog.entourage.social/2017/04/28/comment-utiliser-l-application-entourage/" target="_blank">
                                <i class="material-icons">contact_support</i> Questions fréquentes
                            </a>
                        </li>
                        <li class="dropdown-menu-group mobile-only">
                            <a href="https://blog.entourage.social/charte-ethique-grand-public/" target="_blank">
                                <i class="material-icons">school</i> Charte éthique
                            </a>
                            <a href="/contact/" target="_blank">
                                <i class="material-icons">email</i> Nous contacter
                            </a>
                        </li>
                        <li class="no-mobile">
                            <a ng-click="map.toggleModal('profileEdit')">
                                <i class="material-icons">person_pin</i> Modifier mon profil
                            </a>
                            <a ng-if="map.featureFlags.organization_admin"
                               ng-click="map.openOrganizationAdmin($event)">
                                <i class="material-icons">business</i> Gérer {{map.loggedUser.partner.name | truncate:30}}
                            </a>
                            <a ng-click="map.logout()">
                                <i class="material-icons">power_settings_new</i> Me déconnecter
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                ng-if="map.public"
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
                ng-if="map.public"
                class="btn orange-btn"
                ng-click="map.toggleModal('register', 'Header')"
                >
                <span class="no-mobile"><i class="material-icons">group_add</i><?php echo $custom_fields['bouton'][0] ?></span>
                <span class="mobile-only">Inscription</span>
            </a>
        </div>
    </header>

    <modal-new-action
        ng-if="map.showModal.newAction"
        user="map.loggedUser"
        hide="map.toggleModal('newAction')"
        ></modal-new-action>

    <modal-new-event
        ng-if="map.showModal.newEvent"
        user="map.loggedUser"
        hide="map.toggleModal('newEvent')"
        ></modal-new-event>

    <modal-profile-required
        ng-if="map.profileRequired()"
        user="map.loggedUser"
        reload-feed="map.getPrivateFeed(true)"
        show-modal-carousel="map.showModal.carousel"
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
        toggle-new-action="map.toggleModal('newAction')"
        ></modal-carousel>

    <modal-calendar
        ng-if="map.showModal.calendar"
        user="map.loggedUser"
        map="map.mapObject"
        public="map.public"
        actions="map.actions"
        hide="map.toggleModal('calendar')"
        on-show-action="map.showAction(uuid)"
        ></modal-calendar>

    <modal-search
        ng-if="map.showModal.search && map.currentLocation"
        hide="map.toggleModal('search')"
        current-location="map.currentLocation"
        on-show-poi="map.showPoi(poi)"
        ></modal-search>

    <div id="page-content">
        <div
            id="map"
            ng-class="{'loading': map.refreshing}"
            >
            <feed
                user="map.loggedUser"
                actions="map.actions"
                current-action="map.currentAction"
                empty-area="map.emptyArea"
                on-show-action="map.showAction(uuid)"
                on-open-profile="map.toggleProfileEdit()"
                on-toggle-modal="map.toggleModal(page, token)"
                ></feed>
            <current-action
                map="map.mapObject"
                action="map.currentAction"
                public="map.public"
                show-register="map.toggleModal('register', token)"
                show-profile="map.showProfile(id)"
                user="map.loggedUser"
                show-over-modal="map.showModal.calendar"
                ></current-action>
            <current-poi
                map="map.mapObject"
                poi="map.currentPoi"
                show-over-modal="map.showModal.search"
                ></current-poi>
            <div id="map-container"></div>
            <div
                ng-if="map.currentZoom < 15"
                id="map-message"
                class="no-mobile"
                >
                Seules les actions récentes les plus proches du centre sont affichées (25 max). N'hésitez pas à déplacer la carte !
            </div>
        </div>
        <div id="popup-content"></div>
    </div>

    <!-- Analytics Code -->
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-68872992-1', 'auto', {'allowLinker': true});
        ga('send', 'pageview');
        ga('require', 'linker');
        ga('linker:autoLink', ['www.entourage.social', 'effet.entourage.social', 'don.entourage.social', 'entourage.iraiser.eu']);
    </script>

    <!-- Facebook JS SDK -->
    <script>
        window.fbAsyncInit = function() {
            FB.init({
              appId            : '280727035774134',
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v3.1'
            });
        };

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script>

    <!-- Your customer chat code -->
    <div
        class="fb-customerchat"
        attribution=setup_tool
        page_id="622067231241188"
        theme_color="#ff5100"
        logged_in_greeting="Bonjour ! Comment peut-on vous aider ?"
        logged_out_greeting="Bonjour ! Comment peut-on vous aider ?"
        greeting_dialog_display="hide"
        ></div>

  </body>
</html>