angular.module('entourageApp')
  .component('messages', {
    templateUrl: '/wp-content/themes/entourage/js/components/messages.html',
    bindings: {
      user: '=',
      show: '=',
      onShowAction: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope, $q) {
      var ctrl = this;

      ctrl.unreadOnly = false;
      refreshIncrement = 0

      ctrl.$onInit = function() {
        refreshFeed(true)
      }

      refreshFeed = function(first) {
        refreshIncrement += 1
        checkMessages()
        .then(getPendingUsers)

        if (first) {
          ctrl.checkingMessagesInterval = setInterval(refreshFeed, 30000);
        }
      }

      checkMessages = function() {
        var deferred = $q.defer();

        if (ctrl.loading) {
          deferred.resolve();
          return deferred.promise;
        }

        ctrl.loading = true;
        ctrl.messages = [];
        ctrl.user.notifications = [];

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
              data.feeds.map(function(action) {
                action = transformAction(action.data);

                if (action.join_status == 'accepted' && action.number_of_unread_messages) {
                  pushNotification(action.uuid);
                }
                ctrl.messages.push(action);
                return action;
              });
            }
            ctrl.loading = false;
            $scope.$apply();
            deferred.resolve();
          }
        });

        return deferred.promise;
      }

      getPendingUsers = function() {
        ctrl.messages.map(function(action) {
          if (!action.author || action.author.id != ctrl.user.id || action.status == 'closed' || action.group_type == 'conversation') {
            return;
          }
          if (action.updated_at) {
            var daysFromToday = (new Date().getTime() - new Date(action.updated_at).getTime()) / 1000 / 3600 / 24;
            if ((daysFromToday > 30 && refreshIncrement%4 != 1) || (daysFromToday > 7 && refreshIncrement%2 != 1)) {
              return;
            }
          }
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

                if (action.pendingUsers.length) {
                  pushNotification(action.uuid);
                }
              }
              $scope.$apply();
            }
          });
        });
      }

      pushNotification = function(notif) {
        if (ctrl.user.notifications.indexOf(notif) == -1) {
          ctrl.user.notifications.push(notif);
          document.title = document.title.replace(/Entourage( \([0-9]*\))? \|/g, 'Entourage (' + ctrl.user.notifications.length + ') |');
          toggleFav(true);
        }
      }

      removeNotification = function(notif) {
        var index = ctrl.user.notifications.indexOf(notif);
        if (index > -1) {
          ctrl.user.notifications.splice(index, 1);
          if (ctrl.user.notifications.length) {
            document.title = document.title.replace(/Entourage( \([0-9]*\))? \|/g, 'Entourage (' + ctrl.user.notifications.length + ') |');
          } else {
            document.title = document.title.replace(/Entourage( \([0-9]*\))? \|/g, 'Entourage |');
            toggleFav(false);
          }
        }
      }

      toggleFav = function(active) {
        var link = document.querySelector("head link[rel*='icon']");
        link.href = link.href.replace(active ? 'fav.png' : 'fav-active.png', active ? 'fav-active.png' : 'fav.png');
      }

      ctrl.showAction = function(action) {
        ctrl.show = false;
        ctrl.onShowAction({uuid: action.uuid});
      }

      ctrl.filterUnread = function() {
        ctrl.unreadOnly = !ctrl.unreadOnly;
      }

      ctrl.markAllAsRead = function() {
        ctrl.unreadOnly = false;

        ctrl.messages.map(function(action){
          if (action.number_of_unread_messages) {
            removeNotification(action.uuid);

            $.ajax({
              type: 'PUT',
              url: getApiUrl() + '/entourages/' + action.uuid + '/read',
              data: {
                token: ctrl.user.token,
                id: action.uuid
              }
            });
          }

          return action;
        });
      }

      simulateMouseOut = function() {
        ctrl.hide = true;

        setTimeout(function(){
          delete ctrl.hide;
        }, 1000);
      }
    }
  })