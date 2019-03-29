angular.module('entourageApp')
  .component('modalSearch', {
    bindings: {
      hide: '&',
      currentLocation: '=',
      onShowPoi: '&'
    },
    controller: function($uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-search.html',
          windowClass: 'modal-no-width modal-white low-z-index',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;

            ctrl.poisCategories = getPoisCategories();

            ctrl.locationName = ctrlParent.currentLocation.short_name;

            ctrl.text = "";

            ctrl.location = {
              latitude: parseFloat(ctrlParent.currentLocation.geometry.location.lat()),
              longitude: parseFloat(ctrlParent.currentLocation.geometry.location.lng())
            };

            ctrl.initSearchBox = function() {
              var a = new google.maps.places.Autocomplete(document.getElementById('new-search-input'), {
                bounds: map.mapObject.getBounds(),
                types: ['(regions)']
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

            ctrl.getSelectedCategories = function() {
              var cat = ctrl.poisCategories.filter(function(c) {
                return c.selected;
              });
              if (cat) {
                return cat.map(function(c) {
                  return c.id;
                });
              }
            }

            ctrl.submit = function() {
              if (ctrl.loading) {
                return;
              }

              ctrl.errors = [];

              var selectedCategories = ctrl.getSelectedCategories();

              if (!selectedCategories.length) {
                ctrl.errors.push("Sélectionnez au moins une catégorie");
              }

              if (!ctrl.location) {
                ctrl.errors.push("Sélectionnez une ville");
              }

              if (ctrl.errors.length) {
                return;
              }

              ctrl.loading = true;

              var data = {
                latitude: ctrl.location.latitude,
                longitude: ctrl.location.longitude,
                distance: 20,
                category_ids: selectedCategories.join(',')
              };

              $.ajax({
                type: 'GET',
                url: getApiUrl() + '/pois',
                data: data,
                success: function(data) {
                  if (data && data.pois && data.pois.length) {
                    ctrl.results = data.pois.filter(function(r) {
                      if (ctrl.text.length) {
                        var found = searchString(r.name, ctrl.text);
                        if (!found && r.description) {
                          return searchString(r.description, ctrl.text);
                        }
                        return found;
                      }
                      return true;
                    });
                  }
                  if (!ctrl.results.length) {
                    delete ctrl.results;
                    ctrl.errors.push("Il n'y a aucun résultat pour votre recherche");
                  }
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.openPoi = function(poi) {
              ctrlParent.onShowPoi({poi: poi});
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })