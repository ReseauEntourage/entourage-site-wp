angular.module('entourageApp')
  .component('modalCarousel', {
    bindings: {
      hide: '&',
      toggleNewAction: '&'
    },
    controllerAs: 'ctrlParent',
    controller: function($uibModal) {
      var ctrlParent = this;
      
      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-carousel.html',
          windowClass: 'modal-no-width',
          controllerAs: 'ctrl',
          controller: function($uibModalInstance) {
            var ctrl = this;

            ctrl.currentIndex = 0;

            ctrl.close = function() {
              $uibModalInstance.close();
              localStorage.setItem('carouselView', new Date().getTime());
            }

            ctrl.previous = function() {
              if (ctrl.currentIndex > 0){
                ctrl.currentIndex -= 1;
              }
            }

            ctrl.next = function() {
              if (ctrl.currentIndex < 2){
                ctrl.currentIndex += 1;
              } else {
                ctrl.close();
              }
            }

            ctrl.toggleNewAction = function() {
              ctrl.close();
              ctrlParent.toggleNewAction();
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  });