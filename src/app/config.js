requirejs.config({
    paths: {
      // vendor
      text:          '../vendor/requirejs-text/text',
      hbs:           '../vendor/backbone.marionette.hbs/backbone.marionette.hbs',
      jquery:        '../vendor/jquery/jquery',
      handlebars:    '../vendor/handlebars/handlebars',
      marionette:    '../vendor/backbone.marionette/lib/backbone.marionette',
      lodash:        '../vendor/lodash/dist/lodash',
      backbone:      '../vendor/backbone/backbone',
      leaflet:       '../vendor/leaflet/leaflet-src',
      fittext:       '../vendor/fittext/fittext',
      mousetrap:     '../vendor/mousetrap/mousetrap',
      fastclick:     '../vendor/fastclick/lib/fastclick',

      // data
      'data/countries': '../data/countries'
    },

    map: {
      '*': {
        'underscore': 'lodash'
      }
    },

    shim: {
      'lodash': {
        exports: '_'
      },
      'backbone': {
        deps: ['lodash', 'jquery'],
        exports: 'Backbone'
      },
      'marionette': {
        deps: ['backbone'],
        exports: 'Backbone.Marionette'
      },
      'handlebars': {
        exports: 'Handlebars'
      },
      'leaflet': {
        exports: 'L'
      },
      'fittext': {
        exports: 'fitText'
      },
      'mousetrap': {
        exports: 'Mousetrap'
      },
      'fastclick': {
        exports: 'FastClick'
      }
    }
  }
);

// start app
require(['start']);
