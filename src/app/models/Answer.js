define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Answer = Backbone.Model.extend({
    name: function() {
      return this.get('name');
    },
    hintLength: function() {
      return this.get('hintLength') || 0;
    },
    wantedLetter: function() {
      return this.name().charAt(this.hintLength());
    },
    hasHint: function() {
      return this.hintLength() > 0;
    },
    hint: function() {
      var hintLength = this.hintLength();
      this.set('hintLength', hintLength + 1);

      // make sure current letter is not a white space
      if (this.wantedLetter() === ' ') {
        return this.hint();
      }

      if (this.isResolved()) {
        return this.resolve();
      }

      this.trigger('hint');
    },
    resolve: function() {
      this.set('hintLength', this.name().length);
      this.trigger('resolve');
    },
    isResolved: function() {
      return this.hintLength() === this.name().length;
    },
    resetFromCountry: function(country) {
      this.set({
        name: country.get('name'),
        hintLength: 0
      });
      this.trigger('reset');
    }
  });

  return Answer;
});
