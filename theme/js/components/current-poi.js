angular.module('entourageApp')
  .component('currentPoi', {
    templateUrl: '/wp-content/themes/entourage/js/components/current-poi.html',
    bindings: {
      map: '=',
      poi: '=',
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
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