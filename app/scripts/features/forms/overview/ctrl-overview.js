/**
 * overview page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlOverview', function ($scope, $log, $modelForms, $service, $filter, $rootScope, $modelFormsValidator, appConstants) {

    var logMsgPrefix = "CtrlOverview -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlOverview = {
      title: 'Overview',
      form: {
        reference_no: '',

        person_name: '',
        person_contact_no: '',

        officer_name: '',
        officer_contact_no: '',
        officer_duty_hr: '',

        days_dates_each: false,
        days_dates_continuous: false,
        days_dates: [],

        worksite_from_hr: '',
        worksite_to_hr: '',

        pa_line: '',
        pa_from_station: '',
        pa_from_signals: '',
        pa_from_metres: '',
        pa_from_points: '',
        pa_from_stn: '',
        pa_to_station: '',
        pa_to_signals: '',
        pa_to_metres: '',
        pa_to_points: '',
        pa_to_stn: '',

        description_work: ''
      },
      lines: $modelForms.data.lines,
      Days_Dates_limit: 3
    };

    $scope.ctrlApp.dashboard.home = true;


    /**
     * load the content of overview
     */
    var load = function () {
      $modelFormsValidator.loadedForms['Overview'] = true;

      $modelForms.getPostFilledForm()
        .then(function (response) {
          $log.debug(logMsgPrefix + 'load ->' + response);
          if (response) {

            if ($modelForms.filledForms.json === undefined) {
              $modelForms.filledForms.json = {};
            }

            if ($modelForms.filledForms.json['forms'] !== undefined && $modelForms.filledForms.json.forms['Form1'] !== undefined) {

              var form = $modelForms.filledForms.json.forms['Form1'];

              Object.keys($scope.ctrlOverview.form).forEach(function (key) {

                if (key === 'reference_no') {
                  if ($modelForms.filledForms.json.reference_no !== undefined) {
                    $scope.ctrlOverview.form.reference_no = $modelForms.filledForms.json.reference_no;

                    $rootScope.$broadcast(appConstants.EVENT_FORMS);

                  }

                } else {
                  if (form[key] !== undefined) {
                    $scope.ctrlOverview.form[key] = form[key];
                  }
                }
              });

              if ($scope.ctrlOverview.form.days_dates.length === 0) {
                $scope.ctrlOverview.newDaysDates();
              } else {
                var $index = 0;
                angular.forEach($scope.ctrlOverview.form.days_dates, function (value) {
                  if (value.from !== undefined) {
                    value.from = new Date(value.from);
                  }
                  if (value.to !== undefined) {
                    value.to = new Date(value.to);
                  }
                  $scope.ctrlOverview.form.days_dates[$index] = value;
                  $index++;
                });
              }

            } else {

              if ($scope.ctrlOverview.form.days_dates.length === 0) {
                $scope.ctrlOverview.newDaysDates();
              }
            }

            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlOverview.form));


          }
        });
    };

    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      $log.debug(logMsgPrefix + 'event:' + appConstants.EVENT_FORMS);

      $scope.ctrlApp.title = "Reference #:" + $modelForms.filledForms.json.reference_no;
      $scope.ctrlApp.title += '  ( ' + $filter('cutoffLabel')($modelForms.formtypes[$modelForms.formtype], 20) + ' )';

      if (form && form === 'Overview') {
        load();
      }
    });

    /**
     * create a new days and dates
     */
    $scope.ctrlOverview.newDaysDates = function () {
      $log.debug(logMsgPrefix + ' newDaysDates :' + JSON.stringify($scope.ctrlOverview.form.days_dates));
      if ($scope.ctrlOverview.form.days_dates.length >= $scope.ctrlOverview.Days_Dates_limit) {
        $service.showAlert('Only ' + $scope.ctrlOverview.Days_Dates_limit + ' Days & Dates allowed', true);
        return;
      }
      $scope.ctrlOverview.form.days_dates.push({from: new Date(), to: new Date()});
    };

    /**
     * remove a days and dates
     * @param index the index in the lists(days/dates)
     */
    $scope.ctrlOverview.removeDaysDates = function (index) {
      if ($scope.ctrlOverview.form.days_dates.length === 1) {
        $service.showAlert("At least 1 entry required", true);
        return;
      }
      $log.debug(logMsgPrefix + ' removeDaysDates :' + JSON.stringify($scope.ctrlOverview.form.days_dates));
      $scope.ctrlOverview.form.days_dates.splice(index, 1);
      $modelForms.setPostFilledForm("Form1", "days_dates", $scope.ctrlOverview.form.days_dates);
    };


    load();


  });