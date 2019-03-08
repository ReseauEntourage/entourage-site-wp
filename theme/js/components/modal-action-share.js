angular.module('entourageApp')
  .component('modalActionShare', {
    bindings: {
      hide: '&',
      action: '=?',
    },
    controller: function($uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-action-share.html',
          windowClass: 'modal-white',
          controllerAs: 'ctrl',
          controller: function($uibModalInstance) {
            var ctrl = this;
            ctrl.shareUrl = encodeURIComponent('https://www.entourage.social/entourages/' + ctrlParent.action.uuid);
            ctrl.emailSubject = ctrlParent.action.title;
            ctrl.emailMessage = encodeURIComponent(ctrlParent.action.description + '\n\n Rendez-vous sur Entourage, le réseau de la chaleur humaine : https://www.entourage.social/entourages/' + ctrlParent.action.uuid)
            ctrl.twitterText = encodeURIComponent(ctrlParent.action.title + ' https://www.entourage.social/entourages/' + ctrlParent.action.uuid + ' #chaleurHumaine')
            ctrl.whatsappMessage = encodeURIComponent(ctrlParent.action.title + ' https://www.entourage.social/entourages/' + ctrlParent.action.uuid)

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            ctrl.gaEvent = function(type) {
              if (!isDemoMode()) {
                ga('send', 'event', 'Share', type, ctrlParent.action.uuid);
              }
            }

            ctrl.shareMessenger = function() {
              window.open('fb-messenger://share?link=' + encodeURIComponent('https://www.entourage.social/entourages/' + ctrlParent.action.uuid) + '&app_id=' + encodeURIComponent(280727035774134));
              ctrl.gaEvent('Messenger')
            }

            ctrl.shareFacebook = function() {
              FB.ui({
                method: 'share',
                hashtag: '#chaleurHumaine',
                href: 'https://www.entourage.social/entourages/' + ctrlParent.action.uuid,
              });

              ctrl.gaEvent('Facebook');
            }
          }
        }).closed.then(function() {
          ctrlParent.hide();
        });
      }
    }
  });