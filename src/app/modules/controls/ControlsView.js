define([
  'marionette',
  'hbs!./controls',
  'lodash',
  'jquery',
  'fittext',
  'mousetrap'
], function (Marionette, controlsTemplate, _, $, fitText, Mousetrap) {
  'use strict';

  var ControlsView = Marionette.ItemView.extend({
    template: controlsTemplate,

    events: {
      'click [data-control-id]': 'selectOption',
      'click .hint': 'requestHint',
    },

    initialize: function() {
      // render when new options available
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'change:status', this.renderStatus);

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

      // add keybord shortcuts for hint button
      Mousetrap.bind(['?','/'], function() {
        $el.find('.hint').trigger('click');
      });
    },

    renderStatus: function(control, status) {
      this.$el.find('[data-control-id="'+control.id+'"]').attr('class', status);
    },

    selectOption: function(event) {
      var $button = $(event.currentTarget);
      var id = $button.data('controlId');
      this.collection.guess(id);
    },

    requestHint: function() {
      this.trigger('hint:request');
    }
  });

  return ControlsView;
});
