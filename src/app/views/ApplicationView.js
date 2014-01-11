define([
  'marionette',
  'views/MapView',
  'views/ControlsView',
  'views/AnswerView',
  'hbs!templates/application'
], function (Marionette, MapView, ControlsView, AnswerView, applicationTemplate) {
  'use strict';

  return Marionette.Layout.extend({
    template: applicationTemplate,

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
