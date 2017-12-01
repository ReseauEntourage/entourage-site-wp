
angular.module('entourageApp', [])
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
  .controller('MapController', ['$scope', '$filter', '$http', 'googleMapsInitializer', function($scope, $filter, $http, googleMapsInitializer) {
    map = this

    map.actions = [];
    map.infoWindow = null;
    map.currentAction = null;
    map.loaded = false;
    map.registrationToggle = false;
    map.currentAddress = null;
    map.hideAskLocation = !!navigator.geolocation;
    map.filters = {
      status: null,
      created_at: null
    };

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
      },
      disableDefaultUI: true
    };

    map.init = function(position) {

      // center the map on the user position (if given)
      if (position && position.coords)
      {
        map.mapObjectParams.zoom = 13;
        map.mapObjectParams.center.lat = position.coords.latitude;
        map.mapObjectParams.center.lng = position.coords.longitude;
      }

      map.mapObject = new google.maps.Map(document.getElementById('map-container'), map.mapObjectParams);

      // get the list of actions
      $.ajax({
        type: "GET",
        url: "https://entourage-csv.s3-eu-west-1.amazonaws.com/development/entourages.csv",
        dataType: "text",
        success: function(data) {
          actions = $.csv.toObjects(data);
          console.info(actions);

          if (getQueryParams('token'))
            var entourageId = getQueryParams('token');

          for (var i = 0; i < Object.keys(actions).length; i++) {
            var action = actions[i];
            // if (action.status != 'open')
            //  continue;

            if (i%2)
              action.status = 'open';
            else
              action.status = 'close';

            action.created_at = new Date(action.creation_date);
            action.description = replaceURLWithHTMLLinks(action.description)

            action.latLng = new google.maps.LatLng(action.latitude, action.longitude);

            // create marker
            action.marker = new google.maps.Marker({
              id: map.actions.length,
              position: action.latLng,
              map: map.mapObject,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 0,
                strokeWeight: 0
              },
              animation: google.maps.Animation.DROP
            });

            // draw custom marker icon
            map.drawIcon(action);

            // display action title when marker hovered
            action.marker.addListener('mouseover', map.showTitle);
            
            // show detailed action window when marker clicked
            action.marker.addListener('click', map.showAction);

            map.actions.push(action);

            // display action in url
            if (entourageId && (entourageId == action.uuid || entourageId == action.uuid_v1))
            {
              console.info(i);
              console.info('url', action.title);
              google.maps.event.trigger(action.marker, 'mouseover');
              map.showAction(i);
              map.mapObject.setZoom(13);
              map.mapObject.setCenter(action.marker.getPosition());
            }
          }

          // redraw all icons when zoom changes
          google.maps.event.addListener(map.mapObject, 'zoom_changed', map.drawIcon);

          map.initSearchbox();

          // remove loader
          map.loaded = true;

          $scope.$apply();
        }
      });
    };

    map.initSearchbox = function() {
      var Autocomplete = new google.maps.places.Autocomplete(document.getElementById('app-search-input'), {
        types: ['(cities)'] 
      });

      Autocomplete.addListener('place_changed', function() {
        var place = Autocomplete.getPlace();
        console.info('place_changed', place);

        if (!place.geometry)
          return;
        else {
          map.currentAddress = place.formatted_address;
          map.mapObject.setZoom(13);
          map.mapObject.setCenter(place.geometry.location);
          $scope.$apply(); 
        }
      });
    }

    map.drawIcon = function(action) {
      if (action)
        lat = action.latLng.lat();
      else
        lat = map.actions[0].latLng.lat();
      map.actionIcon.pixels = metersToPixels(map.actionIcon.meters, lat);
      $('#inline-style').text('.gm-style > div > div .gmnoprint {width: ' + map.actionIcon.pixels + 'px !important;height: ' + map.actionIcon.pixels + 'px !important;margin: -' + (map.actionIcon.pixels/2) + 'px !important; transform-origin: ' + (map.actionIcon.pixels/3) + 'px ' + (map.actionIcon.pixels/3) + 'px;}');
    }

    metersToPixels = function(meters, lat) {
      return meters / (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, map.mapObject.getZoom()));
    }

    map.showTitle = function() {
      if (map.infoWindow)
      {
        map.infoWindow.close();
      }

      map.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, map.actionIcon.pixels / -2),
        content: '<div class="gm-info-window" data-id="' + this.id + '"><b>' + map.actions[this.id].title + '</b><span>Par <div class="action-author-picture" style="background-image: url(' + map.actions[this.id].author_avatar_url + ')"></div><a>' + map.actions[this.id].author_name + '</a>, le ' + $filter('date')(map.actions[this.id].created_at, 'dd/MM') + '</span></div>'
      });
      map.infoWindow.open(map.mapObject, this);
    }

    $(document).on('click', '.gm-info-window', function(e){
      map.showAction($(this).attr('data-id'));
    });

    map.showAction = function(index) {
      if (this.id)
        index = this.id;
      map.currentAction = map.actions[index];
      console.info('showAction', map.actions[index]);
      window.history.pushState('page2', map.actions[index].title, '/app/?token=' + map.actions[index].uuid);
      $scope.$apply();
    }

    map.isKeyEnter = function(e) {
      return e.keyCode == 13;
    }

    map.showRegistration = function(token) {
      map.registrationToggle = true;

      if (token)
        ga('send', 'event', 'Entourage', 'join', 'Join Entourage', token);
      else
        ga('send', 'event', 'Header', 'join');
    }

    map.register = function() {
      if (map.phone && map.phone.replace(/\s/g, '').match(/^[\+33]?0?[0-9]{9}/i))
      {
        // send phone
        map.invitationSent = true;
        delete map.registrationError;
        ga('send', 'event', 'Register');
      }
      else
      {
        map.registrationError = 'Votre numéro ne semble pas correct';
      }
      $scope.$apply();
    }

    map.askLocation = function() {
      navigator.geolocation.getCurrentPosition(map.init, map.init);
    }

    map.clearAddress = function() {
      map.currentAddress = null;
      $('#app-search-input').val('').focus();
    }

    map.filterActions = function() {
      for (action in map.actions) {
        var visible = true;
        if (map.filters.status) {
          visible = action.status == map.filters.status;
        }
        action.marker.setVisible(visible);
      }
    }


    // initialize the map when GoogleMaps script is loaded
    googleMapsInitializer.mapsInitialized.then(function() {
      if (getQueryParams('ville')) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'address': getQueryParams('ville')}, function(results, status) {
          if (status === 'OK' && results[0]) {
            map.currentAddress = results[0].formatted_address;
            map.init({
              coords: {
                latitude: parseFloat(results[0].geometry.location.lat()),
                longitude: parseFloat(results[0].geometry.location.lng())
              }
            });
          }
          else {
            map.init();
          }
        });
      }
      else if (navigator.geolocation) {

        // ask user position
        navigator.geolocation.getCurrentPosition(map.init, map.init);
      }
      else {
        map.init();
      }
    });


    //usefull functions

    function getQueryParams(search) {
      qs = window.location.search.split('+').join(' ');

      var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

      while (tokens = re.exec(qs)) {
          params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }

      return params[search];
    }

    function replaceURLWithHTMLLinks(text) {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
      return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
    }

    function geocodeLatLng(lat, lng) {
      
    }

  }])
  .filter('trusted', ['$sce', function($sce){
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }]);