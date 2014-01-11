define([
  'marionette',
  'modules/layout/ApplicationView',
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
    var controlList;
    var answer;

    // render main app view (layout)
    app.main.show(appView);

    // render map
    countriesGeoJson = app.request('countries:geojson');
    appView.renderMap(countriesGeoJson);

    // render controls
    controlList = app.request('controls');
    appView.renderControls(controlList);

    // prepare answer display
    answer = app.request('answer');
    appView.renderAnswer(answer);

    // when next country is requested, highlight current
    // country on the map and prepare the answer view
    app.vent.on('next', function(country) {
      appView.map.currentView.highlightCountry(country);
    });

    // if answer is already hinted, show another letter,
    // otherwise resolve directly
    controlList.on('guess:correct', function() {
      var answer = app.request('answer');

      if (! answer.hasHint() ) {
        return answer.resolve();
      }

      answer.hint();
      app.request('controls:afterhint', answer);
    });

    // show a(nother) letter for the current answer
    appView.on('request:hint', function() {
      var answer = app.request('answer');
      answer.hint();

      if (! answer.isResolved()) {
        app.request('controls:afterhint', answer);
      }
    });

    // show a(nother) letter for the current answer
    appView.on('request:resolve', function() {
      var answer = app.request('answer');
      answer.resolve();
    });

    //
    appView.on('answer:displayed', app.next);

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

  // return app instance
  return app;
});
