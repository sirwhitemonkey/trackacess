'use strict';

//Graph business models
angular.module('trackaccess.services')
  .factory('$api', ['$q', '$log', 'appConstants', function ($q, $log, appConstants) {
    var logMsgPrefix = '$api ->';
    $log.debug(logMsgPrefix + ' created');


    var $api = {
      controller: {}
    };


    /**
     * submit the forms in worklight
     * @param forms the forms{form1,form2....form9}
     * @returns {response} the response {error,message}
     */
    $api.controller.submit = function (forms) {

      var deferred = $q.defer();

      var invocationData = {
        adapter: 'controller',
        procedure: 'submit',
        parameters: [forms]
      };

      WL.Client.invokeProcedure(invocationData, {
        onSuccess: function (response) {

          response = response.invocationResult;


          WL.JSONStore.get(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS).markClean([forms])
            .then(function () {
              deferred.resolve({error: false, message: ''});
            });


        },
        onFailure: function (response) {
          var message = 'Server communication failure.';
          if (response.invocationResult && response.invocationResult.error) {
            message = message + '\n' + response.invocationResult.error;
          }
          deferred.resolve({error: true, message: message});
        },
        timeout: (60000 * 5)
      });

      return deferred.promise;
    };

    return $api;


  }]);

