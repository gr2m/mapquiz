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

      // once an answer is hinted, the entire country needs to
      // be typed. As a shortcut, the hint button can be hold
      // for a bit, and the country will be resolved at once
      'mousedown .hint': 'startTimerForResolve',
      'touchstart .hint': 'startTimerForResolve'
    },

    initialize: function() {
      // render when new options available
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'change:status', this.renderStatus);

      this.listenToKeyboard();
    },

    listenToKeyboard: function() {
      var view = this;
      var $el = this.$el;
      var allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      var resolveAllTimeout;
      var resolveAllTriggered;

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
      // Extra use case: the hint button can be pressed & hold
      // to resolve the entiry country, without typing all
      // letters seperately after hint was used.
      Mousetrap.bind(['?','/'], function() {
        if (resolveAllTriggered) {
          resolveAllTriggered = false;
          return;
        }
        view.requestHint();
        clearTimeout(resolveAllTimeout);
        resolveAllTimeout = undefined;
      }, 'keyup');

      Mousetrap.bind(['?','/'], function() {
        var callback = function() {
          view.requestResolve();
          resolveAllTriggered = true;
        };
        if (resolveAllTimeout || resolveAllTriggered) {
          return;
        }

        resolveAllTimeout = setTimeout(callback, 500);
      }, 'keydown');
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
      this.trigger('request:hint');
      clearTimeout(longClickTimer);
    },

    requestResolve: function() {
      this.trigger('request:resolve');

      // this prevents from click event to be triggered
      // after holding the hint button
      this.render();
    },

    startTimerForResolve: function() {
      var callback = _.bind(this.requestResolve, this);
      clearTimeout(longClickTimer);
      longClickTimer = setTimeout(callback, 700);
    }
  });

  var longClickTimer;

  return ControlsView;
});
