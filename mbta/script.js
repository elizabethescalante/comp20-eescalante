var map;
var locationMarker;
var stationMarker;

var redLine = new Object();
redLine.Alefwife = {lat: 42.3954, lng: -71.1425};
redLine.DavisSquare = {lat: 42.3970, lng: -71.1231};
redLine.PorterSquare = {lat: 42.3884, lng: -71.1191};
redLine.HarvardSquare = {lat: 42.3734, lng: -71.1190};
redLine.CentralSquare = {lat: 42.3652, lng: -71.1036};
redLine.KendallMIT = {lat: 42.3622, lng: -71.0862};
redLine.CharlesMGH = {lat: 42.3611, lng: -71.0705};
redLine.ParkStreet = {lat: 42.3564, lng: -71.0623};
redLine.DowntwonCrossing = {lat: 42.3555, lng: -71.0603};
redLine.SouthStation = {lat: 42.3519, lng: -71.0551};
redLine.Broadway = {lat: 42.3426, lng: -71.0569};
redLine.Andrew = {lat: 42.3302, lng: -71.0577};
redLine.JFKUmass = {lat: 42.3206, lng: -71.0524};
redLine.NorthQuincy = {lat: 42.2758, lng: -71.0302};
redLine.Wollaston = {lat: 42.2668, lng: -71.0205};
redLine.QuincyCenter = {lat: 42.2520, lng: -71.0055};
redLine.QuincyAdams = {lat: 42.2333, lng: -71.0071};
redLine.Braintree = {lat: 42.2073, lng: -71.0014};
redLine.SavinHill = {lat: 42.3113, lng: -71.0533};
redLine.FieldsCorner = {lat: 42.2999, lng: -71.0619};
redLine.Shawmut = {lat: 42.2931, lng: -71.0658};
redLine.Ashmont = {lat: 42.2845, lng: -71.0637};

const values = Object.values(redLine);
const keys = Object.keys(redLine);

// Initialize map: red line, subway icons, centered at south station
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 42.3519, lng: -71.0551},
    	zoom: 11,
    });

	polyline();
    geolocate();
    closestStation();
}

function polyline() {
	// Rendering Red Line polyline 
	var main = values.slice(0,13);
	var braintree = values.slice(12,18);
	var jfk = values.slice(12,13)
	var others = values.slice(18,22);
	var ashmont = jfk.concat(others);
	lines(main);
	lines(braintree);
	lines(ashmont);

	icons(values);
}

function lines(stations) {
	var redLine = new google.maps.Polyline({
	    path: stations,
	    geodesic: true,
	    strokeColor: '#FF0000',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});
	redLine.setMap(map);
}

function icons(stations) {
	var image = {
		url: 'subway-icon.png',
		scaledSize: new google.maps.Size(25, 25)
	};

	for (i = 0; i < stations.length; i++){
		stationMarker = new google.maps.Marker({
		    position: new google.maps.LatLng(stations[i].lat, stations[i].lng),
		    map: map,
		    icon: image
		});
	};
}

function geolocate() {
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showLocation);
	}
	else {
		alert("Geolocation not supported");
	}
}	

// Get geolocation and put a marker there
function showLocation(pos) {
	var location = pos.coords;
	locationMarker = new google.maps.Marker({
        position: new google.maps.LatLng(location.latitude, location.longitude),
        map: map
    })

	var center = new google.maps.LatLng(location.latitude, location.longitude);
    map.setCenter(center);
    map.setZoom(13);
}

// Find closest station, render a polyline, 
function closestStation() {
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showCloseStation);
	}
	else {
		alert("Geolocation not supported");
	}
}

function showCloseStation(pos) {
	// Find closest station
	myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	position = new google.maps.LatLng(values[0].lat, values[0].lng);
	minDistance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, position);
	minIndex = 0;
	for (i = 0; i < values.length; i++){
		position = new google.maps.LatLng(values[i].lat, values[i].lng);
		distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, position);
		console
		if (distance < minDistance) {
			minDistance = distance;
			minIndex = i;
		}
	};

	minDistance = minDistance/1609.344 * 100;
	minDistance = Math.round(minDistance);
	minDistance = minDistance/100;
	
	// Render a polyline
	var coords = [myLocation, values[minIndex]];
	var myLine = new google.maps.Polyline({
	    path: coords,
	    geodesic: true,
	    strokeColor: '#00358c',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});
	myLine.setMap(map);

	// Infowindow
	var infowindow = new google.maps.InfoWindow({
          content:"<p>Closest Red Line Station: " + keys[minIndex] + "</p>" + "<p>Distance away: " + minDistance + " miles</p>"
    });

    locationMarker.addListener('click', function() {
        infowindow.open(map, locationMarker);
    });
}
