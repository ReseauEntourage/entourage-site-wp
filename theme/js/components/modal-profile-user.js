angular.module('entourageApp')
  .component('modalProfileUser', {
    bindings: {
      user: '=',
      profileId: '=',
      onShowAction: '&',
    },
    controller: function($uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-profile-user.html',
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance, $uibModalStack) {
            var ctrl = this;
            ctrl.user = ctrlParent.user;

            ctrl.loading = true;

            $.ajax({
              type: 'GET',
              url: getApiUrl() + '/users/' + ctrlParent.profileId,
              data: {
                token: ctrlParent.user.token,
              },
              success: function(data) {
                if (data.user) {
                  ctrl.profile = data.user;
                }
                else {
                  ctrl.close();
                }
                ctrl.loading = false;
                $scope.$apply();
              },
              error: function(data) {
                ctrl.loading = false;
                $scope.$apply();
              }
            });

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            ctrl.contact = function() {
              ctrlParent.onShowAction({uuid: ctrl.profile.conversation.uuid});
              $uibModalStack.dismissAll();
            }

            ctrl.report = function() {
              ctrl.currentMessage = {
                type: "report_user",
                profile: ctrl.profile
              };
            }
          }
        }).closed.then(function() {
          ctrlParent.profileId = null;
        });
      }
    }
  });