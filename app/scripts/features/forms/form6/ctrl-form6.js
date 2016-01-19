/**
 * form6 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm6', function ($scope, $log, $modelForms, $modelFormsValidator, appConstants) {

    var logMsgPrefix = "CtrlForm6 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm6 = {
      form: {

        power_off_from_hr: '',
        power_on_at_hr: '',

        isolation_locations_between: '',
        isolation_locations_and: '',

        description_work: '',

        blocking_applied_signals: false,
        esl: false,
        isolation_protected_worksite: false,

        blocking_applied_signals_lists: '',
        esl_from_metrage: '',
        esl_from_station_between: '',
        esl_from_station_and: '',
        esl_to_metrage: '',
        esl_to_station_between: '',
        esl_to_station_and: '',

        line_nimt: false,
        line_melling: false,
        line_woburnloop: false,
        line_johnsonville: false,
        line_wairarapa: false,

        single_line_area: false,
        both_up_down_main: false,
        up_main: false,
        down_main: false,
        other_lines: false,
        specify_other_lines: '',

        wellingtonplatform_from: '',
        wellingtonplatform_to: '',
        substation_from: '',
        substation_to: '',
        isolator_from: '',
        isolator_to: '',
        termination: '',

        electrical_safety_observer_yes: false,
        electrical_safety_observer_no: false,
        electrical_safety_observer_from_hr: '',
        electrical_safety_observer_to_hr: '',

        traction_person_name: '',
        traction_person_contact_no: ''



      },
      wellingtonplatforms: $modelForms.data.wellingplatforms,
      substations: $modelForms.data.substations,
      isolator: $modelForms.data.isolator,
      termination: $modelForms.data.termination
    };

    $scope.ctrlApp.dashboard.home = true;

    /**
     * load the content of form6
     */
    var load = function () {
      $modelFormsValidator.loadedForms['Form6'] = true;

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

            if ($modelForms.filledForms.json.forms['Form6'] === undefined) {
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form6'];

            Object.keys($scope.ctrlForm6.form).forEach(function (key) {

              if (form[key] !== undefined) {
                $scope.ctrlForm6.form[key] = form[key];
              }


            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm6.form));
          }
        });
    };


    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      if (form === 'Form6') {
        load();
      }

    });


    $scope.ctrlForm6.setWellingtonPlatform = function (wellingtonplatform, index) {
      $log.debug(logMsgPrefix + ' setWellingtonPlatform ' + JSON.stringify(wellingtonplatform) + ' ->index:' + index);
      if (index === 0) {
        $scope.ctrlForm6.form.wellingtonplatform_from = wellingtonplatform;
      }
      else if (index === 1) {
        $scope.ctrlForm6.form.wellingtonplatform_to = wellingtonplatform;
      }

    };

    $scope.ctrlForm6.setSubstation = function (substation, index) {
      $log.debug(logMsgPrefix + ' setSubstation ' + JSON.stringify(substation) + ' ->index:' + index);
      if (index === 0) {
        $scope.ctrlForm6.form.substation_from = substation;
      }
      else if (index === 1) {
        $scope.ctrlForm6.form.substation_to = substation;

      }

    };


    $scope.ctrlForm6.setIsolator = function (isolator, index) {
      $log.debug(logMsgPrefix + ' setIsolator ' + JSON.stringify(isolator) + ' ->index:' + index);
      if (index === 0) {
        $scope.ctrlForm6.isolator_from = isolator;
      }
      else if (index === 1) {
        $scope.ctrlForm6.form.isolator_to = isolator;
      }
    };

    $scope.ctrlForm6.setTermination = function (termination) {
      $log.debug(logMsgPrefix + ' setTermination ' + JSON.stringify(termination));
      $scope.ctrlForm6.form.termination = termination;
    };

    load();

  });