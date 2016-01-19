'use strict';

var $injector = angular.injector(['ng']);
var $log = $injector.get('$log');


function wlCommonInit() {

  var logMsgPrefix = 'main.js -> ';
  $log.debug(logMsgPrefix + ' wlCommonInit created');

  //WL.JsonStore initialization
  var collections = {
    postfilledforms: {
      searchFields: { id: 'string', reference_no: 'string', status: 'string', form_type: 'string', 'forms.form': 'string'  }
    }
  };

  var onWLSuccess = function () {
    $log.debug(logMsgPrefix + ' onWLSuccess initialisation');
    WL.JSONStore.init(collections).then(function () {
      $log.debug(logMsgPrefix + 'JSONStore collection initialized');
    });
  };

  var onWLFailure = function () {
    $log.debug(logMsgPrefix + ' onWLFailure initialization');
  };

  WL.Client.connect({
    onSuccess: onWLSuccess,
    onFailure: onWLFailure
  });


}
