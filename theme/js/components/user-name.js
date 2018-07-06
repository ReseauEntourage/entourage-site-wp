angular.module('entourageApp')
  .component('userName', {
    templateUrl: '/wp-content/themes/entourage/js/components/user-name.html',
    bindings: {
      user: '=',
      profile: '=',
      clickable: '=',
      withPicture: '=',
      showProfile: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.click = function($event) {
        if (ctrl.clickable != false) {
          ctrl.showProfile({id: ctrl.profile.id});
        }
      }
    }
  })