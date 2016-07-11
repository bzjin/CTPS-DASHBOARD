var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.geo.json")
	.defer(d3.json, "../../JSON/CMP_2014_EXP_ROUTES_MPO_ONLY.geojson")
	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
		CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTimes(results[1]);
		CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mapcSubregions, interstateRoads) {	
	CTPS.demoApp.generateMap = function(mapcSubregions, interstateRoads) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var projScale = 45000,
		projXPos = 100,
		projYPos = 1720;

	var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos]);
	
	var geoPath = d3.geo.path().projection(projection);
	var geoPathS = d3.geo.path().projection(projectionS);
	var geoPathW = d3.geo.path().projection(projectionW);

	var maxmin = []; 
	interstateRoads.features.forEach(function(i) { 
		maxmin.push(i.properties.AM_SPD_IX);
	})

	// SVG Viewport
	var svgContainer = d3.select("#mapMBTA").append("svg")
		.attr("width", "100%")
		.attr("height", 800);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 150])
	  .html(function(d) {
	  	return null;
	  })

	svgContainer.call(tip); 

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(mapcSubregions.features)
		.enter()
		.append("path")
			.attr("class", "subregion")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);
}