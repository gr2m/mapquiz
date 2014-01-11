define([
  'marionette',
  'leaflet',
  'hbs!./map',
  'mousetrap',
  'fastclick',
  'fittext',
  'jquery',
  'lodash'
], function (Marionette, L, mapTemplate, Mousetrap, FastClick, fitText, $, _) {
  'use strict';

  var defaultColor = '#FF3366';
  var highligtColor = '#FF6633';
  var style = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.95,
    fillColor: defaultColor
  };
  var mapOptions = {

    // boundaries
    maxZoom: 4,
    minZoom: 1,

    // Germany
    center: { lat: 43, lng: 0 },

    // hide zoom controls
    zoomControl: false
  };

  var MapView = Marionette.View.extend({
    currentLayer: undefined,

    // DOM must be visible when adding Leaflet
    onShow: function() {
      this.map = L.map( this.el, mapOptions);
      this.countriesLayer = L.geoJson(this.options.countriesGeoJson, {
        style: style
      }).addTo(this.map);

      this.map.fitBounds(this.countriesLayer.getBounds());
    },

    highlightCountry: function(country) {
      var layer = findLayerForCountry(this.countriesLayer.getLayers(), country);
      zoomToLayer(this.map, layer);

      // highlight current layer
      layer.setStyle({ fillColor: highligtColor });

      // if present, remove highlight of last active layer
      if (this.currentLayer) {
        this.currentLayer.setStyle({ fillColor: defaultColor });
      }

      // set current layer
      this.currentLayer = layer;
    }
  });

  // private
  var findLayerForCountry = function(layers, country) {
    return _.find(layers, function(layer) {
      return layer.feature.id === country.id;
    });
  };

  var zoomToLayer = function(map, layer) {
    var options = { pan: { animate: true} };
    map.fitBounds(layer.getBounds(), options);

    // move a bit up to leave room for the controls
    map.panBy([0, 70]);
  };

  return MapView;
});
