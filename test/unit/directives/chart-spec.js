'use strict';


describe('directives',function() {

  var $element, $scope,$compile;
  var logMsgPrefix= 'directives->chart-spec.js -> ';


  beforeEach(inject(function($injector) {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
  }));


  describe('chart',function() {


    it('should display invalid chart', function () {
      $scope.data = {};
      $element = angular.element('<chart data="data"></chart>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.data.chart).toBeUndefined();
      $log.debug(logMsgPrefix + 'should display invalid chart');


    });

    it('should display valid chart', function () {

      $scope.data = { chart: {}};
      $element = angular.element('<chart data="data"></chart>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.data.chart).toBeDefined();
      $log.debug(logMsgPrefix + ' should display valid chart');


    });

  });
});
