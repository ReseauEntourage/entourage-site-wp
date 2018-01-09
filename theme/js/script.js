jQuery(document).ready(function($) {


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
				ga('send', {
					hitType: 'event',
					eventCategory: 'Engagement',
					eventAction: 'Newsletter',
				});
				fbq('track', 'CompleteRegistration');
			},
			error: function(){
				alert("Nous n'avons pas pu vous ajouter, vérifiez le format de l'email");
			}
	    });
	});


	// EVENTS TRACKING //

	$('#header-download-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Engagement',
			eventAction: 'AppDownload',
			eventLabel: 'TopButton'
		});
		fbq('track', 'Lead', {'content_name': 'TopButton'});
	});

	$('.iphone-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Engagement',
			eventAction: 'AppDownload',
			eventLabel: 'iOS'
		});
		fbq('track', 'Lead', {'content_name': 'iOS'});
	});

	$('.android-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Engagement',
			eventAction: 'AppDownload',
			eventLabel: 'Android'
		});
		fbq('track', 'Lead', {'content_name': 'Android'});
	});

  /*
  Deprecated in favor of the Engagement/don event
	$('#donate-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Donate',
			eventAction: 'ClickDonate',
			eventLabel: 'FixedButton'
		});
		fbq('track', 'Purchase', {'content_name': 'FixedButton'});
	});

	$('#site-header .donate-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Donate',
			eventAction: 'ClickDonate',
			eventLabel: 'MenuButton'
		});
		fbq('track', 'Purchase', {'content_name': 'MenuButton'});
	});

	$('.site-footer .donate-btn').on('click', function(){
		ga('send', {
			hitType: 'event',
			eventCategory: 'Donate',
			eventAction: 'ClickDonate',
			eventLabel: 'FooterButton'
		});
		fbq('track', 'Purchase', {'content_name': 'FooterButton'});
	});
  */

	// MOBILE NAV //

	$('#site-header-nav-mobile').on('click', function(){
		$('html').toggleClass('nav-open');
	});


	// MOBILE DOWNLOAD BUTTON //

	var mobileOS = getMobileOperatingSystem();

	if (mobileOS == 'iOS')
    	$('.android-btn').hide();
  	else if (mobileOS == 'Android')
	    $('.iphone-btn').hide();


	if ($('#ask-location').length) {
		// ADDRESS SEARCH BAR //

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


	// ENTOURAGE SHARING WINDOW 

	var apiUrl = 'https://api.entourage.social/api/v1/public';
	var searchToken = /^\/entourages\/([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}|e[a-zA-Z0-9_-]{11})$/.exec(window.location.pathname);
	
	if (searchToken) {
		$band = $('#entourage-window');

		$.get(apiUrl + '/entourages/' + searchToken[1], function({entourage}) {
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
	var Autocomplete = new google.maps.places.Autocomplete(document.getElementById('site-header-input'), {
        types: ['(cities)'] 
      });

	Autocomplete.addListener('place_changed', function() {
		var place = Autocomplete.getPlace();
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