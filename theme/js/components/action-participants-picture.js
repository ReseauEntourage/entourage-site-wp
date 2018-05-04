angular.module('entourageApp')
  .component('actionParticipantsPicture', {
    templateUrl: '/wp-content/themes/entourage/js/components/action-participants-picture.html',
    bindings: {
      user: '=',
      action: '=',
      clickable: '='
    },
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.showParticipants = function(){
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-action-participants.html',
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

            ctrl.close = function() {
              $uibModalInstance.close();
            }
          }
        });
      }
    }
  })