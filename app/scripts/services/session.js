'use strict';


angular.module('trackaccess.services')
  .factory('$session', ['$q', '$log', '$rootScope', 'appConstants', function ($q, $log, $rootScope, appConstants) {
    var logMsgPrefix = '$session ->';
    $log.debug(logMsgPrefix + ' created');

    var $session = {
      onLaunched: false
    };

    /**
     * awake
     * @param param the param state
     */
    $session.awake = function (param) {
      if (param.state === 'onLaunch') {
        $rootScope.$broadcast(appConstants.EVENT_STATE_TRANSITION, {state: 'main.dashboard'});


      }
    };

    return $session;


  }]);