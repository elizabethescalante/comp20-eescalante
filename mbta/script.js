var map;
var lastOpenInfoWindow;

var redLine = new Object()
redLine.Alefwife = { lat: 42.3954, lng: -71.1425, id: 'place-alfcl' };
redLine.DavisSquare = { lat: 42.397, lng: -71.1231, id: 'place-davis' };
redLine.PorterSquare = { lat: 42.3884, lng: -71.1191, id: 'place-portr' };
redLine.HarvardSquare = { lat: 42.3734, lng: -71.119, id: 'place-harsq' };
redLine.CentralSquare = { lat: 42.3652, lng: -71.1036, id: 'place-cntsq' };
redLine.KendallMIT = { lat: 42.3622, lng: -71.0862, id: 'place-knncl' };
redLine.CharlesMGH = { lat: 42.3611, lng: -71.0705, id: 'place-chmnl' };
redLine.ParkStreet = { lat: 42.3564, lng: -71.0623, id: 'place-pktrm' };
redLine.DowntwonCrossing = { lat: 42.3555, lng: -71.0603, id: 'place-dwnxg' };
redLine.SouthStation = { lat: 42.3519, lng: -71.0551, id: 'place-sstat' };
redLine.Broadway = { lat: 42.3426, lng: -71.0569, id: 'place-brdwy' };
redLine.Andrew = { lat: 42.3302, lng: -71.0577, id: 'place-andrw' };
redLine.JFKUmass = { lat: 42.3206, lng: -71.0524, id: 'place-jfk' };
redLine.NorthQuincy = { lat: 42.2758, lng: -71.0302, id: 'place-nqncy' };
redLine.Wollaston = { lat: 42.2668, lng: -71.0205, id: 'place-wlsta' };
redLine.QuincyCenter = { lat: 42.252, lng: -71.0055, id: 'place-qnctr' };
redLine.QuincyAdams = { lat: 42.2333, lng: -71.0071, id: 'place-qamnl' };
redLine.Braintree = { lat: 42.2073, lng: -71.0014, id: 'place-brntn' };
redLine.SavinHill = { lat: 42.3113, lng: -71.0533, id: 'place-shmnl' };
redLine.FieldsCorner = { lat: 42.2999, lng: -71.0619, id: 'place-fldcr' };
redLine.Shawmut = { lat: 42.2931, lng: -71.0658, id: 'place-smmnl' };
redLine.Ashmont = { lat: 42.2845, lng: -71.0637, id: 'place-asmnl' };

const values = Object.values(redLine);
const keys = Object.keys(redLine);

// Initialize map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 42.3519, lng: -71.0551 },
    zoom: 11
  })

  setRedLine();
  geolocate();
}

// Set up the entire Red Line structure
function setRedLine() {
  var main = values.slice(0, 13);
  var braintree = values.slice(12, 18);
  var jfk = values.slice(12, 13);
  var others = values.slice(18, 22);
  var ashmont = jfk.concat(others);
  makeLines(main);
  makeLines(braintree);
  makeLines(ashmont);

  makeMarkers(values);
}

// Make polylines given stations
function makeLines(stations) {
  var redLine = new google.maps.Polyline({
    path: stations,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  })
  redLine.setMap(map);
}

function makeMarkers(stations) {
	var image = {
    url: 'subway-icon.png',
    scaledSize: new google.maps.Size(25, 25)
  }

  stations.map(function(station) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(station.lat, station.lng),
      map: map,
      icon: image
    })

    getTrainDetails(station, function(stationTrainsData) {
      var infoWindow = createInfoWindow(stationTrainsData)
      marker.addListener('click', function() {
        lastOpenInfoWindow && lastOpenInfoWindow.close();
        infoWindow.open(map, marker);
        lastOpenInfoWindow = infoWindow;
      })
    })
  })
}

// Get the data
function getTrainDetails(station, callback) {
  fetchJson(formatMBTAUrl(station), function(theData) {
    var trainsData = theData.data;
    var formattedData = [];
    for (i = 0; i < trainsData.length; i++) {
    	if (trainsData[i].attributes.arrival_time) {
    		var time = trainsData[i].attributes.arrival_time.slice(11,19);
    		var direction = trainsData[i].attributes.direction_id;
    		if (direction == 1) {
    			direction = "Ashmont/Braintree"
    		} else {
    			direction = "Alewife"
    		}

    		formattedData.push({direction: direction, time: time});
    	}	
    }
    callback(formattedData);
  })
}

// Create the infowindow given the data for a station
function createInfoWindow(trainsData) {
  var infoWindow = new google.maps.InfoWindow()
  var schedule = "";
  for (i = 0; i < trainsData.length; i++) {
  	schedule += '<p>' + trainsData[i].direction + ': ' + trainsData[i].time + '</p>';
  }
  var content = '<h1>Upcoming Trains</h1>' + schedule;
  infoWindow.setContent(content);

  return infoWindow;
}

// Actually get the JSON data using XHR
function fetchJson(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', function() {
    callback(JSON.parse(request.responseText))
  })
  request.send();
}

// Format the URL for each station for the XHR request to MBTA API
function formatMBTAUrl(station) {
  return (
    'https://api-v3.mbta.com/predictions?filter[route]=Red&filter[stop]=' +
    station.id +
    '&page[limit]=10&page[offset]=0&sort=departure_time&api_key=' +
    '68b3f1f8e4ef40b48e2bcaabe8efb68c'
  );
}

// Geolocation
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation);
  } else {
    alert('Geolocation not supported');
  }
}

// Get geolocation and put a marker there
function showLocation(pos) {
  var location = pos.coords
  var locationMarker = new google.maps.Marker({
    position: new google.maps.LatLng(location.latitude, location.longitude),
    map: map
  })

  var center = new google.maps.LatLng(location.latitude, location.longitude);
  map.setCenter(center);
  map.setZoom(13);

  showCloseStation(location, locationMarker);
}

function showCloseStation(location, locationMarker) {
  // Find closest station
  var myLocation = new google.maps.LatLng(location.latitude, location.longitude);
  var position = new google.maps.LatLng(values[0].lat, values[0].lng);
  var minDistance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, position);
  var minIndex = 0;
  for (i = 0; i < values.length; i++) {
    position = new google.maps.LatLng(values[i].lat, values[i].lng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, position);
    if (distance < minDistance) {
      minDistance = distance;
      minIndex = i;
    }
  }

  minDistance = Math.round(minDistance / 1609.344 * 100) / 100;

  var coords = [myLocation, values[minIndex]];
  var myLine = new google.maps.Polyline({
    path: coords,
    geodesic: true,
    strokeColor: '#00358c',
    strokeOpacity: 1.0,
    strokeWeight: 2
  })
  myLine.setMap(map);

  var infowindow = new google.maps.InfoWindow({
    content:
      '<p>Closest Red Line Station: ' + keys[minIndex] + 
      '</p><p>Distance away: ' + minDistance + ' miles</p>'
  })

  locationMarker.addListener('click', function() {
    infowindow.open(map, locationMarker);
  })
}