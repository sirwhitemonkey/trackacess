'use strict';

describe('Trackaccess($jsonDataStore)',function() {

  var logMsgPrefix = 'services->json-data-store-spec.js ->';

  describe('PostFilledForms', function () {

    it('*get* should display (1) record', function () {
      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;
      var promise=$jsonDataStore.get(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS);
      $rootScope.$apply(function() {
        promise.then(function(docs){
          expect(docs.length).toEqual(1);
          $log.debug(logMsgPrefix + '*get* should display (1) record');
        },function(error){
        });
      });

    });

    it('(*getQuery* should display (1) record', function () {
      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;
      var promise= $jsonDataStore.getQuery(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS,{id:'9843628554242514'});
      $rootScope.$apply(function() {
        promise.then(function(docs){
          $log.debug(logMsgPrefix + '*getQuery* should display (1) record');
          expect(docs.length).toEqual(1);
        },function(error){
        });
      });
    });

    it('*replace* should replace the record', function () {
      spyOn($mockData, 'postFilledForms').andReturn($q.when({data: getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData = $mockData;

      $rootScope.$apply(function () {
        $jsonDataStore.getQuery(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS, {id: '9843628554242514'})
          .then(function (docs) {
            var form = docs[0];
            form.json.modified_date= new Date();
            var promise;
            promise = $jsonDataStore.replace(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS, [form],true);
            promise.then(function (response) {
              $log.debug(logMsgPrefix + ' *replace* should change the record');
              expect(response).toBe(true);
            });
          });
      });
    });

    it('*remove* should remove the record', function () {
      spyOn($mockData, 'postFilledForms').andReturn($q.when({data: getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData = $mockData;

      $rootScope.$apply(function () {
        $jsonDataStore.getQuery(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS, {id: '9843628554242514'})
          .then(function (docs) {
            var form = docs[0];
            var promise;
            promise = $jsonDataStore.remove(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS, [form]);
            promise.then(function (response) {
              $log.debug(logMsgPrefix + ' *remove* should remove the record');
              expect(response).toBe(true);
            });
          });
      });
    });

  });


});

