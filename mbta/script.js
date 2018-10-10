// Initialize map: red line, subway icons, centered at soutb station
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 42.3519, lng: -71.0551},
    	zoom: 11,
    	mapTypeId: 'terrain'
    });
}
