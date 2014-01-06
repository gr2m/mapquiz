define([
  'marionette',
  'views/MapView',
  'views/ControlsView',
  'hbs!templates/application'
], function (Marionette, MapView, ControlsView, applicationTemplate) {
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
      this.listenTo(controls, 'answer:correct', this.onAnswerCorrect);
      this.controls.show(controls);
    },

    onAnswerCorrect: function(answer) {
      this.trigger('answer:correct', answer);
    }
  });
});
