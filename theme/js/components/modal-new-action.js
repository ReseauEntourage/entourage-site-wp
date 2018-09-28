angular.module('entourageApp')
  .component('newAction', {
    bindings: {
      user: '=',
      hide: '&',
      action: '=?',
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-new-action.html',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;

            ctrl.types = getCategoryTypes();

            if (ctrlParent.action) {
              ctrl.editedAction = ctrlParent.action;
              
              ctrl.title = angular.copy(ctrl.editedAction.title);
              ctrl.description = angular.copy(ctrl.editedAction.description);
              ctrl.display_category = angular.copy(ctrl.editedAction.display_category)
              ctrl.location = angular.copy(ctrl.editedAction.location)

              ctrl.termsAccepted = true;
            }

            ctrl.initSearchBox = function() {
              var a = new google.maps.places.Autocomplete(document.getElementById('new-action-search-input'), {
                bounds: map.mapObject.getBounds(),
                types: 'places'
              });

              a.addListener('place_changed', function() {
                var place = a.getPlace();

                if (place.geometry) {
                  ctrl.location = {
                    latitude: parseFloat(place.geometry.location.lat()),
                    longitude: parseFloat(place.geometry.location.lng())
                  }
                  $scope.$apply();
                }
              });
            }

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            ctrl.submit = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (!ctrl.display_category)
                ctrl.errors.push("Erreur : veuillez sélectionner une catégorie");
              if (!ctrl.title || ctrl.title.length < 10)
                ctrl.errors.push("Erreur : veuillez entrer un titre suffisamment long");
              if (!ctrl.location)
                ctrl.errors.push("Erreur : veuillez entrer une localisation");

              if (ctrl.errors.length)
                return;

              ctrl.loading = true;

              var data = {
                title: ctrl.title,
                entourage_type: ctrl.entourage_type,
                display_category: ctrl.display_category.type,
                description: ctrl.description,
                location: ctrl.location
              }

              if (ctrl.editedAction)
                updateAction(data);
              else
                newAction(data);
            }

            newAction = function(data) {
              $.ajax({
                type: 'POST',
                url: getApiUrl() + '/entourages',
                data: {
                  token: ctrlParent.user.token,
                  entourage: data
                },
                success: function(data) {
                  if (data.entourage) {
                    window.history.pushState('page2', data.entourage.title, '/app/?token=' + data.entourage.id);
                    window.location.reload();
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

            updateAction = function(data) {
              $.ajax({
                type: 'PATCH',
                url: getApiUrl() + '/entourages/' + ctrl.editedAction.uuid,
                data: {
                  token: ctrlParent.user.token,
                  entourage: {
                    title: data.title,
                    description: data.description,
                  }
                },
                success: function(data) {
                  if (data.entourage) {
                    ctrl.editedAction.title = data.entourage.title
                    ctrl.editedAction.description = data.entourage.description

                    ctrl.close();
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
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })