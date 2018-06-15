angular.module('entourageApp')
  .component('modalNewPicture', {
    bindings: {
      user: '=',
      show: '='
    },
    controllerAs: 'ctrlParent',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;
      
      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-new-picture.html',
          windowClass: 'modal-dark',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.imageCropStep = 1;
            ctrl.crop = false;
            ctrl.imageCropResultBlob = null;

            $scope.$watch('ctrl.imageCropResultBlob', function(newVal) {
              if (newVal) {
                ctrl.getUrl();
              }
            });

            ctrl.save = function(){
              ctrl.loading = true;
              ctrl.errors = [];
              ctrl.crop = true;
            }

            ctrl.getUrl = function() {
              $.ajax({
                  type: 'POST',
                  url: getApiUrl() + '/users/me/presigned_avatar_upload/',
                  data: {
                    token: ctrlParent.user.token,
                    content_type: 'image/jpeg'
                  },
                  success: function(data) {
                    if (data)
                      ctrl.uploadImage(data);
                    else
                      ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  },
                  error: function(data) {
                    if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                      ctrl.errors.push("Erreur : " + data.responseJSON.error.message[0]);
                    else
                      ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  }
                });
            }

            ctrl.uploadImage = function(info) {
              $.ajax({
                  type: 'PUT',
                  url: info.presigned_url,
                  contentType: 'image/jpeg',
                  processData: false,
                  data: ctrl.imageCropResultBlob,
                  success: function(data) {
                    ctrl.updateUser(info.avatar_key);
                  },
                  error: function(data) {
                    if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                      ctrl.errors.push("Erreur : " + data.responseJSON.error.message[0]);
                    else
                      ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  }
                });
            }

            ctrl.updateUser = function(avatar_key) {
              $.ajax({
                type: 'PATCH',
                url: getApiUrl() + '/users/me',
                data: {
                  token: ctrlParent.user.token,
                  user: {
                    avatar_key: avatar_key
                  }
                },
                success: function(data) {
                  if (data.user) {
                    ctrlParent.user = data.user;
                    localStorage.setItem('user', JSON.stringify(data.user));
                    ctrl.close();
                  }
                  else
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                    ctrl.errors.push("Erreur : " + data.responseJSON.error.message[0]);
                  else
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.close = function() {
              $uibModalInstance.close();
            }
          }
        }).closed.then(function() {
          ctrlParent.show = false;
        });
      }
    }
  })