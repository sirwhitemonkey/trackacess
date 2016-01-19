'use strict';


describe('Trackaccess($api)',function() {

  var logMsgPrefix = 'services->api-spec.js ->';

  describe('submit', function () {

    it('*submit* should be successful', function () {
      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;

      $rootScope.$apply(function() {
        $jsonDataStore.getQuery(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS,{id:'9843628554242514'})
          .then(function(docs) {
            var form = docs[0];
            var recipient = [];
            spyOn($mockData,'submit').andReturn($q.when({data:getJSONFixture('app/mock/submit.json')}));
            WL.Client.$mockData=$mockData;
            var promise;
            promise = $api.controller.submit(form,recipient);
            promise.then(function(response){
              $log.debug(logMsgPrefix + ' *submit* should be successful');
              expect(response.error).toBe(false);
            });
          });
      });
    });

  });


});

