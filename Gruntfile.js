var livereloadSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({


    // load app meta info
    pkg: grunt.file.readJSON('package.json'),

    // js hint Gruntfile & src files
    jshint: {

      gruntfile: {
        src: ['gruntfile.js']
      },

      server: {
        src: ['src/app/**/*.js']
      }
    },

    // run jshint whenever a *.js file changes
    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      server: {
        options: {
          livereload: true
        },
        files: [
          'src/index.html',
          'src/app/**/*.js',
          'src/assets/**',
          'src/data/*.json'
        ],
        tasks: ['jshint:server']
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'src/',
          open: true,
          livereload: true,
          middleware: function(connect) {
            return [
              // https://github.com/intesso/connect-livereload#grunt-example
              livereloadSnippet,

              // load assets from .tmp/ folder first, fallback to src/
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src')
            ];
          }
        }
      },
      build: {
        options: {
          port: 3000,
          base: 'build/',
          open: true,
          keepalive: true
        }
      }
    },
    // remove build folder before new build
    clean: {
      build: {
        src: ['build', '.tmp']
      },

      // requirejs copies over all files from src/app,
      // I coudn't figure out how to limit that. So to
      // clean up, we remove all files in build/ folder
      // right after the requirejs task, excluding the
      // files we actually want
      requirejs: {
        src: ['build/*.js', '!build/{main,vendor}.js']
      }
    },

    // copy static assets from src & build folder
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'index.html',
            'data/*.json',
            'assets/**'
          ],
          dest: 'build/'
        }]
      }
    },

    // concant & minify assets based on HTML blocks
    // https://github.com/yeoman/grunt-usemin
    useminPrepare: {
      html: 'src/index.html',
      options: {
        dest: 'build'
      }
    },

    // replace blocks of script / style tags with
    // their concatinated & minified versions
    usemin: {
      html: 'build/index.html'
    },

    requirejs: {
      build: {
        options: {
          mainConfigFile: 'src/app/config.js',

          paths: {
            // WHY THE FUCK I NEED THIS?!
            '../data/countries': '../data/countries'
          },

          preserveLicenseComments: false, // true
          optimize: 'none', // uglify
          optimizeCss: 'none',

          appDir: 'src/app',
          baseUrl: './',
          dir: 'build',
          almond: true,
          modules: [
            {
              name: 'vendor',
              include: [
                '../src/vendor/almond/almond'
              ]
            },
            {
              name: 'main',
              exclude: [
                'vendor'
              ]
            }
          ]
        }
      }
    },

    // Static asset revisioning through file content hash
    // https://github.com/yeoman/grunt-filerev
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        src: [
          // do not far-future manifest.appcache:
          // http://alistapart.com/article/application-cache-is-a-douchebag#section7
          'build/**/*.js',
          'build/**/*.css',
          'build/**/*.png'
        ]
      }
    },

    appcache: {
      options: {
        basePath: 'build'
      },
      all: {
        dest: 'build/manifest.appcache',
        cache: ['build/*', 'build/assets/*'],
        network: '*',
        fallback: '/ /'
      }
    },

    // dynamically add manifest="manifest.appcache" to <html> tag
    replace: {
      build: {
        src: ['build/index.html'],
        overwrite: true,
        replacements: [{
          from: /<html([^>]*)>/,
          to: '<html$1 manifest="manifest.appcache">'
        }, {
          from: '<script data-main="app/config" src="vendor/requirejs/require.js"></script>',
          to: function() {
            var vendorFilename = grunt.filerev.summary['build/vendor.js'].substr(6);
            var mainFilename = grunt.filerev.summary['build/main.js'].substr(6);

            return '<script src="'+vendorFilename+'"></script><script src="'+mainFilename+'"></script>';
          }
        }]
      }
    },

    // bump version of app
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // https://github.com/yeoman/grunt-usemin
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  // grunt.loadNpmTasks('grunt-requirejs');

  // https://github.com/yeoman/grunt-filerev
  grunt.loadNpmTasks('grunt-filerev');

  // https://github.com/canvace/grunt-appcache
  grunt.loadNpmTasks('grunt-appcache');

  // https://github.com/yoniholmes/grunt-text-replace
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.loadNpmTasks('grunt-bump');


  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['jshint:server', 'clean:build', 'requirejs', 'clean:requirejs', 'useminPrepare', 'copy', 'concat', 'cssmin', 'filerev', 'appcache', 'replace:build', 'usemin']);
  grunt.registerTask('server', ['connect:server', 'watch:server']);
};
