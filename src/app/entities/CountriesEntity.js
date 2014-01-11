define([
  'app',
  'data/countries',
  'collections/CountryList',
  'collections/ControlList',
  'lodash'
], function (app, countriesGeoJson, CountryList, ControlList, _) {
  'use strict';

  var countryList;
  var currentCountry;

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
    return _.extend(feature.properties, {
      id: feature.id
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
    currentCountry = countryList.chain()
      .without(currentCountry)
      .shuffle()
      .first().value();
    return currentCountry;
  });

  // handler to get a random country out of current collection
  app.reqres.setHandler('countries:current', function(){
    return currentCountry;
  });
});
