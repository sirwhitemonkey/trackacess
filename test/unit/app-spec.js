'use strict';

jasmine.getJSONFixtures().fixturesPath='';
console.log('trackaccess->fixtures:' + jasmine.getJSONFixtures().fixturesPath);


var $rootScope ,$q ,$mockData,$jsonDataStore,
  $log,$api ,$chart,$modelApp,$modelForms;


beforeEach(function() {

  module('trackaccess');

  var $injector = angular.injector(['ng','trackaccess.services']);
  $rootScope=$injector.get('$rootScope');
  $q=$injector.get('$q');
  $log=$injector.get('$log');
  //$httpBackend=$injector.get('$httpBackend');
  $mockData=$injector.get('$mockData');
  $jsonDataStore=$injector.get('$jsonDataStore');
  $api = $injector.get('$api');
  $chart = $injector.get('$chart');
  $modelApp= $injector.get('$modelApp');
  $modelForms= $injector.get('$modelForms');
});
