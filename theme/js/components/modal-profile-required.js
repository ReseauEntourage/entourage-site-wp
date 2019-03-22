angular.module('entourageApp')
  .component('modalProfileRequired', {
    bindings: {
      reloadFeed: '&',
      user: '=',
      showModalCarousel: '='
    },
    controller: function($uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-profile-required.html',
          backdrop: 'static',
          keyboard: false,
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;
            ctrl.currentUser = ctrlParent.user;
            ctrl.isNewUser = angular.copy(ctrl.currentUser.has_password);
            ctrl.optinNewsletter = true;

            ctrl.submit = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (ctrl.isNewUser) {
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

              if (ctrl.isNewUser) {
                var data = {
                  first_name: ctrl.first_name,
                  last_name: ctrl.last_name,
                  about: ctrl.about,
                  address: ctrl.address,
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

            ctrl.newSubscription = function(email){
              $.ajax({
                type: "POST",
                url: "https://api.entourage.social/api/v1/newsletter_subscriptions",
                data: { "newsletter_subscription": { "email": email, "active": true } },
                success: function(){
                  if (!isDemoMode())
                    ga('send', 'event', 'Engagement', 'Newsletter', 'WebApp');
                }
              });
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
                success: function(d) {
                  if (d.user) {
                    ctrl.currentUser = d.user;
                    ctrlParent.user = d.user;

                    if (data.address && data.address.google_place_id) {
                      ctrl.changeAddress(data.address.google_place_id);
                    }
                    else {
                      localStorage.setItem('user', JSON.stringify(d.user));
                    }

                    if (ctrl.currentUser.display_name) {
                      ctrl.close();
                    }
                  }
                  else {
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                  }
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
                    ctrl.errors.push("Erreur : " + data.responseJSON.error.message[0]);
                  }
                  else {
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                  }
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.changeAddress = function(google_place_id) {
              $.ajax({
                type: 'POST',
                url: getApiUrl() + '/users/me/address',
                data: {
                  token: ctrl.currentUser.token,
                  address: {
                    google_place_id: google_place_id
                  }
                },
                success: function(data) {
                  if (data.address) {
                    ctrl.currentUser.address = data.address;
                    ctrlParent.user = ctrl.currentUser;
                    localStorage.setItem('user', JSON.stringify(ctrl.currentUser));
                  }
                  $scope.$apply();
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

            ctrl.close = function() {
              $uibModalInstance.close();
              if (ctrl.isNewUser) {
                ctrlParent.showModalCarousel = true;
              }
              ctrlParent.reloadFeed();
            }
          }
        });
      }
    }
  });