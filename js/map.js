//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
 $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });

var CTPS = {};
CTPS.demoApp = {};

var projScale = 60000,
	projXPos = 300,
	projYPos = 2250;

//For projecting the map and municipality boundaries, NB and EB roads
var projection = d3.geoConicConformal()
.parallels([41 + 43 / 60, 42 + 41 / 60])
.rotate([71 + 30 / 60, -41 ])
.scale([projScale]) 
.translate([projXPos, projYPos]);

var geoPath = d3.geoPath().projection(projection);
	
//Using the d3.queue.js library
d3.queue()
	//.defer(d3.json, "data/json/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "js/tractmap.topojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0]);
	}); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(tracts) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
var tracts_map = topojson.feature(tracts, tracts.objects.tract_census_2).features;

	// SVG Viewport
	var svgContainer = d3.select("#map").append("svg")
		.attr("width", 1300)
		.attr("height", 800);

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(tracts_map)
		.enter()
		.append("path")
			//.attr("class", function(d){ return "subregion " + d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
			//.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#d73027")
			.style("fill-opacity", function(d) { return 5 * d.properties.HISPANIC_PCT_2010;})
			.style("stroke-width", 0)
}


