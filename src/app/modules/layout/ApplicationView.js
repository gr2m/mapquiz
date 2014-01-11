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
      this.listenTo(controls, 'request:hint', this.onHintRequest);
      this.listenTo(controls, 'request:resolve', this.onResolveRequest);
      this.controls.show(controls);
    },

    renderAnswer: function(answer) {
      var answerView = new AnswerView({model: answer});
      this.listenTo(answerView, 'answer:displayed', this.onAnswerResolved);
      answerView.$el.appendTo(this.$el);
    },

    onHintRequest: function() {
      this.trigger('request:hint');
    },

    onResolveRequest: function() {
      this.trigger('request:resolve');
    },

    onAnswerResolved: function() {
      this.trigger('answer:displayed');
    }
  });
});
