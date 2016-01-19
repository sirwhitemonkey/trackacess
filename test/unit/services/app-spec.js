'use strict';


describe('Trackaccess($modelApp)',function() {

  var logMsgPrefix = 'services->app-spec.js ->';

  describe('themes', function () {

    it('*set* theme to (theme1)  validation', function () {

      var themes=$modelApp.themes;

      $rootScope.$apply(function() {
        $modelApp.setTheme(themes[0])
          .then(function(result){
            expect(result).toBe(true);
          });
      });
    });

    it('*get* theme (theme1) validation', function () {
      $rootScope.$apply(function() {
        $modelApp.getTheme()
          .then(function(theme){
            expect(theme.css).toEqual('theme1');
          });
      });
    });

  });


});

