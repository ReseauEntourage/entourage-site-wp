angular.module('entourageApp')
  .component('login', {
    templateUrl: '/wp-content/themes/entourage/js/components/login.html',
    controllerAs: 'ctrl',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrl = this;

      ctrl.loading = false;
      ctrl.step = 'phone';
      ctrl.countries = getCountries();
      ctrl.country = ctrl.countries[0];

      if (localStorage.getItem('keep_user'))
        ctrl.keepLogged = true;
      else
        ctrl.keepLogged = false;

      ctrl.checkPhone = function() {
        if (ctrl.loading || !ctrl.phone)
          return;

        delete ctrl.error;

        ctrl.validPhone = validatePhone(ctrl.country[1], ctrl.phone);

        if (!ctrl.validPhone) {
          ctrl.error = "Votre numéro n'est pas valide, merci de réessayer";
          return;
        }

        ctrl.loading = true;

        $.ajax({
          type: 'POST',
          url: getApiUrl() + '/users/lookup',
          data: {
            phone: ctrl.validPhone,
          },
          success: function(data) {
            if (data && data.status) {
              switch (data.status) {
                case 'not_found':
                  ctrl.error = "Vous ne faites pas encore partie du réseau, inscrivez-vous !";
                  break;
                case 'found':
                  if (data.secret_type == 'code') {
                    ctrl.sendCode(true);
                    ctrl.step = 'code';
                  }
                  else
                    ctrl.step = 'password';
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
          error: function(data) {
            if (data.responseJSON && data.responseJSON.error) {
              switch (data.responseJSON.error.code) {
                case "INVALID_PHONE_FORMAT":
                  ctrl.error = "Erreur : votre téléphone n'est pas au bon format"
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
          }
        });
      }

      ctrl.login = function() {
        if (ctrl.loading)
          return;

        delete ctrl.error;

        if (!ctrl.password) {
          ctrl.error = "Entrez votre mot de passe !";
        }
        else {
          ctrl.loading = true;
          $.ajax({
            type: 'POST',
            url: getApiUrl() + '/login',
            data: {
              user: {
                phone: ctrl.validPhone,
                secret: ctrl.password
              }
            },
            success: function(data) {
              if (data.user)
              {
                data.user.phone = ctrl.phone;
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('keepLogged', ctrl.keepLogged);
                sessionStorage.setItem('logged', 1);
                window.location.reload();
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
                    ctrl.error = "Erreur : votre téléphone et votre mot de passe ne correspondent pas"
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
            }
          });
        }
      }

      ctrl.sendCode = function(force) {
        if (ctrl.loading && !force)
          return;

        ctrl.loading = true;

        $.ajax({
          type: 'PATCH',
          url: getApiUrl() + '/users/me/code',
          data: {
            user: {
              phone: ctrl.validPhone
            },
            code: {
              action: "regenerate"
            }
          },
          success: function(data) {
            ctrl.step = 'code';
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
          }
        });
      }

      ctrl.selectCountry = function(country) {
        ctrl.country = country;
      }
    }
  })