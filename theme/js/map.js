angular.module('entourageApp', ['ui.bootstrap'])
  .factory('googleMapsInitializer', function($window, $q){

    // maps loader deferred object
    var mapsDefer = $q.defer();

    // Google's url for async maps initialization accepting callback function
    var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyATSImG1p5k6KydsN7sESLVM2nREnU7hZk&libraries=places&callback=';

    // async loader
    var asyncLoad = function(asyncUrl, callbackName) {
      var script = document.createElement('script');
      script.src = asyncUrl + callbackName;
      document.body.appendChild(script);
    };

    // callback function - resolving promise after maps successfully loaded
    $window.googleMapsInitialized = function () {
        mapsDefer.resolve();
    };

    // loading google maps
    asyncLoad(asyncUrl, 'googleMapsInitialized');

    return {
        // usage: Initializer.mapsInitialized.then(callback)
        mapsInitialized : mapsDefer.promise
    };
  })
  .controller('MapController', ['$scope', '$filter', '$http', '$uibModal', 'googleMapsInitializer', function($scope, $filter, $http, $uibModal, googleMapsInitializer) {
    map = this
    map.infoWindow = null;
    map.currentAction = null;
    map.loaded = false;
    map.registrationToggle = false;
    map.currentAddress = null;
    map.hideAskLocation = !!navigator.geolocation;
    map.emptyArea = false;
    map.public = true;
    map.mobileView = isMobile();

    $.ajaxSetup({
      beforeSend: function(request, options) {
        if ((options.url.indexOf('https://entourage-back-preprod.herokuapp.com') == 0) || (options.url.indexOf('https://api.entourage.social') == 0)) {
          request.setRequestHeader("X-API-KEY", "26fb18404cb9d6afebc87349");
        }
      }
    });

    // logged user?
    if (localStorage.getItem('user') && (localStorage.getItem('keep_user') || sessionStorage.getItem('logged'))) {
      map.loggedUser = JSON.parse(localStorage.getItem('user'));
      map.public = false;
    }

    // set default filters
    if (map.public && map.mobileView) {
      map.filters = {
        status: 'open',
        period: '7'
      };
    }
    else {
      map.filters = {
        status: localStorage.getItem('filter_status') ? localStorage.getItem('filter_status') : '',
        period: localStorage.getItem('filter_period') ? localStorage.getItem('filter_period') : '90'
      };
    }

    initMap = function(position) {

      map.actions = [];

      // size of marker icons
      map.actionIcon = {
        meters: 250,
        pixels: null
      };

      // default parameters of our map (centered on France)
      map.mapObjectParams = {
        maxZoom: 15,
        minZoom: 3,
        zoom: 6,
        center: {
          lat: 48.8588376,
          lng: 2.2773456
        }
      };

      // center the map on the user position (if given)
      if (position && position.coords) {
        map.mapObjectParams.zoom = 13;
        map.mapObjectParams.center.lat = position.coords.latitude;
        map.mapObjectParams.center.lng = position.coords.longitude;
      }

      if (!map.public) {
        map.mapObjectParams.zoom = 14;
        map.mapObjectParams.minZoom = 14;
        map.mapObjectParams.maxZoom = 14;
        map.mapObjectParams.disableDefaultUI = true; 
      }

      map.mapObject = new google.maps.Map(document.getElementById('map-container'), map.mapObjectParams);

      // get actions
      if (map.public) {
        getAllActions();
      }
      else {

        // if shared action, center map on it before loading feed
        if (getQueryParams('token')) {
          $.ajax({
            type: 'GET',
            url: getApiUrl() + '/entourages/' + getQueryParams('token'),
            data: {
              token: map.loggedUser.token
            },
            success: function(data) {
              if (data.entourage) {
                map.mapObject.setCenter(new google.maps.LatLng(data.entourage.location.latitude, data.entourage.location.longitude));
              }
              getFeed();
            },
            error: function() {
              getFeed();
            }
          });
        }
        else {
          getFeed();
        }
      }
    }

    getFeed = function(refreshing) {
      if (refreshing) {
        clearMarkers();
        map.actions = [];
        map.refreshing = true;
      }

      data = {
        token: map.loggedUser.token,
        latitude: map.mapObject.getCenter().lat(),
        longitude: map.mapObject.getCenter().lng(),
        announcements: "v1"
      };

      if (map.filters.period != '') {
        data.time_range = map.filters.period * 24
      }

      $.ajax({
        type: 'GET',
        url: getApiUrl() + '/feeds',
        data: data,
        success: function(data) {
          if (data.feeds)
          {
            data.feeds.map(function(action){
              action.data.type = action.type;
              action = transformAction(action.data);
              if (action.type != 'Announcement') {
                action = createMarker(action);
              }
              map.actions.push(action);
              return action;
            });

            if (refreshing) {
              map.refreshing = false;
              $scope.$apply();
            }      
            else
              endInitMap();
          }
          else
            alert("Il y a eu une erreur, merci de réessayer ou de nous contacter");
          $scope.$apply();
        }
      });
    }

    getAllActions = function() {
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
          endInitMap();
        }
      });
    }

    endInitMap = function() {
      console.info("actions", map.actions);

      // display action if token in url
      if (getQueryParams('token')) {
        map.showAction({uuid: getQueryParams('token')});
      } 

      // redraw all icons when zoom changes
      markersCustomCSS();
      google.maps.event.addListener(map.mapObject, 'zoom_changed', markersCustomCSS);

      google.maps.event.addListener(map.mapObject, 'dragend', function(){
        if (map.public) {
          isMapEmpty();
        }
        else {
          getFeed(true);
        }
      });

      isMapEmpty();
      
      initSearchbox();

      // remove loader
      map.loaded = true;

      $scope.$apply();
    }

    createMarker = function(action) {
      action.latLng = new google.maps.LatLng(action.location.latitude, action.location.longitude);

      // create marker
      action.marker = new google.maps.Marker({
        id: map.actions.length,
        position: action.latLng,
        map: map.mapObject,
        title: translateTitle(action.status),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 0,
          strokeWeight: 0
        },
        animation: google.maps.Animation.DROP
      });

      // display action title when marker hovered
      action.marker.addListener('mouseover', showTitle);
      action.marker.addListener('mouseout', hideTitle);
      
      // show detailed action window when marker clicked
      action.marker.addListener('click', function(){
        map.showAction(null, this.id, true);
      });

      return action;
    }

    clearMarkers = function() {
      for (var i = 0; i < map.actions.length; i++) {
        if (map.actions[i].marker)
          map.actions[i].marker.setMap(null);
      }
    }

    translateTitle = function(status, active) {
      switch (status) {
        case 'open':
          title = 'En cours';
          break;
        case 'closed':
          title = 'Terminée';
          break;
        default:
          title = '';
      }
      if (active)
        title += ' (ouverte)';
      return title;
    }

    initSearchbox = function() {
      var Autocomplete = new google.maps.places.Autocomplete(document.getElementById('app-search-input'), {
        types: ['(cities)'] 
      });

      Autocomplete.addListener('place_changed', function() {
        var place = Autocomplete.getPlace();

        if (place.geometry) {
          map.currentAddress = place.formatted_address;
          localStorage.setItem('city', map.currentAddress);
          map.mapObject.setCenter(place.geometry.location);

          if (map.public) {
            map.mapObject.setZoom(13);
            isMapEmpty();
          }
          else {
            getFeed(true);
          }
          $scope.$apply(); 
        }
      });
    }

    isMapEmpty = function() {
      if (!map.public)
        return;
      var zoomLevel = map.mapObject.getZoom();
      if (zoomLevel >= 14)
        value = 1;
      else if (zoomLevel >= 13)
        value = 5;
      else
        value = 10;
      var bounds = map.mapObject.getBounds();
      if (!bounds)
        return;
      var count = 0;
      for (id in map.actions) {
        if (map.actions[id].marker.visible && bounds.contains(map.actions[id].marker.getPosition())){
          count += 1;
        }
      }
      map.emptyArea = count < value;
      $scope.$apply();
    }

    markersCustomCSS = function() {
      map.actionIcon.pixels = metersToPixels(map.actionIcon.meters, map.mapObject.getCenter().lat());
      $('#inline-style').text('.gm-style > div > div .gmnoprint {width: ' + map.actionIcon.pixels + 'px !important;height: ' + map.actionIcon.pixels + 'px !important;margin: -' + (map.actionIcon.pixels/2) + 'px !important; transform-origin: ' + (map.actionIcon.pixels/3) + 'px ' + (map.actionIcon.pixels/3) + 'px;}');
    }

    metersToPixels = function(meters, lat) {
      return meters / (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, map.mapObject.getZoom()));
    }

    showTitle = function() {
      map.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, map.actionIcon.pixels / -2),
        content: '<div class="gm-info-window" data-id="' + this.id + '"><b>' + map.actions[this.id].title + '</b><div><div class="action-author-picture" style="background-image: url(' + map.actions[this.id].author.avatar_url + ')"></div><b>' + map.actions[this.id].author.display_name + '</b>, le ' + $filter('date')(map.actions[this.id].created_at, 'dd/MM/yy') + '</div></div>'
      });
      map.infoWindow.open(map.mapObject, this);
    }

    hideTitle = function() {
      if (map.infoWindow)
        map.infoWindow.close();
    }

    $(document).on('click', '.gm-info-window', function(e){
      map.showAction(null, $(this).attr('data-id'));
    });

    map.showAction = function(action, index, apply) {
      hideTitle();

      if (index == undefined && action.uuid) {
        for (var i = 0; i < map.actions.length; i++) {
          var a = map.actions[i];

          if (action.uuid == a.id || action.uuid == a.uuid || action.uuid == a.uuid_v1)
            index = i;
        }
        if (index == undefined) {
          if (map.public)
            return;
          
          $.ajax({
            type: 'GET',
            url: getApiUrl() + '/entourages/' + action.uuid,
            data: {
              token: map.loggedUser.token
            },
            success: function(data) {
              if (data.entourage) {
                var action = transformAction(data.entourage)
                action = createMarker(action);
                map.currentAction = action;
                $scope.$apply();
              }
            }
          });
          return;
        }
      }

      if (index != undefined) {
        action = map.actions[index];
      }

      if (action) {
        map.currentAction = action;

        if (apply)
          $scope.$apply();
      }
    }

    map.logout = function() {
      localStorage.removeItem('user');
      localStorage.removeItem('keep-user');
      sessionStorage.removeItem('logged');
      window.location.reload();
    }

    // MODALS //

    map.hideRegistration = function() {
      map.registrationToggle = false;
    }

    map.showRegistration = function(token) {
      map.registrationToggle = true;

      // TODO: uncomment
      // if (token)
      //   ga('send', 'event', 'Click', 'Join', token);
      // else
      //   ga('send', 'event', 'Click', 'Join', 'Header');
    }

    map.toggleNewAction = function() {
      map.showNewAction = !map.showNewAction;
    }

    map.toggleProfileEdit = function() {
      map.showProfileEdit = !map.showProfileEdit;
    }

    map.toggleNewMessage = function(type, action, user) {
      map.showNewMessage = !map.showNewMessage;
      if (map.showNewMessage) {
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

    map.askLocation = function() {
      navigator.geolocation.getCurrentPosition(initMap, initMap);
    }

    // SEARCH + FILTERS //

    map.clearAddress = function() {
      map.currentAddress = null;
      $('#app-search-input').val('').focus();
      localStorage.removeItem('address');
      localStorage.removeItem('city');
    }

    map.filterActions = function(type, value) {
      map.filters[type] = value;
      localStorage.setItem('filter_status', map.filters.status);
      localStorage.setItem('filter_period', map.filters.period);

      if (map.public) {
        for (id in map.actions) {
          map.filterAction(id);
        }
        isMapEmpty();
      }
      else {
        getFeed(true);
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
        if (map.filters[f] != '') {
          if (f == 'status' && !map.public)
            continue;
          value += 1;
        }
      }
      return value;
    }

    // initialize the map when GoogleMaps script is loaded
    googleMapsInitializer.mapsInitialized.then(function() {
      if (getQueryParams('ville') && getQueryParams('ville') != 'undefined') {
        var city = getQueryParams('ville');
      }
      else if (localStorage.getItem('city') && !getQueryParams('token')) {
        var city = localStorage.getItem('city');
      }
      
      if (city) {
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

  }])
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function(){
              scope.$eval(attrs.ngEnter, {'event': event});
          });
          event.preventDefault();
        }
      });
    }
  })
  .directive('fileread', function () {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  });