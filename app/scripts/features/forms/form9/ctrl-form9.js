/**
 * form9 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm9', function ($scope, $log, $modelForms, $service, $modelFormsValidator, appConstants) {

    var logMsgPrefix = "CtrlForm9 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm9 = {
      form: {

        secondary_pm_detonators_stop_board: false,
        secondary_pm_detonators_flashing_stop_light: false,
        placed_csp_stop_boards: false,
        placed_each_limit_worksite: false,
        placed_following_locations: false,
        placed_following_list_locations: '',

        pm_lockout: false,
        list_lz_numbers: '',

        points_secured: false,
        points_secured_lists: [],
        points_secured_person_name: '',
        points_secured_person_role: '',

        secondary_protection_person_name: '',
        secondary_protection_person_role: '',

        line_impassable: false,
        line_impassable_train_number: '',
        line_impassable_eta: '',
        line_impassable_at: '',

        si_diagram_attached: false,

        other_special_requirements: ''

      },
      Position_Secured_limit: 4,
      position_secured: $modelForms.data.position_secured
    };

    $scope.ctrlApp.dashboard.home = true;

    /**
     * load the content of form8
     */

    var load = function () {
      $modelFormsValidator.loadedForms['Form9'] = true;

      $modelForms.getPostFilledForm()
        .then(function (response) {
          $log.debug(logMsgPrefix + 'load ->' + response);
          if (response) {

            if ($modelForms.filledForms.json === undefined) {
              $modelForms.filledForms.json = {};
            }

            if ($modelForms.filledForms.json.forms === undefined) {
              $modelForms.filledForms.json['forms'] = {};
              return;
            }

            if ($modelForms.filledForms.json.forms['Form9'] === undefined) {
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form9'];

            Object.keys($scope.ctrlForm9.form).forEach(function (key) {

              if (form[key] !== undefined) {
                $scope.ctrlForm9.form[key] = form[key];
              }


            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm9.form));
          }
        });
    };

    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      if (form === 'Form9') {
        load();
      }
    });


    /**
     * validate a point secured
     * @param validate the validate state {true,false}
     */
    $scope.ctrlForm9.pointsSecured = function (validate) {

      if (validate) {
        if ($scope.ctrlForm9.form.points_secured_lists === 0) {
          $scope.ctrlForm9.newPointsSecured();
        }
      }
    };

    /**
     * create a point secured
     */
    $scope.ctrlForm9.newPointsSecured = function () {
      $log.debug(logMsgPrefix + ' newPointsSecured :' + JSON.stringify($scope.ctrlForm9.form.points_secured_lists));
      if ($scope.ctrlForm9.form.points_secured_lists.length >= $scope.ctrlForm9.Position_Secured_limit) {
        $service.showAlert('Only ' + $scope.ctrlForm9.Position_Secured_limit + ' Positions Secured allowed', true);
        return;
      }
      $scope.ctrlForm9.form.points_secured_lists.push({location: '', number: '', position_secured: ''});
    };

    /**
     * remove a point secured
     * @param index the index in the lists(point secured)
     */
    $scope.ctrlForm9.removePointsSecured = function (index) {
      $log.debug(logMsgPrefix + ' removePointsSecured :' + JSON.stringify($scope.ctrlForm9.form.points_secured_lists));
      if ($scope.ctrlForm9.form.points_secured_lists.length === 1) {
        $service.showAlert("At least 1 entry required", true);
        return;
      }
      $scope.ctrlForm9.form.points_secured_lists.splice(index, 1);
      $modelForms.setPostFilledForm('Form9', 'points_secured_lists', $scope.ctrlForm9.form.points_secured_lists);
    };

    /**
     * display the si diagram
     */
    $scope.ctrlForm9.siDiagram = function () {
      $service.showModal('scripts/features/si-diagram/si-diagram.html');
    };


    load();

  });