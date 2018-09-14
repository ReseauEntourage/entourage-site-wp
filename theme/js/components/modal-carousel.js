angular.module('entourageApp')
  .component('modalCarousel', {
    bindings: {
      hide: '&'
    },
    controllerAs: 'ctrlParent',
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;
      
      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-carousel.html',
          windowClass: 'modal-no-width',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;
            
            ctrl.close = function() {
              $uibModalInstance.close();
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  });