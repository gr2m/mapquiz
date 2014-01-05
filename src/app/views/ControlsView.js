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
    tagName: 'ul',

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
          $el.find('[data-country-id="'+letter+'"]').eq(0).trigger('click');
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
        var $answer = $('<div id="answer">'+country.get('name')+'</div>');
        $answer.appendTo(document.body);
        fitText($answer[0], 1.2);
        $answer.addClass('animated bounceOut');
        setTimeout( $.proxy( $answer.remove, $answer), 1000);
        setTimeout( $.proxy( this.trigger, this), 700, 'next');
        return;
      }

      $button.siblings().removeClass('active');
      $button.addClass('animated shake active');
      setTimeout($.proxy( $button.removeClass, $button), 1000, 'animated shake');
    }
  });

  return ControlsView;
});
