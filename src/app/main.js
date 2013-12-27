/* global fitText */
/* global $ */
/* global _ */
/* global L */
/* global Mousetrap */
/* global FastClick */

// var fitText = require('fittext');
// var $ = require('jquery');
// var _ = require('underscore');
// var L = require('leaflet');
// var Mousetrap = require('mousetrap');
// var FastClick = require('fastclick');


// create a map in the "map" div, set the view to a given place and zoom
var map;
var countriesLayer;
var countriesNames;
var defaultColor = '#FF3366';
var highligtColor = '#FF6633';
var mapOptions = {

  // boundaries
  maxZoom: 4,
  minZoom: 1,

  // Germany
  center: { lat: 43, lng: 0 },

  // hide zoom controls
  zoomControl: false
};

// init map
map = L.map('map', mapOptions);

function style( /* feature */ ) {
  return {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.95,
    fillColor: defaultColor
  };
}

function onEachFeature( /* feature, layer */ ) {
  // layer.on({
  //   click: function(event) {
  //     var layer = event.target
  //     // alert(layer.feature.properties.name)

  //     map.setView(layer.getBounds().getCenter())
  //     highlight(layer);
  //   }
  // });
}

// add layer with countries
countriesLayer = L.geoJson(countries, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

countriesNames = _(countriesLayer.getLayers())
    .map(function(layer) {
      return layer.feature.properties.name;
    });

setTimeout(goToRandomLayer, 300);

// show world map
// map.fitBounds(countriesLayer.getBounds());

var currentLayer;
function highlight(layer) {
  layer.setStyle({ fillColor: highligtColor });
  if (currentLayer) {
    currentLayer.setStyle({ fillColor: defaultColor });
  }
  currentLayer = layer;
}

function goToRandomLayer() {
  var layer = _.sample(countriesLayer.getLayers());
  var options = { pan: { animate: true} };
  map.fitBounds(layer.getBounds(), options);
  map.panBy([0, 70]);
  highlight(layer);
  showOptionsFor(layer);
}

var $options = $('#options');
function showOptionsFor (layer) {
  var optionsHtml = [];
  var currentCountryName = layer.feature.properties.name;
  var countriesMappedByLetter = {};
  var countriesNamesOptions;
  countriesMappedByLetter[currentCountryName[0].toLowerCase()] = currentCountryName;

  // shuffle country names
  countriesNames = _.shuffle(countriesNames);

  countriesNamesOptions = _(countriesNames).chain()
      .reduce(function(countriesMappedByLetter, countryName) {
        var currentLetter = countryName[0].toLowerCase();

        // do only allow one country per letter
        if (countriesMappedByLetter[currentLetter]) {
          return countriesMappedByLetter;
        }

        // do only allow for max. 4 options
        if (_.values(countriesMappedByLetter).length === 4) {
          return countriesMappedByLetter;
        }

        //
        countriesMappedByLetter[currentLetter] = countryName;

        return countriesMappedByLetter;
      }, countriesMappedByLetter)
      .values()
      .value();

  // show 4 random options
  optionsHtml = _(countriesNamesOptions).chain()
      .sort()
      .map(function(countryName) {
        var firstLetter = countryName[0].toLowerCase();
        return '<b accesskey="'+firstLetter+'">' + countryName + '</b>';
      })
      .reduce(function(memo, buttonHtml) {
        return memo + buttonHtml;
      }, '')
      .value();

  $options.html( optionsHtml );
}

$options.on('click', 'b', function() {
  var $button = $(this);
  var selectedCountryName = $button.text();
  if (selectedCountryName === currentLayer.feature.properties.name) {
    var $answer = $('<div id="answer">'+selectedCountryName+'</div>');
    $answer.appendTo(document.body);
    fitText($answer[0], 1.2);
    $answer.addClass('animated bounceOut');
    setTimeout( $.proxy( $answer.remove, $answer), 1000);
    setTimeout( goToRandomLayer, 700);
    return;
  }
  $button.siblings().removeClass('active');
  $button.addClass('animated shake active');
  setTimeout($.proxy( $button.removeClass, $button), 1000, 'animated shake');
});

// keyboard shortcuts to select options by first letter
var allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
_(allLetters).each(function(letter) {
  Mousetrap.bind( letter , function() {
    $options.find('[accesskey="'+letter+'"]').eq(0).trigger('click');
  });
});

// additional shortcuts to select options by number
Mousetrap.bind('1', function() {
  $options.find('b').eq(0).trigger('click');
});
Mousetrap.bind('2', function() {
  $options.find('b').eq(1).trigger('click');
});
Mousetrap.bind('3', function() {
  $options.find('b').eq(2).trigger('click');
});
Mousetrap.bind('4', function() {
  $options.find('b').eq(3).trigger('click');
});

// disable scrolling of root element as our app is fullscreen.
// As a side effect, that prevents the bouncing on touch devices,
// when trying to scroll beyond the visible canvas.
document.ontouchmove = function(event){
  event.preventDefault();
};

// Polyfill to remove click delays on browsers with touch UIs
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// enable Leaflet keyboard shortcuts (+/-)
$('#map').focus();
