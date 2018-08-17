angular.module('entourageApp')
  .component('newEvent', {
    bindings: {
      user: '=',
      hide: '&',
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-new-event.html',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;
            ctrl.websiteDirectory = _WEBSITE_DIRECTORY;
            ctrl.options = {
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

            ctrl.initSearchBox = function() {
              var a = new google.maps.places.Autocomplete(document.getElementById('new-action-search-input'), {
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
              $uibModalInstance.close();
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
                location: {
                  latitude: parseFloat(ctrl.place.geometry.location.lat()),
                  longitude: parseFloat(ctrl.place.geometry.location.lng())
                },
                description: ctrl.description,
                metadata: {
                  starts_at: new Date(ctrl.date.setHours(ctrl.time.hour, ctrl.time.min, null)).toISOString(),
                  place_name: ctrl.place.name,
                  street_address: ctrl.place.formatted_address,
                  google_place_id: ctrl.place.place_id
                }
              }

              console.info(data);

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
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })