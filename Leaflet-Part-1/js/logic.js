
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Pull Data
d3.json(queryUrl).then(function (data) {
  // Console log the data retrieved 
  console.log(data);

  createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 2000;
};

// Function to determine marker color by depth
function chooseColor(depth){
  if (depth < 10) return "#00FF00";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "#FF0000";
} 

function createFeatures(earthquakeData) {


  // Give each feature a popup that describes the place and time of the earthquake.
  function featurepopup(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: featurepopup,

    // Point to layer used to alter markers
    pointToLayer: function(feature, latlng) {

      // Style of markers
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });

  // Create earthquakes layer
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create gray tile layer
  let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style:    'mapbox/light-v11',
    access_token: apikey
  });

  // Create map with grayscale and earthquakes
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [grayscale, earthquakes]
  });

  // Add legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
  depths = [-10, 10, 30, 50, 70, 90];
  div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML += '<i style="background:' + chooseColor(depths[i]+1) + '"></i> ' +
                     depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '&nbsp;' +'<br>' : '+'+'&nbsp;'+'&nbsp;');
}


  return div;

};

  legend.addTo(myMap);
}
