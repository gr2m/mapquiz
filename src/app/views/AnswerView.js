define([
  'marionette',
  'hbs!templates/answer',
  'lodash',
  'fittext'
], function (Marionette, answerTemplate, _, fitText) {
  'use strict';

  var AnswerView = Marionette.ItemView.extend({
    template: answerTemplate,
    onRender: function() {
      var that = this;

      this.$el.appendTo(document.body);
      fitText(this.el, 1.2);

      // remove when animation done
      setTimeout( function() {
        that.remove();
        that.trigger('remove');
      }, 1000);
    }
  });

  return AnswerView;
});
