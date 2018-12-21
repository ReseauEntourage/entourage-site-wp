angular.module('entourageApp')
  .component('modalCalendar', {
    bindings: {
      user: '=',
      map: '=',
      hide: '&'
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-calendar.html',
          windowClass: 'modal-small',
          controllerAs: 'ctrl',
          controller: function($scope, $sce, $uibModal, $uibModalInstance) {
            var ctrl = this;

            ctrl.months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            ctrl.currentMonth = new Date().getMonth();
            ctrl.currentYear = new Date().getFullYear();

            ctrl.index = 0;

            ctrl.previousMonth = function() {
              if (!ctrl.index) {
                return;
              }
              ctrl.index -= 1;

              if (ctrl.currentMonth == 0) {
                ctrl.currentMonth = 11;
                ctrl.currentYear -= 1;
              } else {
                ctrl.currentMonth -= 1;
              }
              initDays();
            }

            ctrl.nextMonth = function() {
              if (ctrl.index > 5) {
                return;
              }
              ctrl.index += 1;

              if (ctrl.currentMonth == 11) {
                ctrl.currentMonth = 0;
                ctrl.currentYear += 1;
              } else {
                ctrl.currentMonth += 1;
              }
              initDays();
            }

            initDays = function() {
              var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
              ctrl.days = [];

              for (i = 0; i < new Date(ctrl.currentYear, ctrl.currentMonth + 1, 0).getDate(); i++) {
                var day = {
                  number: i + 1,
                  time: new Date(ctrl.currentYear, ctrl.currentMonth, i + 1).getTime(),
                  events: [],
                  html: ''
                };

                if (day.time == today) {
                  day.today = true;
                } else if (day.time < today) {
                  day.past = true;
                }

                if (ctrl.events) {
                  for (j = 0; j < ctrl.events.length; j++) {
                    var event = ctrl.events[j];
                    var d = new Date(event.metadata.starts_at);
                    if (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() == day.time) {
                      day.events.push(event);
                      day.hour = d.getHours() + "h" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                      day.html += `<div class="popover-calendar-event"><h3>${event.title}</h3><div class="details">${day.hour} - ${event.metadata.display_address}</div><a class="btn dark-btn" href="/app?token=${event.uuid}" target="_blank"><i class="material-icons">call_made</i>Plus d'infos</a></div>`;
                    }
                  }

                  day.html = $sce.trustAsHtml(`<div class="popover-calendar">${day.html}</div>`)
                } 

                ctrl.days.push(day);
              }
              ctrl.emptyDays = new Array(new Date(ctrl.currentYear, ctrl.currentMonth, 1).getDay() - 1);
            }

            getEvents = function() {
              ctrl.loading = true;

              $.ajax({
                type: 'GET',
                url: getApiUrl() + '/feeds/outings',
                data: {
                  token: ctrlParent.user.token,
                  latitude: ctrlParent.map.getCenter().lat(),
                  longitude: ctrlParent.map.getCenter().lng(),
                },
                success: function(data) {
                  if (data.feeds)
                  {
                    ctrl.events = data.feeds.map(function(action) {
                      return transformAction(action.data);
                    });
                  }
                  console.info('events', ctrl.events);

                  initDays();
                  ctrl.loading = false;
                  $scope.$apply();
                },
                error: function(data) {
                  initDays();
                  ctrl.loading = false;
                  $scope.$apply();
                }
              });
            }

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            getEvents();
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  })