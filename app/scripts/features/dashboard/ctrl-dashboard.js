/**
 * dashboard page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlDashboard', function ($scope, $rootScope, $log, $timeout, $q, $ionicPopover, $modelApp, $modelForms, $service, $filter, $session, appConstants) {

    var logMsgPrefix = "CtrlDashboard -> ";
    $scope.ctrlDashboard = {
      title: 'Dashboard',
      sync: false,
      dropdown: {
        isopen: false
      },
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
        if ($scope.ctrlDashboard.query !== '') {
          forms = $filter('filter')($scope.ctrlDashboard.forms, $scope.ctrlDashboard.query);
        }
        var statuses = _(forms)
          .filter(function (form) {
            return form.json.status === status
          })
          .value();

        deferred.resolve(statuses.length);
      };

      var ready, deferred = $q.defer(), forms = $scope.ctrlDashboard.forms;
      if (forms.length === 0) {
        $modelForms.filledForms = undefined;
        $modelForms.getPostFilledForms()
          .then(function (docs) {

            if (docs !== undefined && docs !== null && docs.length !== 0) {
              $scope.ctrlDashboard.forms = docs;
              forms = $scope.ctrlDashboard.forms;
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
          $scope.ctrlDashboard.drafts = items;
        });
      statuses('Favourites')
        .then(function (items) {
          $scope.ctrlDashboard.favourites = items;
        });
      statuses('Completed')
        .then(function (items) {
          $scope.ctrlDashboard.completed = items;
        });
    };

    /**
     * watching the query changes and update the forms statistics
     */
    $scope.$watch(function () {
      return $scope.ctrlDashboard.query;
    }, function () {
      $log.debug(logMsgPrefix + 'query:' + $scope.ctrlDashboard.query);
      load();
    });


    /**
     * toggle the dropdown
     */
    $scope.ctrlDashboard.dropdown.toggle = function () {
      $scope.ctrlDashboard.dropdown.isopen = !$scope.ctrlDashboard.dropdown.isopen;
    };

    /**
     * @param $event the source event
     */
    $scope.ctrlDashboard.formTypes = function ($event) {
      $log.debug(logMsgPrefix + ' formTypes');
      $rootScope.$broadcast(appConstants.EVENT_DESTROY_POPOVER);

      $ionicPopover.fromTemplateUrl('scripts/features/forms/formtypes.html', {
        scope: $scope
      }).then(function (popover) {
        $log.debug(logMsgPrefix + ' formTypes popover');
        $scope.ctrlDashboard.popover = popover;
        document.body.classList.remove('platform-ios');
        document.body.classList.add('platform-ios');
        popover.show($event);
      });
    };

    /**
     * @param status the status of the form {'drafts','favourites','completed'}
     */
    $scope.ctrlDashboard.more = function (status) {
      $scope.navigateRoute('main.dashboard-more', {status: status, query: $scope.ctrlDashboard.query});
    };

    /**
     * destroy any instance of popover view
     */
    $scope.$on(appConstants.EVENT_DESTROY_POPOVER, function (event, param) {

      if ($scope.ctrlDashboard['popover'] !== undefined) {
        if ($scope.ctrlDashboard.popover['_isShown'] !== undefined) {
          if ($scope.ctrlDashboard.popover._isShown)
            $scope.ctrlDashboard.popover.hide();
        }
      }
    });

    /**
     * initialise the forms statistics
     */
    var initialise = function () {
      var timeout = 0;
      if (!$session.onLaunched) {
        timeout = 1500;
        $session.onLaunched = true;
        $log.debug(logMsgPrefix + ' $session.onlaunched');
      }

      $timeout(function () {
        load();
      }, timeout);

    };

    /**
     * listener when form successfully submitted to worklight and update the forms statistics.
     */
    $scope.$on(appConstants.EVENT_FORM_SUBMISSION_SUCCESS, function (event, param) {
      $scope.ctrlApp.dashboard.home = false;
      initialise();
    });

    $scope.ctrlApp.dashboard.home = false;

    initialise();

  });




