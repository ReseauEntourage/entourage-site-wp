angular.module('entourageApp')
  .component('modalProfileEdit', {
    bindings: {
      user: '=',
      reloadFeed: '&',
      hide: '&'
    },
    controllerAs: 'ctrlParent',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;
      
      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-profile-edit.html',
          windowClass: 'modal-no-width',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;
            
            ctrl.loading = false;
            ctrl.user = ctrlParent.user;
            ctrl.first_name = angular.copy(ctrl.user.first_name);
            ctrl.last_name = angular.copy(ctrl.user.last_name);
            ctrl.about = angular.copy(ctrl.user.about);
            ctrl.email = angular.copy(ctrl.user.email);
            ctrl.address = angular.copy(ctrl.user.address);

            ctrl.close = function() {
              $uibModalInstance.close();
            }

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
                email: ctrl.email
              };

              if (ctrl.avatar_key) {
                data.avatar_key = ctrl.avatar_key;
              }

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
                    data.user.phone = ctrlParent.user.phone;
                    ctrlParent.user = data.user;

                    if (ctrl.address.google_place_id) {
                      ctrl.changeAddress();
                    }
                    else {
                      localStorage.setItem('user', JSON.stringify(data.user));
                      ctrl.success = true;
                      ctrl.loading = false;
                      $scope.$apply();
                    }
                  }
                  else {
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  }
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

            ctrl.sendNewPassword = function() {
              $.ajax({
                type: 'PATCH',
                url: getApiUrl() + '/users/me',
                data: {
                  token: ctrl.user.token,
                  user: {
                    sms_code: ctrl.new_password
                  }
                },
                success: function(data) {
                  if (data.user)
                    ctrl.success = true;
                  else
                    ctrl.errors.push("Erreur : Votre mot de passe n'est pas le bon, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                    ctrl.errors.push("Erreur : " + data.responseJSON.error.message);
                  else
                    ctrl.errors.push("Erreur : Votre mot de passe n'est pas le bon, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                },
              });
            }

            ctrl.changePassword = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (!ctrl.current_password || ctrl.current_password.length < 6) {
                ctrl.errors.push("Votre mot de passe actuel est composé d'au moins 6 caractères");
              }
              else if (!ctrl.new_password || !ctrl.new_password.length < 6) {
                ctrl.errors.push("Votre nouveau mot de passe doit être composé d'au moins 6 caractères'");
              }

              if (ctrl.errors.length)
                return;

              ctrl.loading = true;

              $.ajax({
                type: 'POST',
                url: getApiUrl() + '/login',
                data: {
                  user: {
                    phone: ctrl.user.phone,
                    sms_code: ctrl.current_password
                  }
                },
                success: function(data) {
                  if (data.user)
                    ctrl.sendNewPassword();
                  else
                    ctrl.errors.push("Erreur : Votre mot de passe n'est pas le bon, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                    ctrl.errors.push("Erreur : " + data.responseJSON.error.message);
                  else
                    ctrl.errors.push("Erreur : Votre mot de passe n'est pas le bon, merci de réessayer ou de nous contacter");
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.changeAddress = function() {
              $.ajax({
                type: 'POST',
                url: getApiUrl() + '/users/me/address',
                data: {
                  token: ctrlParent.user.token,
                  address: {
                    google_place_id: ctrl.address.google_place_id,
                  }
                },
                success: function(data) {
                  if (data.address) {
                    ctrlParent.user.address = data.address
                    localStorage.setItem('user', JSON.stringify(ctrlParent.user));
                    ctrl.success = true;
                    ctrl.loading = false;
                    $scope.$apply();
                  }
                },
              });
            }

            ctrl.initSearchBox = function() {
              var a = new google.maps.places.Autocomplete(document.getElementById('profile-address-search-input'), {
                bounds: map.mapObject.getBounds()
              });

              a.addListener('place_changed', function() {
                var place = a.getPlace();

                if (place.geometry) {
                  ctrl.address = {
                    google_place_id: place.place_id,
                    display_address: place.formatted_address
                  }
                }
              });
            }

            ctrl.removeUser = function() {
              if (confirm("Voulez-vous vraiment signaler cette personne aux équipes d'Entourage ?")) {
                $.ajax({
                  type: 'DELETE',
                  url: getApiUrl() + '/users/me',
                  data: {
                    token: ctrl.user.token
                  },
                  success: function(data) {
                    if (data.user)
                      ctrl.success = true;
                    else
                      ctrl.errors.push("Erreur : impossible de supprimer votre compte");
                    ctrl.loading = false;
                    $scope.$apply();
                  },
                  error: function(data) {
                    if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                      ctrl.errors.push("Erreur : " + data.responseJSON.error.message);
                    else
                      ctrl.errors.push("Erreur : impossible de supprimer votre compte");
                    ctrl.loading = false;
                    $scope.$apply();
                  },
                });
              }
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
          ctrlParent.reloadFeed();
        });
      }
    }
  });