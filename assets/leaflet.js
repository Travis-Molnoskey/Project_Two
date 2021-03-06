
// d3.csv("Resources/breweries.csv").then(function(data){
//     data.forEach(function(d){
//       breweries.push(d.name)
//     })
//   });

function createMap(breweries) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Breweries": breweries
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [41, -96],
      zoom: 4,
      layers: [lightmap, breweries]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(data) {
    console.log(data[0]);
  
    

    // Initialize an array to hold bike markers
    var breweriesMarkers = [];
  
    // Loop through the stations array
    for (var index = 0; index <data.length; index++) {
      var brewery = data[index];

      // console.log(brewery);

//trying to get brewery name instead of id

      // d3.csv("Resources/breweries.csv", function(data){
      //   data.forEach(function(d){
      //     if (brewery.brewery_id === d.id){
      //       brew_name = d.name
      //       console.log(d.name)
      //       console.log(brew_name)
      //     }
      //   });
      // });

      // For each station, create a marker and bind a popup with the station's name
      var breweriesMarker = L.marker([brewery.latitude, brewery.longitude])
        .bindPopup("<h4> Brewery ID: " + brewery.id + `</br>Lat: ${brewery.latitude} </br> Long: ${brewery.longitude}</br>Location Accuracy: ` + brewery.accuracy + "</h4>");
  
      // Add the marker to the breweriesMarkers array
      breweriesMarkers.push(breweriesMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(breweriesMarkers));
  }
  
  
  // Perform an API call to the brewery data to get station information. Call createMarkers when complete
  d3.csv("Resources/breweries_geocode.csv", function(data){
      createMarkers (data);
  });
  