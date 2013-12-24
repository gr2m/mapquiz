// create a map in the "map" div, set the view to a given place and zoom
var map;
var countriesLayer;
var southWest = L.latLng(180, -60);
var northEast = L.latLng(-180, 180);
var maxBounds = L.latLngBounds(southWest, northEast);
var defaultColor = '#FF3366';
var highligtColor = '#FF6633';

var options = {

  // boundaries
  maxZoom: 4,
  minZoom: 1,
  // maxBounds: maxBounds

  // Germany
  center: { lat: 43, lng: 0 },

  // hide zoom controls
  zoomControl: false
}
map = L.map('map', options)

countriesLayer = L.geoJson(countriesGeoJson, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// show world map
// map.fitBounds(countriesLayer.getBounds());

function style(feature) {
  return {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.95,
    fillColor: defaultColor
  };
}


function onEachFeature(feature, layer) {
  // layer.on({
  //   click: function(event) {
  //     var layer = event.target
  //     // alert(layer.feature.properties.name)

  //     map.setView(layer.getBounds().getCenter())
  //     highlight(layer);
  //   }
  // });
};

var currentLayer;
function highlight(layer) {
  layer.setStyle({ fillColor: highligtColor })
  if (currentLayer) {
    currentLayer.setStyle({ fillColor: defaultColor })
  }
  currentLayer = layer
}

function goToRandomLayer() {
  var layer = _.sample(countriesLayer.getLayers())
  var options = { pan: { animate: true} }
  map.fitBounds(layer.getBounds(), options);
  map.panBy([0, 70])
  highlight(layer);
  showOptionsFor(layer);
}

var $options = $('#options');
function showOptionsFor (layer) {
  var optionsHtml = []
  var currentCountryName = layer.feature.properties.name;

  // show 4 random options
  optionsHtml = _(countriesLayer.getLayers()).chain()
  .sample(4)
  .map(function(layer) {
    return layer.feature.properties.name
  })
  .union([currentCountryName])
  .last(4)
  .shuffle()
  .map(function(countryName) {
    return '<b>' + countryName + '</b>'
  })
  .reduce(function(memo, buttonHtml) {
    return memo + buttonHtml;
  }, '')
  .value();

  $options.html( optionsHtml );

  // replace one of them with correct answer
  $options.eq( _.random(3) ).text(  )
}

$options.on('click', 'b', function() {
  var $button = $(this)
  var selectedCountryName = $button.text()
  if (selectedCountryName === currentLayer.feature.properties.name) {
    $button.blur()
    return goToRandomLayer()
  }
  $button.siblings().removeClass('active')
  $button.addClass('animated shake active')
  setTimeout($.proxy( $button.removeClass, $button), 1000, 'animated shake')
});

// keyboard shortcuts
Mousetrap.bind('1', function() {
  $options.find('b').eq(0).trigger('click')
});
Mousetrap.bind('2', function() {
  $options.find('b').eq(1).trigger('click')
});
Mousetrap.bind('3', function() {
  $options.find('b').eq(2).trigger('click')
});
Mousetrap.bind('4', function() {
  $options.find('b').eq(3).trigger('click')
});

setTimeout(goToRandomLayer, 300)

document.ontouchmove = function(event){
    event.preventDefault();
}
FastClick.attach(document.body);

$('#map').focus()