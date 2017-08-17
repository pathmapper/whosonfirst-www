// Add a Mapzen API key
// To generate your key, go to https://mapzen.com/developers/
var api_key = 'mapzen-aetZmeQ';

var chosenlocation = [37.539619,127.009676,102026327,13,"Seoul"]

var map = L.Mapzen.map('map', {
    maxZoom: chosenlocation[3],
    scrollWheelZoom: false,
    tangramOptions: {
        scene: {
            import: [
                'https://mapzen.com/carto/refill-style/8/refill-style.zip', 'https://mapzen.com/carto/refill-style/8/themes/color-gray.zip',
				'https://mapzen.com/carto/refill-style/8/themes/detail-1.zip'
			],
            global: {
                sdk_mapzen_api_key: api_key,
                sdk_building_extrude: 'false'
            }
        }
    }
});

var lat = chosenlocation[0];
var lon = chosenlocation[1];
map.setView([lat, lon], chosenlocation[3]);

// How we should handle each API result
var show_plane = function(place) {
	$.get(place['mz:uri'], function(result) {
		L.geoJSON(result, {style: function (feature) {
			randomNumber1 = 86+Math.ceil(Math.random()*100);
			color = "rgb("+randomNumber1+","+randomNumber1+","+randomNumber1+")"
			return {color: '#888888', weight: 1, opacity: '.7', fillColor: color, fillOpacity: .5};
		}}).addTo(map);
	});
}

// NOOP (we are using onprogress instead)
var onsuccess = function() { return; };

// Just log errors to the JS console
var onerror = function(rsp) {
    console.error(rsp);
};

// Take all the API results and show them on the map
var onprogress = function(rsp) {
    //console.log(rsp);
	for (var i = 0; i < rsp.places.length; i++) {
        var place = rsp.places[i];
		console.log(place['mz:uri']);
        show_plane(place);
	}
};

function runWhosOnFirstAPI() {
    // Setup the API key
    mapzen.whosonfirst.api.set_handler('authentication', function() {
        return api_key;
    });
    // Get all the venues in the Flatiron District
    // See: https://mapzen.com/documentation/wof/methods/#whosonfirst.places.getDescendants
    var parent_id = chosenlocation[2];
    var method = 'whosonfirst.places.getDescendants';
    var data = {
        id: parent_id,
        per_page: 500,
        extras: 'mz:uri,geom:latitude,geom:longitude', // this gets us lat/lng coords
		placetype: 'neighbourhood'
    };
    // Ok now we actually call the API
    mapzen.whosonfirst.api.execute_method_paginated(method, data, onsuccess, onerror, onprogress);
};