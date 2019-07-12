angular.module('entourageApp')
  .component('modalNewEvent', {
    bindings: {
      user: '=',
      hide: '&',
      action: '=?',
    },
    controller: function($uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-new-event.html',
          backdrop: 'static',
          keyboard: false,
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;

            ctrl.public = true;

            ctrl.datepickerOptions = {
              showWeeks: false,
              minDate: new Date(),
              startingDay: 1,
              formatDayTitle: "MM/yyyy"
            };
            ctrl.hours = ["06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00", "01", "02", "03", "04", "05"];
            ctrl.mins = ["15", "30", "45"];
            ctrl.time= {
              hour: "19",
              min: null
            };

            if (ctrlParent.action) {
              ctrl.editedAction = ctrlParent.action;
              
              ctrl.title = angular.copy(ctrl.editedAction.title);
              ctrl.description = angular.copy(ctrl.editedAction.description);
              ctrl.location = angular.copy(ctrl.editedAction.location);
              ctrl.public = angular.copy(ctrl.editedAction.public);
              ctrl.display_address = angular.copy(ctrl.editedAction.metadata.display_address);
              ctrl.date = new Date(ctrl.editedAction.metadata.starts_at);
              ctrl.time = {
                hour: new Date(ctrl.editedAction.metadata.starts_at).getHours(),
                min: new Date(ctrl.editedAction.metadata.starts_at).getMinutes()
              };
              ctrl.place = {
                name: angular.copy(ctrl.editedAction.metadata.place_name),
                formatted_address: angular.copy(ctrl.editedAction.metadata.street_address),
                place_id: angular.copy(ctrl.editedAction.metadata.google_place_id),
              };
            }

            ctrl.initSearchBox = function() {
              var a = new google.maps.places.Autocomplete(document.getElementById('new-action-search-input'), {
                bounds: map.mapObject.getBounds(),
                types: 'places'
              });

              a.addListener('place_changed', function() {
                var place = a.getPlace();

                if (place.geometry) {
                  ctrl.place = place;
                  $scope.$apply();
                }
              });
            }

            ctrl.close = function() {
              if (ctrl.title || ctrl.description) {
                if (confirm("Voulez-vous vraiment abandonner la création de cet événement ?")) {
                  $uibModalInstance.close();
                }
              } else {
                $uibModalInstance.close();
              }
            }

            ctrl.submit = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (!ctrl.place)
                ctrl.errors.push("Erreur : veuillez indiquer une adresse");
              if (!ctrl.date)
                ctrl.errors.push("Erreur : veuillez indiquer une date");
              if (!ctrl.title || ctrl.title.length < 10)
                ctrl.errors.push("Erreur : veuillez entrer un titre suffisamment long");

              if (ctrl.errors.length)
                return;

              ctrl.loading = true;

              var data = {
                group_type: 'outing',
                title: ctrl.title,
                public: ctrl.public,
                metadata: {
                  starts_at: new Date(ctrl.date.setHours(ctrl.time.hour, ctrl.time.min, null)).toISOString(),
                  place_name: ctrl.place.name,
                  street_address: ctrl.place.formatted_address,
                  google_place_id: ctrl.place.place_id
                },
                description: ctrl.description,
                location: {
                  latitude: ctrl.place.geometry ? parseFloat(ctrl.place.geometry.location.lat()) : ctrl.location.latitude,
                  longitude: ctrl.place.geometry ? parseFloat(ctrl.place.geometry.location.lng()) : ctrl.location.longitude
                }
              };

              console.info(data);

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
                    if (!isDemoMode()) {
                      ga('send', 'event', 'Engagement', 'NewEvent', 'WebApp');
                    }
                    window.history.pushState('page2', data.entourage.title, '/app/?token=' + data.entourage.id);
                    window.location.reload();
                  } else {
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  }
                },
                error: function(data) {
                  if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
                    ctrl.errors.push("Erreur : " + data.responseJSON.error.message[0]);
                  } else {
                    ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                  }
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
                  entourage: data
                },
                success: function(data) {
                  if (data.entourage) {
                    ctrl.editedAction.title = data.entourage.title
                    ctrl.editedAction.metadata = data.entourage.metadata
                    ctrl.editedAction.description = data.entourage.description
                    ctrl.editedAction.location = data.entourage.location

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