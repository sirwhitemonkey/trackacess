/**
 * form3 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm3', function ($scope, $log, $modelForms, $modelFormsValidator, $timeout, $service, appConstants) {

    var logMsgPrefix = "CtrlForm3 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm3 = {
      form: {

        f3_location_between_at_line: '',
        f3_location_between_at_from_station: '',
        f3_location_between_at_from_signals: '',
        f3_location_between_at_from_metres: '',
        f3_location_between_at_from_points: '',
        f3_location_between_at_to_station: '',
        f3_location_between_at_to_signals: '',
        f3_location_between_at_to_metres: '',
        f3_location_between_at_to_points: '',

        re_railing: false,
        re_railing_between: '',
        re_railing_and: '',
        re_railing_detail_rust_rail_between: '',
        re_railing_detail_rust_rail_and: '',


        lca_manual_control: false,
        lca_manual_controls: [],
        lca_manual_control_from_hr: '',
        lca_manual_control_to_hr: '',
        lca_manual_control_speed_boards_yes: false,
        lca_manual_control_speed_boards_no: false,
        lca_manual_control_speed_boards_reason: '',

        lca_disconnected: false,
        lca_disconnections: [],
        lca_disconnected_speed_boards_yes: false,
        lca_disconnected_speed_boards_no: false,
        lca_disconnected_speed_boards_reason: '',

        list_signals_fixed_stop: '',
        list_motors_points_disconnected: '',

        testing_signals_motor_points: false,
        testing_signals_motor_hr: '',
        testing_signals_motor_date: '',

        kv_signals: false,
        kv_signals_power_cutoff_between: '',
        kv_signals_power_cutoff_and: '',
        kv_signals_power_cutoff_from_hr: '',
        kv_signals_power_cutoff_to_hr: '',

        hand_signal_man: false,
        person_in_charge_name: '',
        person_in_charge_contact_no: ''
      },
      Level_Cross_Alarms_limit: 5,
      lines: $modelForms.data.lines
    };
    $scope.ctrlApp.dashboard.home = true;

    /**
     * load the content of form2
     */
    var load = function () {
      $modelFormsValidator.loadedForms['Form3'] = true;

      $modelForms.getPostFilledForm()
        .then(function (response) {
          $log.debug(logMsgPrefix + 'load ->' + response);
          if (response) {

            if ($modelForms.filledForms.json === undefined) {
              $modelForms.filledForms.json = {};
            }

            if ($modelForms.filledForms.json.forms === undefined) {
              $modelForms.filledForms.json['forms'] = {};
            }

            if ($modelForms.filledForms.json.forms['Form1'] === undefined) {
              $modelForms.filledForms.json.forms['Form1'] = {};
              $modelForms.filledForms.json.forms['Form1'].re_railing = true;
              $modelForms.filledForms.json.forms['Form1'].lca_disconnected = true;
              $modelForms.filledForms.json.forms['Form1'].lca_manual_control = true;
              $modelForms.filledForms.json.forms['Form1'].kv_signals = true;
            }

            if ($modelForms.filledForms.json.forms['Form3'] === undefined) {
              $modelForms.filledForms.json.forms['Form3'] = {};
            }

            var form = $modelForms.filledForms.json.forms['Form3'];

            Object.keys($scope.ctrlForm3.form).forEach(function (key) {

              if (form[key] !== undefined) {
                $scope.ctrlForm3.form[key] = form[key];
              }

              //Needed parameters
              var form1 = $modelForms.filledForms.json.forms['Form1'];
              if (form1.re_railing !== undefined) {
                $scope.ctrlForm3.form.re_railing = form1.re_railing;
              }
              if (form1.lca_manual_control !== undefined) {
                $scope.ctrlForm3.form.lca_manual_control = form1.lca_manual_control;
              }
              if (form1.lca_disconnected !== undefined) {
                $scope.ctrlForm3.form.lca_disconnected = form1.lca_disconnected;
              }
              if (form1.kv_signals !== undefined) {
                $scope.ctrlForm3.form.kv_signals = form1.kv_signals;
              }


              if ($scope.ctrlForm3.form.testing_signals_motor_date !== undefined &&
                $scope.ctrlForm3.form.testing_signals_motor_date !== '') {
                $scope.ctrlForm3.form.testing_signals_motor_date = new Date($scope.ctrlForm3.form.testing_signals_motor_date);
              }

            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm3.form));
          }
        });
    };


    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      if (form === 'Form3') {
        load();
      }

    });

    /**
     * create a LCA manual control
     */
    $scope.ctrlForm3.newLCAManualControl = function () {
      $log.debug(logMsgPrefix + ' newLCAManualControl :' + JSON.stringify($scope.ctrlForm3.form.lca_manual_controls));
      if ($scope.ctrlForm3.form.lca_manual_controls.length >= $scope.ctrlForm3.Level_Cross_Alarms_limit) {
        $service.showAlert('Only ' + $scope.ctrlForm3.Level_Cross_Alarms_limit + ' Level Crossing Alarms on Manual Control allowed', true);
        return;
      }
      $scope.ctrlForm3.form.lca_manual_controls.push({level_crossing: '', metrage: ''});
    };

    /**
     * remove an LCA manual control
     * @param index the index of the lists(LCA manual control)
     */
    $scope.ctrlForm3.removeLCAManualControl = function (index) {
      $log.debug(logMsgPrefix + ' removeLCAManualControl :' + JSON.stringify($scope.ctrlForm3.form.lca_manual_controls));
      $scope.ctrlForm3.form.lca_manual_controls.splice(index, 1);
      $modelForms.setPostFilledForm('Form3', 'lca_manual_control', $scope.ctrlForm3.form.lca_manual_controls);
    };

    /**
     * create a LCA disconnected
     */
    $scope.ctrlForm3.newLCADisconnected = function () {
      $log.debug(logMsgPrefix + ' newLCADisconnected :' + JSON.stringify($scope.ctrlForm3.form.lca_disconnections));
      if ($scope.ctrlForm3.form.lca_disconnections.length >= $scope.ctrlForm3.Level_Cross_Alarms_limit) {
        $service.showAlert('Only ' + $scope.ctrlForm3.Level_Cross_Alarms_limit + ' Level Crossing Alarms Disconnected allowed', true);
        return;
      }
      $scope.ctrlForm3.form.lca_disconnections.push({level_crossing: '', metrage: ''});
    };

    /**
     * remove a LCA disconnected
     * @param index the index of the lists(LCA disconnected)
     */
    $scope.ctrlForm3.removeLCADisconnected = function (index) {
      $log.debug(logMsgPrefix + ' removeLCADisconnected :' + JSON.stringify($scope.ctrlForm3.form.lca_disconnections));
      $scope.ctrlForm3.form.lca_disconnections.splice(index, 1);
      $modelForms.setPostFilledForm('Form3', 'lca_disconnected', $scope.ctrlForm3.form.lca_disconnections);
    };


    if (!$modelFormsValidator.error &&
      ($modelFormsValidator.submit === undefined || ($modelFormsValidator.submit !== undefined && $modelFormsValidator.submit === false))) {
      $service.showAlert('Only qualified signals staff should be filling this form', false);
    }

    load();

  });


