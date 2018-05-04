angular.module('entourageApp')
  .component('modalNewMessage', {
    bindings: {
      user: '=',
      message: '='
    },
    controller: function($scope, $element, $attrs, $uibModal) {
      var ctrlParent = this;

      ctrlParent.$onInit = function() {
        $uibModal.open({
          templateUrl: '/wp-content/themes/entourage/js/components/modal-new-message.html',
          controllerAs: 'ctrl',
          controller: function($scope, $uibModal, $uibModalInstance) {
            var ctrl = this;
            ctrl.type = ctrlParent.message.type; 

            ctrl.loading = false;

            ctrl.close = function() {
              $uibModalInstance.close();
            }

            ctrl.send = function() {
              if (ctrl.loading)
                return;

              ctrl.errors = [];

              if (!ctrl.message || ctrl.message.length < 4)
                ctrl.errors.push("Erreur : veuillez entrer un message suffisamment long");

              if (ctrl.errors.length)
                return;

              ctrl.loading = true;

              if (ctrl.type == 'report_user') {
                $.ajax({
                  type: 'POST',
                  url: getApiUrl() + '/users/' + ctrlParent.message.profile.id + '/report',
                  data: {
                    token: ctrlParent.user.token,
                    id: ctrlParent.message.profile.id,
                    user_report: {
                      message: ctrl.message
                    }
                  },
                  success: function(data) {
                    ctrl.close();
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
              else {
                switch (ctrl.type) {
                  case 'report_action':
                    title = "Signalement d'un entourage";
                    message = "<b>Entourage signalé : </b><a href='https://admin.entourage.social/entourages/" + ctrlParent.message.action.uuid + "'>" + ctrlParent.message.action.title + "</a>";
                    message += "<br><b>Signalé par : </b><a href='https://admin.entourage.social/users/" + ctrlParent.user.id + "'>" + ctrlParent.user.display_name + "</a>";
                    break;
                  case 'action_feedback':
                    title = "Mes retours sur l'entourage '" + ctrlParent.message.action.title + "' ";
                    if (ctrl.actionFeedback == 'success') {
                      title += "qui a été un succès";
                    }
                    else {
                      title += "qui n'a pas abouti";
                    }
                    message = "<b>Entourage concerné : </b><a href='https://admin.entourage.social/entourages/" + ctrlParent.message.action.uuid + "'>" + ctrlParent.message.action.title + "</a>";
                    message += "<br><b>Créé par : </b><a href='https://admin.entourage.social/users/" + ctrlParent.user.id + "'>" + ctrlParent.user.display_name + "</a>";
                    break;
                  default:
                    title = 'Nouveau message';
                    message = '';
                }

                message += "<br><b>Message : </b><br>" + ctrl.message;

                $.ajax({
                  type: 'POST',
                  url: '/wp-admin/admin-post.php',
                  data: {
                    action: 'direct_email',
                    title: title,
                    message: message
                  },
                  success: function(data) {
                    if (data == 'success') {
                      ctrl.close();
                    }
                    else
                      ctrl.errors.push("Il y a eu une erreur, merci de réessayer ou de nous contacter");
                    ctrl.loading = false;
                    $scope.$apply();
                  }
                });
              }
            }
          }
        }).closed.then(function() {
          ctrlParent.message = false;
        });
      }
    }
  })