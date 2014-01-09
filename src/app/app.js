define([
  'marionette',
  'views/ApplicationView',
  'views/AnswerView',
  'views/HintView',
  'fastclick',
], function (Marionette, ApplicationView, AnswerView, HintView, FastClick) {
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

    // render main app view (layout)
    app.main.show(appView);

    // render map
    countriesGeoJson = app.request('countries:geojson');
    appView.renderMap(countriesGeoJson);

    // render controls
    controlList = app.request('controls');
    appView.renderControls(controlList);

    // when next country is requested, render map and
    // the controls accordingly
    app.vent.on('next', function(country) {
      appView.map.currentView.highlightCountry(country);
    });

    //
    controlList.on('guess:correct', showAnswerAndGotoNext);

    // if there is already a hint, show more of it,
    // otherwise create a new hint and show it
    appView.on('hint:request', function() {
      var hint = app.request('hint:current');
      var country = app.request('countries:current');
      var hintView;

      if (hint) {
        hint.more();
      } else {
        hint = app.request('hint:new', country);
        hintView = new HintView({model: hint});
        hintView.render();
      }

      if (hint.isComplete()) {
        return showAnswerAndGotoNext();
      }

      app.request('controls:afterhint', country, hint);
    });

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

  // show answer
  var showAnswerAndGotoNext = function() {
    var country = app.request('countries:current');
    var answer = new AnswerView({model: country});
    answer.render();
    answer.on('remove', app.next);
  };

  // make app accessible on window for debugging
  window.app = app;

  // return app instance
  return app;
});
