// Karma configuration

var path = require('path');

module.exports = function(config) {

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'base',

    plugins: [
      // these plugins will be require() by Karma
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-junit-reporter'
    ],

    // frameworks to use
    frameworks: ['jasmine'],




    // list of files / patterns to load in the browser
    files: [
      //js libs

      '../app/bower_components/ionic/release/js/ionic.bundle.min.js',

      '../app/bower_components/jquery/jquery.min.js',
      '../app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      '../app/bower_components/lodash/dist/lodash.min.js',
      '../app/bower_components/highcharts/highcharts.js',
      '../app/bower_components/highcharts/highcharts-more.js',
      '../app/bower_components/highcharts/highcharts-3d.js',
      '../app/bower_components/moment/moment.js',

      '../app/lib/jsbn/*.js',

      '../app/js/initOptions.js',
      '../app/js/main.js',
      '../app/js/messages.js',


      '../app/scripts/app.js',
      '../app/scripts/services/services.js',
      '../app/scripts/services/*.js',
      '../app/scripts/controllers/controllers.js',
      '../app/scripts/controllers/*.js',
      '../app/scripts/directives/directives.js',
      '../app/scripts/filters/filters.js',
      '../app/scripts/features/**/*.js',
      '../app/scripts/features/**/**/*.js',



      //test lib files
      //'../test/lib/angular/angular-mocks.js',
      '../app/bower_components/angular-mocks/angular-mocks.js',
      '../test/lib/jasmine-jquery.js',

      //unit test specs
      '../test/unit/**/*.js',

      //mock worklight
      '../app/mock/worklight-mock.js',

      // fixtures
      {pattern:'../app/mock/*.json', watched: true, served: true, included: false},
      '../app/scripts/directives/*.html',
      '../app/scripts/features/forms/24hr-time.html',
      '../app/scripts/features/si-diagram/sketch-canvas.html',
      '../app/scripts/features/forms/forms.json'
    ],


    preprocessors: {
      '../app/scripts/directives/*.html':['ng-html2js'],
      '../app/scripts/features/forms/24hr-time.html':['ng-html2js'],
      '../app/scripts/features/si-diagram/sketch-canvas.html':['ng-html2js'],
      '../app/scripts/features/forms/forms.json':['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      cacheIdFromPath: function(filepath) {
        filepath = filepath.replace(path.resolve() + '/app/','');
        //console.log("ngHtml2JS = " + filepath);
        return filepath;
      }
    },

    // list of files to exclude
    exclude: [
     
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit'],

    junitReporter : {
      outputFile: '../test/output/unit.xml',
      suite: 'unit'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};
