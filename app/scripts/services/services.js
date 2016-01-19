'use strict';

//Common services
angular.module('trackaccess.services', [])
  .factory('$service', ['$q', '$log', '$ionicLoading', '$ionicPopup', '$timeout', '$ionicModal', 'appConstants',
    function ($q, $log, $ionicLoading, $ionicPopup, $timeout, $ionicModal, appConstants) {

      var logMsgPrefix = '$service -> ';
      $log.debug(logMsgPrefix + ' created');

      var $service = {};

      /**
       * remove a file
       * @param filename
       * @param filetype
       * @returns {boolean} the true/false
       */
      $service.removeFile = function (filename, filetype) {

        $log.debug(logMsgPrefix + ' removeFile');

        var deferred = $q.defer();

        var targetelement = (filetype === 'js') ? 'script' : (filetype === 'css') ? 'link' : 'none';
        var targetattr = (filetype === 'js') ? 'src' : (filetype === 'css') ? 'href' : 'none';
        var allsuspects = document.getElementsByTagName(targetelement);

        for (var i = allsuspects.length; i >= 0; i--) {
          if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
          }
        }
        deferred.resolve(true);
        return deferred.promise;
      };

      /**
       * load a file
       * @param filename
       * @param filetype
       * @returns {boolean} true/false
       */
      $service.loadFile=function(filename,filetype) {
        $log.debug(logMsgPrefix + ' loadFile');
        var deferred=$q.defer();

        var fileref;
        if (filetype === 'js'){
          fileref=document.createElement('script');
          fileref.setAttribute('type','text/javascript');
          fileref.setAttribute('src', filename);
        }
        else if (filetype === 'css'){
          fileref=document.createElement('link');
          fileref.setAttribute('rel', 'stylesheet');
          fileref.setAttribute('type', 'text/css');
          fileref.setAttribute('href', filename);
        }
        if (typeof fileref!=='undefined') {
          document.getElementsByTagName('head')[0].appendChild(fileref);
        }

        deferred.resolve(true);
        return deferred.promise;

      };


      /**
       * unique id generator
       * @returns {string} the unique id
       */
      $service.uniqueId = function () {
        var length = 16;
        var timestamp = +new Date();

        var _getRandomInt = function (min, max) {
          return Math.floor(Math.random() * ( max - min + 1 )) + min;
        };

        var ts = timestamp.toString();
        var parts = ts.split('').reverse();
        var id = '';

        for (var i = 0; i < length; ++i) {
          var index = _getRandomInt(0, parts.length - 1);
          id += parts[index];
        }

        return id;
      };


      /**
       * display the modal
       * @param templateUrl the template url
       */
      $service.showModal = function (templateUrl) {

        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: null,
          animation: 'slide-in-up',//'slide-left-right', 'slide-in-up', 'slide-right-left'
          focusFirstInput: true,
          backdropClickToClose: false
        }).then(function (modal) {
          $service.$modal = modal;
          $service.$modal.show();
        });
      };

      /**
       * hide the modal
       */
      $service.hideModal = function () {

        $service.$modal.hide();
        $service.$modal.remove();

      };

      /**
       * display the alert
       * @param message the message value
       * @param error the error  true/false
       */
      $service.showAlert = function (message, error) {

        var cls = 'ion-information-circled';
        if (error) {
          cls = 'ion-android-warning  _error';
        }

        var template = ' <div class="row">' +
          '    <div class="col col-15">' +
          '      <i class="ion ' + cls + ' messaging"></i>' +
          '    </div>' +
          '    <div class="col col-85"> ' +
          '      <span>{{message}}</span>' +
          '    </div>' +
          '   </div>';
        template = template.replace('{{message}}', message);
        $ionicLoading.show({
          template: template,
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 250,
          showDelay: 50
        });


        $timeout(function () {
          $ionicLoading.hide();
        }, 3000);

      };

      /**
       * hide alert
       */
      $service.hideAlert = function () {
        $ionicLoading.hide();
      };

      /**
       * display the loading
       * @param message the message value
       * @returns {empty}
       */
      $service.showLoading = function (message) {

        var deferred = $q.defer();
        var template = ' <div class="row">' +
          '    <div class="col col-15">' +
          '      <ion-spinner></ion-spinner>' +
          '    </div>' +
          '    <div class="col col-85"> ' +
          '      <span>{{message}}</span>' +
          '    </div>' +
          '   </div>';
        template = template.replace('{{message}}', message);
        $ionicLoading.show({
          template: template,
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 250,
          showDelay: 50
        });

        deferred.resolve();
        return deferred.promise;

      };

      /**
       * displaying the prompt
       * @param title
       * @param template
       * @param type
       * @param placeholder
       * @param callback
       * @param cancelText
       * @param okText
       */
      $service.prompt = function (title, template, type, placeholder, callback, cancelText, okText) {
        $ionicPopup.prompt({
          title: title,
          template: template,
          inputType: type,
          inputPlaceholder: placeholder,
          cancelText: cancelText,
          cancelType: okText
        }).then(function (response) {
          callback(response);
        });

      };

      /**
       * hide the loading
       * @param timeout
       * @returns {empty}
       */
      $service.hideLoading = function (timeout) {
        var deferred = $q.defer();

        $timeout(function () {
          $ionicLoading.hide();
          deferred.resolve();
        }, timeout);

        return deferred.promise;
      };

      /**
       * display the confirm
       * @param message
       * @param callback
       * @param cancelText
       * @param okText
       */
      $service.confirm = function (message, callback, cancelText, okText) {
        if (!cancelText) {
          cancelText = 'Cancel';
        }
        if (!okText) {
          okText = 'OK';
        }
        var confirmPopup = $ionicPopup.confirm({
          title: '',
          template: '<div class="text-align-center">' + message + '</div>',
          cancelText: cancelText,
          okText: okText
        });
        confirmPopup.then(function (response) {
          callback(response);
        });
      };


      /**
       * checking the network i.e wifi
       * @returns {boolean} the true/false
       */
      $service.networkInfo = function () {
        var deferred = $q.defer();

        if (appConstants.isMock) {
          deferred.resolve(true);
        } else {
          $timeout(function () {
            WL.Device.getNetworkInfo(function (networkInfo) {

              var isNetworkConnected = true;
              if (networkInfo.isNetworkConnected !== undefined) {
                isNetworkConnected = networkInfo.isNetworkConnected;
                isNetworkConnected = (isNetworkConnected === 'true' ? true : false);
              }

              $log.debug(logMsgPrefix + 'isNetworkConnected:' + isNetworkConnected);

              deferred.resolve(isNetworkConnected);
            });
          }, 3000);
        }
        return deferred.promise;

      };

      return $service;


    }])

  .factory('appConstants',['$log',function($log){

    var logMsgPrefix='appConstants -> ';
    $log.debug(logMsgPrefix + ' created');


    var appConstants= {
      isMock: true,
      EVENT_STATE_TRANSITION: '_event_state_transition',
      EVENT_DESTROY_POPOVER: '_event_destroy_popover',
      EVENT_THEME_STYLE: '_event_theme_style',
      EVENT_FORMS: '_event_forms',
      EVENT_ERROR: '_event_error',
      EVENT_CLEAR_ERROR: '_event_clear_error',
      EVENT_NAVIGATE_FORM: '_event_navigate_form',
      EVENT_SKETCH_INPUT: '_event_sketch_input',
      EVENT_SKETCH_OUTPUT: '_event_sketch_output',
      EVENT_DROPDOWN_HIDE: '_event_dropdown_hide',
      EVENT_FORM_SUBMISSION_SUCCESS: '_event_form_submission_success',

      LOCAL_STORAGE_THEME: 'theme',
      LOCAL_STORAGE_PREFILLED_FORMS: 'prefilledforms',
      LOCAL_STORAGE_POSTFILLED_FORMS: 'postfilledforms'
    };
    return appConstants;
  }])

  .factory('$mockData', ['$q', '$log','$http', function($q,$log, $http) {

    var logMsgPrefix='$mockData -> ';
    $log.debug(logMsgPrefix + ' created');

    var $mockData = {};


    $mockData.submit=function() {
      var deferred=$q.defer();

      $http.get('mock/submit.json').then(function (result) {
        deferred.resolve(result);
      });

      return deferred.promise;
    };

    $mockData.postFilledForms=function() {
      var deferred=$q.defer();

      $http.get('mock/postfilledforms.json').then(function (result) {
        deferred.resolve(result);
      });

      return deferred.promise;
    };

    return $mockData;

  }]);






