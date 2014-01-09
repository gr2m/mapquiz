define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Control = Backbone.Model.extend({
    isWanted: function() {
      return this.get('isWanted');
    },

    makeCorrect: function() {
      this.set('status', 'correct');
      return this;
    },

    makeIncorrect: function() {
      this.set('status', 'incorrect');
      return this;
    }
  }, {
    newFromCountry: function(country, letterAt) {
      var id = country.get('name').charAt(letterAt || 0).toLowerCase();
      var name = id;
      var countryId = country.id;
      return new this({
        id: id,
        name: name,
        countryId: countryId
      });
    },

    newFromLetter: function(letter) {
      return new this({
        id: letter,
        name: letter
      });
    }
  });

  return Control;
});
