angular.module('entourageApp')
  .component('register', {
    templateUrl: '/wp-content/themes/entourage/js/components/register.html',
    bindings: {
      toggle: '&'
    },
    controller: function($scope) {
      var ctrl = this;

      $scope.registrationStep = 1;
      $scope.invitationSent = false;
      $scope.countriesToggle = false;
      $scope.countries = getCountries();
      $scope.country = ctrl.countries[0];
      $scope.user = {}
      $scope.loading = false;

      $scope.hide = function() {
        ctrl.toggle();
      }

      $scope.selectCountry = function(country) {
        $scope.country = country;
      }

      $scope.register = function() {
        if ($scope.loading || !$scope.user.phone)
          return;

        var countryCode = $scope.country[1].toUpperCase();
        var phone = libphonenumber.parse($scope.user.phone, countryCode);
        delete $scope.registrationError;

        if (!phone.phone) {
          $scope.registrationError = "Votre numéro n'est pas valide, merci de réessayer";
        }
        else {
          phone = libphonenumber.format(phone.phone, countryCode, 'International');

          if (!libphonenumber.isValidNumber(phone, countryCode)) {
            $scope.registrationError = "Votre numéro n'est pas valide, merci de réessayer";
          }
          else {
            
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
                  $scope.user = data.user;
                  $scope.user.phone = phone;
                  $scope.registrationStep = 2;
                  if (!isDemoMode())
                    ga('send', 'event', 'Engagement', 'AppDownload', 'WebApp');
                }
                else
                  $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                $scope.$apply();
              },
              error: function(data) {
                if (data.responseJSON && data.responseJSON.error) {
                  if (data.responseJSON.error.code == "CANNOT_CREATE_USER") {
                    $scope.registrationError = "Erreur : vous faites déjà partie du réseau Entourage !";
                  }
                  else if (data.responseJSON.error.message) {
                    $scope.registrationError = "Erreur : " + data.responseJSON.error.message[0];
                  }
                }
                else {
                  $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                }
                $scope.$apply();
              }
            });
          }
        }
      }

      $scope.login = function() {
        if ($scope.loading)
          return;

        delete $scope.registrationError;

        if (!$scope.user.sms_code || !$scope.user.sms_code.match(/[0-9]{6}/)) {
          $scope.registrationError = "Votre code d'activation est composé de 6 chiffres";
        }
        else if (!$scope.password || $scope.password.length < 8) {
          $scope.registrationError = "Votre mot de passe doit être composé d'au moins 8 caractères";
        }
        else {
          $scope.loading = true;

          $.ajax({
            type: 'POST',
            url: getApiUrl() + '/login',
            data: {
              user: {
                phone: $scope.user.phone,
                secret: $scope.user.sms_code
              }
            },
            success: function(data) {
              if (data.user) {
                $scope.user.token = data.user.token;
                changePassword($scope.password);
              }
              else {
                $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
                $scope.loading = false;
                $scope.$apply();
              }
            },
            error: function(data) {
              if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
                $scope.registrationError = "Erreur : " + data.responseJSON.error.message
              else
                $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
              $scope.loading = false;
              $scope.$apply();
            },
          });
        }
      }

      function changePassword(password) {
        if (!password || !$scope.user.token)
          return;

        $.ajax({
          type: 'PATCH',
          beforeSend: function(request) {
            getAjaxHeaders(request);
          },
          url: getApiUrl() + '/users/me',
          data: {
            token: $scope.user.token,
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
              $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
            $scope.loading = false;
            $scope.$apply();
          },
          error: function(data) {
            if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message)
              $scope.registrationError = "Erreur : " + data.responseJSON.error.message
            else
              $scope.registrationError = "Il y a eu une erreur, merci de réessayer ou de nous contacter";
            $scope.loading = false;
            $scope.$apply();
          },
        });
      }
    }
  })