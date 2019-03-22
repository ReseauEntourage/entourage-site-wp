angular.module('entourageApp', ['ui.bootstrap', 'ImageCropper', 'ngTouch'])
  .controller('MapController', ['$scope', '$filter', '$http', '$uibModal', '$q', function($scope, $filter, $http, $uibModal, $q) {
    map = this
    map.infoWindow = null;
    map.currentAction = null;
    map.currentPoi = null;
    map.loaded = false;
    map.registrationToggle = false;
    map.currentAddress = null;
    map.hideAskLocation = !!navigator.geolocation;
    map.emptyArea = false;
    map.mobileView = isMobile();
    map.loggedUser = getLoggedUser();
    map.public = map.loggedUser ? false : true;
    map.showModal = {};
    map.showMessages = false;
    map.verbatim = getVerbatim();

    autoLogin = function() {
      var deferred = $q.defer();
      var authToken = getQueryParams('auth');

      if (!authToken) {
        deferred.resolve();
        return deferred.promise;
      }

      // remove the parameter from the URL
      var pathWithoutAuth = fullPathWithoutParam('auth');
      var authTokenUserId = parseInt(authToken.slice(2).split('-')[0]);

      if (isNaN(authTokenUserId) ||
          (!map.public && authTokenUserId === map.loggedUser.id)) {
        history.replaceState({}, document.title, pathWithoutAuth);
        deferred.resolve();
        return deferred.promise;
      }

      $.ajax({
        type: 'POST',
        url: getApiUrl() + '/login',
        data: {
          user: {
            auth_token: authToken
          }
        },
        success: function(data) {
          if (!data.user) {
            return;
          }
          // TODO: data.user.phone is not returned by the API, so it won't be set
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('keepLogged', false);
          sessionStorage.setItem('logged', 1);
          if (!data.user.has_password && !isDemoMode()) {
            ga('send', 'event', 'Engagement', 'FirstConnection', 'WebApp');
          }
          window.location = pathWithoutAuth;
        },
        complete: function() {
          history.replaceState({}, document.title, pathWithoutAuth);
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    initGoogleMaps = function() {
      // maps loader deferred object
      var mapsDefer = $q.defer();

      // Google's url for async maps initialization accepting callback function
      var APIKey = isDemoMode() ? 'AIzaSyATSImG1p5k6KydsN7sESLVM2nREnU7hZk' : 'AIzaSyBw3x8b-OTcK1mT3yJ94j4lhxmADI-uT-k';
      var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=' + APIKey + '&libraries=places,geometry&callback=';

      // async loader
      var asyncLoad = function(asyncUrl, callbackName) {
        var script = document.createElement('script');
        script.src = asyncUrl + callbackName;
        document.body.appendChild(script);
      };

      // callback function - resolving promise after maps successfully loaded
      window.googleMapsInitialized = function () {
        mapsDefer.resolve();
      };

      // loading google maps
      asyncLoad(asyncUrl, 'googleMapsInitialized');

      return mapsDefer.promise;
    }

    initMap = function(position) {

      map.actions = [];

      initFilters();

      // default parameters of our map (centered on Paris)
      map.mapObjectParams = {
        maxZoom: 15,
        minZoom: 14,
        zoom: 14,
        zoomControl: !map.mobileView,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
          lat: 48.85453279673971,
          lng: 2.3678111456542865
        },
        styles: getMapStyle()
      };

      // center the map on a custom position if given
      if (position && position.coords) {
        map.mapObjectParams.zoom = 14;
        map.mapObjectParams.center.lat = position.coords.latitude;
        map.mapObjectParams.center.lng = position.coords.longitude;
      }

      map.mapObject = new google.maps.Map(document.getElementById('map-container'), map.mapObjectParams);
      map.currentZoom = map.mapObject.getZoom();

      resizeMarkers();

      getActions();

      if (getQueryParams('page') && getQueryParams('page') == 'calendrier') {
        map.toggleModal('calendar');
      }

      // when the user zooms the map
      google.maps.event.addListener(map.mapObject, 'zoom_changed', function() {
        resizeMarkers();

        if (map.public) {
          filterActions();
        }
        else {
          map.getPrivateFeed();
        }
        getPois();
        map.currentZoom = map.mapObject.getZoom();
      });

      // when the user drags the map
      google.maps.event.addListener(map.mapObject, 'dragend', function(){
        if (map.public) {
          filterActions();
        }
        else {
          map.getPrivateFeed();
        }
        getPois();
      });

      initSearchbox();
      initPopupClass();
    }


    // ** ACTIONS **/

    getActions = function() {
      google.maps.event.addListener(map.mapObject, 'bounds_changed', function() {
        if (!map.isMapReady) {
          map.isMapReady = true;
          initFeed();
        }
      });
    }

    getPublicActions = function() {
      $.ajax({
        type: "GET",
        url: "https://entourage-csv.s3.eu-west-1.amazonaws.com/production/entourages.csv",
        dataType: "text",
        success: function(data) {
          data = $.csv.toObjects(data);
          for (var i = 0; i < Object.keys(data).length; i++) {
            action = data[i];
            action.type = 'Entourage';
            action.location = {
              latitude: action.latitude,
              longitude: action.longitude
            };
            action.created_at = new Date(action.creation_date);
            action.author = {
              display_name: action.author_name,
              avatar_url: action.author_avatar_url
            };
            action.description = replaceURLWithHTMLLinks(action.description);

            if (action.group_type == 'outing') {
              action.metadata = {
                starts_at: action.event_starts_at,
                display_address: action.event_display_address,
                google_place_id: action.google_place_id,
              }
              if (new Date(action.metadata.starts_at) < new Date()) {
                action.status = "closed";
              }
            }

            map.actions.push(associateMarker(action));
          }

          filterActions();

          showCarousel();

          console.info(map.actions)
          
          map.loaded = true;
          $scope.$apply();

          // display action if token in url
          if (getQueryParams('token')) {
            map.showAction(getQueryParams('token'));
          } 
        }
      });
    }

    initFeed = function() {
      if (map.public) {
        getPublicActions();
      }
      else {
        // if the profile onboarding modal is required,
        // the "first" run (open entourage from URL, handle deeplink)
        // will be run after that modal is closed
        var first = !map.profileRequired();

        // if shared action, center map on it before loading feed
        if (getQueryParams('token')) {
          $.ajax({
            type: 'GET',
            url: getApiUrl() + '/entourages/' + getQueryParams('token'),
            data: {
              token: map.loggedUser.token
            },
            success: function(data) {
              if (data.entourage && data.entourage.group_type != "conversation") {
                map.mapObject.setCenter(new google.maps.LatLng(data.entourage.location.latitude, data.entourage.location.longitude));
              }
              map.getPrivateFeed(first);
            },
            error: function() {
              map.getPrivateFeed(first);
            }
          });
        }
        else {
          map.getPrivateFeed(first);
        }
      }

      getPois();
    }

    map.getPrivateFeed = function(first) {
      map.refreshing = true;
      map.boundsSize = getBoundsSize(map.mapObject.getBounds());

      data = {
        token: map.loggedUser.token,
        latitude: map.mapObject.getCenter().lat(),
        longitude: map.mapObject.getCenter().lng(),
        distance: Math.ceil(Math.max(map.boundsSize.x, map.boundsSize.y) / 2 / 1000),
        announcements: 'v1',
        types: map.filters.types.join(',')
      };

      if (map.filters.period != '') {
        data.time_range = map.filters.period * 24;
      }

      $.ajax({
        type: 'GET',
        url: getApiUrl() + '/feeds',
        data: data,
        success: function(data) {
          if (data.feeds) {
            data.feeds = data.feeds.map(function(action) {
              action.data.type = action.type;
              return transformAction(action.data);
            });

            var actions = data.feeds.filter(function(action) {
              return (action.type == 'Entourage');
            }).map(function(action) {
              for (id in map.actions) {
                if (action.uuid == map.actions[id].uuid) {
                  var foundAction = map.actions[id];
                  map.actions.splice(id, 1);
                }
              }
              if (foundAction) {
                return foundAction;
              }
              return associateMarker(action);
            });

            clearAllMarkers('actions');

            map.actions = actions;

            filterActions();

            // Add announcements

            var announcements = data.feeds.filter(function(action) {
              return (action.type == 'Announcement');
            });

            for (id in announcements) {
              var announcement = announcements[id];

              if (id == 0) {
                map.actions.splice(2, 0, announcement);
              }
              else {
                map.actions.splice(5 * id, 0, announcement);
              }
            }

            if (first) {
              if (getQueryParams('token')) {
                // display action if token in url
                map.showAction(getQueryParams('token'));
              }
              handleDeeplinks();
            }

            console.info('actions', map.actions);

            map.refreshing = false;
            map.loaded = true;
            $scope.$apply();
          }
        },
        error: function(data) {
          if (data.responseJSON && data.responseJSON.message && data.responseJSON.message == 'unauthorized') {
            map.logout();
          }
        }
      });
    }

    filterActions = function() {
      var mapPoly = new google.maps.Polygon({
        paths: [
          {
            lat: map.mapObject.getBounds().getNorthEast().lat(),
            lng: map.mapObject.getBounds().getNorthEast().lng()
          },
          {
            lat: map.mapObject.getBounds().getNorthEast().lat(),
            lng: map.mapObject.getBounds().getSouthWest().lng()
          },
          {
            lat: map.mapObject.getBounds().getSouthWest().lat(),
            lng: map.mapObject.getBounds().getSouthWest().lng()
          },
          {
            lat: map.mapObject.getBounds().getSouthWest().lat(),
            lng: map.mapObject.getBounds().getNorthEast().lng()
          },
        ]
      });

      map.actions = map.actions.filter(function(action) {
        var visible = true;
        if (action.type == 'Entourage' && action.status != 'closed') {
          var inMap = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(action.location.latitude, action.location.longitude), mapPoly);
          visible = inMap;
        }
        if (visible && action.group_type != 'outing' && map.filters.period != '') {
          visible = action.created_at.getTime() >= new Date().setDate(new Date().getDate() - map.filters.period);
        }
        if (visible && action.status == 'closed') {
          visible = false;
        }
        if (map.public) {
          action.marker.setVisible(visible);
          action.hidden = !visible;
          return true;
        }
        else {
          if (!visible) {
            action.marker.setMap(null);
          }
          return visible;
        }
      });

      generateMarkers();
      isMapEmpty();
    }

    getPois = function() {
      
      clearAllMarkers('pois');

      if (!map.filters.pois.length) {
        return;
      }
      map.refreshing = true;
      map.boundsSize = getBoundsSize(map.mapObject.getBounds());

      data = {
        latitude: map.mapObject.getCenter().lat(),
        longitude: map.mapObject.getCenter().lng(),
        distance: Math.ceil(Math.max(map.boundsSize.x, map.boundsSize.y) / 1000),
        category_ids: map.filters.pois.join(',')
      };

      $.ajax({
        type: 'GET',
        url: getApiUrl() + '/pois',
        data: data,
        success: function(data) {
          if (data && data.pois) {
            map.pois = data.pois.map(function(poi) {
              poi.marker = new google.maps.Marker({
                id: poi.id,
                position: new google.maps.LatLng(poi.latitude, poi.longitude),
                map: map.mapObject,
                title: 'marker-map marker-poi poi-icon category-' + poi.category_id + ' id:' + poi.id,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillOpacity: 0,
                  strokeWeight: 0
                },
              });

              // display action title when marker hovered
              poi.marker.addListener('mouseover', function() {
                poi.marker.setTitle('');
                map.popup = new Popup(new google.maps.LatLng(this.position.lat(), this.position.lng()), `<div class="popup-bubble-content-header popup-poi capitalize-first-letter">${poi.name}</div><div class="popup-bubble-content-bottom"><i class="action-icon poi-icon category-${poi.category.id}"></i><b>${poi.category.name}</b></div>`);
                map.popup.setMap(map.mapObject);
              });
              poi.marker.addListener('mouseout', hideMarkerTitle);
              
              // show detailed window when marker clicked
              poi.marker.addListener('click', function(){
                if (map.currentPoi && map.currentPoi.id == poi.id) {
                  map.currentPoi = null;
                }
                else {
                  map.currentPoi = poi;
                }
                map.currentAction = null;
                $scope.$apply();
              });

              return poi;
            });
          }
          generateMarkers();

          map.refreshing = false;
          $scope.$apply();
        },
        error: function(data) {
          if (data.responseJSON && data.responseJSON.message && data.responseJSON.message == 'unauthorized') {
            map.logout();
          }
        }
      });
    }

    isMapEmpty = function() {
      if (!map.public) {
        map.emptyArea = !map.actions.filter(function(action) {
          return (action.type == 'Entourage');
        }).length;
      }
      else { 
        var zoomLevel = map.mapObject.getZoom();
        if (zoomLevel >= 14) {
          minAction = 1;
        }
        else if (zoomLevel == 13) {
          minAction = 2;
        }
        else {
          minAction = 5;
        }

        var count = 0;
        var bounds = map.mapObject.getBounds();
        if (!bounds) {
          return;
        }

        for (id in map.actions) {
          if (!map.actions[id].marker) {
            continue;
          }
          if (map.actions[id].marker.visible && bounds.contains(map.actions[id].marker.getPosition())){
            count += 1;
          }
        }
        map.emptyArea = count < minAction;
      }
      $scope.$apply();
    }

    getBoundsSize = function(bounds) {
      var NE = bounds.getNorthEast();
      var SW = bounds.getSouthWest();
      var NW = new google.maps.LatLng(NE.lat(), SW.lng());

      return {
        x: google.maps.geometry.spherical.computeDistanceBetween(NW, NE),
        y: google.maps.geometry.spherical.computeDistanceBetween(NW, SW)
      };
    }

    placeChanged = function(address, location) {
      map.currentAddress = address;
      localStorage.setItem('address', map.currentAddress);
      map.mapObject.setCenter(location);

      if (map.public) {
        filterActions();
      }
      else {
        map.getPrivateFeed();
      }
      getPois();
      $scope.$apply(); 
    }

    map.profileRequired = function() {
      return !map.public && (!map.loggedUser.display_name || !map.loggedUser.has_password) && map.loaded;
    }

    map.showAction = function(uuid, apply) {
      if (map.currentAction && map.currentAction.uuid == uuid) {
        map.currentAction = null;
        $scope.$apply();
        return; 
      }

      hideMarkerTitle();

      map.currentPoi = null;

      searchAction = map.actions.filter(function(a){
        return (uuid == a.id || uuid == a.uuid);
      });

      if (!searchAction.length) {
        if (map.public) {
          return;
        }

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + uuid,
          data: {
            token: map.loggedUser.token
          },
          success: function(data) {
            if (data.entourage) {
              var action = transformAction(data.entourage);
              if (data.entourage.group_type != "conversation") {
                map.mapObject.setCenter(new google.maps.LatLng(action.location.latitude, action.location.longitude));
                map.getPrivateFeed();
                getPois();
              }
              map.currentAction = action;
              $scope.$apply();
            }
          }
        });
      }
      else {
        map.currentAction = searchAction[0];

        if (apply) {
          $scope.$apply();
        }
      }
    }

    map.showProfile = function(id) {
      map.currentProfileId = id;
    }

    showCarousel = function() {
      if (!localStorage.getItem('carouselView')) {
        setTimeout(function() {
          map.showModal.carousel = true;
          $scope.$apply();
        }, 5000);
      }
    }


    // ** MARKERS ** //

    // default action size
    map.actionIcon = {
      meters: 250,
      pixels: null
    };

    associateMarker = function(action) {
      action.latLng = new google.maps.LatLng(action.location.latitude, action.location.longitude);

      var classes = ['marker-map marker-action', 'status-' + action.status];

      if (action.join_status) {
        classes.push('join-status-' + action.join_status);
      }

      if (action.number_of_unread_messages) {
        classes.push('unread');
      }

      if (action.group_type == 'outing') {
        classes.push('event');
      }

      classes.push('id:' + action.uuid);

      // create marker
      action.marker = new google.maps.Marker({
        id: action.uuid,
        position: action.latLng,
        map: map.mapObject,
        title: classes.join(' '),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 0,
          strokeWeight: 0
        },
        animation: google.maps.Animation.DROP
      });

      // display action title when marker hovered
      action.marker.addListener('mouseover', function() {
        action.marker.setTitle('');
        showMarkerTitle(action, this);
      });
      action.marker.addListener('mouseout', hideMarkerTitle);
      
      // show detailed action window when marker clicked
      action.marker.addListener('click', function(){
        map.showAction(action.uuid, true);
      });

      return action;
    }

    generateMarkers = function() {
      // need to wait the markers are in the DOM...
      var intervalGenerateMarkers = setInterval(function() {
        if ($('#map-container .gm-style div[title*=marker-map]').length) {
          $('#map-container .gm-style div[title*=marker-map]').each(function(){
            var search = $(this).attr('title').match(/([a-z-0-9_ ]*)?id:([a-zA-Z0-9_\-]*)/);
            $(this).addClass(search[1]).removeAttr('title');
            $(this).attr('id', 'marker-map-' + search[2]);
            if (map.currentAction && map.currentAction.uuid == search[2]) {
              $(this).addClass('active');
            }
            else if (map.currentPoi && map.currentPoi.id == search[2]) {
              $(this).addClass('active');
            }
          });
          clearInterval(intervalGenerateMarkers);
        }
      }, 1000);
    }

    showMarkerTitle = function(action, context) {
      map.popup = new Popup(new google.maps.LatLng(context.position.lat(), context.position.lng()), '<div class="popup-bubble-content-header capitalize-first-letter">' + action.title + '</div><div class="popup-bubble-content-bottom"><div class="action-author-picture" style="background-image: url(' + action.author.avatar_url + ')"></div><b>' + action.author.display_name + '</b>,&nbsp;<span class="date">le ' + $filter('date')(action.created_at, 'dd/MM') + '</span></div>');
      map.popup.setMap(map.mapObject);
    }

    hideMarkerTitle = function() {
      if (map.popup) {
        map.popup.setMap(null);
      }
    }

    clearAllMarkers = function(type) {
      for (id in map[type]) {
        if (map[type][id].marker) {
          map[type][id].marker.setMap(null);
        }
      }
    }

    resizeMarkers = function() {
      map.actionIcon.pixels = metersToPixels(map.actionIcon.meters, map.mapObject.getCenter().lat());
      style = '.gm-style .marker-action {width: ' + map.actionIcon.pixels + 'px !important;height: ' + map.actionIcon.pixels + 'px !important;margin: -' + (map.actionIcon.pixels/2) + 'px !important;}';
      style += '.gm-style .marker-poi {width: ' + map.actionIcon.pixels/2.5 + 'px !important;height: ' + map.actionIcon.pixels/2.5 + 'px !important;margin: -' + (map.actionIcon.pixels/2.5/2) + 'px !important;}';
      
      if (map.mapObject.getZoom() < 14) {
        style += '.gm-style .marker-map:after,.gm-style .marker-poi:before {display: none;}';
      }

      $('#inline-style').text(style);
    }

    metersToPixels = function(meters, lat) {
      return meters / (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, map.mapObject.getZoom()));
    }

    // when user clicks a marker
    $(document).on('click', '.gm-info-window', function(e){
      map.showAction($(this).attr('data-id'));
    });


    // ** MENU ** //

    map.logout = function() {
      localStorage.removeItem('user');
      localStorage.removeItem('keep-user');
      sessionStorage.removeItem('logged');
      window.location.reload();
    }


    // ** MODALS ** //

    map.toggleModal = function(name, token) {
      if (map.public && name != 'carousel' && name != 'register' && name != 'login' && name != 'calendar') {
        map.toggleModal('register');
        return;
      }

      map.showModal[name] = !map.showModal[name];

      if ((name == 'calendar' || name == 'login') && map.showModal[name]) {
        map.currentAction = null;
      }

      if (name == 'register' && map.showModal.register && !isDemoMode()) {
        ga('send', 'event', 'Click', 'Join', token);
      }
    }

    map.toggleNewMessage = function(type, action, user) {
      map.toggleModal('newMessage');
      if (map.showNew.message) {
        map.currentMessage = {
          type: type,
          action: action,
          user: user
        }
      }
      else {
        delete map.currentMessage;
      }
    }


    // ** SEARCH ** //

    initSearchbox = function() {
      var input = document.getElementById('app-search-input');
      var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

      function addEventListenerWrapper(type, listener) {
          // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
          // and then trigger the original listener.
          if (type == "keydown") {
              var orig_listener = listener;
              listener = function(event) {
                  var suggestion_selected = $('.pac-item-selected').length > 0;
                  if (event.which == 13 && !suggestion_selected) {
                      var simulated_downarrow = $.Event('keydown', {
                          keyCode: 40,
                          which: 40
                      });
                      orig_listener.apply(input, [simulated_downarrow]);
                  }
                  orig_listener.apply(input, [event]);
              };
          }
          _addEventListener.apply(input, [type, listener]);
      }

      input.addEventListener = addEventListenerWrapper;
      input.attachEvent = addEventListenerWrapper;

      var Autocomplete = new google.maps.places.Autocomplete(input, {
        bounds: map.mapObject.getBounds(),
        types: ['(regions)']
      });
      Autocomplete.setComponentRestrictions({'country': ['fr', 'be', 'ca', 'ch', 'uk']});

      Autocomplete.addListener('place_changed', function() {
        var place = Autocomplete.getPlace();

        if (place.geometry) {
          placeChanged(place.formatted_address, place.geometry.location);
        }
      });
    }

    map.clearAddress = function() {
      map.currentAddress = null;
      $('#app-search-input').val('').focus();
      localStorage.removeItem('address');
    }

    map.askLocation = function() {
      navigator.geolocation.getCurrentPosition(initMap, initMap);
    }


    // ** FILTERS ** //

    initFilters = function() {
      map.categoryTypes = getCategoryTypes();

      map.filters = {
        period: (localStorage.getItem('filter_period') != null) ? localStorage.getItem('filter_period') : '14',
        types: (localStorage.getItem('filter_types') != null) ? localStorage.getItem('filter_types').split(',') : ['as','ae','am','ar','ai','ak','ao','ah','cs','ce','cm','cr','ci','ck','co','ch','ou'],
        pois: (localStorage.getItem('filter_pois') != null) ? (localStorage.getItem('filter_pois').length ? localStorage.getItem('filter_pois').split(',') : []) : ['1', '2', '3', '4', '5', '6', '7']
      };
    }

    map.toggleFilterIds = function(type, ids) {
      if (!ids || !ids.length) {
        map.filters[type] = [];
      }
      else {
        for (id in ids) {
          var category = ids[id];
          var index = map.filters[type].indexOf(category);
          if (index == -1) {
            map.filters[type].push(category);
          }
          else {
            map.filters[type].splice(index, 1);
          }
        }
      }
      map.filterMarkers(type, map.filters[type].join(','));
    }

    map.filterMarkers = function(type, value) {
      if (typeof map.filters[type] != 'object') {
        map.filters[type] = value;
      }
      localStorage.setItem('filter_' + type, value);

      if (type == 'pois') {
        getPois();
      }
      else if (map.public) {
        filterActions();
      }
      else {
        map.getPrivateFeed();
      }
    }

    map.activatedFilters = function() {
      var value = 0;
      for (f in map.filters) {
        if (f == 'pois') {
          continue;
        }
        if (f == 'types') {
          if (!map.public && (map.filters[f].indexOf('ou') == -1 || map.filters[f].indexOf('as') == -1 || map.filters[f].indexOf('cs') == -1)) {
            value += 1;
          }
        }
        else if (map.filters[f] != '') {
          value += 1;
        }
      }
      return value;
    }


    // **  POPUPS ** //

    function initPopupClass() {
      /**
       * A customized popup on the map.
       * @param {!google.maps.LatLng} position
       * @param {!Element} content
       * @constructor
       * @extends {google.maps.OverlayView}
       */
      Popup = function(position, html) {
        this.position = position;

        var content = document.createElement('div');
        content.innerHTML = html;
        content.classList.add('popup-bubble-content');

        var pixelOffset = document.createElement('div');
        pixelOffset.classList.add('popup-bubble-anchor');
        pixelOffset.appendChild(content);

        this.anchor = document.createElement('div');
        this.anchor.classList.add('popup-tip-anchor');
        this.anchor.appendChild(pixelOffset);
      };

      Popup.prototype = Object.create(google.maps.OverlayView.prototype);

      Popup.prototype.onAdd = function() {
        this.getPanes().floatPane.appendChild(this.anchor);
      };

      Popup.prototype.onRemove = function() {
        if (this.anchor.parentElement) {
          this.anchor.parentElement.removeChild(this.anchor);
        }
      };

      Popup.prototype.draw = function() {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
        this.anchor.style.left = divPosition.x + 'px';
        this.anchor.style.top = (divPosition.y - 20) + 'px';
      };
    }


    // ** DEEPLINKS ** //

    handleDeeplinks = function() {
      var hash = window.location.hash;

      // remove the hash from the URL
      history.replaceState({}, document.title, window.location.pathname + window.location.search);

      if (hash === '#create-action') {
        map.toggleNewAction();
      }
      else if (hash === '#create-event') {
        map.toggleNewEvent();
      }
    }


    $.ajaxSetup({
      beforeSend: function(request, options) {
        if ((options.url.indexOf('https://entourage-back-preprod.herokuapp.com') == 0) || (options.url.indexOf('https://api.entourage.social') == 0)) {
          request.setRequestHeader("X-API-KEY", "26fb18404cb9d6afebc87349");
        }
      }
    });


    // ** INIT ** //

    autoLogin()
    .then(initGoogleMaps)
    .then(function() {
      if (map.loggedUser && map.loggedUser.address) {
        if (map.loggedUser.address.latitude) {
          initMap({
            coords: {
              latitude: map.loggedUser.address.latitude,
              longitude: map.loggedUser.address.longitude
            }
          });
        }
        else if (map.loggedUser.address.display_address) {
          initMapFromAddress(map.loggedUser.address.display_address);
        }
      }
      else {
        if (getQueryParams('ville') && getQueryParams('ville') != 'undefined') {
          initMapFromAddress(getQueryParams('ville'));
        }
        else if (localStorage.getItem('address')) {
          initMapFromAddress(localStorage.getItem('address'));
        }
        // ask user position
        else if (navigator.geolocation && !getQueryParams('token')) {
          navigator.geolocation.getCurrentPosition(initMap, initMap);
        }
        // if not
        else {
          initMap();
        }
      }
    });

    initMapFromAddress = function(address) {
      var geocoder = new google.maps.Geocoder;

      geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK' && results[0]) {
          map.currentAddress = results[0].formatted_address;
          localStorage.setItem('address', results[0].formatted_address);
          initMap({
            coords: {
              latitude: parseFloat(results[0].geometry.location.lat()),
              longitude: parseFloat(results[0].geometry.location.lng())
            }
          });
        }
        else {
          initMap();
        }
      });
    }
  }]);
