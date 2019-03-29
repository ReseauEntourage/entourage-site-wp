angular.module('entourageApp')
  .component('currentPoi', {
    templateUrl: '/wp-content/themes/entourage/js/components/current-poi.html',
    bindings: {
      map: '=',
      poi: '=',
      showOverModal: "="
    },
    controllerAs: 'ctrl',
    controller: function($scope) {
      var ctrl = this;

      $scope.$watch('ctrl.poi', function(newValue, oldValue) {
        if (newValue && newValue != oldValue) {
          if (oldValue && oldValue.marker) {
            toggleMarker(oldValue.id, true);
          }
          ctrl.openPoi();
        }
        else if (oldValue && !newValue) {
          ctrl.hide(oldValue);
        }
      });

      ctrl.openPoi = function () {
        ctrl.loading = false;

        if (ctrl.poi.marker) {
          toggleMarker(ctrl.poi.id);
        }

        window.history.pushState('page2', ctrl.poi.name, `/app/?lat=${ctrl.poi.latitude}&lng=${ctrl.poi.longitude}`);
        ctrl.open = true;
      }

      ctrl.hide = function(poi) {
        if (!poi) {
          return;
        }

        if (poi.marker) {
          toggleMarker(poi.id, true);
        }

        ctrl.open = false;

        window.history.pushState('page3', 'app', '/app');

        setTimeout(function(){
          ctrl.poi = null;
          $scope.$apply();
        }, 500);
      }

      toggleMarker = function(id, hide) {
        $('#marker-map-' + id).toggleClass('active', !hide);
      }
    }
  });