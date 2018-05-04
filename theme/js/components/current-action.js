angular.module('entourageApp')
  .component('currentAction', {
    templateUrl: '/wp-content/themes/entourage/js/components/current-action.html',
    bindings: {
      map: '=',
      action: '=',
      public: '=',
      showRegistration: '&',
      user: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrl = this;

      ctrl.loading = false;
      ctrl.timeline = [];
      ctrl.newMessage = "";

      ctrl.$onInit = function() {
        if (ctrl.action)
          ctrl.openAction();
      }

      $scope.$watch('ctrl.action', function(newValue, oldValue) {
        if (newValue && newValue != oldValue) {
          console.info('newAction', newValue);

          if (oldValue && oldValue.marker)
            oldValue.marker.setTitle(translateTitle(oldValue.status));

          ctrl.openAction();
        }
      });

      ctrl.openAction = function () {
        if (ctrl.action.marker) {
          ctrl.action.marker.setTitle(translateTitle(ctrl.action.status, true));
          ctrl.map.setCenter(ctrl.action.marker.getPosition());

          if (ctrl.public)
            ctrl.map.setZoom(13);
        }
        
        if (!ctrl.public) {
          ctrl.is_admin = (ctrl.action.author.id == ctrl.user.id);

          if (ctrl.action.join_status == 'accepted') {

            ctrl.getTimeline();
            ctrl.checkingInfoInterval = setInterval(ctrl.getTimeline, 300000);

            // mark as read
            $.ajax({
              type: 'PUT',
              url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/read',
              data: {
                token: ctrl.user.token,
                id: ctrl.action.uuid
              }
            });
          }
        }

        window.history.pushState('page2', ctrl.action.title, '/app/?token=' + ctrl.action.uuid);
        ctrl.open = true;
      }

      ctrl.askJoin = function() {
        if (ctrl.public) {
          ctrl.showRegistration({token: ctrl.action.uuid});
        }
        else {
          ctrl.join();
        }
      }

      ctrl.join = function(message) {
        if (ctrl.loading)
          return;

        ctrl.loading = true;
          
        $.ajax({
          type: 'POST',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users',
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid
          },
          success: function(data) {
            ctrl.action.join_status = 'pending';
            ctrl.loading = false;
            $scope.$apply();

            ctrl.requestMessageModal();
          },
          error: function(data) {
            ctrl.loading = false;
            $scope.$apply();
          },
        });
      }

      ctrl.requestMessageModal = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/join-request.html',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrlModal = this;

            ctrlModal.close = function() {
              $uibModalInstance.close();
            }

            ctrlModal.submit = function() {
              if (ctrlModal.loading)
                return;

              if (!ctrlModal.message) {
                ctrlModal.close();
                return;
              }

              ctrlModal.loading = true;

              $.ajax({
                type: 'PUT',
                url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users/' + ctrl.user.id,
                data: {
                  token: ctrl.user.token,
                  user_id: ctrl.user.id,
                  entourage_id: ctrl.action.uuid,
                  request: {
                    message: ctrlModal.message
                  }
                },
                success: function(data) {
                  ctrlModal.close();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                    ctrlModal.error = "Erreur : " + data.responseJSON.error.message
                  else
                    ctrlModal.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                  ctrlModal.loading = false;
                  $scope.$apply();
                }
              });
            }
          }
        });
      }

      ctrl.getTimeline = function(forced) {
        if (ctrl.loading && !forced)
          return;

        ctrl.loading = true;

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users',
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid
          },
          success: function(data) {
            if (data.users)
            {
              ctrl.action.users = data.users;

              ctrl.timeline = ctrl.action.users.filter(function(user){
                return ((user.id != ctrl.action.author.id) && (user.status == 'accepted'));
              }).map(function(user) {
                var data = {
                  user: user,
                  created_at: user.requested_at,
                  message: user.message,
                  type: 'user'
                }
                return data; 
              });
            }
            ctrl.getMessages();
            $scope.$apply();
          },
          error: function(data) {
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.getMessages = function() {
        if (ctrl.action.join_status != 'accepted')
          return;

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/chat_messages',
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid
          },
          success: function(data) {
            if (data.chat_messages)
            {
              ctrl.timeline = ctrl.timeline.concat(data.chat_messages.map(function(message) {
                var data = {
                  user: message.user,
                  created_at: message.created_at,
                  message: message.content,
                  type: 'message'
                }
                return data; 
              }));

              ctrl.sortTimeline();
            }
          },
          error: function(data) {
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.sortTimeline = function() {
        ctrl.timeline.sort(function(a, b){
          if (a.created_at < b.created_at)
            return -1;
          if (a.created_at > b.created_at)
            return 1;
          return 0;
        });

        var lastDate = ctrl.action.created_at;
        for (var i = 0; i < ctrl.timeline.length; i++) {
          var event = ctrl.timeline[i];
          var a = new Date(lastDate);
          var b = new Date(event.created_at);
          var now = new Date();

          if (now.getDate() == b.getDate() && now.getMonth() == b.getMonth()) {
            event.formatDate = 'H:mm';
          }
          else if (!(a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getHours() == b.getHours())) {
            event.formatDate = 'd MMMM, H:mm';
          }
          lastDate = event.created_at;
        }
        $scope.$apply();

        setTimeout(function(){
          $($element).find('.action-chat').scrollTop($($element).find('.action-chat>div').height());
          ctrl.loading = false;
          $scope.$apply();
        }, 1000);
      }

      ctrl.sendNewMessage = function() {
        if (ctrl.loading || !ctrl.newMessage.length)
          return;

        ctrl.loading = true;

        $.ajax({
          type: 'POST',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/chat_messages',
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid,
            chat_message: {
              content: ctrl.newMessage
            }
          },
          success: function(data) {
            ctrl.getTimeline(true);

            ctrl.newMessage = "";
            $scope.$apply();
          },
          error: function(data) {
            alert("Erreur : votre message n'a pas pu être envoyé, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.changeUserStatus = function(userId, status) {
        if (ctrl.loading)
          return;

        ctrl.loading = true;

        $.ajax({
          type: 'PUT',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users/' + userId,
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid,
            user_id: userId,
            user: {
              status: status
            }
          },
          success: function(data) {
            ctrl.getTimeline();
          },
          error: function(data) {
            alert("Erreur : le statut de l'utilisateur n'a pu être changé, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.hide = function() {
        if (ctrl.action.marker)
          ctrl.action.marker.setTitle(translateTitle(ctrl.action.status));
        ctrl.open = false;

        window.history.pushState('page3', ctrl.action.title, '/app');
        clearInterval(ctrl.checkingInfoInterval);

        setTimeout(function(){
          ctrl.action = null;
          $scope.$apply();
        }, 500);
      }

      ctrl.report = function() {
        ctrl.currentMessage = {
          type: "report_action",
          action: ctrl.action
        };
      }

      ctrl.leave = function() {
        if (ctrl.loading)
          return;

        ctrl.loading = true;
          
        $.ajax({
          type: 'DELETE',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users/' + ctrl.user.id,
          data: {
            token: ctrl.user.token,
            entourage_id: ctrl.action.uuid,
            user_id: ctrl.user.id
          },
          success: function(data) {
            ctrl.action.join_status = 'cancelled';
            ctrl.loading = false;
            $scope.$apply();
          },
          error: function(data) {
            alert("Erreur : nous n'avons pas pu vous enlever de cette action, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.finishAction = function() {
        if (ctrl.loading)
          return;

        ctrl.loading = true;

        $.ajax({
          type: 'PATCH',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid,
          data: {
            token: ctrl.user.token,
            entourage: {
              status: 'closed'
            }
          },
          success: function(data) {
            ctrl.currentMessage = {
              type: "action_feedback",
              action: ctrl.action
            };
            ctrl.action.status = 'closed';
            ctrl.loading = false;
            $scope.$apply();
          },
          error: function(data) {
            alert("Erreur : nous n'avons pas pu clôre cette action, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.shareFacebook = function() {
        FB.ui({
          method: 'feed',
          display: 'popup',
          link: 'http://entourage.social/app/?token=' + ctrl.action.uuid,
        }, function(response){
          console.info(response);
        });
      }
    }
  });