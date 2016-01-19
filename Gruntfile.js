'use strict';


var path = require('path');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var copyTo = ['mock/**','styles/css/**','fonts/**','images/**','lib/**','js/**',
    'scripts/**','*.html','bower_components/jquery/jquery.min.js','bower_components/jquery/jquery.min.map',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/lodash/dist/lodash.min.js',
    'bower_components/highcharts/**',
    'bower_components/moment/**',
    'bower_components/angular-bootstrap/bootstrap.min.css',
    'bower_components/ionic/release/js/angular.min.js.map',
    'bower_components/ionic/release/js/ionic.bundle.min.js',
    'bower_components/ionic/release/js/angular-sanitize.min.js.map',
    'bower_components/ionic/release/css/ionic.min.css',
    'bower_components/ionic/release/fonts/**'
  ];

  var worklightAppPath = grunt.option('worklightAppPath') || '../track-access-worklight63/apps/trackaccess/common/';

  //build wlapp and adapters
  var worklightServerHost = grunt.option('worklightServerHost') || 'http://localhost:10080/worklightadmin/';
  var adaptersDomain = grunt.option('adaptersDomain') || 'localhost';
  var baseDir = grunt.option('baseDir') || '../track-access-worklight63';
  var secure = grunt.option('secure') || 'false';
  var runtime = grunt.option('runtime') || 'track-access-worklight63';
  var protocol= grunt.option('protocol') || 'http';
  var username = grunt.option('username') || 'admin';
  var password= grunt.option('password') || 'admin';
  var wlServerContext = grunt.option('wlServerContext') || 'trackaccess';

  // Define the configuration for all the tasks
  grunt.initConfig({

    compass: {
      clean: {
        options: {
          clean: true
        }
      },
      dist: {
        options: {
          sassDir: 'app/styles/sass',
          cssDir: 'app/styles/css'
        }
      }
    },

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js'],
        tasks: ['newer:jshint:all','newer:copy:worklight']
      },
      html: {
        files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.html'],
        tasks: ['newer:copy:worklight']
      },
      jsTest: {
        files: ['test/unit/{,*/}*.js','test/e2e/{,*/}*.js'],
        tasks: ['newer:jshint:test']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer','newer:copy:worklight','replace:screencss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    replace: {

      clean_fixture: {
        src: ['test/unit/app-spec.js'],
        overwrite: true,
        replacements: [{
          to: "jasmine.getJSONFixtures().fixturesPath=''",
          from: "jasmine.getJSONFixtures().fixturesPath='" + path.resolve() + "'"
        }]
      },
      update_fixture: {
        src: ['test/unit/app-spec.js'],
        overwrite: true,
        replacements: [{
          from: "jasmine.getJSONFixtures().fixturesPath=''",
          to: "jasmine.getJSONFixtures().fixturesPath='" + path.resolve() + "'"
        }]
      },

      screencss: {
        src: [worklightAppPath + '/**/screen.css'],
        overwrite :true,
        replacements:[{
          from: 'app/app',
          to: '../..'
        }
        ]
      },
      log: {
        src: [worklightAppPath + '/**/*.js'],
        overwrite :true,
        replacements:[{
          from: '$log.debug',
          to: '//$log.debug'
        }
        ]
      },
      disable_mock: {
        src: [worklightAppPath + '/**/services.js'],
        overwrite :true,
        replacements:[{
          from: 'isMock: true',
          to: 'isMock: false'
        }
        ]
      }
    },


    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        //'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      options: { force: true },
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      worklight: worklightAppPath + '*'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'scripts/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      worklight: {
        files: [
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: copyTo,
            dest: worklightAppPath
          } // includes files in path
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'/*,
         'htmlmin'*/
      ]
    },
    // Execute ANT builds
    exec: {
      build_deploy_wlapp_adapters: {
        cmd: function() { return 'if test -d ' + baseDir + '; then ant -f ' + baseDir + '/worklight_build.xml build-deploy-wlapp-adapters -DbaseDir=' + baseDir  + ' -DworklightServerHost=' + worklightServerHost + ' -DadaptersDomain=' + adaptersDomain + ' -Dsecure=' + secure + ' -Druntime=' + runtime + ' -Dprotocol=' + protocol +  ' -Dusername=' + username +  ' -Dpassword=' + password +'; else echo "Worklight repo doesn\'t seem to exist... Nothing to do here, skipping the Worklight build."; fi'; },
        stdout: true,
        stderr: true
      },
      build_adapters_wlapp: {
        cmd: function() { return 'if test -d ' + baseDir + '; then ant -f ' + baseDir + '/worklight_build.xml build-adapters-wlapp -DbaseDir=' + baseDir  + ' -DworklightServerHost=' + worklightServerHost + ' -DadaptersDomain=' + adaptersDomain + ' -Dsecure=' + secure + ' -Druntime=' + runtime + ' -Dprotocol=' + protocol +  ' -Dusername=' + username +  ' -Dpassword=' + password +'; else echo "Worklight repo doesn\'t seem to exist... Nothing to do here, skipping the Worklight build."; fi'; },
        stdout: true,
        stderr: true
      }
    },

    karma: {
      //common options
      options: {
        configFile: 'karma.unit.conf.js'
      },
      unit: {
        //default settings
      },
      unit_ci: {
        singleRun: true
      }
    }




  });
  // END -> grunt.initConfig

  grunt.registerTask('build-deploy-wlapp-adapters', ['exec:build_deploy_wlapp_adapters']);
  grunt.registerTask('stageHTML5ToWorklight',['clean:worklight','copy:worklight']);

  grunt.registerTask('serve', function () {

    grunt.task.run([
      //'clean:worklight',
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });


  grunt.registerTask('dev', [
    'jshint',
    'replace:clean_fixture',
    'replace:update_fixture',
    'karma:unit_ci',
    'replace:clean_fixture',
    'clean:dist',
    'compass',
    'stageHTML5ToWorklight',
    'replace:screencss',
    'replace:disable_mock',
    'build-deploy-wlapp-adapters'
  ]);


  grunt.registerTask('prod', [
    'jshint',
    'replace:clean_fixture',
    'replace:update_fixture',
    'karma:unit_ci',
    'replace:clean_fixture',
    'clean:dist',
    'compass',
    'stageHTML5ToWorklight',
    'replace:screencss',
    'replace:log',
    'replace:disable_mock',
    'build-deploy-wlapp-adapters'
  ]);

};
