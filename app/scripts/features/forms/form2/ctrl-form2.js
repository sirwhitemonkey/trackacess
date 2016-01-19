/**
 * form2 page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForm2', function ($scope, $log, $modelForms, $service, $modelFormsValidator, appConstants) {

    var logMsgPrefix = "CtrlForm2 -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForm2 = {
      form: {
        single_line_area: false,
        up_main: false,
        down_main: false,
        siding_loops: false,

        rpo_locations: [],

        worksite_information: []

      },
      RPO_locations_limit: 4,
      Worksite_Information_limit: 7
    };

    /**
     * load the content of form2
     */
    var load = function () {
      $modelFormsValidator.loadedForms['Form2'] = true;

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

            if ($modelForms.filledForms.json['forms'] !== undefined && $modelForms.filledForms.json.forms['Form2'] !== undefined) {
              var form = $modelForms.filledForms.json.forms['Form2'];

              Object.keys($scope.ctrlForm2.form).forEach(function (key) {

                if (form[key] !== undefined) {
                  $scope.ctrlForm2.form[key] = form[key];
                }

                if ($scope.ctrlForm2.form.rpo_locations.length === 0) {
                  $scope.ctrlForm2.newRPOLocation();
                }
                if ($scope.ctrlForm2.form.worksite_information.length === 0) {
                  $scope.ctrlForm2.newWorksiteInformation();
                }

              });

            } else {

              if ($scope.ctrlForm2.form.rpo_locations.length === 0) {
                $scope.ctrlForm2.newRPOLocation();
              }
              if ($scope.ctrlForm2.form.worksite_information.length === 0) {
                $scope.ctrlForm2.newWorksiteInformation();
              }

            }

            $log.debug(logMsgPrefix + 'load ->' + JSON.stringify($scope.ctrlForm2.form));
          }
        });
    };


    /**
     * listener for the form event
     */
    $scope.$on(appConstants.EVENT_FORMS, function (event, form) {
      if (form === 'Form2') {
        load();
      }

    });


    $scope.ctrlApp.dashboard.home = true;

    /**
     * create a new RPO location
     */
    $scope.ctrlForm2.newRPOLocation = function () {
      $log.debug(logMsgPrefix + ' newRPOLocation :' + JSON.stringify($scope.ctrlForm2.form.rpo_locations));
      if ($scope.ctrlForm2.form.rpo_locations.length >= $scope.ctrlForm2.RPO_locations_limit) {
        $service.showAlert('Only ' + $scope.ctrlForm2.RPO_locations_limit + ' RPO Locations allowed', true);
        return;
      }
      $scope.ctrlForm2.form.rpo_locations.push({location: '', tc_contact: {yes: false, no: false}, communication_tpo_locations: {yes: false, no: false}});
    };

    /**
     * remove RPO location
     * @param index the index of the lists (RPO location)
     */
    $scope.ctrlForm2.removeRPOLocation = function (index) {
      $log.debug(logMsgPrefix + ' newRPOLocation :' + JSON.stringify($scope.ctrlForm2.form.rpo_locations));
      if ($scope.ctrlForm2.form.rpo_locations.length === 1) {
        $service.showAlert("At least 1 entry required", true);
        return;
      }
      $scope.ctrlForm2.form.rpo_locations.splice(index, 1);
      $modelForms.setPostFilledForm('Form2', 'rpo_locations', $scope.ctrlForm2.form.rpo_locations);
    };

    /**
     * create a new worksite information
     */
    $scope.ctrlForm2.newWorksiteInformation = function () {
      $log.debug(logMsgPrefix + ' newWorksiteInformation :' + JSON.stringify($scope.ctrlForm2.form.worksite_information));

      if ($scope.ctrlForm2.form.worksite_information.length >= $scope.ctrlForm2.Worksite_Information_limit) {
        $service.showAlert('Only ' + $scope.ctrlForm2.Worksite_Information_limit + ' Worksite Information allowed', true);
        return;
      }
      $scope.ctrlForm2.form.worksite_information.push({worksite_number: '', worksite_name: '', channel_radio_coverage: {yes: false, no: false}, cellphone_coverage: {yes: false, no: false}, worksite_description: ''});
    };

    /**
     * remove the worksite information
     * @param index the index of the lists (worksite information)
     */
    $scope.ctrlForm2.removeWorksiteInformation = function (index) {
      $log.debug(logMsgPrefix + ' removeWorksiteInformation :' + JSON.stringify($scope.ctrlForm2.form.worksite_information));
      $scope.ctrlForm2.form.worksite_information.splice(index, 1);
      $modelForms.setPostFilledForm('Form2', 'worksite_information', $scope.ctrlForm2.form.worksite_information);
    };

    load();

  });