angular.module('entourageApp')
  .component('modalProfileRequired', {
    bindings: {
      user: '='
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-profile-required.html',
          backdrop: 'static',
          keyboard: 'false',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;

            ctrl.submit = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (!ctrl.first_name)
                ctrl.errors.push("Erreur : veuillez entrer votre prénom");
              if (!ctrl.last_name)
                ctrl.errors.push("Erreur : veuillez entrer votre nom");
              if (!ctrl.email || !ctrl.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
                ctrl.errors.push("Erreur : veuillez entrer un email valide");

              if (ctrl.errors.length)
                return;

              var data = {
                first_name: ctrl.first_name,
                last_name: ctrl.last_name,
                about: ctrl.about,
                email: ctrl.email,
                avatar_key: ctrl.avatar_key
              };

              ctrl.loading = true;

              $.ajax({
                type: 'PATCH',
                url: getApiUrl() + '/users/me',
                data: {
                  token: ctrlParent.user.token,
                  user: data
                },
                success: function(data) {
                  if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    ctrlParent.user = data.user;
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
        });
      }
    }
  });