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
    reloadForCountry: function(countryList, country) {
      var correctOption = parseCountry(country);
      var options = getFromCountryList(countryList, correctOption, numOptions);
      this.reset( options );

      // return sorted options
      return this;
    }
  }, {
    // class Methods

    // map country models by first letter. That
    // will assure that only one country is present
    // per first letter.
    fromCountryList: function(countryList) {
      var models = countryList.map( function(country) {
        var name = country.get('name');
        return {
          id: name.charAt(0).toLowerCase(),
          name: name
        };
      });

      return new this(models);
    }
  });

  // private

  // turn country model into Option model
  var parseCountry = function(country) {
    var name = country.get('name');
    return {
      id: name.charAt(0).toLowerCase(),
      name: name
    };
  };

  // get options from countryList, mapped by first letter,
  // but without the letter for wantedCountry
  var getFromCountryList = function(countryList, wantedCountry, length) {
    var countriesByLetter = {};
    countriesByLetter[wantedCountry.id] = _.extend(wantedCountry, {isCorrect: true});

    return countryList.chain()
      .map( parseCountry )
      .reduce(function (countriesByLetter, country) {

        // do only allow one country per letter
        if (countriesByLetter[country.id]) {
          return countriesByLetter;
        }

        // do only allow for max. 4 options
        if (_.values(countriesByLetter).length === length) {
          return countriesByLetter;
        }

        //
        countriesByLetter[country.id] = country;

        return countriesByLetter;
      }, countriesByLetter)
      .values()
      .value();
  };

  return OptionList;
});
