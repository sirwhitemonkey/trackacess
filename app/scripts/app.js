'use strict';

(function () {

  angular.module('trackaccess', ['ionic', 'ngAnimate', 'trackaccess.services', 'trackaccess.directives',
    'trackaccess.controllers', 'trackaccess.filters', 'ui.bootstrap'])

    .run(function ($ionicPlatform, $rootScope, $state, $log, $timeout, $service, $session, appConstants) {

      var logMsgPrefix = 'app.js -> ';

      $ionicPlatform.ready(function () {

      });

      // remove worklight.css, not required.
      $service.removeFile('worklight/worklight.css', 'css')
        .then(function (result) {
          $log.debug(logMsgPrefix + ' removeFile :' + result);

        });

      // if mock , load the js file
      if (appConstants.isMock) {
        $service.loadFile('mock/worklight-mock.js','js')
          .then(function(result){
            $log.debug(logMsgPrefix + ' loadFile :' + result);
          });
      }

      document.addEventListener('deviceready', function () {
        try {
          cordova.$session = $session;
          var param = {
            state: 'onLaunch'
          };
          $session.awake(param);
        } catch (e) {

        }
      }, false);


      // global state transition
      $rootScope.$on(appConstants.EVENT_STATE_TRANSITION, function (event, param) {
        $log.debug(logMsgPrefix + ' transition ' + JSON.stringify(param));

        var params = {};
        if (param.params === undefined) {
          params = {};
        } else {
          params = param.params;
        }

        $state.go(param.state.toLowerCase(), params);
      });

    })

    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider

        .state('main', {
          url: '/main',
          templateProvider: function ($templateCache, $http) {
            var url = 'scripts/features/main/main.html';
            return $http.get(url, {cache: $templateCache}).then(function (html) {
              return html.data;
            });
          },
          controller: 'CtrlApp'
        })

        .state('main.dashboard', {
          url: '/dashboard/:time',
          views: {
            content: {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/dashboard/dashboard.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlDashboard'
            }
          }
        })

        .state('main.dashboard-more', {
          url: '/dashboard-more/:status/:query',
          views: {
            content: {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/dashboard/dashboard-more.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlDashboardMore'
            }
          }
        })

        .state('main.stats', {
          url: '/stats/:time',
          views: {
            content: {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/stats/stats.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlStats'
            }
          }

        })

        .state('main.forms', {
          url: '/forms',
          views: {
            content: {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/main-forms.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForms'
            }
          }

        })


        .state('main.forms.overview', {
          url: '/overview',
          views: {
            'tab-overview': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/overview/overview.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlOverview'
            }
          }
        })

        .state('main.forms.form1', {
          url: '/form1',
          views: {
            'tab-form1': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form1/form1.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm1'
            }
          }
        })

        .state('main.forms.form2', {
          url: '/form2',
          views: {
            'tab-form2': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form2/form2.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm2'
            }
          }
        })

        .state('main.forms.form3', {
          url: '/form3',
          views: {
            'tab-form3': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form3/form3.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm3'
            }
          }
        })

        .state('main.forms.form4', {
          url: '/form4',
          views: {
            'tab-form4': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form4/form4.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm4'
            }
          }
        })

        .state('main.forms.form5', {
          url: '/form5',
          views: {
            'tab-form5': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form5/form5.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm5'
            }
          }
        })

        .state('main.forms.form6', {
          url: '/form6',
          views: {
            'tab-form6': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form6/form6.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm6'
            }
          }
        })

        .state('main.forms.form7', {
          url: '/form7',
          views: {
            'tab-form7': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form7/form7.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm7'
            }
          }
        })

        .state('main.forms.form8', {
          url: '/form8',
          views: {
            'tab-form8': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form8/form8.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm8'
            }
          }
        })

        .state('main.forms.form9', {
          url: '/form9',
          views: {
            'tab-form9': {
              templateProvider: function ($templateCache, $http) {
                var url = 'scripts/features/forms/form9/form9.html';
                return $http.get(url, {cache: $templateCache}).then(function (html) {
                  return html.data;
                });
              },
              controller: 'CtrlForm9'
            }
          }
        });

      $urlRouterProvider.otherwise('/main');
    });

})();













