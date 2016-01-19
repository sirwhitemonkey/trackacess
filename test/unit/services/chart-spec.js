'use strict';


describe('Trackaccess($chart)',function() {

  var logMsgPrefix = 'services->chart-spec.js ->';


  describe('chart', function () {

    it('*summary-dashboard* should display the charts', function () {
      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;

      $rootScope.$apply(function() {
        $chart.drawGraph('Summary Dashboard')
          .then(function(data){

            $log.debug(logMsgPrefix + ' *summary-dashboard* should display the charts');
            expect(data.chart).toBeDefined();
          });


      });
    });

  });


});

