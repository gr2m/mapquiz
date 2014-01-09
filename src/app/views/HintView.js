define([
  'marionette',
  'hbs!templates/hint',
  'lodash',
  'fittext'
], function (Marionette, hintTemplate, _, fitText) {
  'use strict';

  var HintView = Marionette.ItemView.extend({
    template: hintTemplate,
    initialize: function() {
      this.listenTo(this.model, 'change:length', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    onRender: function() {
      this.$el.appendTo(document.body);
      fitText(this.el, 1.2);
    },
    templateHelpers: {

      // turns "Germany" into "Ger____" if length is 3
      coveredHint: function() {
        var hint = this;

        return hint.name.replace(/\w/g, function(match, i) {
          if (i === hint.length) {
            return '<em class="current">'+match+'</em>';
          }

          return '<em>'+match+'</em>';
        });
      }
    }
  });

  return HintView;
});
