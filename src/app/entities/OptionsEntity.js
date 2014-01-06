define([
  'app',
  'collections/OptionList'
], function (app, OptionList) {
  'use strict';

  var optionList;

  // initialize the countries collection to be used accross modules
  // as an empty list
  optionList = new OptionList();

  // handler to get 3 random country names next to the correct answer
  app.reqres.setHandler('options', function(){
    return optionList;
  });

  // when requesting next country, update the list of options
  app.vent.on('next', function(country) {
    var countryList = app.request('countries');

    optionList.reloadForCountry(countryList.shuffle(), country);
  });
});
