require([
  'app',
  'backbone',
  'routers/index',
  'controllers/index',
  'entities/CountriesEntity',
  'entities/OptionsEntity'
], function (app, Backbone, Router, Controller) {
  'use strict';

  app.start();
  new Router({ controller: Controller });
  Backbone.history.start();
});
