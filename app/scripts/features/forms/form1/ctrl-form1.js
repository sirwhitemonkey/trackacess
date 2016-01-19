/**
 * form1 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm1', function ($scope, $log, $modelForms, $service, $modelFormsValidator, $filter, appConstants) {

    var logMsgPrefix = "CtrlForm1 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm1 = {
      form: {
        rpo_location_pwa: false,
        rpo_location: '',

        work_tunnel_yes: false,
        work_tunnel_no: false,
        tunnel_safety_plan_approval_no: '',

        communication_plan_yes: false,
        communication_plan_no: false,

        pm_blocking: false,
        pm_lockout: false,
        pm_track_time_permit: false,
        pm_single_line_area: false,
        pm_both_up_down: false,
        pm_up_main: false,
        pm_down_main: false,
        pm_other_lines: false,
        pm_specify_other_lines: '',

        csp: false,
        csp_e_protect_requested: false,
        csp_single_line_area: false,
        csp_both_up_down: false,
        csp_up_main: false,
        csp_down_main: false,
        csp_other_lines: false,
        csp_specify_other_lines: '',
        csp_from_stn: '',
        csp_to_stn: '',
        csp_signals: false,
        csp_signals_listed: '',
        csp_erect_advance_inner_warning: false,
        csp_locations: '',

        call_sign: '',

        tw_mis88: false,
        tw_limits_from_metrage: '',
        tw_limits_to_metrage: '',

        si_diagram_yes: false,
        si_diagram_no: false,

        work_multiline_yes: false,
        work_multiline_no: false,
        work_multiline_contacted: '',
        work_multiline_date: '',
        work_multiline_hr: '',

        multi_worksite_activity: false,
        reporting_point_location: '',

        line_impassable: false,
        line_impassable_from_hr: '',
        line_impassable_to_hr: '',

        re_railing: false,
        lca_disconnected: false,
        lca_manual_control: false,
        kv_signals: false,
        signals_field_engineer: false,

        work_under_near_traction_overhead: false,
        need_overhead_power_cutoff: false,
        traction_personnel_advised: false,

        work_train_required: false,
        mtmv_work_protection_plan_required: false
      }
    };

    $scope.ctrlApp.dashboard.home = true;


    /**
     * load the content of form1
     */
    var load = function () {

      $modelFormsValidator.loadedForms['Form1'] = true;

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

            if ($modelForms.filledForms.json.forms['Form1'] === undefined) {
              $modelForms.filledForms.json.forms['Form1'] = {};
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form1'];

            Object.keys($scope.ctrlForm1.form).forEach(function (key) {

              if (form[key] !== undefined) {
                $scope.ctrlForm1.form[key] = form[key];
              }

              if ($scope.ctrlForm1.form.work_multiline_date !== undefined &&
                $scope.ctrlForm1.form.work_multiline_date !== '') {
                $scope.ctrlForm1.form.work_multiline_date = new Date($scope.ctrlForm1.form.work_multiline_date);
              }

            });

            $scope.ctrlForms.tractionform();

            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm1.form));
          }
        });
    };

    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      if (form === 'Form1') {
        load();
      }

    });

    /**
     * display the si diagram
     */
    $scope.ctrlForm1.siDiagram = function () {
      $service.showModal('scripts/features/si-diagram/si-diagram.html');
    };

    /**
     * validate the form selection
     * @param options the option {true,false}
     * @param validate the value of the form's property
     * @param form the name of the form
     */
    $scope.ctrlForm1.validateForm = function (options, validate, form) {

      if (form.indexOf('Form6-8') !== -1) {

        if ($scope.ctrlForm1.form.work_under_near_traction_overhead === true ||
          $scope.ctrlForm1.form.need_overhead_power_cutoff === true) {
          if ($scope.ctrlForm1.form.traction_personnel_advised === true) {
            if ($modelForms.filledForms.json.forms['Form6'] === undefined) {
              $modelForms.filledForms.json.forms['Form6'] = {};
            }
            if ($modelForms.filledForms.json.forms['Form7'] === undefined) {
              $modelForms.filledForms.json.forms['Form7'] = {};
            }
            if ($modelForms.filledForms.json.forms['Form8'] === undefined) {
              $modelForms.filledForms.json.forms['Form8'] = {};
            }
            $scope.ctrlForms.tractionform();
            return;
          } else {
            if ($modelForms.filledForms.json.forms['Form6'] === undefined &&
              $modelForms.filledForms.json.forms['Form7'] === undefined &&
              $modelForms.filledForms.json.forms['Form8'] === undefined) {
              return;
            }

          }
        }
        if ($scope.ctrlForm1.form.work_under_near_traction_overhead === false &&
          $scope.ctrlForm1.form.need_overhead_power_cutoff == false && $scope.ctrlForm1.form.traction_personnel_advised === false) {
          return;
        }
      } else {
        if ((options && validate) || (!options && !validate)) {

          if (options && validate) {
            if (form === 'Form2') {
              if ($modelForms.filledForms.json.forms['Form2'] === undefined) {
                $modelForms.filledForms.json.forms['Form2'] = {};
              }
            } else if (form === 'Form4') {
              if ($modelForms.filledForms.json.forms['Form4'] === undefined) {
                $modelForms.filledForms.json.forms['Form4'] = {};
              }
            } else if (form === 'Form5') {
              if ($modelForms.filledForms.json.forms['Form5'] === undefined) {
                $modelForms.filledForms.json.forms['Form5'] = {};
              }
            } else if (form === 'Form9') {
              if ($modelForms.filledForms.json.forms['Form9'] === undefined) {
                $modelForms.filledForms.json.forms['Form9'] = {};
              }
            }
          }
          return;
        }
      }

      $modelForms.getPostFilledForm()
        .then(function (response) {
          $log.debug(logMsgPrefix + 'validateForm ->' + response);
          if (response) {

            var action = function (form) {

              var _form = form;
              if (form.indexOf('Form6-8') !== -1) {
                _form = 'Form6-8';
              }
              $service.confirm("'" + _form + "' already attached in the form, you want to remove the contents ?", function (response) {

                if (response) {
                  if (form.indexOf('Form6-8') !== -1) {
                    delete $modelForms.filledForms.json.forms['Form6'];
                    delete $modelForms.filledForms.json.forms['Form7'];
                    delete $modelForms.filledForms.json.forms['Form8'];
                  } else {
                    delete $modelForms.filledForms.json.forms[form];
                  }
                  $modelForms.replacePostFilledForm()
                    .then(function (response) {
                    });

                  if (form === 'Form2') {
                    if (options) {
                      $scope.ctrlForm1.form.communication_plan_no = true;
                    }
                  }
                  if (form.indexOf('Form6-8') !== -1) {
                    $scope.ctrlForm1.form.traction_personnel_advised = false;
                  }

                } else {
                  if (form === 'Form2') {
                    if (!options) {
                      $scope.ctrlForm1.form.communication_plan_no = !validate;
                      $scope.ctrlForm1.form.communication_plan_yes = true;
                    } else {
                      $scope.ctrlForm1.form.communication_plan_yes = !validate;
                    }
                  } else if (form === 'Form4') {
                    $scope.ctrlForm1.form.mtmv_work_protection_plan_required = !validate;

                  } else if (form === 'Form5') {
                    $scope.ctrlForm1.form.work_train_required = !validate;

                  } else if (form === 'Form9') {
                    $scope.ctrlForm1.form.line_impassable = !validate;
                  } else if (form.indexOf('Form6-8') !== -1) {
                    $scope.ctrlForm1.form[form.split('-')[0]] = !validate;
                  }
                }
              });
            };

            if ($modelForms.filledForms.json.forms[form] !== undefined) {
              action(form);
            } else {
              if (form.indexOf('Form6-8') !== -1) {
                action(form);
              }
            }

          }
        });
    };

    load();

  });






