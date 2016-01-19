'use strict';

(function () {

  angular.module('trackaccess.directives')

  /**
   * preFilled form -> local storage
   */
    .directive('preFilledForm', function ($log, $modelForms, $interval, appConstants) {

      var logMsgPrefix = 'preFilledForm ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        scope: {
          srcKey: '@',
          srcValue: '='
        },
        /**
         * @param scope the isolated scope {srcKey,srcValue}
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          var interval;

          scope.$watch('srcValue', function (event, param) {

            $interval.cancel(interval);

            interval = $interval(function () {
              $log.debug(logMsgPrefix + ' $watch ->' + scope.srcKey + ' value:' + scope.srcValue);
              $modelForms.setPreFilledForm(scope.srcKey, scope.srcValue);
              $interval.cancel(interval);
            }, 500);

          });

          scope.$on(appConstants.EVENT_ERROR, function (event, key) {
            $log.debug(logMsgPrefix + appConstants.EVENT_ERROR + ' key:' + key);

            if (key === scope.srcKey) {
              element.addClass('error-border');
            }

          });

          element.bind('focus', function (event) {
            element.removeClass('error-border');
          });

        }
      };
    })

  /**
   * postFille form -> json store
   */
    .directive('postFilledForm', function ($log, $modelForms, $timeout, $interval, $rootScope, appConstants) {

      var logMsgPrefix = 'postFilledForm ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        scope: {
          srcForm: '@',
          single: '@',
          srcKey: '@',
          srcValue: '=',
          childKey: '@',
          childValue: '=',
          preFilled: '@'
        },
        /**
         * @param scope the isolated scope{srcForm,single,srcKey,srcValue,childKey,childValue,preFilled}
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          var interval;

          var postFilledForms = function () {
            $modelForms.setPostFilledForm(scope.srcForm, scope.srcKey, scope.srcValue);
            if (scope.srcKey === 'reference_no') {
              $rootScope.$broadcast(appConstants.EVENT_FORMS);
            }


          };

          element.bind('blur', function (event) {
            $log.debug(logMsgPrefix + ' blur ->' + scope.srcKey + ' value:' + scope.srcValue);
            postFilledForms();
          });

          // delay $watch to let the values load first
          $timeout(function () {

            /**
             * listener for the src value
             */
            scope.$watch('srcValue', function (event, param) {

              $interval.cancel(interval);

              interval = $interval(function () {
                $log.debug(logMsgPrefix + ' $watch ->' + scope.srcKey + ' value:' + scope.srcValue);
                postFilledForms();
                $interval.cancel(interval);
              }, 500);
            });

            /**
             * listener for the child value
             */
            scope.$watch('childValue', function (event, param) {

              $interval.cancel(interval);

              interval = $interval(function () {
                $log.debug(logMsgPrefix + ' $watch ->' + scope.srcKey + ' value:' + scope.srcValue);
                postFilledForms();
                $interval.cancel(interval);
              }, 500);
            });

          }, 800);


          if (scope.preFilled) {

            /*
             Prefilled texts
             person_name: '',
             person_contact_no: '',
             officer_name: '',
             officer_contact_no:'',
             officer_duty_hr: ''
             */

            $modelForms.getPreFilledForm()
              .then(function (prefilledforms) {
                if (scope.srcKey === 'person_name') {
                  scope.srcValue = prefilledforms['person_name'];
                  element.removeClass('error-border');
                }
                else if (scope.srcKey === 'person_contact_no') {
                  scope.srcValue = prefilledforms['person_contact_no'];
                  element.removeClass('error-border');
                }
                else if (scope.srcKey === 'officer_name') {
                  scope.srcValue = prefilledforms['officer_name'];
                  element.removeClass('error-border');
                }
                else if (scope.srcKey === 'officer_contact_no') {
                  scope.srcValue = prefilledforms['officer_contact_no'];
                  element.removeClass('error-border');
                }
                else if (scope.srcKey === 'officer_duty_hr') {
                  scope.srcValue = prefilledforms['officer_duty_hr'];
                  element.removeClass('error-border');
                }
              });
          }

          /**
           * listener for the event clear error
           */
          scope.$on(appConstants.EVENT_CLEAR_ERROR, function () {
            element.removeClass('error-border');

          });

          var date_dotted_border = false;

          /**
           * listener for the event error
           */
          scope.$on(appConstants.EVENT_ERROR, function (event, key) {
            $log.debug(logMsgPrefix + appConstants.EVENT_ERROR + ' key:' + key);

            if (key === scope.srcKey) {
              element.addClass('error-border');
            }

            if (scope.childKey !== undefined && scope.childKey === key) {
              element.addClass('error-border');
              if (element.attr('class').indexOf('date-dotted-border') !== -1) {
                date_dotted_border = true;
                element.removeClass('date-dotted-border');
              }
            }

          });

          element.bind('focus', function (event) {
            element.removeClass('error-border');
            if (date_dotted_border) {
              element.addClass('date-dotted-border');
              date_dotted_border = false;
            }
          });
          element.bind('click', function (event) {
            element.removeClass('error-border');
            if (date_dotted_border) {
              element.addClass('date-dotted-border');
              date_dotted_border = false;
            }
          });

        }
      };
    })

  /**
   * customTime
   */
    .directive('customTime', function ($log, $modelForms, $utilString, $interval, appConstants) {

      var logMsgPrefix = '24hrTime ->';
      $log.debug(logMsgPrefix + 'created');

      return {
        restrict: 'A',
        templateUrl: 'scripts/features/forms/24hr-time.html',
        replace: true,
        scope: {
          time: '=',
          key: '@',
          form: '@',
          setClass: '@'
        },
        /**
         * @param $scope the isolated scope{time,key,form,setClass}
         * @param $element the element in the DOM
         */
        controller: function ($scope, $element) {

          $scope.hour = '';
          $scope.minute = '';

          if ($scope.time !== undefined &&
            $scope.time !== '') {
            var time = $scope.time.split(':');
            $scope.hour = parseInt(time[0]);
            $scope.minute = parseInt(time[1]);
          }

          var interval_h, interval_m;
          var form = $scope.form.toLocaleLowerCase();

          // listener for the hour
          $scope.$watch('hour', function (event, param) {

            $interval.cancel(interval_h);

            interval_h = $interval(function () {
              var regexp = $utilString.regexpNumeric();
              if (!(new RegExp(regexp).test($scope.hour))) {
                $scope.hour = 0;
              }

              if ($scope.hour !== undefined && $scope.minute !== undefined) {
                $scope.time = $scope.hour + ':' + $scope.minute;
                $log.debug(logMsgPrefix + 'key:' + $scope.key + ' value:' + $scope.time);
                $modelForms.setPostFilledForm($scope.form, $scope.key, $scope.time);
              }
              $interval.cancel(interval_h);
            }, 500);

          });

          // listener for the minute
          $scope.$watch('minute', function (event, param) {
            $interval.cancel(interval_m);
            interval_m = $interval(function () {
              var regexp = $utilString.regexpNumeric();
              if (!(new RegExp(regexp).test($scope.minute))) {
                $scope.minute = 0;
              }
              if ($scope.hour !== undefined && $scope.minute !== undefined) {
                $scope.time = $scope.hour + ':' + $scope.minute;
                $log.debug(logMsgPrefix + 'key:' + $scope.key + ' value:' + $scope.time);
                $modelForms.setPostFilledForm($scope.form, $scope.key, $scope.time);
              }
              $interval.cancel(interval_m);
            });

          });

          // listener for the event clear error
          $scope.$on(appConstants.EVENT_CLEAR_ERROR, function () {
            $('#' + form + '_' + $scope.key + '_hour').removeClass('error-border');
            $('#' + form + '_' + $scope.key + '_minute').removeClass('error-border');
          });

          // listener for the event error
          $scope.$on(appConstants.EVENT_ERROR, function (event, key) {
            $log.debug(logMsgPrefix + appConstants.EVENT_ERROR + ' key:' + key);
            if (key === form + '_' + $scope.key) {
              if ($scope.hour === '') {
                $('#' + form + '_' + $scope.key + '_hour').addClass('error-border');
              }
              if ($scope.minute === '') {
                $('#' + form + '_' + $scope.key + '_minute').addClass('error-border');
              }
            }

          });

          $element.bind('focus', function (event) {

            $('#' + form + '_' + $scope.key + '_hour').removeClass('error-border');
            $('#' + form + '_' + $scope.key + '_minute').removeClass('error-border');
          });
          $element.bind('click', function (event) {
            $('#' + form + '_' + $scope.key + '_hour').removeClass('error-border');
            $('#' + form + '_' + $scope.key + '_minute').removeClass('error-border');
          });

          $element.bind('blur', function (event) {

          });
        }
      };

    })

  /**
   * inputFilter
   */
    .directive("inputFilter", function ($timeout, $utilString) {
      return {
        restrict: "A",
        scope: {
          inputSource: "=",
          inputType: "@"
        },
        /**
         * @param $scope the isolated scope{inputSource,inputType}
         */
        controller: function ($scope) {
          var regexp = null;

          var watchers = {};

          // listener for the input source
          $scope.$watch("inputSource", function (event, param) {

            if ($scope.inputSource === undefined ||
              $scope.inputSource === '') {
              watchers['inputSource'] = '';
              return;
            }

            if ($scope.inputSource === undefined)
              return;

            if ($scope.inputType === '24hr') {
              regexp = $utilString.regexpNumeric();
              if (!(new RegExp(regexp).test($scope.inputSource))) {
                $scope.inputSource = '';
              }

              if ($scope.inputSource !== undefined &&
                $scope.inputSource !== '') {
                if (parseInt($scope.inputSource) > 23 || parseInt($scope.inputSource) < 0) {
                  $scope.inputSource = '';
                }
              }
            }
            else if ($scope.inputType === 'minute') {
              regexp = $utilString.regexpNumeric();
              if (!(new RegExp(regexp).test($scope.inputSource))) {
                $scope.inputSource = $scope.inputSource.toString().replace(/\D/g, '');
              }

              if ($scope.inputSource !== undefined &&
                $scope.inputSource !== '') {
                if (parseInt($scope.inputSource) > 59 || parseInt($scope.inputSource) < 0) {
                  $scope.inputSource = '';
                }
              }
            }
            else if ($scope.inputType === 'numeric') {
              regexp = $utilString.regexpNumeric();
              if (!(new RegExp(regexp).test($scope.inputSource))) {
                $scope.inputSource = $scope.inputSource.toString().replace(/\D/g, '');
              }
            }
            else if ($scope.inputType === 'float' || $scope.inputType === 'decimal') {

              var str = $scope.inputSource;

              if (str.substring === undefined)
                return;


              var count = 0;
              regexp = $utilString.regexpRealFloatingPointNumber();
              if (str.substring(str.length - 1, str.length) === '.') {
                var period = ".";
                count = (str.match(/\./g) || []).length;
                if (count > 1) {
                  $scope.inputSource = str.slice(0, -1);
                }
                return;
              }

              if (str.substring(str.length - 1, str.length) === '-') {
                count = (str.match(/-/g) || []).length;
                if (count > 1) {
                  $scope.inputSource = str.slice(0, -1);
                } else {
                  if (!(new RegExp(regexp).test($scope.inputSource))) {
                    if (watchers['inputSource'] !== undefined) {
                      $scope.inputSource = watchers['inputSource'];
                    } else {
                      $scope.inputSource = '';
                    }
                  } else {
                    watchers['inputSource'] = $scope.inputSource;
                  }
                }
                return;
              }


              if (!(new RegExp(regexp).test($scope.inputSource))) {
                if (watchers['inputSource'] !== undefined) {
                  $scope.inputSource = watchers['inputSource'];
                } else {
                  $scope.inputSource = '';
                }
              } else {
                watchers['inputSource'] = $scope.inputSource;
              }
            }

          });
        }
      };

    })


}());




