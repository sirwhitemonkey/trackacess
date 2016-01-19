'use strict';


describe('Trackaccess($modelForms)',function() {

  var logMsgPrefix = 'services->forms-spec.js ->';

  describe('Forms', function () {

    it('*get* form  (Form1)  validation', function () {

      $rootScope.$apply(function() {
        var form= $modelForms.getForm('Form1');
        expect(form.id).toEqual('Form1');
        $log.debug(logMsgPrefix + ' *get* form  (Form1)  successful');
      });
    });

    it('*setPreFilledForm* form  validation', function () {

      $rootScope.$apply(function() {

        $modelForms.setPreFilledForm('test','test')
          .then(function(result) {
            expect(result).toBe(true);
            $log.debug(logMsgPrefix + '*setPreFilledForm* form  successful');

          });
      });
    });

    it('*getPreFilledForm* form  validation', function () {

      $rootScope.$apply(function() {

        $modelForms.getPreFilledForm()
          .then(function(result) {

            expect(Object.keys(result).length).toEqual(1);
            $log.debug(logMsgPrefix + '*setPreFilledForm* form  successful');

          });
      });
    });

    it('*setPostFilledForm* form  validation', function () {

      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;
      var promise= $jsonDataStore.getQuery(WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS,{id:'9843628554242514'});
      $rootScope.$apply(function() {
        promise.then(function(docs){
          $modelForms.filledForms=docs[0];

          $modelForms.setPostFilledForm('Form1','reference_no','1234567890')
            .then(function(result){
              expect(result).toBe(true);
              $log.debug(logMsgPrefix + '*setPostFilledForm* form  successful');
            });
        },function(error){
        });
      });
    });

    it('*getPostFilledForm* form  validation', function () {

      spyOn($mockData,'postFilledForms').andReturn($q.when({data:getJSONFixture('app/mock/postfilledforms.json')}));
      WL.Client.$mockData=$mockData;

      $modelForms.id='9843628554242514';

      $rootScope.$apply(function() {
        $modelForms.filledForms=undefined;
        $modelForms.getPostFilledForm()
          .then(function(result){
            expect(result).toBe(true);
            $log.debug(logMsgPrefix + '*getPostFilledForm* form  successful');
          });
      },function(error){
      });
    });

  });


});

