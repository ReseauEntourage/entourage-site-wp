angular.module('entourageApp')
  .component('modalRegister', {
    bindings: {
      hide: '&',
      openLogin: '&'
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-register.html',
          windowClass: 'modal-no-width',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.registrationStep = 1;
            ctrl.invitationSent = false;
            ctrl.countriesToggle = false;
            ctrl.countries = getCountries();
            ctrl.country = ctrl.countries[0];
            ctrl.user = {};
            ctrl.loading = false;

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            ctrl.openLogin = function() {
              ctrlParent.openLogin();
              ctrl.close();
            }

            ctrl.selectCountry = function(country) {
              ctrl.country = country;
            }

            ctrl.register = function() {
              if (ctrl.loading || !ctrl.user.phone)
                return;

              delete ctrl.error;

              var phone = validatePhone(ctrl.country[1], ctrl.user.phone);
              if (!phone) {
                ctrl.error = "Votre numéro n'est pas valide, merci de réessayer";
                return;
              }

              ctrl.loading = true;
              
              $.ajax({
                type: 'POST',
                url: getApiUrl() + '/users',
                data: {
                  user: {
                    phone: phone
                  }
                },
                success: function(data) {
                  if (data.user) {
                    ctrl.user = data.user;
                    ctrl.user.phone = phone;
                    ctrl.registrationStep = 2;
                    if (!isDemoMode())
                      ga('send', 'event', 'Engagement', 'AppDownload', 'WebApp');
                  }
                  else
                    ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error) {
                    if (data.responseJSON.error.code == "CANNOT_CREATE_USER") {
                      ctrl.error = "Erreur : vous faites déjà partie du réseau Entourage ! Cliquez sur 'Connectez-vous' en haut à droite et entrez votre téléphone";
                    }
                    else if (data.responseJSON.error.message) {
                      ctrl.error = "Erreur : " + data.responseJSON.error.message[0];
                    }
                  }
                  else {
                    ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                  }
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.login = function() {
              if (ctrl.loading)
                return;

              delete ctrl.error;

              if (!ctrl.user.sms_code || !ctrl.user.sms_code.match(/[0-9]{6}/)) {
                ctrl.error = "Votre code d'activation est composé de 6 chiffres";
              }
              else if (!ctrl.password || ctrl.password.length < 8) {
                ctrl.error = "Votre mot de passe doit être composé d'au moins 8 caractères";
              }
              else {
                ctrl.loading = true;

                $.ajax({
                  type: 'POST',
                  url: getApiUrl() + '/login',
                  data: {
                    user: {
                      phone: ctrl.user.phone,
                      secret: ctrl.user.sms_code
                    }
                  },
                  success: function(data) {
                    if (data.user) {
                      ctrl.user.token = data.user.token;
                      changePassword(ctrl.password);
                    }
                    else {
                      ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                      ctrl.loading = false;
                      $scope.$apply();
                    }
                  },
                  error: function(data) {
                    if (data.responseJSON && data.responseJSON.error) {
                      switch (data.responseJSON.error.code) {
                        case "INVALID_PHONE_FORMAT":
                          ctrl.error = "Erreur : votre téléphone n'est pas au bon format"
                          break;
                        case "UNAUTHORIZED":
                          ctrl.error = "Erreur : le code d'activation est incorrect."
                          break;
                        case "DELETED":
                          ctrl.error = "Erreur : votre compte a été désactivé"
                          break;
                        default:
                          ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                      }
                    }
                    else {
                      ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                    }
                    ctrl.loading = false;
                    $scope.$apply();
                  },
                });
              }
            }

            function changePassword(password) {
              if (!password || !ctrl.user.token)
                return;

              $.ajax({
                type: 'PATCH',
                beforeSend: function(request) {
                  getAjaxHeaders(request);
                },
                url: getApiUrl() + '/users/me',
                data: {
                  token: ctrl.user.token,
                  user: {
                    password: password
                  }
                },
                success: function(data) {
                  if (data.user)
                  {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.reload();
                  }
                  else
                    ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                    ctrl.error = "Erreur : " + data.responseJSON.error.message
                  else
                    ctrl.error = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                  ctrl.loading = false;
                  $scope.$apply();
                },
              });
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })