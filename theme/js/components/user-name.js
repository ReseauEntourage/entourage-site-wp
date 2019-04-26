angular.module('entourageApp')
  .component('userName', {
    templateUrl: '/wp-content/themes/entourage/js/components/user-name.html',
    bindings: {
      user: '=',
      clickable: '=',
      withPicture: '=',
      showProfile: '&',
      showAsUser: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope) {
      var ctrl = this;

      ctrl.clickable = ctrl.clickable || false;

      $scope.$watch('ctrl.user', function(newUser) {
        if (newUser) {
          ctrl.refreshUser();
        }
      });

      ctrl.refreshUser = function() {
        if (ctrl.user.partner && !ctrl.showAsUser) {
          ctrl.displayName = ctrl.user.partner.name
        } else {
          ctrl.displayName = ctrl.user.display_name;
        }
      }

      ctrl.click = function() {
        if (!ctrl.clickable) {
          return;
        }

        ctrl.showProfile({id: ctrl.user.id});
      }
    }
  })