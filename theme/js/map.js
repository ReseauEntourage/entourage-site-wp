angular.module('entourageApp', ['ui.bootstrap', 'ImageCropper'])
  .controller('MapController', ['$scope', '$filter', '$http', '$uibModal', '$q', function($scope, $filter, $http, $uibModal, $q) {
    map = this
    map.infoWindow = null;
    map.currentAction = null;
    map.loaded = false;
    map.registrationToggle = false;
    map.currentAddress = null;
    map.hideAskLocation = !!navigator.geolocation;
    map.emptyArea = false;
    map.mobileView = isMobile();
    map.loggedUser = getLoggedUser();
    map.public = map.loggedUser ? false : true;
    map.showModal = {};

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

      // default parameters of our map (centered on Paris)
      map.mapObjectParams = {
        maxZoom: 15,
        minZoom: 5,
        zoom: 13,
        zoomControl: !map.mobileView,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
          lat: 48.85453279673971,
          lng: 2.3678111456542865
        }
      };

      // center the map on a custom position (if given)
      if (position && position.coords) {
        map.mapObjectParams.zoom = 13;
        map.mapObjectParams.center.lat = position.coords.latitude;
        map.mapObjectParams.center.lng = position.coords.longitude;
      }

      if (!map.public) {
        map.mapObjectParams.zoom = 14;
        map.mapObjectParams.minZoom = 12;
        map.mapObjectParams.maxZoom = 14;
      }

      map.mapObject = new google.maps.Map(document.getElementById('map-container'), map.mapObjectParams);

      setMarkersCustomStyle();

      definePopupClass();

      // when the user zooms the map
      google.maps.event.addListener(map.mapObject, 'zoom_changed', function() {
        setMarkersCustomStyle();

        if (!map.public) {
          map.getPrivateFeed();
        }
      });

      // when the user drags the map
      google.maps.event.addListener(map.mapObject, 'dragend', function(){
        if (map.public) {
          isMapEmpty();
        }
        else {
          map.getPrivateFeed();
        }
      });

      getActions();

      initSearchbox();
    }


    // ** ACTIONS **/

    getActions = function() {
      if (map.public) {
        getPublicActions();
      }
      else {
        google.maps.event.addListener(map.mapObject, 'bounds_changed', function() {
          if (!map.isMapReady) {
            map.isMapReady = true;
            initFeed();
          }
        });
      }
    }

    getPublicActions = function() {
      $.ajax({
        type: "GET",
        url: "https://entourage-csv.s3-eu-west-1.amazonaws.com/production/entourages.csv",
        dataType: "text",
        success: function(data) {
          data = $.csv.toObjects(data);
          for (var i = 0; i < Object.keys(data).length; i++) {
            action = data[i];
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
            action = createMarker(action);
            map.actions.push(action);

            // hide if filters
            map.filterAction(i);
          }

          // display action if token in url
          if (getQueryParams('token')) {
            map.showAction(getQueryParams('token'));
          } 

          generateMarkers();
          isMapEmpty();
          showCarousel();
          
          map.loaded = true;
          $scope.$apply();
        }
      });
    }

    initFeed = function() {
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

    map.getPrivateFeed = function(first) {
      clearMarkers();
      map.actions = [];
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
          if (data.feeds)
          {
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
              ]});

            data.feeds = data.feeds.map(function(action){
              action.data.type = action.type;
              action = transformAction(action.data);

              if (action.type == 'Entourage') {
                var visible = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(action.location.latitude, action.location.longitude), mapPoly);
                visible = visible && !(map.filters.status && action.status != map.filters.status)
                if (visible) {
                  map.actions.push(createMarker(action));
                }
              }

              return action;
            });

            generateMarkers();

            map.emptyArea = !map.actions.length;

            var announcementsCount = 0;
            data.feeds.map(function(action){
              if (action.type == 'Announcement') {
                if (announcementsCount == 0) {
                  map.actions.splice(1, 0, action);
                }
                else {
                  if (map.actions.length > 4) {
                    map.actions.splice(5, 0, action);
                  }
                  else {
                    map.actions.splice(map.actions.length, 0, action);
                  }
                }
                announcementsCount += 1;
              }
            });

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
          console.info(data);
          if (data.responseJSON && data.responseJSON.message && data.responseJSON.message == 'unauthorized') {
            map.logout();
          }
        }
      });
    }

    isMapEmpty = function() {
      var zoomLevel = map.mapObject.getZoom();
      if (zoomLevel >= 14)
        value = 1;
      else if (zoomLevel == 13)
        value = 2;
      else
        value = 5;

      var count = 0;
      var bounds = map.mapObject.getBounds();
      if (!bounds)
        return;
      for (id in map.actions) {
        if (!map.actions[id].marker)
          continue;
        if (map.actions[id].marker.visible && bounds.contains(map.actions[id].marker.getPosition())){
          count += 1;
        }
      }
      map.emptyArea = count < value;
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

    placeChanged = function(city, location) {
      map.currentAddress = city;
      localStorage.setItem('city', map.currentAddress);
      map.mapObject.setCenter(location);

      if (map.public) {
        map.mapObject.setZoom(13);
        isMapEmpty();
      }
      else {
        map.getPrivateFeed();
      }
      $scope.$apply(); 
    }

    map.profileRequired = function() {
      return !map.public && (!map.loggedUser.display_name || !map.loggedUser.has_password) && map.loaded;
    }

    map.showAction = function(uuid, apply) {
      hideMarkerTitle();

      searchAction = map.actions.filter(function(a){
        return (uuid == a.id || uuid == a.uuid || uuid == a.uuid_v1);
      });

      if (!searchAction.length) {
        if (map.public)
          return;
        
        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + uuid,
          data: {
            token: map.loggedUser.token
          },
          success: function(data) {
            if (data.entourage) {
              var action = transformAction(data.entourage);
              if (action.type == 'Entourage') {
                action = createMarker(action);
              }
              map.currentAction = action;
              $scope.$apply();
            }
          }
        });
      }
      else {
        map.currentAction = searchAction[0];

        if (apply)
          $scope.$apply();
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


    // ** MARKERS **/

    // default action size
    map.actionIcon = {
      meters: 250,
      pixels: null
    };

    createMarker = function(action) {
      action.latLng = new google.maps.LatLng(action.location.latitude, action.location.longitude);

      // create marker
      action.marker = new google.maps.Marker({
        id: action.uuid,
        position: action.latLng,
        map: map.mapObject,
        title: 'marker-action ' + action.status + ' id:' + action.uuid,
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
        if ($('#map-container .gm-style div[title*=marker-action]').length) {
          $('#map-container .gm-style div[title*=marker-action]').each(function(){
            var search = $(this).attr('title').match(/([a-z- ]*)?id:([a-zA-Z0-9_]*)/);
            $(this).addClass(search[1]).removeAttr('title');
            $(this).attr('id', 'marker-action-' + search[2]);
            if (map.currentAction && map.currentAction.uuid == search[2])
              $(this).addClass('opened');
          });
          clearInterval(intervalGenerateMarkers);
        }
      }, 1000);
    }

    showMarkerTitle = function(action, context) {
      map.popup = new Popup(new google.maps.LatLng(context.position.lat(), context.position.lng()), '<div class="popup-bubble-content-header capitalize-first-letter">' + action.title + '</div><div class="popup-bubble-content-bottom"><div class="action-author-picture" style="background-image: url(' + action.author.avatar_url + ')"></div><b>' + action.author.display_name + '</b>, <span class="date">le ' + $filter('date')(action.created_at, 'dd/MM') + '</span></div>');
      map.popup.setMap(map.mapObject);
    }

    hideMarkerTitle = function() {
      if (map.popup) {
        map.popup.setMap(null);
      }
    }

    clearMarkers = function() {
      for (var i = 0; i < map.actions.length; i++) {
        if (map.actions[i].marker)
          map.actions[i].marker.setMap(null);
      }
    }

    setMarkersCustomStyle = function() {
      map.actionIcon.pixels = metersToPixels(map.actionIcon.meters, map.mapObject.getCenter().lat());
      $('#inline-style').text('.gm-style .marker-action {width: ' + map.actionIcon.pixels + 'px !important;height: ' + map.actionIcon.pixels + 'px !important;margin: -' + (map.actionIcon.pixels/2) + 'px !important; transform-origin: ' + (map.actionIcon.pixels/3) + 'px ' + (map.actionIcon.pixels/3) + 'px;}');
    }

    metersToPixels = function(meters, lat) {
      return meters / (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, map.mapObject.getZoom()));
    }

    // Click a Marker
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
      map.showModal[name] = !map.showModal[name];

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
      localStorage.removeItem('city');
    }

    map.askLocation = function() {
      navigator.geolocation.getCurrentPosition(initMap, initMap);
    }


    // ** FILTERS ** //

    map.categoryTypes = getCategoryTypes();

    // Default/saved filters
    if (map.public && map.mobileView) {
      map.filters = {
        status: 'open',
        period: '7'
      };
    }
    else {
      map.filters = {
        status: (localStorage.getItem('filter_status') != null) ? localStorage.getItem('filter_status') : 'open',
        period: (localStorage.getItem('filter_period') != null) ? localStorage.getItem('filter_period') : '14',
        types: (localStorage.getItem('filter_types') != null) ? localStorage.getItem('filter_types').split(',') : ['as','ae','am','ar','ai','ak','ao','ah','cs','ce','cm','cr','ci','ck','co','ch','ou']
      };
    }

    map.toggleFilterType = function(categories) {
      for (id in categories) {
        var category = categories[id];
        var index = map.filters.types.indexOf(category);
        if (index == -1) {
          map.filters.types.push(category);
        }
        else {
          map.filters.types.splice(index, 1);
        }
      }
      map.filterActions('types', map.filters.types.join(','));
    }

    map.filterActions = function(type, value) {
      if (typeof map.filters[type] != 'object')
        map.filters[type] = value;
      localStorage.setItem('filter_' + type, value);

      if (map.public) {
        for (id in map.actions) {
          map.filterAction(id);
        }
        generateMarkers();
        isMapEmpty();
      }
      else {
        map.getPrivateFeed();
      }
    }

    map.filterAction = function(id) {
      var visible = true;
      if (map.filters.status != '') {
        visible = map.actions[id].status == map.filters.status;
      }
      if (visible && map.filters.period != '') {
        visible = new Date(map.actions[id].creation_date).getTime() >= new Date().setDate(new Date().getDate() - map.filters.period);
      }
      map.actions[id].marker.setVisible(visible);
    }

    map.activatedFilters = function() {
      var value = 0;
      for (f in map.filters) {
        if (f == 'types') {
          if (!map.public && (map.filters[f].indexOf('ou') == -1 || map.filters[f].indexOf('as') == -1 || map.filters[f].indexOf('cs') == -1))
            value += 1;
        }
        else if (map.filters[f] != '') {
          value += 1;
        }
      }
      return value;
    }


    // **  POPUPS ** //

    function definePopupClass() {
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
      var city = null;

      if (getQueryParams('ville') && getQueryParams('ville') != 'undefined') {
        city = getQueryParams('ville');
      }
      else if (localStorage.getItem('city')) {
        city = localStorage.getItem('city');
      }
      else if (map.loggedUser) {
        if (map.loggedUser.address && map.loggedUser.address.display_address) {
          city = map.loggedUser.address.display_address;
        }
      }
      
      if (city && !getQueryParams('token')) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'address': city}, function(results, status) {
          if (status === 'OK' && results[0]) {
            map.currentAddress = results[0].formatted_address;
            localStorage.setItem('city', results[0].formatted_address);
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
      else if (navigator.geolocation) {
        // ask user position
        navigator.geolocation.getCurrentPosition(initMap, initMap);
      }
      else {
        initMap();
      }
    });
  }]);
