define([
  'marionette',
  'hbs!templates/controls',
  'lodash',
  'jquery',
  'fittext',
  'mousetrap'
], function (Marionette, controlsTemplate, _, $, fitText, Mousetrap) {
  'use strict';

  var ControlsView = Marionette.ItemView.extend({
    template: controlsTemplate,

    events: {
      'click [data-country-id]': 'selectOption'
    },

    initialize: function() {
      // render when new options available
      this.listenTo(this.collection, 'reset', this.render);

      this.listenToKeyboard();
    },

    listenToKeyboard: function() {
      var $el = this.$el;
      var allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');

      // add keyboard shortcuts to select options by first letter
      _.each(allLetters, function(letter) {
        Mousetrap.bind( letter , function() {
          $el.find('[accesskey="'+letter+'"]').eq(0).trigger('click');
        });
      });

      // add keyboard shortcuts to select options by number
      _.each( '1234'.split(''), function(number) {
        Mousetrap.bind(number, function() {
          var index = parseInt(number) - 1;
          $el.find('[data-country-id]').eq( index ).trigger('click');
        });
      });
    },

    selectOption: function(event) {
      var $button = $(event.currentTarget);
      var selectedCountryId = $button.data('countryId');
      var country = this.collection.get(selectedCountryId);

      if (country.get('isCorrect')) {
        this.trigger('answer:correct', country);
        return;
      }

      $button.siblings().removeClass('active');
      $button.addClass('animated shake active');
      setTimeout($.proxy( $button.removeClass, $button), 1000, 'animated shake');
    }
  });

  return ControlsView;
});
