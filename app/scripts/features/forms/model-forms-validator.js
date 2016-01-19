'use strict';

angular.module('trackaccess.services')

  .factory('$modelFormsValidator', ['$q', '$log', '$modelForms', '$rootScope', '$service', '$timeout', 'appConstants',
    function ($q, $log, $modelForms, $rootScope, $service, $timeout, appConstants) {

      var logMsgPrefix = '$modelFormsValidator ->';
      $log.debug(logMsgPrefix + ' created');

      var $modelFormsValidator = {
        error: false,
        validators: {}
      };

      /**
       * prefilled form validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Prefilled = function () {
        var deferred = $q.defer();

        $modelFormsValidator.error = false;

        $modelForms.getPreFilledForm()
          .then(function (prefilledforms) {

            angular.forEach(prefilledforms, function (value, key) {

              if (value === undefined || value === null || value === '') {
                $modelFormsValidator.error = true;
                $rootScope.$broadcast(appConstants.EVENT_ERROR, key);
              }
            });

            if ($modelFormsValidator.error) {
              $service.showAlert("Incomplete prefilled form", true);
            }

            deferred.resolve();

          });

        return deferred.promise;
      };

      /**
       * overview validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Overview = function () {
        $log.debug(logMsgPrefix + 'validate_Overview');
        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form1'];

            $modelFormsValidator.error = false;

            var promises = [];
            if (forms.json['reference_no'] === undefined || forms.json['reference_no'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'reference_no'));
            }
            if (form['person_name'] === undefined || form['person_name'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_name'));
            }
            if (form['person_contact_no'] === undefined || form['person_contact_no'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_contact_no'));
            }
            if (form['officer_name'] === undefined || form['officer_name'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'officer_name'));
            }
            if (form['officer_contact_no'] === undefined || form['officer_contact_no'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'officer_contact_no'));
            }
            if (form['officer_duty_hr'] === undefined || form['officer_duty_hr'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'officer_duty_hr'));
            }
            if (form['days_dates_each'] === undefined && form['days_dates_continuous'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_each'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_continuous'));
            } else {
              if (form['days_dates_each'] === false && form['days_dates_continuous'] === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_each'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_continuous'));
              } else {
                if (form['days_dates'] === undefined || form['days_dates'] === null || form['days_dates'].length === 0) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_each'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'days_dates_continuous'));
                } else {
                  var $index = 0;
                  angular.forEach(form['days_dates'], function (value) {

                    if (value.from === undefined) {
                      $modelFormsValidator.error = true;
                      promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_from'));
                    }
                    if (value.to === undefined) {
                      $modelFormsValidator.error = true;
                      promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_to'));
                    }

                    $index++;
                  });
                }
              }
            }


            if (form['worksite_from_hr'] === undefined || form['worksite_from_hr'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form1_worksite_from_hr'));
            }
            if (form['worksite_to_hr'] === undefined || form['worksite_to_hr'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form1_worksite_to_hr'));
            }
            if (form['pa_line'] === undefined || form['pa_line'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_line'));
            }
            if (form['pa_from_station'] === undefined || form['pa_from_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_from_station'));
            }
            if (form['pa_from_signals'] === undefined || form['pa_from_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_from_signals'));
            }
            if (form['pa_from_metres'] === undefined || form['pa_from_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_from_metres'));
            }
            if (form['pa_from_points'] === undefined || form['pa_from_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_from_points'));
            }
            if (form['pa_from_stn'] === undefined || form['pa_from_stn'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_from_stn'));
            }
            if (form['pa_to_station'] === undefined || form['pa_to_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_to_station'));
            }
            if (form['pa_to_signals'] === undefined || form['pa_to_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_to_signals'));
            }
            if (form['pa_to_metres'] === undefined || form['pa_to_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_to_metres'));
            }
            if (form['pa_to_points'] === undefined || form['pa_to_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_to_points'));
            }
            if (form['pa_to_stn'] === undefined || form['pa_to_stn'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pa_to_stn'));
            }
            if (form['description_work'] === undefined || form['description_work'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'description_work'));
            }


            /*
             if ($modelFormsValidator.error) {

             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Overview');

             $q.all(promises)
             .then(function(){
             if (!$modelForms.onLoadForms && ($modelFormsValidator.submit === undefined ||
             ($modelFormsValidator.submit !== undefined && $modelFormsValidator.submit === false))) {
             $modelForms.onLoadForms=true;
             if ($modelForms.targetForm !== 'Overview') {
             $service.showAlert("Overview form is required to complete", false);
             }
             } else {
             $service.showAlert("Incomplete Overview form", true);
             }
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/

            $modelFormsValidator.validators['Overview'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form1 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form1 = function () {

        $log.debug(logMsgPrefix + 'validate_Form1');

        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form1'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['rpo_location_pwa'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'rpo_location_pwa'));
            } else {
              if (form['rpo_location_pwa'] === true && (form['rpo_location'] === undefined || form['rpo_location'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'rpo_location'));
              }
            }
            if (form['work_tunnel_yes'] === undefined && form['work_tunnel_no'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tunnel_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tunnel_no'));
            } else {
              if (form['work_tunnel_yes'] === false && form['work_tunnel_no'] === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tunnel_yes'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tunnel_no'));
              } else {
                if (form['work_tunnel_yes'] === true && (form['tunnel_safety_plan_approval_no'] === undefined || form['tunnel_safety_plan_approval_no'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tunnel_safety_plan_approval_no'));
                }
              }

            }
            if ((form['communication_plan_yes'] === undefined && form['communication_plan_no'] === undefined) ||
              (form['communication_plan_yes'] === false && form['communication_plan_no'] === false)) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'communication_plan_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'communication_plan_no'));
            }

            if (form['pm_blocking'] === false && form['pm_lockout'] === false && form['pm_track_time_permit'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_blocking'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_lockout'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_track_time_permit'));
            } else {
              if (form['pm_blocking'] === true || form['pm_lockout'] === true || form['pm_track_time_permit'] === true) {
                if ((form['pm_single_line_area'] === undefined && form['pm_both_up_down'] === undefined && form['pm_up_main'] === undefined
                  && form['pm_down_main'] === undefined && form['pm_other_lines'] === undefined) ||
                  (form['pm_single_line_area'] === false && form['pm_both_up_down'] === false && form['pm_up_main'] === false
                    && form['pm_down_main'] === false && form['pm_other_lines'] === false)) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_single_line_area'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_both_up_down'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_up_main'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_down_main'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_other_lines'));
                } else {
                  if (form['pm_other_lines'] === true && (form['pm_specify_other_lines'] === undefined || form['pm_specify_other_lines'] === '')) {
                    $modelFormsValidator.error = true;
                    promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'pm_specify_other_lines'));
                  }
                }
              }


            }

            if (form['csp'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp'));
            } else {
              if (form['csp'] === true) {
                if ((form['csp_single_line_area'] === undefined && form['csp_both_up_down'] === undefined && form['csp_up_main'] === undefined
                  && form['csp_down_main'] === undefined && form['csp_other_lines'] === undefined) || (form['csp_single_line_area'] === false && form['csp_both_up_down'] === false && form['csp_up_main'] === false
                  && form['csp_down_main'] === false && form['csp_other_lines'] === false)) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_single_line_area'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_both_up_down'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_up_main'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_down_main'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_other_lines'));
                } else {
                  if (form['csp_other_lines'] === true && (form['csp_specify_other_lines'] === undefined || form['csp_specify_other_lines'] === '')) {
                    $modelFormsValidator.error = true;
                    promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_specify_other_lines'));
                  }
                }

                if (form['csp_e_protect_requested'] === undefined) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_e_protect_requested'));
                }
                if (form['csp_from_stn'] === undefined || form['csp_from_stn'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_from_stn'));
                }
                if (form['csp_to_stn'] === undefined || form['csp_to_stn'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_to_stn'));
                }
                if (form['csp_signals'] !== undefined) {
                  if (form['csp_signals'] === true && (form['csp_signals_listed'] === undefined || form['csp_signals_listed'] === '')) {
                    $modelFormsValidator.error = true;
                    promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_signals_listed'));
                  }
                }
                if (form['csp_erect_advance_inner_warning'] !== undefined) {
                  if (form['csp_erect_advance_inner_warning'] === true && (form['csp_locations'] === undefined || form['csp_locations'] === '')) {
                    $modelFormsValidator.error = true;
                    promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'csp_locations'));
                  }
                }


              }

            }
            if (form['tw_mis88'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tw_mis88'));
            } else {
              if (form['tw_mis88'] === true) {
                if (form['tw_limits_from_metrage'] === undefined || form['tw_limits_from_metrage'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tw_limits_from_metrage'));
                }
                if (form['tw_limits_to_metrage'] === undefined || form['tw_limits_to_metrage'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tw_limits_to_metrage'));
                }
              }
            }

            if ((form['work_multiline_yes'] === undefined && form['work_multiline_no'] === undefined ) ||
              (form['work_multiline_yes'] === false && form['work_multiline_no'] === false)) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_multiline_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_multiline_no'));
            } else {
              if (form['work_multiline_yes'] === true) {
                if (form['work_multiline_contacted'] === undefined || form['work_multiline_contacted'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_multiline_contacted'));
                }
                if (form['work_multiline_date'] === undefined || form['work_multiline_date'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_multiline_date'));
                }
                if (form['work_multiline_hr'] === undefined || form['work_multiline_hr'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form1_work_multiline_hr'));
                }
              }

            }

            if (form['multi_worksite_activity'] === true) {
              if (form['reporting_point_location'] == undefined || form['reporting_point_location'] === '') {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'reporting_point_location'));
              }
            }

            if (form['work_under_near_traction_overhead'] === true || form['need_overhead_power_cutoff'] === true) {
              if (form['traction_personnel_advised'] == false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_personnel_advised'));
              }
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form1');
             $service.showAlert("Incomplete Form1", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/

            $modelFormsValidator.validators['Form1'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form2 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form2 = function () {
        $log.debug(logMsgPrefix + 'validate_Form2');
        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form2'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['single_line_area'] === undefined && form['up_main'] === undefined && form['down_main'] === undefined && form['siding_loops'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'single_line_area'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'up_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'siding_loops'));
            } else {
              if (form['single_line_area'] === false && form['up_main'] === false && form['down_main'] === false && form['siding_loops'] === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'single_line_area'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'up_main'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'down_main'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'siding_loops'));
              }
            }

            var $index = 0;
            angular.forEach(form['rpo_locations'], function (value) {

              if (value.location === '') {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_location'));
              }
              if (value.tc_contact.yes === false && value.tc_contact.no === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_tc_contact.yes'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_tc_contact.no'));
              }
              if (value.communication_tpo_locations.yes === false && value.communication_tpo_locations.no === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_communication_tpo_locations.yes'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_communication_tpo_locations.no'));
              }
              $index++;
            });

            $index = 0;
            angular.forEach(form['worksite_information'], function (value) {

              if (value.worksite_number === '') {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_worksite_number'));
              }
              if (value.worksite_name === '') {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_worksite_name'));
              }

              if (value.channel_radio_coverage.yes === false && value.channel_radio_coverage.no === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_channel_radio_coverage.yes'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_channel_radio_coverage.no'));
              }
              if (value.cellphone_coverage.yes === false && value.cellphone_coverage.no === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_cellphone_coverage.yes'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_cellphone_coverage.no'));
              }
              if (value.worksite_description === '') {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_worksite_description'));
              }

              $index++;
            });

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form2');
             $service.showAlert("Incomplete Form2", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form2'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form3 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form3 = function () {
        $log.debug(logMsgPrefix + 'validate_Form3');

        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form3'];
            $modelFormsValidator.error = false;

            var promises = [];

            if (form['f3_location_between_at_line'] === undefined || form['f3_location_between_at_line'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_line'));
            }
            if (form['f3_location_between_at_from_station'] === undefined || form['f3_location_between_at_from_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_from_station'));
            }
            if (form['f3_location_between_at_from_signals'] === undefined || form['f3_location_between_at_from_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_from_signals'));
            }
            if (form['f3_location_between_at_from_metres'] === undefined || form['f3_location_between_at_from_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_from_metres'));
            }
            if (form['f3_location_between_at_from_points'] === undefined || form['f3_location_between_at_from_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_from_points'));
            }
            if (form['f3_location_between_at_to_station'] === undefined || form['f3_location_between_at_to_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_to_station'));
            }
            if (form['f3_location_between_at_to_signals'] === undefined || form['f3_location_between_at_to_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_to_signals'));
            }
            if (form['f3_location_between_at_to_metres'] === undefined || form['f3_location_between_at_to_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_to_metres'));
            }
            if (form['f3_location_between_at_to_points'] === undefined || form['f3_location_between_at_to_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f3_location_between_at_to_points'));
            }
            if (form['person_in_charge_name'] === undefined || (form['person_in_charge_name'] !== undefined && form['person_in_charge_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_name'));
            }
            if (form['person_in_charge_contact_no'] === undefined || (form['person_in_charge_contact_no'] !== undefined && form['person_in_charge_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_contact_no'));
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form3');
             $service.showAlert("Incomplete Form3", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form3'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form4 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form4 = function () {
        $log.debug(logMsgPrefix + 'validate_Form4');

        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form4'];
            $modelFormsValidator.error = false;

            var promises = [];

            if (form['tamper'] === undefined || form['tamper'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tamper'));
            }
            if (form['regulator'] === undefined || form['regulator'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'regulator'));
            }
            if (form['stabiliser'] === undefined || form['stabiliser'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'stabiliser'));
            }
            if (form['low_loader'] === undefined || form['low_loader'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'low_loader'));
            }
            if (form['rail_grinder'] === undefined || form['rail_grinder'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'rail_grinder'));
            }
            if (form['ballast_cleaner'] === undefined || form['ballast_cleaner'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'ballast_cleaner'));
            }
            if (form['ballast_cleaner'] === undefined || form['ballast_cleaner'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'ballast_cleaner'));
            }
            if (form['additional_machinery'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'additional_machinery'));
            } else {
              if (form['additional_machinery'] === true) {
                if (form['additional_machinery_details'] === undefined || form['additional_machinery_details'] === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'additional_machinery_details'));
                }
              }
            }

            if (form['f4_location_between_at_line'] === undefined || form['f4_location_between_at_line'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_line'));
            }
            if (form['f4_location_between_at_from_station'] === undefined || form['f4_location_between_at_from_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_from_station'));
            }
            if (form['f4_location_between_at_from_signals'] === undefined || form['f4_location_between_at_from_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_from_signals'));
            }
            if (form['f4_location_between_at_from_metres'] === undefined || form['f4_location_between_at_from_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_from_metres'));
            }
            if (form['f4_location_between_at_from_points'] === undefined || form['f4_location_between_at_from_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_from_points'));
            }
            if (form['f4_location_between_at_to_station'] === undefined || form['f4_location_between_at_to_station'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_to_station'));
            }
            if (form['f4_location_between_at_to_signals'] === undefined || form['f4_location_between_at_to_signals'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_to_signals'));
            }
            if (form['f4_location_between_at_to_metres'] === undefined || form['f4_location_between_at_to_metres'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_to_metres'));
            }
            if (form['f4_location_between_at_to_points'] === undefined || form['f4_location_between_at_to_points'] === '') {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'f4_location_between_at_to_points'));
            }

            if (form['work_tw_areas'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tw_areas'));
            } else {
              if (form['work_tw_areas'] === true) {
                if (form['work_tw_areas_csp'] === false && form['work_tw_areas_tw_control_mis88'] === false) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tw_areas_csp'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_tw_areas_tw_control_mis88'));
                }
              }
            }

            if (form['work_singleline_automatic_areas'] === undefined) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_singleline_automatic_areas'));
            } else {
              if (form['work_singleline_automatic_areas'] === true) {
                if (form['work_singleline_automatic_areas_csp'] === false && form['work_singleline_automatic_areas_track_time_permit_mis60'] === false) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_singleline_automatic_areas_csp'));
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_singleline_automatic_areas_track_time_permit_mis60'));
                }
              }
            }

            if (form['travelling_departure_from'] === undefined || (form['travelling_departure_from'] !== undefined && form['travelling_departure_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'travelling_departure_from'));
            }
            if (form['travelling_departure_to'] === undefined || (form['travelling_departure_to'] !== undefined && form['travelling_departure_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'travelling_departure_to'));
            }
            if (form['travelling_departure_hr'] === undefined || (form['travelling_departure_hr'] !== undefined && form['travelling_departure_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form4_travelling_departure_hr'));
            }
            if (form['travelling_return_from'] === undefined || (form['travelling_return_from'] !== undefined && form['travelling_return_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'travelling_return_from'));
            }
            if (form['travelling_return_to'] === undefined || (form['travelling_return_to'] !== undefined && form['travelling_return_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'travelling_return_to'));
            }
            if (form['travelling_return_hr'] === undefined || (form['travelling_return_hr'] !== undefined && form['travelling_return_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form4_travelling_return_hr'));
            }
            if (form['person_in_charge_name'] === undefined || (form['person_in_charge_name'] !== undefined && form['person_in_charge_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_name'));
            }
            if (form['person_in_charge_contact_no'] === undefined || (form['person_in_charge_contact_no'] !== undefined && form['person_in_charge_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_contact_no'));
            }
            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form4');
             $service.showAlert("Incomplete Form4", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form4'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };


      /**
       * form5 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form5 = function () {
        $log.debug(logMsgPrefix + 'validate_Form5');

        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form5'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['swo'] === undefined || (form['swo'] !== undefined && form['swo'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'swo'));
            }

            if (form['work_train_departure_from'] === undefined || (form['work_train_departure_from'] !== undefined && form['work_train_departure_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_train_departure_from'));
            }
            if (form['work_train_departure_hr'] === undefined || (form['work_train_departure_hr'] !== undefined && form['work_train_departure_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form5_work_train_departure_hr'));
            }
            if (form['work_train_finish_at'] === undefined || (form['work_train_finish_at'] !== undefined && form['work_train_finish_at'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'work_train_finish_at'));
            }
            if (form['work_train_finish_at_hr'] === undefined || (form['work_train_finish_at_hr'] !== undefined && form['work_train_finish_at_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form5_work_train_finish_at_hr'));
            }
            if (form['additional_info_yes'] === false && form['additional_info_no'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'additional_info_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'additional_info_no'));
            } else {
              if (form['additional_info_yes'] === true) {
                if (form['additional_info_list_location'] === undefined || (form['additional_info_list_location'] !== undefined && form['additional_info_list_location'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'additional_info_list_location'));
                }
              }
            }
            if (form['consists'] === undefined || (form['consists'] !== undefined && form['consists'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'consists'));
            }

            if (form['multiline_workarea'] === true) {
              if (form['multiline_workarea_both_up_down_main'] === false && form['multiline_workarea_up_main'] === false
                && form['multiline_workarea_down_main'] === false && form['multiline_workarea_other_lines'] === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'multiline_workarea_both_up_down_main'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'multiline_workarea_up_main'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'multiline_workarea_down_main'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'multiline_workarea_other_lines'));
              } else {
                if (form['multiline_workarea_other_lines'] === true) {
                  if (form['multiline_workarea_specify_other_lines'] === undefined || (form['multiline_workarea_specify_other_lines'] !== undefined && form['multiline_workarea_specify_other_lines'] === '')) {
                    $modelFormsValidator.error = true;
                    promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'multiline_workarea_specify_other_lines'));
                  }
                }
              }
            }

            if (form['train_service_cancelled_resheduled_yes'] === false && form['train_service_cancelled_resheduled_no'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'train_service_cancelled_resheduled_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'train_service_cancelled_resheduled_no'));
            } else {
              if (form['train_service_cancelled_resheduled_yes'] === true) {
                if (form['train_service_cancelled_resheduled'] === undefined || (form['train_service_cancelled_resheduled'] !== undefined && form['train_service_cancelled_resheduled'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'train_service_cancelled_resheduled'));
                }
              }
            }
            if (form['person_in_charge_name'] === undefined || (form['person_in_charge_name'] !== undefined && form['person_in_charge_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_name'));
            }
            if (form['person_in_charge_contact_no'] === undefined || (form['person_in_charge_contact_no'] !== undefined && form['person_in_charge_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'person_in_charge_contact_no'));
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form6');
             $service.showAlert("Incomplete Form5", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form5'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form6 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form6 = function () {
        $log.debug(logMsgPrefix + 'validate_Form6');

        var deferred = $q.defer();

        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form6'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['power_off_from_hr'] === undefined || (form['power_off_from_hr'] !== undefined && form['power_off_from_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form6_power_off_from_hr'));
            }
            if (form['power_on_at_hr'] === undefined || (form['power_on_at_hr'] !== undefined && form['power_on_at_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form6_power_on_at_hr'));
            }
            if (form['isolation_locations_between'] === undefined || (form['isolation_locations_between'] !== undefined && form['isolation_locations_between'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_between'));
            }
            if (form['isolation_locations_and'] === undefined || (form['isolation_locations_and'] !== undefined && form['isolation_locations_and'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_and'));
            }
            if (form['description_work'] === undefined || (form['description_work'] !== undefined && form['description_work'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'description_work'));
            }
            if (form['blocking_applied_signals'] === false && form['esl'] === false && form['isolation_protected_worksite'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_protected_worksite'));
            } else {
              if (form['blocking_applied_signals'] === true) {
                if (form['blocking_applied_signals_lists'] === undefined || (form['blocking_applied_signals_lists'] !== undefined && form['blocking_applied_signals_lists'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals_lists'));
                }
              } else if (form['esl'] === true) {
                if (form['esl_from_metrage'] === undefined || (form['esl_from_metrage'] !== undefined && form['esl_from_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_metrage'));
                }
                if (form['esl_from_station_between'] === undefined || (form['esl_from_station_between'] !== undefined && form['esl_from_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_between'));
                }
                if (form['esl_from_station_and'] === undefined || (form['esl_from_station_and'] !== undefined && form['esl_from_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_and'));
                }
                if (form['esl_to_metrage'] === undefined || (form['esl_to_metrage'] !== undefined && form['esl_to_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_metrage'));
                }
                if (form['esl_to_station_between'] === undefined || (form['esl_to_station_between'] !== undefined && form['esl_to_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_between'));
                }
                if (form['esl_to_station_and'] === undefined || (form['esl_to_station_and'] !== undefined && form['esl_to_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_and'));
                }
              }
            }

            if (form['line_nimt'] === false && form['line_melling'] === false && form['line_woburnloop'] === false
              && form['line_johnsonville'] === false && form['line_wairarapa'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_nimt'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_melling'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_woburnloop'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_johnsonville'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_wairarapa'));
            }
            if (form['single_line_area'] === false && form['both_up_down_main'] === false && form['up_main'] === false
              && form['down_main'] === false && form['other_lines'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'single_line_area'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'both_up_down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'up_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'other_lines'));
            } else {
              if (form['other_lines'] === true) {
                if (form['specify_other_lines'] === undefined || (form['specify_other_lines'] !== undefined && form['specify_other_lines'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'specify_other_lines'));
                }
              }
            }
            if (form['wellingtonplatform_from'] === undefined || (form['wellingtonplatform_from'] !== undefined && form['wellingtonplatform_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'wellingtonplatform_from'));
            }
            if (form['wellingtonplatform_to'] === undefined || (form['wellingtonplatform_to'] !== undefined && form['wellingtonplatform_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'wellingtonplatform_to'));
            }
            if (form['substation_from'] === undefined || (form['substation_from'] !== undefined && form['substation_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'substation_from'));
            }
            if (form['substation_to'] === undefined || (form['substation_to'] !== undefined && form['substation_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'substation_to'));
            }
            if (form['isolator_from'] === undefined || (form['isolator_from'] !== undefined && form['isolator_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator_from'));
            }
            if (form['isolator_to'] === undefined || (form['isolator_to'] !== undefined && form['isolator_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator_to'));
            }
            if (form['termination'] === undefined || (form['termination'] !== undefined && form['termination'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'termination'));
            }
            if (form['electrical_safety_observer_yes'] === false && form['electrical_safety_observer_no'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_no'));
            } else {
              if (form['electrical_safety_observer_yes'] === true) {
                if (form['electrical_safety_observer_from_hr'] === undefined || (form['electrical_safety_observer_from_hr'] !== undefined && form['electrical_safety_observer_from_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form6_electrical_safety_observer_from_hr'));
                }
                if (form['electrical_safety_observer_to_hr'] === undefined || (form['electrical_safety_observer_to_hr'] !== undefined && form['electrical_safety_observer_to_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form6_electrical_safety_observer_to_hr'));
                }
              }
            }
            if (form['traction_person_name'] === undefined || (form['traction_person_name'] !== undefined && form['traction_person_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_name'));
            }
            if (form['traction_person_contact_no'] === undefined || (form['traction_person_contact_no'] !== undefined && form['traction_person_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_contact_no'));
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form6');
             $service.showAlert("Incomplete Form6", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form6'] = $modelFormsValidator.error;
            deferred.resolve();
          });

        return deferred.promise;
      };

      /**
       * form7 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form7 = function () {
        $log.debug(logMsgPrefix + 'validate_Form7');

        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form7'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['power_off_from_hr'] === undefined || (form['power_off_from_hr'] !== undefined && form['power_off_from_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form7_power_off_from_hr'));
            }
            if (form['power_on_at_hr'] === undefined || (form['power_on_at_hr'] !== undefined && form['power_on_at_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form7_power_on_at_hr'));
            }
            if (form['isolation_locations_between'] === undefined || (form['isolation_locations_between'] !== undefined && form['isolation_locations_between'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_between'));
            }
            if (form['isolation_locations_and'] === undefined || (form['isolation_locations_and'] !== undefined && form['isolation_locations_and'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_and'));
            }
            if (form['description_work'] === undefined || (form['description_work'] !== undefined && form['description_work'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'description_work'));
            }
            if (form['blocking_applied_signals'] === false && form['esl'] === false && form['isolation_protected_worksite'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_protected_worksite'));
            } else {
              if (form['blocking_applied_signals'] === true) {
                if (form['blocking_applied_signals_lists'] === undefined || (form['blocking_applied_signals_lists'] !== undefined && form['blocking_applied_signals_lists'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals_lists'));
                }
              } else if (form['esl'] === true) {
                if (form['esl_from_metrage'] === undefined || (form['esl_from_metrage'] !== undefined && form['esl_from_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_metrage'));
                }
                if (form['esl_from_station_between'] === undefined || (form['esl_from_station_between'] !== undefined && form['esl_from_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_between'));
                }
                if (form['esl_from_station_and'] === undefined || (form['esl_from_station_and'] !== undefined && form['esl_from_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_and'));
                }
                if (form['esl_to_metrage'] === undefined || (form['esl_to_metrage'] !== undefined && form['esl_to_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_metrage'));
                }
                if (form['esl_to_station_between'] === undefined || (form['esl_to_station_between'] !== undefined && form['esl_to_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_between'));
                }
                if (form['esl_to_station_and'] === undefined || (form['esl_to_station_and'] !== undefined && form['esl_to_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_and'));
                }
              }
            }
            if (form['line_ef25'] === false && form['line_diesel_hauled_trains'] === false && form['line_15days_notice'] === false
              && form['line_yard'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_ef25'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_diesel_hauled_trains'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_15days_notice'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_yard'));
            }
            if (form['single_line_area'] === false && form['both_up_down_main'] === false && form['up_main'] === false
              && form['down_main'] === false && form['other_lines'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'single_line_area'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'both_up_down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'up_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'other_lines'));
            } else {
              if (form['other_lines'] === true) {
                if (form['specify_other_lines'] === undefined || (form['specify_other_lines'] !== undefined && form['specify_other_lines'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'specify_other_lines'));
                }
              }
            }
            if (form['tss_from'] === undefined || (form['tss_from'] !== undefined && form['tss_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tss_from'));
            }
            if (form['tss_to'] === undefined || (form['tss_to'] !== undefined && form['tss_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tss_to'));
            }
            if (form['isolator1_from'] === undefined || (form['isolator1_from'] !== undefined && form['isolator1_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator1_from'));
            }
            if (form['isolator1_to'] === undefined || (form['isolator1_to'] !== undefined && form['isolator1_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator1_to'));
            }
            if (form['isolator2_from'] === undefined || (form['isolator2_from'] !== undefined && form['isolator2_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator2_from'));
            }
            if (form['isolator2_to'] === undefined || (form['isolator2_to'] !== undefined && form['isolator2_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator2_to'));
            }
            if (form['termination'] === undefined || (form['termination'] !== undefined && form['termination'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'termination'));
            }
            if (form['electrical_safety_observer_yes'] === false && form['electrical_safety_observer_no'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_no'));
            } else {
              if (form['electrical_safety_observer_yes'] === true) {
                if (form['electrical_safety_observer_from_hr'] === undefined || (form['electrical_safety_observer_from_hr'] !== undefined && form['electrical_safety_observer_from_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form7_electrical_safety_observer_from_hr'));
                }
                if (form['electrical_safety_observer_to_hr'] === undefined || (form['electrical_safety_observer_to_hr'] !== undefined && form['electrical_safety_observer_to_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form7_electrical_safety_observer_to_hr'));
                }
              }
            }
            if (form['traction_person_name'] === undefined || (form['traction_person_name'] !== undefined && form['traction_person_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_name'));
            }
            if (form['traction_person_contact_no'] === undefined || (form['traction_person_contact_no'] !== undefined && form['traction_person_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_contact_no'));
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form7');
             $service.showAlert("Incomplete Form7", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form7'] = $modelFormsValidator.error;
            deferred.resolve();
          });
        return deferred.promise;
      };

      /**
       * form8 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form8 = function () {
        $log.debug(logMsgPrefix + 'validate_Form8');


        var deferred = $q.defer();


        $modelForms.getPostFilledForm()
          .then(function (forms) {


            var form = forms.json.forms['Form8'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['power_off_from_hr'] === undefined || (form['power_off_from_hr'] !== undefined && form['power_off_from_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form8_power_off_from_hr'));
            }
            if (form['power_on_at_hr'] === undefined || (form['power_on_at_hr'] !== undefined && form['power_on_at_hr'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form8_power_on_at_hr'));
            }
            if (form['isolation_locations_between'] === undefined || (form['isolation_locations_between'] !== undefined && form['isolation_locations_between'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_between'));
            }
            if (form['isolation_locations_and'] === undefined || (form['isolation_locations_and'] !== undefined && form['isolation_locations_and'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_locations_and'));
            }
            if (form['description_work'] === undefined || (form['description_work'] !== undefined && form['description_work'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'description_work'));
            }
            if (form['blocking_applied_signals'] === false && form['esl'] === false && form['isolation_protected_worksite'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolation_protected_worksite'));
            } else {
              if (form['blocking_applied_signals'] === true) {
                if (form['blocking_applied_signals_lists'] === undefined || (form['blocking_applied_signals_lists'] !== undefined && form['blocking_applied_signals_lists'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'blocking_applied_signals_lists'));
                }
              } else if (form['esl'] === true) {
                if (form['esl_from_metrage'] === undefined || (form['esl_from_metrage'] !== undefined && form['esl_from_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_metrage'));
                }
                if (form['esl_from_station_between'] === undefined || (form['esl_from_station_between'] !== undefined && form['esl_from_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_between'));
                }
                if (form['esl_from_station_and'] === undefined || (form['esl_from_station_and'] !== undefined && form['esl_from_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_from_station_and'));
                }
                if (form['esl_to_metrage'] === undefined || (form['esl_to_metrage'] !== undefined && form['esl_to_metrage'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_metrage'));
                }
                if (form['esl_to_station_between'] === undefined || (form['esl_to_station_between'] !== undefined && form['esl_to_station_between'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_between'));
                }
                if (form['esl_to_station_and'] === undefined || (form['esl_to_station_and'] !== undefined && form['esl_to_station_and'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'esl_to_station_and'));
                }
              }
            }

            if (form['line_nimt'] === false && form['line_nal'] === false && form['line_new'] === false
              && form['line_wiridepot'] === false && form['line_manukau'] === false && form['line_one'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_nimt'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_nal'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_new'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_wiridepot'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_manukau'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_one'));
            }
            if (form['single_line_area'] === false && form['both_up_down_main'] === false && form['up_main'] === false
              && form['down_main'] === false && form['other_lines'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'single_line_area'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'both_up_down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'up_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'down_main'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'other_lines'));
            } else {
              if (form['other_lines'] === true) {
                if (form['specify_other_lines'] === undefined || (form['specify_other_lines'] !== undefined && form['specify_other_lines'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'specify_other_lines'));
                }
              }
            }
            if (form['tss_from'] === undefined || (form['tss_from'] !== undefined && form['tss_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tss_from'));
            }
            if (form['tss_to'] === undefined || (form['tss_to'] !== undefined && form['tss_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'tss_to'));
            }
            if (form['isolator1_from'] === undefined || (form['isolator1_from'] !== undefined && form['isolator1_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator1_from'));
            }
            if (form['isolator1_to'] === undefined || (form['isolator1_to'] !== undefined && form['isolator1_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator1_to'));
            }
            if (form['isolator2_from'] === undefined || (form['isolator2_from'] !== undefined && form['isolator2_from'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator2_from'));
            }
            if (form['isolator2_to'] === undefined || (form['isolator2_to'] !== undefined && form['isolator2_to'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'isolator2_to'));
            }
            if (form['termination'] === undefined || (form['termination'] !== undefined && form['termination'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'termination'));
            }
            if (form['electrical_safety_observer_yes'] === false && form['electrical_safety_observer_no'] === false) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_yes'));
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'electrical_safety_observer_no'));
            } else {
              if (form['electrical_safety_observer_yes'] === true) {
                if (form['electrical_safety_observer_from_hr'] === undefined || (form['electrical_safety_observer_from_hr'] !== undefined && form['electrical_safety_observer_from_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form8_electrical_safety_observer_from_hr'));
                }
                if (form['electrical_safety_observer_to_hr'] === undefined || (form['electrical_safety_observer_to_hr'] !== undefined && form['electrical_safety_observer_to_hr'] === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'form8_electrical_safety_observer_to_hr'));
                }
              }
            }
            if (form['traction_person_name'] === undefined || (form['traction_person_name'] !== undefined && form['traction_person_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_name'));
            }
            if (form['traction_person_contact_no'] === undefined || (form['traction_person_contact_no'] !== undefined && form['traction_person_contact_no'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'traction_person_contact_no'));
            }

            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form8');
             $service.showAlert("Incomplete Form8", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form8'] = $modelFormsValidator.error;
            deferred.resolve();
          });
        return deferred.promise;
      };

      /**
       * form9 validation
       * @returns {empty}
       */
      $modelFormsValidator.validate_Form9 = function () {
        $log.debug(logMsgPrefix + 'validate_Form9');

        var deferred = $q.defer();

        $modelForms.getPostFilledForm()
          .then(function (forms) {

            var form = forms.json.forms['Form9'];
            $modelFormsValidator.error = false;

            var promises = [];
            if (form['secondary_pm_detonators_stop_board'] === true || form['secondary_pm_detonators_flashing_stop_light'] === true) {
              if (form['placed_csp_stop_boards'] == false && form['placed_each_limit_worksite'] === false) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'placed_csp_stop_boards'));
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'placed_each_limit_worksite'));
              }
            }
            if (form['placed_following_locations'] === true) {
              if (form['placed_following_list_locations'] === undefined || (form['placed_following_list_locations'] !== undefined && form['placed_following_list_locations'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'placed_following_list_locations'));
              }
            }

            if (form['pm_lockout'] === true) {
              if (form['list_lz_numbers'] === undefined || (form['list_lz_numbers'] !== undefined && form['list_lz_numbers'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'list_lz_numbers'));
              }
            }

            if (form['points_secured'] === true) {
              if (form['points_secured_person_name'] === undefined || (form['points_secured_person_name'] !== undefined && form['points_secured_person_name'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'points_secured_person_name'));
              }
              if (form['points_secured_person_role'] === undefined || (form['points_secured_person_role'] !== undefined && form['points_secured_person_role'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'points_secured_person_role'));
              }

              var $index = 0;
              angular.forEach(form['points_secured_lists'], function (value) {

                if (value.location === '') {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_location'));
                }
                if (value.number === undefined || (value.number !== undefined && value.number === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_number'));
                }
                if (value.position_secured === undefined || (value.position_secured !== undefined && value.position_secured === '')) {
                  $modelFormsValidator.error = true;
                  promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, $index + '_position_secured'));
                }
                $index++;
              });
            }
            if (form['secondary_protection_person_name'] === undefined || (form['secondary_protection_person_name'] !== undefined && form['secondary_protection_person_name'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'secondary_protection_person_name'));
            }
            if (form['secondary_protection_person_role'] === undefined || (form['secondary_protection_person_role'] !== undefined && form['secondary_protection_person_role'] === '')) {
              $modelFormsValidator.error = true;
              promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'secondary_protection_person_role'));
            }

            if (form['line_impassable'] === true) {
              if (form['line_impassable_train_number'] === undefined || (form['line_impassable_train_number'] !== undefined && form['line_impassable_train_number'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_impassable_train_number'));
              }
              if (form['line_impassable_eta'] === undefined || (form['line_impassable_eta'] !== undefined && form['line_impassable_eta'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_impassable_eta'));
              }
              if (form['line_impassable_at'] === undefined || (form['line_impassable_at'] !== undefined && form['line_impassable_at'] === '')) {
                $modelFormsValidator.error = true;
                promises.push($rootScope.$broadcast(appConstants.EVENT_ERROR, 'line_impassable_at'));
              }

            }
            /*
             if ($modelFormsValidator.error) {
             $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM,'Form9');
             $service.showAlert("Incomplete Form9", true);
             $q.all(promises)
             .then(function(){
             deferred.resolve();
             });

             } else {
             deferred.resolve();
             }*/
            $modelFormsValidator.validators['Form9'] = $modelFormsValidator.error;
            deferred.resolve();
          });
        return deferred.promise;
      };

      return $modelFormsValidator;

    }]);