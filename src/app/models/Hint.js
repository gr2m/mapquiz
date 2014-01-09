define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Hint = Backbone.Model.extend({
    name: function() {
      return this.get('name');
    },
    length: function() {
      return this.get('length');
    },
    wantedLetter: function() {
      return this.name().charAt(this.length());
    },
    more: function() {
      var length = this.length();
      this.set('length', length + 1);

      // make sure current letter is not a white space
      if (this.wantedLetter() === ' ') {
        this.more();
      }
    },
    isComplete: function() {
      return this.length() === this.name().length;
    }
  },{
    newFromCountry: function(country) {
      return new this({
        name: country.get('name'),
        length: 1
      });
    }
  });

  return Hint;
});
