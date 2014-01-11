define([
  'marionette',
  'hbs!templates/answer',
  'lodash',
  'fittext'
], function (Marionette, answerTemplate, _, fitText) {
  'use strict';

  var AnswerView = Marionette.ItemView.extend({
    template: answerTemplate,
    initialize: function() {
      this.listenTo(this.model, 'resolve', this.resolve);
      this.listenTo(this.model, 'hint reset', this.render);
    },

    onRender: function() {
      // hintLength === 0 means that the answer has been initialized
      // and is not meant to be shown yet. When resolved, hintlength
      // is lenght of answer
      if ( this.model.hintLength() === 0 ) {
        this.$el.hide();
        return;
      }

      this.$el.show();
      this.$el.find('span').removeClass('animated bounceOut');
      this.$el.find('#answer').removeClass('resolved');
      fitText(this.el, 1.2);
    },

    resolve: function() {
      var view = this;

      view.render();
      view.$el.find('#answer').addClass('resolved');
      view.$el.find('span').addClass('animated bounceOut');
      setTimeout(function() {
        view.trigger('answer:displayed');
      }, 1000);
    },

    templateHelpers: {

      // turns "Germany" into "Ger____" if length is 3
      hintedAnswer: function() {
        var answer = this;

        return answer.name.replace(/\w/g, function(match, i) {
          if (i === answer.hintLength) {
            return '<em class="current">'+match+'</em>';
          }

          return '<em>'+match+'</em>';
        });
      }
    }
  });

  return AnswerView;
});
