function getColor(mag){
  switch(parseInt(mag)){
      case 0: return '#b7f34d';
      case 1: return '#e1f34d';
      case 2: return '#f3db4d';
      case 3: return '#f3ba4d';
      case 4: return '#f0a76b';
      default: return '#f06b6b';
  }
}

// Query time options
all_hour = "all_hour"
all_day = "all_day"
all_week = "all_week"
all_month = "all_month"
significant_week = "significant_week"
significant_month = "significant_month"

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
  + all_week + ".geojson";

// GET request to query URL
d3.json(url, function(response){
  // create an array of the features array from JSONs
  createFeatures(response.features);
});

// Define map functions
function createFeatures(earthquakeData) {

  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
      fillOpacity: 0.75,
      color: "white",
      stroke: true,
      weight: 1,
      fillColor: getColor(feature.properties.mag),
      radius: feature.properties.mag * 3
  });
  }
  function onEachFeature(feature, layer) {
    // Append nested keys to get to the info
    layer.bindPopup("<h3>" + "Magnitude: " + feature.properties.mag + "</h3>"
    + "<hr><p>" + feature.properties.place + "</p>"
    + "<p>" + new Date(feature.properties.time) + "</p>");
  }
  // GeoJSON layer for features
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define map style layers
  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light", // style of map. https://docs.mapbox.com/vector-tiles/reference/mapbox-streets-v8/
    accessToken: API_KEY
  });

  var streetsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets", // style of map. https://docs.mapbox.com/vector-tiles/reference/mapbox-streets-v8/
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightMap,
    "Street Map": streetsMap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map object
  var myMap = L.map("map", {
    center: [37.09, -95.71], // lat long
    zoom: 4, // Zoom level: https://docs.mapbox.com/help/glossary/zoom-level
    layers: [lightMap, earthquakes] //link to layers
});

  // Create layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  CreateLegend();

  function CreateLegend(){
      var legend = L.control({position: "bottomright"});
      legend.onAdd = function(){
          var div = L.DomUtil.create("div","info legend");
          var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
          var legends = [];
  
          for(var i=0;i<labels.length;i++){
              legends.push("<li style=\"list-style-type:none;\"><div style=\"background-color: " + getColor(i) + "\">&nbsp;</div> " + 
              "<div>" + labels[i] + "</div></li>");}
              div.innerHTML += "<ul class='legend'>" + legends.join("") + "</ul>";
              return div;
          };
  
          legend.addTo(myMap);
      
  }

}

