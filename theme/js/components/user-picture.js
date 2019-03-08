angular.module('entourageApp')
  .component('userPicture', {
    templateUrl: '/wp-content/themes/entourage/js/components/user-picture.html',
    bindings: {
      user: '=',
      action: '=',
      clickable: '=?',
      showProfile: '&'
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        ctrlParent.clickable = ctrlParent.clickable || false;
      }

      ctrlParent.getUser = function() {
        return ctrlParent.action ? ctrlParent.action.author : ctrlParent.user;
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
          templateUrl: '/wp-content/themes/entourage/js/components/modal-action-participants.html',
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.$onInit = function() {
              ctrl.user = ctrlParent.user;
              ctrl.action = ctrlParent.action;

              if (!ctrl.action.users)
                ctrl.getUsers();
            }

            ctrl.getUsers = function(){
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