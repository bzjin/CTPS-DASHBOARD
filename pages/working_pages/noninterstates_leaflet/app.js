var mymap = L.map('mapid').setView([42.35402, -71.0895], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w'
}).addTo(mymap);

var origTopoJSON = d3.json("../../noninterstate_2015.topojson", function(error, results){ 
	var data = results;
	var noninterstates = topojson.feature(data, data.objects.mpo_nhs_noninterstate_2015).features;

	L.geoJson(noninterstates, {
		style: function(feature) { 
			switch (parseInt(feature.properties.PSI)) { 
				case 0: return {color: "#EE3B3B"};
				case 1: return {color: "#EE3B3B"};
				case 2: return {color: "#FFD53E"};
				case 3: return {color: "#E3FF30"};
				case 4: return {color: "#00B26F"};
				case 5: return {color: "#00B26F"};
				default: return {color: "black"}
			}
		}
	}).addTo(mymap);

})




