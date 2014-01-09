define([
  'app',
  'collections/ControlList'
], function (app, ControlList) {
  'use strict';

  var controlList;

  // initialize the countries collection to be used accross modules
  // as an empty list
  controlList = new ControlList();

  // handler to get 3 random country names next to the correct answer
  app.reqres.setHandler('controls', function(){
    return controlList;
  });

  // get a hint for current controls
  app.reqres.setHandler('controls:correct', function(){
    return controlList.findWhere({isWanted: true});
  });

  // get a hint for current controls
  app.reqres.setHandler('controls:afterhint', function(country, hint) {
    var countryList = app.request('countries');
    controlList.reloadForHint(countryList.shuffle(), country, hint);
  });

  // when requesting next country, update the list of controls
  app.vent.on('next', function(country) {
    var countryList = app.request('countries');

    controlList.reloadForCountry(countryList.shuffle(), country);
  });
});
