angular.module('entourageApp')
  .filter('trusted', ['$sce', function($sce){
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }])
  .filter('linkify', function(){
    return function(x) {
      return x.replace(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, '<a href="$2" target="_blank">$2</a>');
    };
  })
  .filter('showbr', function(){
    return function(x) {
      return x.replace(/\n/g, '<br>');
    };
  })
  .filter('timeAgo', function(){
	return function(x) {
  		var hoursAgo = Math.floor((new Date().getTime() - new Date(x).getTime()) / 3600000);
  		if (hoursAgo < 24)
  			return "aujourd'hui";

			var daysAgo = Math.floor(hoursAgo / 24);
			if (daysAgo < 2)
				return "hier";
			
      if (daysAgo < 3)
				return "avant-hier";
			if (daysAgo < 7)
				return "il y a " + daysAgo + " jours";

			var weeksAgo = Math.floor(weeksAgo / 7);
			if (weeksAgo < 2)
				return "la semaine dernière";
			if (weeksAgo < 4)
				return "il y a " + weeksAgo + " semaines";

			var monthAgo = Math.floor(daysAgo / 30.5);
			if (monthAgo < 2)
				return "ce mois-ci";
			if (monthAgo < 12)
				return "il y a " + monthAgo + " mois";

			var yearsAgo = Math.floor(monthAgo / 12);
			if (monthAgo < 12)
				return "il y a 1 an";
			
      return "il y a " + yearsAgo + " ans";
  	};
  })
  .directive('contenteditable', ['$sce', function($sce) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
		  	if (!ngModel) return;

			ngModel.$render = function() {
				element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
			};

			element.on('blur keyup change', function() {
				scope.$evalAsync(read);
			});

			element.on("paste", function(e) {
			    if (e.originalEvent && e.originalEvent.clipboardData) {
				    var text = e.originalEvent.clipboardData.getData("text/plain");
			    }
			    else if (e.clipboardData) {
			    	var text = e.clipboardData.getData("text/plain");
			    }

			    if (text) {
			    	document.execCommand("insertHTML", false, text);
			    	e.preventDefault();
			    }
			});

		  read();

		  function read() {
		    var html = element.html();
		    html = html.replace(/<div>(.[^<]*)<\/div>?/gi, '\n$1').trim()
		    ngModel.$setViewValue(html);
		  }
		}
	};
	}])
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
  })
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
    };
  });
