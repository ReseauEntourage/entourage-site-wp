angular.module('entourageApp')
  .component('userPicture', {
    templateUrl: '/wp-content/themes/entourage/js/components/user-picture.html',
    bindings: {
      user: '=',
      action: '=',
      clickable: '=?',
      showProfile: '&',
      showAsUser: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        ctrlParent.clickable = ctrlParent.clickable || false;
      }

      $scope.$watch('ctrl.user', function(newUser) {
        if (newUser) {
          ctrlParent.refreshUser();
        }
      });

      ctrlParent.refreshUser = function() {
        // if (ctrlParent.user.id == 611 || ctrlParent.user.id == 2975) {
        //   ctrlParent.user.partner = {
        //     "id": 1,
        //     "name": "Saint-Vincent de Paul",
        //     "small_logo_url": "data:image/png;base64,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"
        //   };
        // }
        if (!ctrlParent.user.partner || ctrlParent.showAsUser || (ctrlParent.action && ctrlParent.action.group_type == 'conversation')) {
          ctrlParent.imageUrl = ctrlParent.user.avatar_url;
        } else {
          ctrlParent.imageUrl = ctrlParent.user.partner.small_logo_url;
        }
        ctrlParent.isAmbassador = (ctrlParent.user.community_roles && ctrlParent.user.community_roles.indexOf("ambassador") > -1) || (ctrlParent.user.roles && ctrlParent.user.roles.indexOf('ambassador') > -1);
      }

      ctrlParent.showParticipants = function(){
        if (!ctrlParent.action || !ctrlParent.clickable) {
          return;
        }

        if (ctrlParent.action.group_type == 'conversation') {
          ctrlParent.showProfile({id: ctrlParent.action.author.id});
          return;
        }

        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-action-users.html',
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance) {
            var ctrl = this;

            ctrl.$onInit = function() {
              ctrl.action = ctrlParent.action;

              if (!ctrl.action.users) {
                ctrl.getUsers();
              }
            }

            ctrl.getUsers = function(){
              if (ctrl.loading)
                return;

              ctrl.loading = true;

              $.ajax({
                type: 'GET',
                url: getApiUrl() + '/entourages/' + ctrl.action.uuid + '/users',
                data: {
                  token: getUserToken(),
                  entourage_id: ctrl.action.uuid
                },
                success: function(data) {
                  if (data.users) {
                    ctrl.action.users = data.users;
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

            ctrl.open = function(id) {
              ctrlParent.showProfile({id: id});
            }

            ctrl.close = function() {
              $uibModalInstance.close();
            }
          }
        });
      }
    }
  })