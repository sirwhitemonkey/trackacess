/**
 * prefilled form page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlPreFilledForm',function($scope,$log,$modelForms,$chart,$timeout,$modelApp,appConstants) {

    var logMsgPrefix = "ctrlPreFilledForm -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlPreFilledForm={
      form: {
        person_name: '',
        person_contact_no: '',
        officer_name: '',
        officer_contact_no:'',
        officer_duty_hr: ''
      },
      graph_data:undefined

    };


    /**
     * drawing the summary chart
     */
    var drawGraph=function() {
      $chart.drawGraph('Summary Dashboard')
        .then(function(data){
          $scope.ctrlPreFilledForm.graph_data=data;
        });
    };

    /**
     * initialise the graph
     */
    var initialiseGraph=function() {
      $timeout(function() {
        drawGraph();
      },1500);
    };

    /**
     * load the prefilled content
     */
    var loadPreFilledForms=function() {
      $modelForms.getPreFilledForm()
        .then(function(prefilledforms){
          if (prefilledforms!==null) {
            Object.keys($scope.ctrlPreFilledForm.form).forEach(function(key) {
              if (prefilledforms[key]!==undefined) {
                $scope.ctrlPreFilledForm.form[key]=prefilledforms[key];
              }
            });
          } else {
            Object.keys($scope.ctrlPreFilledForm.form).forEach(function(key) {
              $modelForms.setPreFilledForm(key,'');
            });
          }
        });
    };


    /**
     * listener when theme styling, graphs will be initialise
     */
    $scope.$on(appConstants.EVENT_THEME_STYLE,function(event,param){
      initialiseGraph();
    });

    /**
     * listener when form submission successful, graphs will be initialise
     */
    $scope.$on(appConstants.EVENT_FORM_SUBMISSION_SUCCESS,function(event,param){
      initialiseGraph();
    });


    initialiseGraph();
    loadPreFilledForms();


  });