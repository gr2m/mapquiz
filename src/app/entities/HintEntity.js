define([
  'app',
  'models/Hint'
], function (app, Hint) {
  'use strict';

  var hint;

  // create & return a new hint for the passed country
  app.reqres.setHandler('hint:new', function(country){
    hint = Hint.newFromCountry(country);
    return hint;
  });

  // get current hint if present
  app.reqres.setHandler('hint:current', function(){
    return hint;
  });

  // when requesting next country, remove the hint;
  app.vent.on('next', function() {
    if (hint) {
      hint.destroy();
      hint = undefined;
    }
  });
});
