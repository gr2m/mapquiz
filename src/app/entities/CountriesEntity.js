define([
  'app',
  'data/countries',
  'collections/CountryList',
  'collections/OptionList',
  'lodash'
], function (app, countriesGeoJson, CountryList, OptionList, _) {
  'use strict';

  var countryList;

  // map function to turn a GeoJson FeatureCollection array
  // into properties for
  function mapGeoJsonFeatureToRecordProperties (feature) {
    // {
    //   "type":"Feature",
    //   "id":"AFG",
    //   "properties":{"name":"Afghanistan"},
    //   "geometry":{
    //       "type":"Polygon",
    //       "coordinates":[ /*...*/ ]
    //   }}
    // }
    var firstLetter = feature.properties.name.charAt(0).toLowerCase();
    return _.extend(feature.properties, {
      id: feature.id,
      letter: firstLetter
    });
  }

  // initialize the countries collection to be used accross modules
  countryList = new CountryList( _.map(countriesGeoJson.features, mapGeoJsonFeatureToRecordProperties));

  // handler to get countries as geoJson
  app.reqres.setHandler('countries:geojson', function(){
    return countriesGeoJson;
  });
  // handler to get countries
  app.reqres.setHandler('countries', function(){
    return countryList;
  });

  // handler to get a random country out of current collection
  app.reqres.setHandler('countries:next', function(){
    // shuffle to get a random order
    return countryList.shuffle()[0];
  });
});
