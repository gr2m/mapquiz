define([
  'backbone',
  'lodash',
  'models/Country'
], function (Backbone, _, Country) {
  'use strict';

  // how many options shall be offered
  var numOptions = 4;

  var OptionList = Backbone.Collection.extend({
    model: Country,

    comparator: 'name',

    // returns four country names as options to
    // guess the right from, including the passed
    // country which is the correct answer
    reloadForCountry: function(countryList, wantedCountry) {
      wantedCountry.set('isCorrect', true);
      var models = getFromCountryList(countryList, wantedCountry, numOptions);
      this.reset( models );

      // return sorted options
      return this;
    }
  });

  // private

  // get options from countryList
  var getFromCountryList = function(countryList, wantedCountry, length) {
    var country;
    var models;
    var countriesByLetter = {};
    countriesByLetter[wantedCountry.get('letter')] = wantedCountry;

    for (var i = 0; i < countryList.length; i++) {
      country = countryList[i];

      // do only allow one country per letter
      if (countriesByLetter[country.get('letter')]) {
        continue;
      }

      countriesByLetter[country.get('letter')] = country;

      models = _.values(countriesByLetter);
      if (models.length === length) {
        return models;
      }
    }
  };

  return OptionList;
});
