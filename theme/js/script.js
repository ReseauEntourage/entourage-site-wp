jQuery(document).ready(function($) {

	// MOBILE DOWNLOAD BUTTON //

	var mobileOS = getMobileOperatingSystem();

	if (mobileOS == 'iOS')
    	$('.iphone-btn').css('display', 'inline-block');
  	else if (mobileOS == 'Android')
	    $('.android-btn').css('display', 'inline-block');


	// FIXED HEADER //

	$(window).scroll(function(){
		$('#site-header-fixed:not(.keep-show)').toggleClass('show', $(window).scrollTop() >= 50);
	});


	// ANCHOR: ANIMATED SCROLL //

	$('a[href^="#"]').on('click', function() {
		var page = $(this).attr('href');
		$('html, body').animate( { scrollTop: $(page).offset().top }, 500 );
		return false;
	});


	// FORMS //

	$('#contact-form').on('submit', function(e) {
	    $.ajax({
           type: "POST",
           url: $('#contact-form').attr('action'),
           data: $("#contact-form").serialize(),
           success: function(data) {
				if (data == 'success')
				{
					$('html, body').animate({ scrollTop: $('.section_page-contact').offset().top });
					$('#contact-form').addClass('success').html('Message bien envoyé ! Nous vous répondrons rapidement.');
				}
				else
					alert(data);
           }
         });

	    e.preventDefault();
	});

	$('#asso-form').on('submit', function(e) {
		$("#form-errors").hide();
		e.preventDefault();

	    $.ajax({
			type: "POST",
			url: 'https://api.entourage.social/api/v1/registration_requests',
			//url: 'https://entourage-back-preprod.herokuapp.com/api/v1/registration_requests',
			data: {
           		registration_request: {
		            organization: {
		              name: $('#registration_form-1-name').val(),
		              local_entity: $('#registration_form-1-local_entity').val(),
		              address: $('#registration_form-1-address').val(),
		              phone: $('#registration_form-1-phone').val(),
		              email: $('#registration_form-1-email').val(),
		              website_url: $('#registration_form-1-website_url').val(),
		              description: $('#registration_form-1-description').val(),
		              logo_key: $('#registration_form-1-logo_key').val(),
		            },
		            user: {
		              first_name: $('#registration_form-2-first_name').val(),
		              last_name: $('#registration_form-2-last_name').val(),
		              phone: $('#registration_form-2-phone').val(),
		              email: $('#registration_form-2-email').val(),
		            },
	            },
	        },
	        dataType: 'json',
        })
        .done(function(data) {
			$('html, body').animate({ scrollTop: $('.section_page-adherer').offset().top });
			$('#asso-form').addClass('success').html('Votre association a bien été inscrite ! Nous reviendrons vers vous rapidement :)');
        })
        .fail(function(data) {
	        var organization_errors = JSON.parse(data.responseText).errors.organization;
	        $("#form-errors").show()
	        $("#form-errors-list").html("");
	        organization_errors.forEach(function(entry) {
	          	$("#form-errors-list").append("<li>Association : "+entry+"</li>")
	        });
	        
	        var contact_errors = JSON.parse(data.responseText).errors.user;
	        contact_errors.forEach(function(entry) {
          		$("#form-errors-list").append("<li>Administrateur : "+entry+"</li>")
	        });

	        alert("Nous n'avons pas pu vous inscrire car il y a des erreurs dans le formulaire");
	    });
	});


	// NEWSLETTER //

	$('#newsletter-email').on('keypress', function(e){
		if (e.keyCode == 13)
			$('#subscribe-newsletter').click();
	});

	$('#subscribe-newsletter').click(function() {
	    var email = $('#newsletter-email').val();
	    $.ajax({
			type: "POST",
			url: "https://api.entourage.social/api/v1/newsletter_subscriptions",
			data: { "newsletter_subscription": { "email": email, "active": true } },
			success: function(){
				$('.section-newsletter').addClass('success').html('<p>Vous êtes bien inscrit à notre newsletter ! A bientôt :)</p>');
        gtag('event', 'Newsletter', {'event_category': 'Engagement', 'event_label': 'Website'});
				fbq('track', 'CompleteRegistration');
			},
			error: function(){
				alert("Nous n'avons pas pu vous ajouter, vérifiez le format de l'email");
			}
	    });
	});


	// EVENTS TRACKING //

  // https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data#handle_timeouts
  function withTimeout(callback, opt_timeout) {
    var called = false;
    function fn() {
      if (!called) {
        called = true;
        callback();
      }
    }
    setTimeout(fn, opt_timeout || 1000);
    return fn;
  }

  // https://support.google.com/analytics/answer/7478520
  function gtagOutboundClickEvent(jqEvent, action, parameters) {
    var element = jqEvent.target,
        url = element.href;
    parameters = parameters || {};

    if (!url ||
        element.target === '_blank' ||
        jqEvent.ctrlKey || jqEvent.metaKey || jqEvent.shiftKey || jqEvent.altKey) {
      // do nothing
    } else {
      jqEvent.preventDefault();
      parameters.event_callback = withTimeout(function(){document.location = url});
      parameters.transport_type = 'beacon';
    }

    gtag('event', action, parameters);
  }

	$('[ga-event]').on('click', function(e){
		var attr = $(this).attr('ga-event').split(" "),
        action = null,
        parameters = {};

    if (!attr[1]) {
      console.info('gtag_send error: no action. attr.', attr);
      return;
    }

    action = attr[1];
    parameters.event_category = attr[0];
		if (attr[2]) {
			parameters.event_label = attr[2];
		}

		console.info('gtag_send', 'event', action, parameters);
		gtagOutboundClickEvent(e, action, parameters);
	});

	$('.iphone-btn').on('click', function(e){
    gtagOutboundClickEvent(e, 'AppDownload', {'event_category': 'Engagement', 'event_label': 'iOS'});
		fbq('track', 'Lead', {'content_name': 'iOS'});
	});

	$('.android-btn').on('click', function(e){
    gtagOutboundClickEvent(e, 'AppDownload', {'event_category': 'Engagement', 'event_label': 'Android'});
    fbq('track', 'Lead', {'content_name': 'Android'});
	});

	$('#banner-app-download').find('.app-download-btn').on('click', function(e){
    gtagOutboundClickEvent(e, 'AppDownload', {'event_category': 'Engagement', 'event_label': mobileOS});
    fbq('track', 'Lead', {'content_name': mobileOS});
	});


	// MOBILE NAV //

	$('#site-header-nav-mobile').on('click', function(){
		$('html').toggleClass('nav-open');
	});


	// APP DOWNLOAD BANNER //

	if (!localStorage.getItem('no-app-download-banner'))
		$('body').addClass('show-banner-app');

	$('#banner-app-download').find('.close').on('click', function(){
		$('body').removeClass('show-banner-app');
		localStorage.setItem('no-app-download-banner', 1);
	});


	// ADDRESS SEARCH BAR //

	if ($('#ask-location').length) {

		// Google's url for async maps initialization accepting callback function
	    var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyATSImG1p5k6KydsN7sESLVM2nREnU7hZk&libraries=places&callback=';

		var asyncLoad = function(asyncUrl, callbackName) {
			var script = document.createElement('script');
			script.src = asyncUrl + callbackName;
			document.body.appendChild(script);
	    };

	    asyncLoad(asyncUrl, 'googleMapsInitialized');

	    if (!navigator.geolocation)
	    	$('#ask-location').hide();

	    $('#ask-location').on('click', function() {
	    	navigator.geolocation.getCurrentPosition(function(position) {
			    window.location = "/app?lat=" + position.coords.latitude + '&lng=' + position.coords.longitude; 
			});
	    });
    }

    $('#banner-don').on('click', function(){
    	window.location = "/le-don-de-chaleur-humaine?src=banner";
    });


	// ENTOURAGE SHARING WINDOW 

	var apiUrl = 'https://api.entourage.social/api/v1/public';
	var searchToken = /^\/entourages\/([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}|e[a-zA-Z0-9_-]{11})$/.exec(window.location.pathname);
	
	if (searchToken) {
		$band = $('#entourage-window');

		$.get(apiUrl + '/entourages/' + searchToken[1], function(data) {
			var entourage = data.entourage
			var html = '<p class="need-you"><b class="user-name">' + entourage.author.display_name + '</b> a besoin de vous !</p>';
			html += '<div class="entourage-card">';
			html += '<h1 class="entourage-name">' + entourage.title + '</h1>';
			html += '<p class="entourage-info">';
			if (entourage.author.avatar_url)
				html += '<i class="user-picture" style="background-image: url(' + entourage.author.avatar_url + ')"></i>';
			html += '<span class="user-name">' + entourage.author.display_name + '</span>';
			html += '<span class="created-time"> - ' + entourage.created_at + '</span>';
			if (entourage.approximated_location)
				html += ', <span>' + entourage.approximated_location + '</span>';
			html += '</p>';

			if (entourage.description.length)
				html += '<p class="entourage-description">' + entourage.description + '</p>';

			html += '</div></div>';

			$band.html(html).slideDown();

			setTimeout(function(){
				$('html, body').animate( { scrollTop: $band.offset().top - 50 }, 500 );
			}, 2000);
			
			$band.find('a.close-band').on('click', function(){
				$band.slideUp();
			});
		});
	}
	else
	{
		$(window).scroll();
	}

});

function googleMapsInitialized() {
	var input = document.getElementById('site-header-input');
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
	    types: ['(regions)'] 
  	});
  	Autocomplete.setComponentRestrictions({'country': ['fr', 'be', 'ca', 'ch', 'uk']});

	Autocomplete.addListener('place_changed', function() {
		var place = Autocomplete.getPlace();

		if (place.geometry)
			window.location = '/app?ville=' + place.formatted_address;
	});
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
      return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }

  return "unknown";
}