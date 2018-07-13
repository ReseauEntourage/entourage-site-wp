angular.module('entourageApp')
  .component('modalProfileRequired', {
    bindings: {
      reloadFeed: '&',
      user: '='
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-profile-required.html',
          backdrop: 'static',
          keyboard: false,
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;
            ctrl.currentUser = ctrlParent.user;
            ctrl.optinNewsletter = true;

            ctrl.submit = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (ctrl.currentUser.has_password) {
                if (!ctrl.first_name)
                  ctrl.errors.push("Erreur : veuillez entrer votre prénom");
                if (!ctrl.last_name)
                  ctrl.errors.push("Erreur : veuillez entrer votre nom");
              }
              else {
                if (!ctrl.password || ctrl.password.length < 8)
                  ctrl.errors.push("Erreur : votre mot de passe est trop court");
                if (ctrl.password != ctrl.password_confirm)
                  ctrl.errors.push("Erreur : vous avez écrit deux mots de passe différents");
              }

              if (!ctrl.currentUser.email && (!ctrl.email || !ctrl.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)))
                ctrl.errors.push("Erreur : veuillez entrer un email valide");

              if (ctrl.errors.length)
                return;

              if (ctrl.currentUser.has_password) {
                var data = {
                  first_name: ctrl.first_name,
                  last_name: ctrl.last_name,
                  about: ctrl.about,
                  avatar_key: ctrl.avatar_key
                };
              }
              else {
                var data = {
                  password: ctrl.password
                };
              }

              if (!ctrl.currentUser.email) {
                data.email = ctrl.email;

                if (ctrl.optinNewsletter) {
                  ctrl.newSubscription(ctrl.email);
                }
              }

              ctrl.updateUser(data);
            }

            ctrl.updateUser = function(data) {
              ctrl.loading = true;

              $.ajax({
                type: 'PATCH',
                url: getApiUrl() + '/users/me',
                data: {
                  token: ctrl.currentUser.token,
                  user: data
                },
                success: function(data) {
                  if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    ctrl.currentUser = data.user;
                    ctrlParent.user = ctrl.currentUser;
                    if (ctrl.currentUser.display_name) {
                      ctrl.close();
                    }
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

            ctrl.newSubscription = function(email){
              $.ajax({
                type: "POST",
                url: "https://api.entourage.social/api/v1/newsletter_subscriptions",
                data: { "newsletter_subscription": { "email": email, "active": true } },
                success: function(){
                  ga('send', 'event', 'Engagement', 'Newsletter', 'WebApp');
                }
              });
            }

            ctrl.close = function() {
              $uibModalInstance.close();
              ctrlParent.reloadFeed();
            }
          }
        });
      }
    }
  });