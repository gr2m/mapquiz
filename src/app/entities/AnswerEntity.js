define([
  'app',
  'models/Answer'
], function (app, Answer) {
  'use strict';

  var answer = new Answer();

  // get current answer if present
  app.reqres.setHandler('answer', function(){
    return answer;
  });

  // when requesting next country, (re)initialize answer
  app.vent.on('next', function(country) {
    answer.resetFromCountry(country);
  });
});
