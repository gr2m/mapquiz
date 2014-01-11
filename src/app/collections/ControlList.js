define([
  'backbone',
  'lodash',
  'models/Control'
], function (Backbone, _, Control) {
  'use strict';

  // how many options shall be offered
  var numOptions = 4;

  var ControlList = Backbone.Collection.extend({
    model: Control,

    comparator: 'name',

    // reloads controls basend on the passed country,
    // the other 3 option being letters for real countries
    // as well.
    reloadForCountry: function(countryList, wantedCountry) {
      var models = getFromCountryList(countryList, wantedCountry, numOptions);
      this.reset( models );

      // return sorted options
      return this;
    },

    // reloads controls basend on the passed country and answer.
    // It randomly generates letters for the other controls
    reloadForAnswer: function(countryList, answer) {
      var models = getFromAnswer(countryList, answer, numOptions);
      this.reset( models );

      // return sorted options
      return this;
    },

    guess: function(id) {
      var model = this.get(id);

      if (! model) {
        return;
      }

      if ( model.isWanted() ) {
        this.chain().without(model).each(function(model) {
          model.makeIncorrect();
        });
        model.makeCorrect();
        this.trigger('guess:correct');
        return;
      }

      model.makeIncorrect();
      this.trigger('guess:incorrect');
    }
  });

  // private

  //
  var getFromCountryList = function(countryList, wantedCountry, numOptions) {
    var models;
    var controlsMap = {};
    var control = Control.newFromCountry( wantedCountry );
    control.set('isWanted', true);
    controlsMap[control.id] = control;

    for (var i = 0; i < countryList.length; i++) {
      control = Control.newFromCountry( countryList[i] );

      // do only allow one country per letter
      if (controlsMap[control.id]) {
        continue;
      }

      controlsMap[control.id] = control;

      models = _.values(controlsMap);
      if (models.length === numOptions) {
        return models;
      }
    }
  };

  //
  var vocals = 'aeiou'.split('');
  var consonants = 'bcdfghjklmnpqrstvwxz'.split('');
  var getFromAnswer = function(countryList, answer, numOptions) {
    var models;
    var controlsMap = {};
    var wantedControl = Control.newFromCountry( answer, answer.hintLength() );
    var wantedLetter = answer.wantedLetter();
    var bucket = _.contains(vocals, wantedLetter) ? vocals : consonants;
    wantedControl.set('isWanted', true);
    controlsMap[wantedControl.id] = wantedControl;

    models = _(bucket).chain()
        .without(wantedLetter)
        .sample( numOptions - 1)
        .map( _.bind(Control.newFromLetter, Control) ).value()
        .concat(wantedControl);

    return models;
  };

  return ControlList;
});
