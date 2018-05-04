angular.module('entourageApp')
  .component('action', {
    templateUrl: '/wp-content/themes/entourage/js/components/action.html',
    bindings: {
      user: '=',
      action: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs) {
      var ctrl = this;
    }
  })