angular.module('entourageApp')
  .component('action', {
    templateUrl: '/wp-content/themes/entourage/js/components/action.html',
    bindings: {
      user: '=?',
      action: '='
    },
    controllerAs: 'ctrl',
    controller: function() {
      var ctrl = this;

      if (!ctrl.user) {
        ctrl.user = {
          id: 0
        }
      }
    }
  })