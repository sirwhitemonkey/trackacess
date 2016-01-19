/**
 * more options page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlMoreOptions', function ($scope, $rootScope, $log, $modelApp, appConstants) {

    var logMsgPrefix = 'CtrlMoreOptions -> ';
    $log.debug(logMsgPrefix + 'created');

    $scope.ctrlMoreOptions = {
      company: 'KiwiRail',
      app_name: 'Track Access',
      version: '1.0.0'
    };

    $scope.ctrlMoreOptions.themes = $modelApp.themes;

    //$scope.ctrlMoreOptions.groups =[ {accordion: 'graph', isopen:true}, {accordion: 'themes', isopen:false}];
    $scope.ctrlMoreOptions.groups = [
      {accordion: 'themes', isopen: false},
      {accordion: 'info', isopen: false},
      {accordion: 'app', isopen: true}
    ];

    try {
      $scope.ctrlMoreOptions.version = WL.Client.getAppProperty('APP_VERSION');
    } catch (e) {
    }


  });