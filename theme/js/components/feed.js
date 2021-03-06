angular.module('entourageApp')
  .component('feed', {
    templateUrl: '/wp-content/themes/entourage/js/components/feed.html',
    bindings: {
      user: '=',
      actions: '=',
      currentAction: '=',
      emptyArea: '=',
      onShowAction: '&',
      onOpenProfile: '&',
      onToggleModal: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope) {
      var ctrl = this;

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
          if (ctrl.currentAction && ctrl.currentAction.uuid == action.uuid) {
            ctrl.currentAction = null;
          }
          else {
            ctrl.onShowAction({uuid: action.uuid});
          }
        }
      }

      ctrl.hover = function(action, hide) {
        if (ctrl.currentAction) {
          if (ctrl.currentAction.uuid != action.uuid) {
            $('.marker-action.active').toggleClass('hide-animation', !hide);
          }
          else {
            return;
          }
        }
        $('#marker-map-' + action.uuid).toggleClass('active', !hide);
      }

      // Mobile only
      ctrl.hiddenFeed = true;
      
      ctrl.toggleFeed = function() {
        ctrl.hiddenFeed = !ctrl.hiddenFeed;
      }
    }
  })