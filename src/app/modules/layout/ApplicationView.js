define([
  'marionette',
  'modules/map/MapView',
  'modules/controls/ControlsView',
  'modules/answer/AnswerView',
  'hbs!./layout'
], function (Marionette, MapView, ControlsView, AnswerView, template) {
  'use strict';

  return Marionette.Layout.extend({
    template: template,

    regions: {
      map: '#map',
      controls: '#controls'
    },

    renderMap: function(countriesGeoJson) {
      var map = new MapView({countriesGeoJson: countriesGeoJson});
      this.map.show(map);
    },

    renderControls: function(optionList) {
      var controls = new ControlsView({collection: optionList});
      this.listenTo(controls, 'hint:request', this.onHintRequest);
      this.controls.show(controls);
    },

    renderAnswer: function(answer) {
      var answerView = new AnswerView({model: answer});
      this.listenTo(answerView, 'answer:displayed', this.onAnswerResolved);
      answerView.$el.appendTo(this.$el);
    },

    onHintRequest: function() {
      this.trigger('hint:request');
    },

    onAnswerResolved: function() {
      this.trigger('answer:displayed');
    }
  });
});
