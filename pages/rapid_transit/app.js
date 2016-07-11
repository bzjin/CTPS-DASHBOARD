var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.geo.json")
	.defer(d3.json, "../../JSON/MBTA_NODE.geojson")
	.defer(d3.json, "../../JSON/red_line_boardings.json")
	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1], results[2]);
		//CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mapcSubregions, mbta_nodes, red_line_boardings) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var projScale = 90000,
	projXPos = -200,
	projYPos = 3000;

var projection = d3.geo.conicConformal()
.parallels([41 + 43 / 60, 42 + 41 / 60])
.rotate([71 + 30 / 60, -41 ])
.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
.translate([projXPos, projYPos]);

var geoPath = d3.geo.path().projection(projection);

red_line_boardings.forEach(function(i){
	mbta_nodes.features.forEach(function(j){
		if (i.station == j.properties.STATION) { 
			i.coordinates = j.geometry.coordinates;
			//console.log(i.coordinates)
		}
	})
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

var nodesSVG = svgContainer.selectAll(".nodes")
		.data(red_line_boardings)
		.enter()
		.append("circle")
			.attr("class", function(d) { return "nodes"})
			.attr("cx", function(d) { if (d.coordinates != undefined) {return projection(d.coordinates)[0]}; })
			.attr("cy", function(d) { if (d.coordinates != undefined) {return projection(d.coordinates)[1]}; })
			.attr("r", function(d) { return d.boardings[0]/1000})
			.style("fill", "#ddd")
			.style("opacity", .8)//function(d) { return (d.properties.AM_SPD_IX-.5);})
}