define([
  'backbone',
  'models/Country'
], function (Backbone, Country) {
  'use strict';

  var CountryList = Backbone.Collection.extend({
    model: Country,
  });

  return CountryList;
});
