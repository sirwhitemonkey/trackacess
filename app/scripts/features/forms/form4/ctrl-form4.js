/**
 * form4 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm4',function($scope,$log,$modelForms,$modelFormsValidator,$service,appConstants) {

    var logMsgPrefix = "CtrlForm4 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm4={
      form: {
        tamper: '',
        regulator: '',
        stabiliser:'',
        low_loader: '',
        gopher: '',
        rail_grinder: '',
        ballast_cleaner: '',
        additional_machinery: false,
        additional_machinery_details: '' ,

        f4_location_between_at_line: '',
        f4_location_between_at_from_station: '',
        f4_location_between_at_from_signals: '',
        f4_location_between_at_from_metres: '',
        f4_location_between_at_from_points: '',
        f4_location_between_at_to_station: '',
        f4_location_between_at_to_signals: '',
        f4_location_between_at_to_metres: '',
        f4_location_between_at_to_points: '',


        work_tw_areas: false,
        work_tw_areas_csp: false,
        work_tw_areas_tw_control_mis88: false,

        work_singleline_automatic_areas: false,
        work_singleline_automatic_areas_csp: false,
        work_singleline_automatic_areas_track_time_permit_mis60:false,

        travelling_departure_from: '',
        travelling_departure_to: '',
        travelling_departure_hr: '',
        travelling_return_from: '',
        travelling_return_to: '',
        travelling_return_hr: '',
        work_enroute: '',

        mtmv_location: '',
        mtmv_station: false,
        mtmv_station_name: '',
        mtmv_station_loop: false,
        mtmv_station_yard: false,
        mtmv_main_line_siding: false,
        mtmv_main_line_siding_name: '',
        mtmv_metrage: false,
        mtmv_metrage_linear_reference: '',

        need_trains_cancelled: false,

        signaller_pukekohe: false,
        signaller_plimmerton: false,
        signaller_tawa: false,

        lca_manual_operation: false,
        need_overhead_power_cutoff: false,
        person_in_charge_name: '',
        person_in_charge_contact_no:''

      },
      tamper_nos: $modelForms.data.tamper_nos,
      regulator_nos: $modelForms.data.regulator_nos,
      stabiliser_nos: $modelForms.data.stabiliser_nos,
      low_loader_nos: $modelForms.data.low_loader_nos,
      rail_grinder_nos: $modelForms.data.rail_grinder_nos,
      ballast_cleaner_nos: $modelForms.data.ballast_cleaner_nos,
      gopher_nos: $modelForms.data.gopher_nos,
      lines: $modelForms.data.lines
    };

    $scope.ctrlApp.dashboard.home=true;

    /**
     * load the content of form4
     */
    var load = function() {
      $modelFormsValidator.loadedForms['Form4']=true;

      $modelForms.getPostFilledForm()
        .then(function(response) {
          $log.debug(logMsgPrefix + 'load ->' + response);
          if (response) {

            if ($modelForms.filledForms.json === undefined) {
              $modelForms.filledForms.json={};
            }

            if ($modelForms.filledForms.json.forms === undefined)  {
              $modelForms.filledForms.json['forms']={};
              return;
            }

            if ($modelForms.filledForms.json.forms['Form1'] === undefined)  {
              $modelForms.filledForms.json.forms['Form1']={};
            }

            if ($modelForms.filledForms.json.forms['Form4'] === undefined)  {
              $modelForms.filledForms.json.forms['Form4']={};
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form4'];

            Object.keys($scope.ctrlForm4.form).forEach(function(key){

              if (form[key] !== undefined) {
                $scope.ctrlForm4.form[key] = form[key];
              }


            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm4.form));
          }
        });
    };


    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS,function(event,form){
      if (form === 'Form4') {
        load();
      }

    });

    /**
     * validate the form selection
     * @param options the option {true,false}
     * @param validate the value of the form's property
     * @param form the name of the form
     */
    $scope.ctrlForm4.validateForm=function(options,validate,form) {

      if ($modelForms.formtype === 'form_type_1') {
        return;
      }

      if (form.indexOf('Form6-8') !== -1) {

        if ($scope.ctrlForm4.form.need_overhead_power_cutoff === true) {
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


      $modelForms.getPostFilledForm()
        .then(function(response) {
          $log.debug(logMsgPrefix + 'validateForm ->' + response);
          if (response) {

            var action = function(form) {

              var _form=form;
              if (form.indexOf('Form6-8') !== -1) {
                _form='Form6-8';
              }
              $service.confirm("'" + _form + "' already attached in the form, you want to remove the contents ?",function(response) {

                if (response) {
                  if (form.indexOf('Form6-8') !== -1) {
                    delete $modelForms.filledForms.json.forms['Form6'];
                    delete $modelForms.filledForms.json.forms['Form7'];
                    delete $modelForms.filledForms.json.forms['Form8'];
                  } else {
                    delete $modelForms.filledForms.json.forms[form];
                  }
                  $modelForms.replacePostFilledForm()
                    .then(function(response){
                    });

                  if (form.indexOf('Form6-8') !== -1) {
                    $scope.ctrlForm4.form.need_overhead_power_cutoff=false;
                  }

                }
              });
            };

            if ($modelForms.filledForms.json.forms[form] !== undefined)  {
              action(form);
            } else {
              if (form.indexOf('Form6-8') !== -1) {
                action(form);
              }
            }

          }
        });
    };


    if (!$modelFormsValidator.error &&
      ($modelFormsValidator.submit === undefined || ($modelFormsValidator.submit !== undefined && $modelFormsValidator.submit === false))) {

      $service.showAlert('Only MTMV gangers and field engineers should fill this form',false);
    }

    load();

  });