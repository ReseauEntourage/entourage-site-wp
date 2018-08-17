angular.module('entourageApp')
	.filter('trusted', ['$sce', function($sce){
		return function(text) {
	  		return $sce.trustAsHtml(text);
		};
	}])
	.filter('linkify', function(){
		return function(x) {
	  		return x.replace(/(https?:\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?)/gi, '<a href="$1" target="_blank">$1</a>');
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
	.filter('formatDate', function(){
		return function(x) {
			if (!x)
				return;
  			var keys = {
  				January: 'janvier',
  				February: 'février',
  				March: 'mars',
  				April: 'avril',
  				May: 'mai',
  				June: 'juin',
  				July: 'juillet',
  				August: 'août',
  				September: 'septembre',
  				October: 'octobre',
  				November: 'novembre',
  				December: 'décembre',
  				Jan: 'jan',
  				Feb: 'fév',
  				Mar: 'mars',
  				Apr: 'avril',
  				May: 'mai',
  				Jun: 'juin',
  				Jul: 'juil',
  				Aug: 'août',
  				Sep: 'sep',
  				Oct: 'oct',
  				Nov: 'nov',
  				Dec: 'déc',
  				Sunday: 'dimanche',
  				Monday: 'lundi',
  				Tuesday: 'mardi',
  				Wednesday: 'mercredi',
  				Thursday: 'jeudi',
  				Friday: 'vendredi',
  				Saturday: 'samedi',
  				Sun: 'dim',
  				Mon: 'lun',
  				Tue: 'mar',
  				Wed: 'mer',
  				Thu: 'jeu',
  				Fri: 'ven',
  				Sat: 'sam'
  			};
			for (index in Object.keys(keys)) {
				var key = Object.keys(keys)[index];
				x = x.replace(key, keys[key]);
			}
      		return x;
  		};
	});
