angular.module('entourageApp')
  .component('messages', {
    templateUrl: '/wp-content/themes/entourage/js/components/messages.html',
    bindings: {
      user: '=',
      onShowAction: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.checkMessages();
      }

      ctrl.checkMessages = function() {
        if (ctrl.loading)
          return;

        console.info('Checking my actions...');
        ctrl.checkingMessagesInterval = setInterval(ctrl.checkMessages, 300000);
        
        ctrl.actions = [];
        ctrl.loading = true;
        ctrl.user.unreadMessages = 0;

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/myfeeds',
          data: {
            token: ctrl.user.token,
            status: "all",
            show_tours: false,
            time_range: 24 * 365 * 3 // 3 years
          },
          success: function(data) {
            if (data.feeds) {
              data.feeds.map(function(action){
                action = transformAction(action.data);

                if (action.join_status == 'accepted') {
                  ctrl.getLastMessage(action);

                  ctrl.is_admin = (action.author.id == ctrl.user.id);
                  if (ctrl.is_admin) {
                    ctrl.getPendingUsers(action);
                  }
                }

                ctrl.actions.push(action);
                return action;
              });
            }
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.getPendingUsers = function(action) {
        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + action.uuid + '/users',
          data: {
            token: ctrl.user.token,
            entourage_id: action.uuid
          },
          success: function(data) {
            if (data.users) {
              action.pendingUsers = data.users.filter(function(user){
                return (user.status == 'pending');
              });
              if (action.pendingUsers.length && !action.number_of_unread_messages) {
                ctrl.user.unreadMessages += 1;
              }
            }
            $scope.$apply();
          }
        });
      }

      ctrl.getLastMessage = function(action) {
        if (action.number_of_unread_messages)
          ctrl.user.unreadMessages += 1;

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + action.id + '/chat_messages',
          data: {
            token: ctrl.user.token,
            entourage_id: action.id
          },
          success: function(data) {
            if (data.chat_messages && data.chat_messages.length) {
              action.lastMessage = data.chat_messages[0];
            }
            else if (action.description) {
              action.lastMessage = {
                user: ctrl.user,
                content: action.description
              };
            }
            $scope.$apply();
          }
        });
      }

      ctrl.showAction = function(action) {
        if (action.number_of_unread_messages) {
          ctrl.user.unreadMessages -= 1;
          action.number_of_unread_messages = 0;
        }
        else if (action.pendingUsers.length) {
          ctrl.user.unreadMessages -= 1;
          action.pendingUsers = 0;
        }
        simulateMouseOut();
        ctrl.onShowAction({uuid: action.uuid});
      }

      simulateMouseOut = function() {
        ctrl.hide = true;
        setTimeout(function(){
          delete ctrl.hide;
        }, 1000);
      }
    }
  })