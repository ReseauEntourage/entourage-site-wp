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
    map.phone = '';
    map.hideAskLocation = !!navigator.geolocation;
    map.filters = {
      status: localStorage.getItem('filter_status') ? localStorage.getItem('filter_status') : '',
      period: localStorage.getItem('filter_period') ? localStorage.getItem('filter_period') : ''
    };
    map.countries = [ [ "Afghanistan (‫افغانستان‬‎)", "af", "93" ], [ "Albania (Shqipëri)", "al", "355" ], [ "Algeria (‫الجزائر‬‎)", "dz", "213" ], [ "American Samoa", "as", "1684" ], [ "Andorra", "ad", "376" ], [ "Angola", "ao", "244" ], [ "Anguilla", "ai", "1264" ], [ "Antigua and Barbuda", "ag", "1268" ], [ "Argentina", "ar", "54" ], [ "Armenia (Հայաստան)", "am", "374" ], [ "Aruba", "aw", "297" ], [ "Australia", "au", "61", 0 ], [ "Austria (Österreich)", "at", "43" ], [ "Azerbaijan (Azərbaycan)", "az", "994" ], [ "Bahamas", "bs", "1242" ], [ "Bahrain (‫البحرين‬‎)", "bh", "973" ], [ "Bangladesh (বাংলাদেশ)", "bd", "880" ], [ "Barbados", "bb", "1246" ], [ "Belarus (Беларусь)", "by", "375" ], [ "Belgium (België)", "be", "32" ], [ "Belize", "bz", "501" ], [ "Benin (Bénin)", "bj", "229" ], [ "Bermuda", "bm", "1441" ], [ "Bhutan (འབྲུག)", "bt", "975" ], [ "Bolivia", "bo", "591" ], [ "Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387" ], [ "Botswana", "bw", "267" ], [ "Brazil (Brasil)", "br", "55" ], [ "British Indian Ocean Territory", "io", "246" ], [ "British Virgin Islands", "vg", "1284" ], [ "Brunei", "bn", "673" ], [ "Bulgaria (България)", "bg", "359" ], [ "Burkina Faso", "bf", "226" ], [ "Burundi (Uburundi)", "bi", "257" ], [ "Cambodia (កម្ពុជា)", "kh", "855" ], [ "Cameroon (Cameroun)", "cm", "237" ], [ "Canada", "ca", "1", 1, [ "204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905" ] ], [ "Cape Verde (Kabu Verdi)", "cv", "238" ], [ "Caribbean Netherlands", "bq", "599", 1 ], [ "Cayman Islands", "ky", "1345" ], [ "Central African Republic (République centrafricaine)", "cf", "236" ], [ "Chad (Tchad)", "td", "235" ], [ "Chile", "cl", "56" ], [ "China (中国)", "cn", "86" ], [ "Christmas Island", "cx", "61", 2 ], [ "Cocos (Keeling) Islands", "cc", "61", 1 ], [ "Colombia", "co", "57" ], [ "Comoros (‫جزر القمر‬‎)", "km", "269" ], [ "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243" ], [ "Congo (Republic) (Congo-Brazzaville)", "cg", "242" ], [ "Cook Islands", "ck", "682" ], [ "Costa Rica", "cr", "506" ], [ "Côte d’Ivoire", "ci", "225" ], [ "Croatia (Hrvatska)", "hr", "385" ], [ "Cuba", "cu", "53" ], [ "Curaçao", "cw", "599", 0 ], [ "Cyprus (Κύπρος)", "cy", "357" ], [ "Czech Republic (Česká republika)", "cz", "420" ], [ "Denmark (Danmark)", "dk", "45" ], [ "Djibouti", "dj", "253" ], [ "Dominica", "dm", "1767" ], [ "Dominican Republic (República Dominicana)", "do", "1", 2, [ "809", "829", "849" ] ], [ "Ecuador", "ec", "593" ], [ "Egypt (‫مصر‬‎)", "eg", "20" ], [ "El Salvador", "sv", "503" ], [ "Equatorial Guinea (Guinea Ecuatorial)", "gq", "240" ], [ "Eritrea", "er", "291" ], [ "Estonia (Eesti)", "ee", "372" ], [ "Ethiopia", "et", "251" ], [ "Falkland Islands (Islas Malvinas)", "fk", "500" ], [ "Faroe Islands (Føroyar)", "fo", "298" ], [ "Fiji", "fj", "679" ], [ "Finland (Suomi)", "fi", "358", 0 ], [ "France", "fr", "33" ], [ "French Guiana (Guyane française)", "gf", "594" ], [ "French Polynesia (Polynésie française)", "pf", "689" ], [ "Gabon", "ga", "241" ], [ "Gambia", "gm", "220" ], [ "Georgia (საქართველო)", "ge", "995" ], [ "Germany (Deutschland)", "de", "49" ], [ "Ghana (Gaana)", "gh", "233" ], [ "Gibraltar", "gi", "350" ], [ "Greece (Ελλάδα)", "gr", "30" ], [ "Greenland (Kalaallit Nunaat)", "gl", "299" ], [ "Grenada", "gd", "1473" ], [ "Guadeloupe", "gp", "590", 0 ], [ "Guam", "gu", "1671" ], [ "Guatemala", "gt", "502" ], [ "Guernsey", "gg", "44", 1 ], [ "Guinea (Guinée)", "gn", "224" ], [ "Guinea-Bissau (Guiné Bissau)", "gw", "245" ], [ "Guyana", "gy", "592" ], [ "Haiti", "ht", "509" ], [ "Honduras", "hn", "504" ], [ "Hong Kong (香港)", "hk", "852" ], [ "Hungary (Magyarország)", "hu", "36" ], [ "Iceland (Ísland)", "is", "354" ], [ "India (भारत)", "in", "91" ], [ "Indonesia", "id", "62" ], [ "Iran (‫ایران‬‎)", "ir", "98" ], [ "Iraq (‫العراق‬‎)", "iq", "964" ], [ "Ireland", "ie", "353" ], [ "Isle of Man", "im", "44", 2 ], [ "Israel (‫ישראל‬‎)", "il", "972" ], [ "Italy (Italia)", "it", "39", 0 ], [ "Jamaica", "jm", "1876" ], [ "Japan (日本)", "jp", "81" ], [ "Jersey", "je", "44", 3 ], [ "Jordan (‫الأردن‬‎)", "jo", "962" ], [ "Kazakhstan (Казахстан)", "kz", "7", 1 ], [ "Kenya", "ke", "254" ], [ "Kiribati", "ki", "686" ], [ "Kosovo", "xk", "383" ], [ "Kuwait (‫الكويت‬‎)", "kw", "965" ], [ "Kyrgyzstan (Кыргызстан)", "kg", "996" ], [ "Laos (ລາວ)", "la", "856" ], [ "Latvia (Latvija)", "lv", "371" ], [ "Lebanon (‫لبنان‬‎)", "lb", "961" ], [ "Lesotho", "ls", "266" ], [ "Liberia", "lr", "231" ], [ "Libya (‫ليبيا‬‎)", "ly", "218" ], [ "Liechtenstein", "li", "423" ], [ "Lithuania (Lietuva)", "lt", "370" ], [ "Luxembourg", "lu", "352" ], [ "Macau (澳門)", "mo", "853" ], [ "Macedonia (FYROM) (Македонија)", "mk", "389" ], [ "Madagascar (Madagasikara)", "mg", "261" ], [ "Malawi", "mw", "265" ], [ "Malaysia", "my", "60" ], [ "Maldives", "mv", "960" ], [ "Mali", "ml", "223" ], [ "Malta", "mt", "356" ], [ "Marshall Islands", "mh", "692" ], [ "Martinique", "mq", "596" ], [ "Mauritania (‫موريتانيا‬‎)", "mr", "222" ], [ "Mauritius (Moris)", "mu", "230" ], [ "Mayotte", "yt", "262", 1 ], [ "Mexico (México)", "mx", "52" ], [ "Micronesia", "fm", "691" ], [ "Moldova (Republica Moldova)", "md", "373" ], [ "Monaco", "mc", "377" ], [ "Mongolia (Монгол)", "mn", "976" ], [ "Montenegro (Crna Gora)", "me", "382" ], [ "Montserrat", "ms", "1664" ], [ "Morocco (‫المغرب‬‎)", "ma", "212", 0 ], [ "Mozambique (Moçambique)", "mz", "258" ], [ "Myanmar (Burma) (မြန်မာ)", "mm", "95" ], [ "Namibia (Namibië)", "na", "264" ], [ "Nauru", "nr", "674" ], [ "Nepal (नेपाल)", "np", "977" ], [ "Netherlands (Nederland)", "nl", "31" ], [ "New Caledonia (Nouvelle-Calédonie)", "nc", "687" ], [ "New Zealand", "nz", "64" ], [ "Nicaragua", "ni", "505" ], [ "Niger (Nijar)", "ne", "227" ], [ "Nigeria", "ng", "234" ], [ "Niue", "nu", "683" ], [ "Norfolk Island", "nf", "672" ], [ "North Korea (조선 민주주의 인민 공화국)", "kp", "850" ], [ "Northern Mariana Islands", "mp", "1670" ], [ "Norway (Norge)", "no", "47", 0 ], [ "Oman (‫عُمان‬‎)", "om", "968" ], [ "Pakistan (‫پاکستان‬‎)", "pk", "92" ], [ "Palau", "pw", "680" ], [ "Palestine (‫فلسطين‬‎)", "ps", "970" ], [ "Panama (Panamá)", "pa", "507" ], [ "Papua New Guinea", "pg", "675" ], [ "Paraguay", "py", "595" ], [ "Peru (Perú)", "pe", "51" ], [ "Philippines", "ph", "63" ], [ "Poland (Polska)", "pl", "48" ], [ "Portugal", "pt", "351" ], [ "Puerto Rico", "pr", "1", 3, [ "787", "939" ] ], [ "Qatar (‫قطر‬‎)", "qa", "974" ], [ "Réunion (La Réunion)", "re", "262", 0 ], [ "Romania (România)", "ro", "40" ], [ "Russia (Россия)", "ru", "7", 0 ], [ "Rwanda", "rw", "250" ], [ "Saint Barthélemy", "bl", "590", 1 ], [ "Saint Helena", "sh", "290" ], [ "Saint Kitts and Nevis", "kn", "1869" ], [ "Saint Lucia", "lc", "1758" ], [ "Saint Martin (Saint-Martin (partie française))", "mf", "590", 2 ], [ "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508" ], [ "Saint Vincent and the Grenadines", "vc", "1784" ], [ "Samoa", "ws", "685" ], [ "San Marino", "sm", "378" ], [ "São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239" ], [ "Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966" ], [ "Senegal (Sénégal)", "sn", "221" ], [ "Serbia (Србија)", "rs", "381" ], [ "Seychelles", "sc", "248" ], [ "Sierra Leone", "sl", "232" ], [ "Singapore", "sg", "65" ], [ "Sint Maarten", "sx", "1721" ], [ "Slovakia (Slovensko)", "sk", "421" ], [ "Slovenia (Slovenija)", "si", "386" ], [ "Solomon Islands", "sb", "677" ], [ "Somalia (Soomaaliya)", "so", "252" ], [ "South Africa", "za", "27" ], [ "South Korea (대한민국)", "kr", "82" ], [ "South Sudan (‫جنوب السودان‬‎)", "ss", "211" ], [ "Spain (España)", "es", "34" ], [ "Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94" ], [ "Sudan (‫السودان‬‎)", "sd", "249" ], [ "Suriname", "sr", "597" ], [ "Svalbard and Jan Mayen", "sj", "47", 1 ], [ "Swaziland", "sz", "268" ], [ "Sweden (Sverige)", "se", "46" ], [ "Switzerland (Schweiz)", "ch", "41" ], [ "Syria (‫سوريا‬‎)", "sy", "963" ], [ "Taiwan (台灣)", "tw", "886" ], [ "Tajikistan", "tj", "992" ], [ "Tanzania", "tz", "255" ], [ "Thailand (ไทย)", "th", "66" ], [ "Timor-Leste", "tl", "670" ], [ "Togo", "tg", "228" ], [ "Tokelau", "tk", "690" ], [ "Tonga", "to", "676" ], [ "Trinidad and Tobago", "tt", "1868" ], [ "Tunisia (‫تونس‬‎)", "tn", "216" ], [ "Turkey (Türkiye)", "tr", "90" ], [ "Turkmenistan", "tm", "993" ], [ "Turks and Caicos Islands", "tc", "1649" ], [ "Tuvalu", "tv", "688" ], [ "U.S. Virgin Islands", "vi", "1340" ], [ "Uganda", "ug", "256" ], [ "Ukraine (Україна)", "ua", "380" ], [ "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971" ], [ "United Kingdom", "gb", "44", 0 ], [ "United States", "us", "1", 0 ], [ "Uruguay", "uy", "598" ], [ "Uzbekistan (Oʻzbekiston)", "uz", "998" ], [ "Vanuatu", "vu", "678" ], [ "Vatican City (Città del Vaticano)", "va", "39", 1 ], [ "Venezuela", "ve", "58" ], [ "Vietnam (Việt Nam)", "vn", "84" ], [ "Wallis and Futuna (Wallis-et-Futuna)", "wf", "681" ], [ "Western Sahara (‫الصحراء الغربية‬‎)", "eh", "212", 1 ], [ "Yemen (‫اليمن‬‎)", "ye", "967" ], [ "Zambia", "zm", "260" ], [ "Zimbabwe", "zw", "263" ], [ "Åland Islands", "ax", "358", 1 ] ];
    map.country = [ "France", "fr", "33" ];
    map.countriesToggle = false;

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
        url: "https://entourage-csv.s3-eu-west-1.amazonaws.com/production/entourages.csv",
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

            action.created_at = new Date(action.creation_date);
            action.description = replaceURLWithHTMLLinks(action.description)

            action.latLng = new google.maps.LatLng(action.latitude, action.longitude);

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

            // draw custom marker icon
            map.drawIcon(action);

            // display action title when marker hovered
            action.marker.addListener('mouseover', map.showTitle);
            
            // show detailed action window when marker clicked
            action.marker.addListener('click', map.showAction);

            map.actions.push(action);

            // hide if filters
            map.filterAction(i);

            // display action in url
            if (entourageId && (entourageId == action.uuid || entourageId == action.uuid_v1))
            {
              // google.maps.event.trigger(action.marker, 'mouseover');
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

    translateTitle = function (status, active) {
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

    map.initSearchbox = function() {
      var Autocomplete = new google.maps.places.Autocomplete(document.getElementById('app-search-input'), {
        types: ['(cities)'] 
      });

      Autocomplete.addListener('place_changed', function() {
        var place = Autocomplete.getPlace();

        if (place.geometry) {
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
        map.infoWindow.close();

      map.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, map.actionIcon.pixels / -2),
        content: '<div class="gm-info-window" data-id="' + this.id + '"><b>' + map.actions[this.id].title + '</b><div><div class="action-author-picture" style="background-image: url(' + map.actions[this.id].author_avatar_url + ')"></div><span class="action-author">' + map.actions[this.id].author_name + '</span>, le ' + $filter('date')(map.actions[this.id].created_at, 'dd/MM/yy') + '</div></div>'
      });
      map.infoWindow.open(map.mapObject, this);
    }

    $(document).on('click', '.gm-info-window', function(e){
      map.showAction($(this).attr('data-id'));
    });

    map.showAction = function(index) {
      if (this.id)
        index = this.id;
      if (map.currentAction)
        map.currentAction.marker.setTitle(translateTitle(map.currentAction.status));
      map.currentAction = map.actions[index];
      console.info('showAction', map.actions[index]);
      map.currentAction.marker.setTitle(translateTitle(map.currentAction.status, true));
      window.history.pushState('page2', map.actions[index].title, '/app/?token=' + map.actions[index].uuid);
      $scope.$apply();
    }

    map.hideAction = function(index) {
      map.currentAction.marker.setTitle(translateTitle(map.currentAction.status));
      map.currentAction = null;
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

    map.selectCountry = function(country) {
      map.country = country;
    }

    map.register = function() {
      if (!map.phone)
        return;
      var countryCode = map.country[1].toUpperCase();
      var phone = libphonenumber.parse(map.phone, countryCode);
      delete map.registrationError;

      if (!phone.phone) {
        map.registrationError = "Votre numéro n'est pas valide, merci de réessayer";
      }
      else {
        phone = libphonenumber.format(phone.phone, countryCode, 'International');

        if (!libphonenumber.isValidNumber(phone, countryCode)) {
          map.registrationError = "Votre numéro n'est pas valide, merci de réessayer";
        }
        else {
          
          // https://entourage-back-preprod.herokuapp.com/api/v1/users
          $.ajax({
            type: 'POST',
            url: 'https://api.entourage.social/api/v1/users',
            data: {
              user: {
                phone: phone
              }
            },
            success: function(data) {
              if (data.user)
              {
                map.invitationSent = true;
                ga('send', 'event', 'Register');
              }
              else
                map.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
              $scope.$apply();
            },
            error: function(data) {
              if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                map.registrationError = "Erreur : " + data.responseJSON.error.message[0]
              else
                map.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
              $scope.$apply();
            }
          });
        }
      }
    }

    map.askLocation = function() {
      navigator.geolocation.getCurrentPosition(map.init, map.init);
    }

    map.clearAddress = function() {
      map.currentAddress = null;
      $('#app-search-input').val('').focus();
    }

    map.clearFilters  = function() {
      map.filters = {
        status: '',
        period: ''
      };
      map.filterActions();
    }

    map.filterActions = function() {
      localStorage.setItem('filter_status', map.filters.status);
      localStorage.setItem('filter_period', map.filters.period);
      for (id in map.actions) {
        map.filterAction(id);
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

    map.shareFacebook = function(action) {
      FB.ui({
        method: 'feed',
        display: 'popup',
        link: 'http://entourage.social/app/?token=' + action.uuid,
      }, function(response){
        console.info(response);
      });
    }

    // initialize the map when GoogleMaps script is loaded
    googleMapsInitializer.mapsInitialized.then(function() {
      if (getQueryParams('ville') && getQueryParams('ville') != 'undefined') {
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


  }])
  .filter('trusted', ['$sce', function($sce){
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }]);




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