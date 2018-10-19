angular.module('entourageApp')
  .component('feed', {
    templateUrl: '/wp-content/themes/entourage/js/components/feed.html',
    bindings: {
      user: '=',
      actions: '=',
      onShowAction: '&',
      onOpenProfile: '&',
      onOpenCreateAction: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.hiddenFeed = true;

      ctrl.click = function(action) {
        if (action.type == 'Announcement') {
          if (action.open_page) {
            switch (action.open_page) {
              case "profile":
              case "badge":
                ctrl.onOpenProfile();
                break;
              case "create-action":
                ctrl.onOpenCreateAction();
                break;
            }
          }
          else if (action.url) {
            window.open(action.url, '_blank');
          }
        }
        else {
          ctrl.onShowAction({uuid: action.uuid});
        }
      }

      ctrl.hover = function(action, hide) {
        $('#marker-action-' + action.uuid).toggleClass('active', !hide);
      }

      ctrl.toggleFeed = function() {
        ctrl.hiddenFeed = !ctrl.hiddenFeed;
      }
    }
  })