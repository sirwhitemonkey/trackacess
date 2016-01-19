/**
 * main app controller
 */
angular.module('trackaccess.controllers')

  .controller('CtrlApp', function ($scope, $rootScope, $log, $timeout, $modelApp, $modelForms, $state, $ionicPopover, $session, appConstants) {

    var logMsgPrefix = "CtrlApp -> ";

    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlApp = {
      title: 'Track Access',
      theme: {},
      dashboard: {
        home: false
      }
    };

    /**
     * get the theme
     */
    var getTheme = function () {
      $modelApp.getTheme()
        .then(function (theme) {
          $scope.ctrlApp.theme = theme;
          $log.debug(logMsgPrefix + ' getTheme:' + JSON.stringify($scope.ctrlApp.theme));

          $rootScope.$broadcast(appConstants.EVENT_THEME_STYLE, {theme: theme});
        });
    };


    /**
     * display the more options
     * @param $event the source event
     */
    $scope.ctrlApp.moreOptions = function ($event) {
      $log.debug(logMsgPrefix + ' moreOptions');
      $ionicPopover.fromTemplateUrl('scripts/features/main/more-options.html', {
        scope: $scope
      }).then(function (popover) {
        $log.debug(logMsgPrefix + ' moreOptions popover');
        $scope.ctrlApp.popover = popover;
        document.body.classList.remove('platform-ios');
        document.body.classList.add('platform-ios');
        popover.show($event);
      });

    };

    /**
     * set the them
     * @param theme the theme selection
     */
    $scope.ctrlApp.setTheme = function (theme) {
      $modelApp.setTheme(theme)
        .then(function (response) {
          $log.debug(logMsgPrefix + ' setTheme :' + response + ' theme:' + JSON.stringify(theme));
          if (response) {
            getTheme();
          }
        });
    };

    /**
     * displaying the graph
     * @param graph the graph {Summary,Form,Forms}
     */
    $scope.ctrlApp.showGraph = function (graph) {
      $log.debug(logMsgPrefix + ' showGraph:' + graph + ' current state:' + $state.current.name);

      if ($modelApp.current !== undefined) {
        if ($modelApp.current.name.indexOf('main.forms') === -1) {
          $modelApp.current = $state.current;
        }
      }

      $modelApp.graph = graph;
      $scope.navigateRoute("main.stats", {time: new Date().getTime()});

      $rootScope.$broadcast(appConstants.EVENT_DESTROY_POPOVER);

    };

    /**
     * listener to destroy the popover view
     */
    $scope.$on(appConstants.EVENT_DESTROY_POPOVER, function (event, param) {

      if ($scope.ctrlApp['popover'] !== undefined) {
        if ($scope.ctrlApp.popover['_isShown'] !== undefined) {
          if ($scope.ctrlApp.popover._isShown)
            $scope.ctrlApp.popover.hide();
        }
      }
    });

    /**
     * form navigation
     * @param state the state name
     * @param params the params data
     */
    $scope.navigateRoute = function (state, params) {
      $log.debug(logMsgPrefix + ' navigateRoute ->' + state + ' params:' + JSON.stringify(params));


      if (params === undefined)
        params = {};

      $modelApp.current = $state.current;

      if (state === 'main.dashboard') {
        $scope.ctrlApp.dashboard.home = false;
        params.time = new Date().getTime();
        $scope.ctrlApp.title = "Track Access";
        $modelForms.currentForm = undefined;
        $modelForms.filledForms = undefined;
        $scope.$emit(appConstants.EVENT_STATE_TRANSITION, {state: state, params: params});
      } else if (state === 'main.forms') {
        $modelForms.create()
          .then(function (response) {
            $scope.$emit(appConstants.EVENT_STATE_TRANSITION, {state: state, params: params});
          });

      } else {
        $scope.$emit(appConstants.EVENT_STATE_TRANSITION, {state: state, params: params});
      }


    };

    /**
     * navigate a form
     * @param form the form target
     */
    $scope.navigateForm = function (form) {
      var formtype = form.json.form_type;
      var id = form.json.id;
      form.selected = true;

      $log.debug(logMsgPrefix + ' navigateForm ->' + formtype + ' id:' + id);
      $modelForms.formtype = formtype;
      $rootScope.$broadcast(appConstants.EVENT_DESTROY_POPOVER);
      $modelForms.filledForms = undefined;
      $modelForms.id = id;

      $scope.navigateRoute('main.forms', {}, true);

      // remove selection
      $timeout(function() {
        form.selected = false;
      },500);

    };

    getTheme();

    //Browser only for testing
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      var awake = {'state': 'onLaunch'};
      $session.awake(awake);
      $log.debug(logMsgPrefix + ' onlaunch');
    }


  });



