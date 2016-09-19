var mymap = L.map('mapid').setView([42.35402, -71.0895], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w'
}).addTo(mymap);

