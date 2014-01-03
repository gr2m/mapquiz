define([
  'marionette',
  'views/ApplicationView',
  'fastclick',
], function (Marionette, ApplicationView, FastClick) {
  'use strict';

  var app = new Marionette.Application();
  var appView = new ApplicationView();

  app.addRegions({
    // set app's root region to <body> element
    main: 'body'
  });

  app.addInitializer(function () {
    var countriesGeoJson;
    var optionList;

    // render main app view (layout)
    app.main.show(appView);

    // render map
    countriesGeoJson = app.request('countries:geojson');
    appView.renderMap(countriesGeoJson);

    // render controls
    optionList = app.request('options');
    appView.renderControls(optionList);

    // disable scrolling of root element as our app is fullscreen.
    // As a side effect, that prevents the bouncing on touch devices,
    // when trying to scroll beyond the visible canvas.
    document.ontouchmove = function(event){
      event.preventDefault();
    };

    // Polyfill to remove click delays on browsers with touch UIs
    // https://github.com/ftlabs/fastclick
    FastClick.attach(document.body);

    // start app by showing first country
    app.next();
  });

  // helper to load next country
  app.next = function() {
    var nextCountry = app.request('countries:next');
    app.vent.trigger('next', nextCountry);
  };

  // make app accessible on window for debugging
  window.app = app;

  // when next country is requested, render map and
  // the controls accordingly
  app.vent.on('next', function(country) {
    appView.map.currentView.highlightCountry(country);
  });

  appView.on('next', app.next);

  // return app instance
  return app;
});
