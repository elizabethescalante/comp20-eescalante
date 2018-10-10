// Initialize map: red line, subway icons, centered at soutb station
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 42.3519, lng: -71.0551},
    	zoom: 11,
    	mapTypeId: 'terrain'
    });

// Rendering Red Line
var redLineStationsMain = [
    {lat: 42.3954, lng: -71.1425}, //alewife
    {lat: 42.3970, lng: -71.1231}, //davis
    {lat: 42.3884, lng: -71.1191}, //porter
    {lat: 42.3734, lng: -71.1190}, //harvard
    {lat: 42.3652, lng: -71.1036}, //central
    {lat: 42.3622, lng: -71.0862}, //kendall/mit
    {lat: 42.3611, lng: -71.0705}, //charles/mgh
    {lat: 42.3564, lng: -71.0623}, //park st
    {lat: 42.3555, lng: -71.0603}, //downtown crossing
    {lat: 42.3519, lng: -71.0551}, //south station
    {lat: 42.3426, lng: -71.0569}, //broadway
    {lat: 42.3302, lng: -71.0577}, //andrew
    {lat: 42.3206, lng: -71.0524}  //jfk/umass
];
var redLineStationsBraintree = [
	{lat: 42.3206, lng: -71.0524}, //jfk/umass
    {lat: 42.2758, lng: -71.0302}, //north quincy
    {lat: 42.2668, lng: -71.0205}, //wollaston
    {lat: 42.2520, lng: -71.0055}, //quincy cntr
    {lat: 42.2333, lng: -71.0071}, //quincy adams
    {lat: 42.2073, lng: -71.0014}  //braintree    
];
var redLineStationsAshmont = [
    {lat: 42.3206, lng: -71.0524}, //jfk/umass
    {lat: 42.3113, lng: -71.0533}, //savin hill
    {lat: 42.2999, lng: -71.0619}, //fields corner
    {lat: 42.2931, lng: -71.0658}, //shawmut
    {lat: 42.2845, lng: -71.0637}  //ashmont  
];
        
var redLineMain = new google.maps.Polyline({
    path: redLineStationsMain,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
});
var redLineBraintree = new google.maps.Polyline({
    path: redLineStationsBraintree,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
});
var redLineAshmont = new google.maps.Polyline({
    path: redLineStationsAshmont,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
});

redLineMain.setMap(map);
redLineBraintree.setMap(map);
redLineAshmont.setMap(map);
}