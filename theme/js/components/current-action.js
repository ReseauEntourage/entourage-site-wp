angular.module('entourageApp')
  .component('currentAction', {
    templateUrl: '/wp-content/themes/entourage/js/components/current-action.html',
    bindings: {
      map: '=',
      action: '=',
      public: '=',
      showRegister: '&',
      showProfile: '&',
      user: '=',
      showOverModal: "="
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrl = this;

      ctrl.showShare = false;
      ctrl.editEvent = false;
      ctrl.editAction = false;

      $scope.$watch('ctrl.action', function(newValue, oldValue) {
        if (newValue && newValue != oldValue) {
          console.info('Open action', newValue);

          if (oldValue && oldValue.marker) {
            toggleMarker(oldValue.uuid, true);
          }

          ctrl.openAction();
        }
        else if (oldValue && !newValue) {
          ctrl.hide(oldValue);
        }
      });

      ctrl.openAction = function () {
        ctrl.loading = false;
        ctrl.timeline = [];
        ctrl.newMessage = "";
        ctrl.lastRefreshTime = null;
        clearInterval(ctrl.checkingInfoInterval);

        if (ctrl.action.marker) {
          toggleMarker(ctrl.action.uuid);
        }
        
        if (!ctrl.public) {
          ctrl.is_admin = (ctrl.action.author.id == ctrl.user.id);

          if (ctrl.action.join_status == 'accepted') {
            ctrl.getTimeline(true);
            ctrl.checkingInfoInterval = setInterval(ctrl.getTimeline, 30000);

            ctrl.markAsRead();

            $($element).find('.action-chat').scrollTop(20000);
          }
        }

        window.history.pushState('page2', ctrl.action.title, '/app/?token=' + ctrl.action.uuid);
        ctrl.open = true;
      }


      // ** TIMELINE ** //

      ctrl.getTimeline = function(showLoader) {
        console.info('getTimeline', ctrl.action);

        if (!ctrl.action) {
          return;
        }

        if (showLoader) {
          ctrl.loading = true;
        }

        if (ctrl.action.group_type == "conversation") {
          ctrl.getMessages();
        }
        else {
          $.ajax({
            type: 'GET',
            url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users',
            data: {
              token: ctrl.user.token,
              entourage_id: ctrl.action.uuid
            },
            success: function(data) {
              if (data.users) {
                ctrl.action.users = data.users;
                ctrl.action.number_of_people = ctrl.action.users.filter(function(user) {
                  if (user.id == ctrl.user.id && user.status == 'accepted') {
                    ctrl.action.join_status = 'accepted';
                  }
                  return ((user.id != ctrl.action.author.id) && (user.status == 'accepted'));
                }).length;
              }
              ctrl.getMessages();
            },
            error: function(data) {
              ctrl.loading = false;
              $scope.$apply();
            }
          });
        }
      }

      ctrl.getUsers = function() {
        if (ctrl.loading)
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
              ctrl.action.number_of_people = data.users.length - 1;
            }
            ctrl.loading = false;
            $scope.$apply();
          },
          error: function(data) {
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.getMessages = function(before) {
        if (ctrl.action.join_status != 'accepted') {
          return;
        }

        var data = {
          token: ctrl.user.token,
          entourage_id: ctrl.action.uuid
        };

        if (before) {
          data.before = before;
        }

        $.ajax({
          type: 'GET',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/chat_messages',
          data: data,
          success: function(data) {
            if (data.chat_messages) {
              if (before) {
                ctrl.action.chat_messages = ctrl.action.chat_messages.concat(data.chat_messages);
              }
              else {
                ctrl.action.chat_messages = data.chat_messages;
              }
              if (data.chat_messages.length == 25) {
                ctrl.getMessages(ctrl.action.chat_messages[ctrl.action.chat_messages.length - 1].created_at);
              }
              else {
                ctrl.buildTimeline();
              }
            }
            else {
              ctrl.loading = false;
              $scope.$apply();
            }
          },
          error: function(data) {
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.buildTimeline = function() {
        var newTimeline = [];
        var refreshTimeline = false;

        if (ctrl.action.users) {
          newTimeline = ctrl.action.users.filter(function(user) {
            return ((user.id != ctrl.action.author.id) && (user.status == 'accepted'));
          }).map(function(user) {
            return {
              user: user,
              created_at: user.requested_at,
              message: user.message,
              type: 'user'
            }; 
          });
        }

        if (ctrl.action.chat_messages) {
          newTimeline = newTimeline.concat(ctrl.action.chat_messages.map(function(message) {
            if (new Date(message.created_at) > ctrl.lastRefreshTime) {
              refreshTimeline = true;
            }
            return {
              user: message.user,
              created_at: message.created_at,
              message: message.content,
              message_type: message.message_type,
              type: 'message'
            }; 
          }));
        }

        if (!ctrl.lastRefreshTime || refreshTimeline) {
          console.info('refresh timeline');

          newTimeline.sort(function(a, b){
            if (a.created_at < b.created_at)
              return -1;
            if (a.created_at > b.created_at)
              return 1;
            return 0;
          });

          var previousEventDate = new Date(ctrl.action.created_at);
          var now = new Date();

          for (i in newTimeline) {
            var event = newTimeline[i];
            var eventDate = new Date(event.created_at);

            if (((eventDate.getTime() - previousEventDate.getTime()) / 1000) > 600) {
              if (now.getDate() == eventDate.getDate() && now.getMonth() == eventDate.getMonth()) {
                event.formatDate = 'H:mm';
              }
              else if (!(now.getDate() == eventDate.getDate() && now.getMonth() == eventDate.getMonth() && now.getHours() == eventDate.getHours())) {
                event.formatDate = 'd MMMM, H:mm';
              }
            }

            previousEventDate = eventDate;
          }

          ctrl.timeline = angular.copy(newTimeline);
          $scope.$apply();

          setTimeout(function(){
            $($element).find('.action-chat').scrollTop(20000);
            ctrl.loading = false;
            $scope.$apply();
          }, 500);
        }
        else {
          ctrl.loading = false;
          $scope.$apply();
        }

        ctrl.lastRefreshTime = new Date();
      }


      // ** BOTTOM ACTIONS  ** //

      ctrl.askJoin = function() {
        if (ctrl.public) {
          ctrl.showRegister({token: 'action-' + ctrl.action.uuid});
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

            if (ctrl.action.public) {
              ctrl.getTimeline();
            }
            else {
              ctrl.requestMessageModal();
            }
            
            ctrl.checkingInfoInterval = setInterval(ctrl.getTimeline, 30000);
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
            ctrl.getTimeline(true);
          },
          error: function(data) {
            alert("Erreur : le statut de l'utilisateur n'a pu être changé, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }

      ctrl.sendConsent = function(userId, status) {
        ctrl.loading = true;

        $.ajax({
          type: 'PATCH',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid,
          data: {
            token: ctrl.user.token,
            entourage: {
              status: 'open'
            }
          },
          success: function(data) {
            window.location.reload();
          },
          error: function(data) {
            alert("Erreur : le statut de votre action n'a pu être changé, réessayez ou contactez l'équipe d'Entourage");
            ctrl.loading = false;
            $scope.$apply();
          }
        });
      }


      // ** TOP ACTIONS  ** //

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
        ctrl.currentMessage = {
          type: "action_feedback",
          action: ctrl.action
        };
      }

      ctrl.edit = function() {
        if (ctrl.action.group_type == 'outing') {
          ctrl.editEvent = true;
        } else if (ctrl.action.group_type == 'action') {
          ctrl.editAction = true;
        }
      }

      ctrl.hide = function(action) {
        if (!action) {
          return;
        }

        if (action.marker) {
          toggleMarker(action.uuid, true);
        }

        ctrl.open = false;

        clearInterval(ctrl.checkingInfoInterval);
        window.history.pushState('page3', action.title, '/app');

        setTimeout(function(){
          ctrl.action = null;
          $scope.$apply();
        }, 500);
      }


      // ** OTHER ACTIONS ** //

      ctrl.openProfile = function(id) {
        ctrl.showProfile({id: id});
      }

      ctrl.markAsRead = function() {
        if (ctrl.user.notifications) {
          var index = ctrl.user.notifications.indexOf(ctrl.action.uuid);
          if (index > -1) {
            ctrl.user.notifications.splice(index, 1);
            if (ctrl.user.notifications.length) {
              document.title = document.title.replace(/Entourage( \([0-9]*\))? \|/g, 'Entourage (' + ctrl.user.notifications.length + ') |');
            } else {
              document.title = document.title.replace(/Entourage( \([0-9]*\))? \|/g, 'Entourage |');
            }
          }
        }

        if (!ctrl.action.number_of_unread_messages) {
          return;
        }

        ctrl.action.number_of_unread_messages = 0;

        $.ajax({
          type: 'PUT',
          url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/read',
          data: {
            token: ctrl.user.token,
            id: ctrl.action.uuid
          }
        });
      }

      toggleMarker = function(id, hide) {
        $('#marker-map-' + id).toggleClass('active', !hide);
      }
    }
  });