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
          backdrop: 'static',
          keyboard: false,
          windowClass: 'modal-no-width modal-white low-z-index',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModalInstance) {
            var ctrl = this;

            ctrl.loading = false;
            ctrl.poisCategories = getPoisCategories();
            ctrl.locationName = "";
            ctrl.text = "";

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
              if (ctrl.results) {
                delete ctrl.results;
              } else {
                $uibModalInstance.close();
              }
            }

            ctrl.toggleCategory = function(category) {
              category.selected = !category.selected;
              if (ctrl.getSelectedCategories()) {
                ctrl.selectedCategories = true;
              }
            }

            ctrl.toggleCategories = function(select) {
              ctrl.poisCategories.map(function(c) {
                c.selected = select;
                return c;
              });
              ctrl.selectedCategories = select;
            }

            ctrl.getSelectedCategories = function() {
              var cat = ctrl.poisCategories.filter(function(c) {
                return c.selected;
              });
              return cat.length;
            }

            ctrl.submit = function() {
              if (ctrl.loading) {
                return;
              }

              ctrl.errors = [];

              var selectedCategories = ctrl.poisCategories.filter(function(c) {
                return c.selected;
              }).map(function(c) {
                return c.id;
              });

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
                distance: 5,
                category_ids: selectedCategories.join(',')
              };

              if (!isDemoMode()) {
                ga('send', 'event', 'Search', 'Poi', ctrl.text);
              }

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
                  if (!data || !data.pois || !data.pois.length || !ctrl.results.length) {
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

            ctrl.print = function() {
              if (ctrl.window) {
                ctrl.window.close();
              }
              ctrl.window = window.open("/liste-structures/", "win", "width=840,height=1188");
              ctrl.window.onload = function(){

                var page = `<div class="page">`;
                page += `<header>`;
                page += `<img src="/wp-content/themes/entourage/img/logo-entourage-orange-big.png" />`;
                page += `<strong>Entourage, réseau d’amitié et d’entraide entre voisins avec et sans domicile</strong>`;
                page += `<a>www.entourage.social</a>`;
                page += `</header>`;

                page += `<h1>Les structures solidaires recensées à ${ctrl.locationName}</h1>`;

                page += `<div id="categories">`;
                ctrl.poisCategories.map(function (category) {
                  if (!category.selected) {
                    return;
                  }
                  page += `<div class="category-item">`;
                  page += `<i class="action-icon poi-icon category-${category.id }"></i>`;
                  page += `<span class="name">= ${category.label}</span>`;
                  page += `</div>`;
                });
                page += `</div>`;

                var firstPageResults = ctrl.results.splice(0, 8);

                firstPageResults.map(function (result) {
                  page += `<div class="result-item">`;
                  page += `<h4>`;
                  page += `<i class="action-icon poi-icon category-${result.category_id }"></i>`;
                  page += `<span class="name">${result.name}</span>`;
                  page += `</h4>`;
                  page += `<div class="infos">`;
                  page += `<span class="capitalize-first-letter address"><i class="material-icons">location_on</i>${result.adress}</span>`;
                  if (result.phone) {
                    page += `<span class="phone"><i class="material-icons">phone</i>${result.phone}</span>`;
                  }
                  page += `</div>`;
                  page += `</div>`;
                });

                var i = 0;
                ctrl.results.map(function (result) {
                  if (i%11 == 0) {
                    page += `</div><div class="page">`;
                  }
                  page += `<div class="result-item">`;
                  page += `<h4>`;
                  page += `<i class="action-icon poi-icon category-${result.category_id }"></i>`;
                  page += `<span class="name">${result.name}</span>`;
                  page += `</h4>`;
                  page += `<div class="infos">`;
                  page += `<span class="capitalize-first-letter address"><i class="material-icons">location_on</i>${result.adress}</span>`;
                  if (result.phone) {
                    page += `<span class="phone"><i class="material-icons">phone</i>${result.phone}</span>`;
                  }
                  page += `</div>`;
                  page += `</div>`;
                  i += 1;
                });

                page += `</div>`;

                ctrl.window.document.body.innerHTML = page;
                setTimeout(function(){
                  ctrl.window.print();
                }, 200);
              }
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })