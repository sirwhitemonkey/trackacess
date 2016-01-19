angular.module('trackaccess.controllers')

  .controller('CtrlStats',function($scope,$log,$rootScope,$modelApp,$modelForms,$chart,appConstants) {

    var logMsgPrefix = "CtrlStats -> ";
    $log.debug(logMsgPrefix + 'created');
    $scope.ctrlStats={
      title: $modelApp.graph,
      icon: '',
      form: false,
      graph: '',
      graph_data: undefined,
      switch_form: 'Form >> ' + $modelForms.formtypes[$modelForms.formtype]
    };

    $scope.ctrlApp.dashboard.home=true;

    var icon=function() {

      if ($modelApp.graph === 'Form') {
        $scope.ctrlStats.icon = 'ion-ios-grid-view-outline';

      }
      else if ($modelApp.graph === 'Forms') {
        $scope.ctrlStats.icon = 'ion-ios-grid-view';
      }
      else if ($modelApp.graph === 'Summary') {
        $scope.ctrlStats.icon = 'ion-pie-graph';
      }

    };

    var drawGraph=function() {


      icon();

      $chart.drawGraph($modelApp.graph)
        .then(function(data){
          $scope.ctrlStats.graph_data=data;
        });
    };

    if ($modelApp.current.name.indexOf('main.forms') !== -1) {
      $scope.ctrlStats.form=true;
    }

    drawGraph();


    $scope.$on(appConstants.EVENT_THEME_STYLE,function(event,param){

      drawGraph();

    });

  });


