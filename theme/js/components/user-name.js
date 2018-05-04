angular.module('entourageApp')
  .component('userName', {
    templateUrl: '/wp-content/themes/entourage/js/components/user-name.html',
    bindings: {
      user: '=',
      profile: '=',
      withPicture: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs) {
      var ctrl = this;
    }
  })