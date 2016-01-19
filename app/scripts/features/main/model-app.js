'use strict';

angular.module('trackaccess.services')

  .factory('$modelApp', ['$q', '$localDataStorage', '$log', 'appConstants', function ($q, $localDataStorage, $log, appConstants) {
    var logMsgPrefix = '$modelApp ->';
    $log.debug(logMsgPrefix + ' created');

    var $modelApp = {
      callback: '',
      graph: '',
      dashboard: false
    };

    $modelApp.themes = [
      {css: 'theme1', name: 'Theme 1'},
      {css: 'theme2', name: 'Theme 2'},
      {css: 'theme3', name: 'Theme 3'}
    ];

    /**
     * set the theme
     * @param theme the theme selection
     * @returns {boolean} the true/false
     */
    $modelApp.setTheme = function (theme) {
      var deferred = $q.defer();

      $localDataStorage.saveObj(appConstants.LOCAL_STORAGE_THEME, theme)
        .then(function (response) {
          deferred.resolve(response);
        });

      return deferred.promise;

    };

    /**
     * get the theme
     * @returns {theme} the theme selection
     */
    $modelApp.getTheme = function () {
      var deferred = $q.defer();
      $localDataStorage.loadObj(appConstants.LOCAL_STORAGE_THEME)
        .then(function (theme) {
          if (theme == null) {
            $modelApp.setTheme($modelApp.themes[0])
              .then(function (response) {
                if (response) {
                  deferred.resolve($modelApp.themes[0]);
                } else {
                  deferred.resolve(null);
                }
              });

          } else {
            deferred.resolve(theme);
          }
        });
      return deferred.promise;
    };


    return $modelApp;

  }]);




