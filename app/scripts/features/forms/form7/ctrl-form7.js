/**
 * form7 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm7',function($scope,$log,$modelForms,$modelFormsValidator,appConstants) {

    var logMsgPrefix = "CtrlForm7 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm7={
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

        line_ef25: false,
        line_diesel_hauled_trains: false,
        line_15days_notice: false,
        line_yard: false,

        single_line_area: false,
        both_up_down_main: false,
        up_main: false,
        down_main: false,
        other_lines: false,
        specify_other_lines: '',

        tss_from: '',
        tss_to: '',
        isolator1_from: '',
        isolator1_to: '',
        isolator2_from: '',
        isolator2_to: '',
        termination: '',

        electrical_safety_observer_yes: false,
        electrical_safety_observer_no: false,
        electrical_safety_observer_from_hr: '',
        electrical_safety_observer_to_hr: '',

        traction_person_name: '',
        traction_person_contact_no:''

      },
      tss: $modelForms.data.tss,
      isolator: $modelForms.data.isolator,
      termination: $modelForms.data.termination
    };

    $scope.ctrlApp.dashboard.home=true;

    /**
     * load the content of form7
     */
    var load = function() {
      $modelFormsValidator.loadedForms['Form7']=true;

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

            if ($modelForms.filledForms.json.forms['Form7'] === undefined)  {
              return;
            }

            var form = $modelForms.filledForms.json.forms['Form7'];

            Object.keys($scope.ctrlForm7.form).forEach(function(key){

              if (form[key] !== undefined) {
                $scope.ctrlForm7.form[key] = form[key];
              }


            });
            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm7.form));
          }
        });
    };

    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS,function(event,form){
      if (form === 'Form7') {
        load();
      }

    });


    /**
     * set the tss in the selection
     * @param tss the tss object
     * @param index the index {from=0,to=1}
     */
    $scope.ctrlForm7.setTss=function(tss,index) {
      $log.debug(logMsgPrefix + ' setTss ' + JSON.stringify(tss) + ' ->index:' + index);
      if (index === 0) {
        $scope.ctrlForm7.form.tss_from=tss;
      } else if (index == 1) {
        $scope.ctrlForm7.form.tss_to=tss;
      }
    };

    /**
     * set the isolator in the selection
     * @param isolator the isolator object
     * @param level the level type {level1=0,level2=1}
     * @param index the index {from=0,to=1}
     */
    $scope.ctrlForm7.setIsolator=function(isolator,level,index) {
      $log.debug(logMsgPrefix + ' setIsolator ' + JSON.stringify(isolator) + ' ->index:' + index);
      if (level === 0) {
        if (index == 0) {
          $scope.ctrlForm7.form.isolator1_from = isolator;
        } else if (index === 1) {
          $scope.ctrlForm7.form.isolator2_from = isolator;
        }
      }
      else  if (level === 1) {
        if (index == 0) {
          $scope.ctrlForm7.form.isolator1_to = isolator;
        } else if (index === 1) {
          $scope.ctrlForm7.form.isolator2_to = isolator;
        }
      }
    };

    /**
     * set the termination in the selection
     * @param termination the termination object
     */
    $scope.ctrlForm7.setTermination=function(termination) {
      $log.debug(logMsgPrefix + ' setTermination ' + JSON.stringify(termination));
      $scope.ctrlForm7.form.termination=termination;
    };


    load();

  });