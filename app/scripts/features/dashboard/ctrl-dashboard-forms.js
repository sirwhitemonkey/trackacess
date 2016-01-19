/**
 * dashboard extension form page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlDashboardForms', function ($scope, $rootScope, $log, $timeout, $q, $modelApp, $modelForms, $service, $filter, $state, appConstants) {

    var logMsgPrefix = "CtrlDashboardForms -> ";
    $scope.ctrlDashboardForms = {
      title: 'Dashboard Forms',
      drafts: 0,
      query: '',
      favourites: 0,
      completed: 0,
      forms: [],
      formtypes: $modelForms.formtypes
    };


    $log.debug(logMsgPrefix + ' created');

    /**
     * get the number of forms based on status
     * @param status the status of the form {'draft','favourites','completed'}
     * @returns {count} the no. of forms based on status
     */
    var statuses = function (status) {

      var counts = function () {
        if ($scope.ctrlDashboardForms.query !== '') {
          forms = $filter('filter')($scope.ctrlDashboardForms.forms, $scope.ctrlDashboardForms.query);
        }
        var statuses = _(forms)
          .filter(function (form) {
            return form.json.status === status
          })
          .value();

        deferred.resolve(statuses.length);
      };

      var ready, deferred = $q.defer(), forms = $scope.ctrlDashboardForms.forms;
      if (forms.length === 0) {
        $modelForms.getPostFilledForms()
          .then(function (docs) {

            if (docs !== undefined && docs !== null && docs.length !== 0) {
              $scope.ctrlDashboardForms.forms = docs;
              forms = $scope.ctrlDashboardForms.forms;
            }
            counts();
          });
      } else {
        counts();
      }
      return deferred.promise;
    };

    /**
     * load the statistics of forms based on drafts,favourites,completed
     */
    var load = function () {
      statuses('Draft')
        .then(function (items) {
          $scope.ctrlDashboardForms.drafts = items;
        });
      statuses('Favourites')
        .then(function (items) {
          $scope.ctrlDashboardForms.favourites = items;
        });
      statuses('Completed')
        .then(function (items) {
          $scope.ctrlDashboardForms.completed = items;
        });
    };

    /**
     * watching the query changes and update the forms statistics
     */
    $scope.$watch(function () {
      return $scope.ctrlDashboardForms.query;
    }, function () {
      $log.debug(logMsgPrefix + 'query:' + $scope.ctrlDashboardForms.query);
      load();
    });

    /**
     * duplicate the form {drafts,favourites,completed}
     * @param form the form to be duplicated
     */
    $scope.ctrlDashboardForms.duplicate = function (form) {
      form.selected = true;
      $modelApp.current = $state.current;
      $modelForms.id = $service.uniqueId();
      $modelForms.duplicateForms = form.json.forms;
      $modelForms.currentForm = undefined;


      if ($modelForms.formtype === 'form_type_2') {
        if ($modelForms.duplicateForms['Form1'] === undefined) {
          $modelForms.duplicateForms['Form1'] = {};
        }
        $modelForms.duplicateForms['Form1'].mtmv_work_protection_plan_required = true;
      }
      $modelForms.create()
        .then(function (response) {
          $scope.ctrlDashboardForms.close();
          $scope.$emit(appConstants.EVENT_STATE_TRANSITION, {state: 'main.forms', params: {}});
        });
    };

    /**
     * hide the modal
     */
    $scope.ctrlDashboardForms.close = function () {
      $service.hideModal();
    };

    load();

  });




