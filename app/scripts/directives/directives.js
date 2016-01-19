'use strict';

(function () {

  angular.module('trackaccess.directives', [])

  /**
   * resize the element
   */
    .directive('resizeContents', function ($log, $interval) {

      var logMsgPrefix = 'resizeContents ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        scope: {
          sync: '=',
          margin: '@',
          footer: '@'
        },
        /**
         * @param scope the isolated scope , {sync,margin,footer}
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          var w = angular.element($(window));
          var el = angular.element($(element));

          var interval;

          var resize = function () {
            var height = w.height() - el.height();
            height -= (parseInt(el.offset().top));

            $log.debug(logMsgPrefix + ' sync height:' + height);
            el.css({'height': el.height() + height});

            if (scope.margin !== undefined && scope.margin !== '') {
              el.css({'height': el.height() - parseInt(scope.margin)});
            }

            el.css({'overflow-y': 'scroll'});

            if (scope.footer === 'true') {
              el.css({'height': el.height()});
            }
            $interval.cancel(interval);
          };

          scope.$watch('sync', function (newValue, oldValue) {
            $interval.cancel(interval);
            interval = $interval(function () {
              resize();
            }, 500);
          });

          w.bind('resize', function (event) {
            $interval.cancel(interval);
            interval = $interval(function () {
              resize();
            }, 500);
          });
        }
      };
    })

  /**
   * position the element
   */
    .directive('position', function ($log) {

      var logMsgPrefix = 'position ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        scope: {
          iosTop: '@',
          top: '@'
        },
        /**
         * @param scope the isolated scope, {iosTop,top}
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          var standalone = window.navigator.standalone,
            userAgent = window.navigator.userAgent.toLowerCase(),
            safari = /safari/.test(userAgent),
            ios = /iphone|ipod|ipad/.test(userAgent);

          if (ios) {
            if (!standalone && safari) {
              //browser
              element.css({'top': scope.top + 'px'});

              $log.debug(logMsgPrefix + 'browser');

            } else if (standalone && !safari) {
              //standalone
              $log.debug(logMsgPrefix + 'standalone');

            } else if (!standalone && !safari) {
              //uiwebview
              $log.debug(logMsgPrefix + 'webview');
              element.css({'top': scope.iosTop + 'px'});
            }
          } else {
            //not iOS
            element.css({'top': scope.top + 'px'});
          }
        }
      };
    })

  /**
   * theme styling
   */
    .directive('themeStyle', function ($log, appConstants) {

      var logMsgPrefix = 'themeStyle ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        /**
         * @param scope the current scope
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          scope.$on(appConstants.EVENT_THEME_STYLE, function (event, param) {
            $log.debug(logMsgPrefix + ' theme:' + JSON.stringify(param.theme));
            element.attr('href', 'styles/css/' + param.theme.css + '.css');
          });
        }
      };
    })

  /**
   * chart drawing
   */
    .directive('chart', function ($log) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div></div>',
        replace: true,
        /**
         * @param $scope the isolated scope {data}
         * @param $element the element in the DOM
         */
        controller: function ($scope, $element) {

          var logMsgPrefix = 'chart ->';

          $log.debug(logMsgPrefix + 'created');

          $scope.$watch('data', function (event, param) {
            if ($scope.data !== undefined &&
              $scope.data !== '') {

              $element.highcharts($scope.data);
            }
          });
        }
      };
    })

  /**
   * capitalise string(s)
   */
    .directive('capitalize', function ($log, $filter) {
      var logMsgPrefix = 'capitalize ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        scope: {
          srcItem: '=',
          firstCharacterWord: '@',
          firstCharacter: '@'
        },
        /**
         * @param scope the isolated scope, {srcItem,firstCharacterWord,firstCharacter}
         * @param element the element in the DOM
         */
        link: function (scope, element) {

          scope.$watch('srcItem', function (event, param) {

            if (scope.firstCharacterWord) {
              scope.srcItem = $filter('capitalizedFirstCharacterInWord')(scope.srcItem);
            }

            if (scope.firstCharacter) {
              scope.srcItem = $filter('capitalizedFirstCharacter')(scope.srcItem);
            }
          });
        }
      };
    })

  /**
   * custom dropdown
   */
    .directive('dropdown', function ($log, $rootScope, appConstants) {

      var logMsgPrefix = 'dropdown ->';
      $log.debug(logMsgPrefix + ' created');

      return {
        restrict: 'E',
        templateUrl: 'scripts/directives/dropdown.html',
        scope: {
          placeholder: '@',
          list: '=',
          selected: '=',
          property: '@',
          onSelected: '&'
        },
        /**
         * @param scope the isolated scope, {placeholder,list,selected,property,onSelected}
         */
        link: function (scope) {
          scope.listVisible = false;
          scope.isPlaceholder = true;
          scope.display = '';

          scope.select = function (item) {
            scope.isPlaceholder = false;
            scope.selected = item;

            scope.listVisible = false;

            scope.onSelected({item: item});

          };

          scope.isSelected = function (item) {
            return item[scope.property] === scope.selected[scope.property];
          };

          $rootScope.$on(appConstants.EVENT_DROPDOWN_HIDE, function () {
            scope.listVisible = false;
          });

          scope.show = function () {
            scope.listVisible = !scope.listVisible;
          };

          scope.$watch('selected', function (value) {
            scope.isPlaceholder = scope.selected[scope.property] === undefined;
            scope.display = scope.selected[scope.property];
          });
        }
      };
    });

}());



