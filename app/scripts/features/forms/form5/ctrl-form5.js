/**
 * form5 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm5',function($scope,$log,$service,$modelForms,$modelFormsValidator,appConstants) {

    var logMsgPrefix = "CtrlForm5 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm5= {
      form: {

       swo: '',
        work_carried_out: '',
       work_train_departure_from: '',
       work_train_departure_hr: '',
       work_train_finish_at: '',
       work_train_finish_at_hr: '',

       additional_info_yes: false,
       additional_info_no: false,
       additional_info_list_location: '',

        ep_van_required: false,

        bridging_beams_wagons: false,
        bridging_beams_storage_position: false,
        ewr_wagons: false,

        consists: '',

        multiline_workarea: false,
        multiline_workarea_both_up_down: false,
        multiline_workarea_up_main: false,
        multiline_workarea_down_main: false,
        multiline_workarea_other_lines: false,
        multiline_workarea_specify_other_lines: '',

        train_service_cancelled_resheduled_yes: false,
        train_service_cancelled_resheduled_no: false,
        train_service_cancelled_resheduled: '',

        person_in_charge_name: '',
        person_in_charge_contact_no:''


      }
    }
    $scope.ctrlApp.dashboard.home=true;

    /**
     * load the content of form5
     */
    var load = function() {
      $modelFormsValidator.loadedForms['Form5']=true;

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

            if ($modelForms.filledForms.json.forms['Form5'] === undefined)  {
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form5'];

            Object.keys($scope.ctrlForm5.form).forEach(function(key){

              if (form[key] !== undefined) {
                $scope.ctrlForm5.form[key] = form[key];
              }

              var form1 = $modelForms.filledForms.json.forms['Form1'];

              if ($scope.ctrlForm5.form.work_carried_out === '') {
                var work_carried_out = 'Station[' + form1.pa_from_station + '-' + form1.pa_to_station + '],';
                work_carried_out += 'Signal[' + form1.pa_from_signals + '-' + form1.pa_to_signals + '],';
                work_carried_out += 'Metre[' + form1.pa_from_metres + '-' + form1.pa_to_metres + '],';
                work_carried_out += 'Point[' + form1.pa_from_points + '-' + form1.pa_to_points+ ']';
                $scope.ctrlForm5.form.work_carried_out=work_carried_out;
              }

              $scope.ctrlForm5.form.multiline_workarea=form1.work_multiline_yes;

            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm5.form));
          }
        });
    };


    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS,function(event,form){
      if (form === 'Form5') {
        load();
      }

    });


    if (!$modelFormsValidator.error &&
      ($modelFormsValidator.submit === undefined || ($modelFormsValidator.submit !== undefined && $modelFormsValidator.submit === false))) {

      $service.showAlert('Only field engineers should be filling this form',false);
    }

    load();

  });