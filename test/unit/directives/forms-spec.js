'use strict';


describe('directives',function() {

  var $element, $scope,$compile;
  var logMsgPrefix= 'directives->forms-spec.js -> ';


  beforeEach(inject(function($injector) {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
  }));


  describe('preFilledForm',function() {


    it('should display (empty)', function () {

      $scope.form = {
        srcKey: '',
        srcValue: ''
      };

      $element = angular.element('<pre-filled-form src-key="{{form.srcKey}}" src-value="form.srcValue"></pre-filled-form>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.srcKey).toEqual('');
      expect(scope.srcValue).toEqual('');
      $log.debug(logMsgPrefix + 'should display (empty)');


    });

    it('should display valid', function () {

      $scope.form = {
        srcKey: 'test',
        srcValue: 'test'
      };

      $element = angular.element('<pre-filled-form src-key="{{form.srcKey}}" src-value="form.srcValue"></pre-filled-form>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.srcKey).toEqual('test');
      expect(scope.srcValue).toEqual('test');
      $log.debug(logMsgPrefix + 'should display valid');


    });

  });

  describe('postFilledForm',function() {


    it('should display (empty)', function () {

      $scope.form = {
        srcKey: '',
        srcValue: '',
        srcForm: ''
      };

      $element = angular.element('<post-filled-form  src-form="{{form.srcForm}}" src-key="{{form.srcKey}}" src-value="form.srcValue"></post-filled-form>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.srcKey).toEqual('');
      expect(scope.srcValue).toEqual('');
      expect(scope.srcForm).toEqual('');
      $log.debug(logMsgPrefix + 'should display (empty)');


    });

    it('should display valid', function () {

      $scope.form = {
        srcKey: 'test',
        srcValue: 'test',
        srcForm: 'Form1'
      };

      $element = angular.element('<post-filled-form  src-form="{{form.srcForm}}" src-key="{{form.srcKey}}" src-value="form.srcValue"></post-filled-form>');
      $compile($element)($scope);
      $scope.$digest();

      expect($element).toBeDefined();
      expect($element.controller).toBeDefined();

      // Get the element scope
      var scope = $element.isolateScope();

      // Make our assertions
      expect(scope.srcKey).toEqual('test');
      expect(scope.srcValue).toEqual('test');
      expect(scope.srcForm).toEqual('Form1');
      $log.debug(logMsgPrefix + 'should display valid');


    });

  });

});
