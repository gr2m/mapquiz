var livereloadSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // load all grunt tasks (node_modules/grunt-* packages)
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
      html: {
        options: {
          livereload: true
        },
        files: [
          'src/index.html',
          'src/app/templates/**/*.html'
        ],
        tasks: []
      },
      js: {
        options: {
          livereload: true
        },
        files: [
          'src/app/**/*.js'
        ],
        tasks: ['jshint']
      },
      css: {
        options: {
          livereload: true
        },
        files: [
          '.tmp/style/**/*.css'
        ],
        tasks: []
      },
      sass: {
        files: [
          'src/style/**/*.scss'
        ],
        tasks: ['sass']
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '*',
          base: 'src/',
          open: true,
          livereload: true,
          middleware: function(connect) {
            return [
              // https://github.com/intesso/connect-livereload#grunt-example
              livereloadSnippet,

              // load assets from tmp folder first, fallback to src
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src')
            ];
          }
        }
      },
      build: {
        options: {
          port: 3000,
          hostname: '*',
          base: 'build/',
          open: true,
          keepalive: true
        }
      }
    },

    // remove build folder before new build
    clean: {
      build: { src: ['build'] },
      tmp: { src: ['.tmp', '.sass-cache', '.grunt'] },

      // remove CNAME file added with create-file:cname
      deploy: { src: ['build/CNAME'] },

      // requirejs copies over all files from src/app,
      // I coudn't figure out how to limit that. So to
      // clean up, we remove all files in build/ folder
      // right after the requirejs task, excluding the
      // files we actually want
      requirejs: {
        src: ['build/**', '!build', '!build/{start,vendor}.js']
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
            'style/**/*.png'
          ],
          dest: 'build/'
        }, {
          expand: true,
          cwd: 'src/',
          src: [
            'vendor/leaflet/leaflet.css',
            'vendor/animate.css/animate.css'
          ],
          dest: '.tmp/'
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
    // https://github.com/yeoman/grunt-usemin
    usemin: {
      html: 'build/index.html'
    },

    // https://github.com/gruntjs/grunt-contrib-sass
    // compile *.scss files into *.css
    sass: {
      build: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'style/app.scss'
          ],
          dest: '.tmp/',
          ext: '.css'
        }]
      }
    },

    //
    requirejs: {
      build: {
        options: {
          mainConfigFile: 'src/app/config.js',

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
              name: 'start',
              exclude: [
                'vendor'
              ]
            }
          ]
        }
      }
    },

    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
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
          'build/**/*.{js,css,png}'
        ]
      }
    },

    // https://github.com/canvace/grunt-appcache
    appcache: {
      options: {
        basePath: 'build'
      },
      all: {
        dest: 'build/manifest.appcache',
        cache: ['build/*', 'build/style/*'],
        network: '*',
        fallback: '/ /'
      }
    },

    // https://github.com/yoniholmes/grunt-text-replace
    replace: {
      html: {
        src: ['build/index.html'],
        overwrite: true,
        replacements: [{

          // add manifest="manifest.appcache" to <html> tag
          from: /<html([^>]*)>/,
          to: '<html$1 manifest="manifest.appcache">'
        }, {

          // replace requirejs script tag with tags for generated & bundled files
          from: '<script data-main="app/config" src="vendor/requirejs/require.js"></script>',
          to: function() {
            var vendorFilename = grunt.filerev.summary['build/vendor.js'].substr(6);
            var mainFilename = grunt.filerev.summary['build/start.js'].substr(6);

            return '<script src="'+vendorFilename+'"></script><script src="'+mainFilename+'"></script>';
          }
        }]
      },

      // turn the SVG file exported from assets/controls/controls.sketch
      // and turn it into src/app/templates/controls.html
      svg: require('./assets/controls/grunt-replace-config')
    },

    // https://github.com/vojtajina/grunt-bump
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
    },


    // https://github.com/travis-hilterbrand/grunt-file-creator
    // to add CNAME file before deploying to githup pages
    'file-creator': {
      'cname': {
        'build/CNAME': function(fs, fd, done) {
          fs.writeSync(fd, 'quiz.janagallus.com');
          done();
        }
      }
    },

    // https://github.com/tschaub/grunt-gh-pages
    // deploy build/ folder to gh-pages branch
    'gh-pages': {
      options: {
        base: 'build'
      },
      build: {
        src: ['**/*']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['jshint:server', 'clean', 'requirejs', 'clean:requirejs', 'useminPrepare', 'copy', 'sass', 'concat', 'cssmin', 'filerev', 'appcache', 'replace:html', 'usemin', 'clean:tmp']);
  grunt.registerTask('server', ['sass', 'connect:server', 'watch']);
  grunt.registerTask('deploy', ['build', 'file-creator:cname','gh-pages', 'clean:tmp', 'clean']);
};
