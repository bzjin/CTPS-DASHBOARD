var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.geo.json")
	.defer(d3.json, "../../JSON/MBTA_NODE.geojson")
	.defer(d3.json, "../../JSON/red_line_boardings.json")
	.defer(d3.json, "../../JSON/green_line_boardings.json")
	.defer(d3.json, "../../JSON/blue_line_boardings.json")
	.defer(d3.json, "../../JSON/orange_line_boardings.json")
	.defer(d3.csv, "../../JSON/bus_route_1.csv")

	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMBTA(results[0],results[1], results[2], results[3], results[4], results[5]);
		CTPS.demoApp.generateRoute1(results[6]);
		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMBTA = function(mapcSubregions, mbta_nodes, red, green, blue, orange) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var projScale = 120000,
	projXPos = -600,
	projYPos = 3850;

var projection = d3.geo.conicConformal()
.parallels([41 + 43 / 60, 42 + 41 / 60])
.rotate([71 + 30 / 60, -41 ])
.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
.translate([projXPos, projYPos]);

var geoPath = d3.geo.path().projection(projection);
var toParse = [red, green, blue, orange];
var allLines = [];

toParse.forEach(function(k){
	k.forEach(function(i){
		mbta_nodes.features.forEach(function(j){
			if (i.station == j.properties.STATION) { 
				i.coordinates = j.geometry.coordinates;
				i.line = j.properties.LINE;
			}
		})
		allLines.push(i);
	})
})

// SVG Viewport
var svgContainer = d3.select("#mapMBTA").append("svg")
	.attr("width", "100%")
	.attr("height", 700);

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
		.data(allLines)
		.enter()
		.append("circle")
			.attr("class", function(d) { return "nodes"})
			.attr("cx", function(d) { return projection(d.coordinates)[0]} )
			.attr("cy", function(d) { return projection(d.coordinates)[1]} )
			//.attr("r", function(d) { return Math.sqrt(d.boardings[0])/10})
			.style("stroke", function(d){
				if (d.line == "RED") { return "red"}
				if (d.line == "BLUE") { return "blue"}
				if (d.line == "GREEN") { return "green"}
				if (d.line == "ORANGE") { return "orange"}
			})
			.style("stroke-width", 1)
			.style("fill", "none")
			.style("opacity", .8)//function(d) { return (d.properties.AM_SPD_IX-.5);})

	var index = 0;

for (var i = 0; i < 9; i++) { 
	nodesSVG.transition()
		.delay(i*1000)
		.duration(1000)
		.ease("linear")
		.attr("r", function(d) { return d.boardings[i]/1000})
}

var stationNames = svgContainer.selectAll(".stationNames")
		.data(allLines)
		.enter()
		.append("text")
			.attr("class", function(d) { return "stationNames"})
			.text(function(d) { return d.station; })
			.attr("x", function(d) { 
				if (d.line == "ORANGE") {
					return projection(d.coordinates)[0] - 20;
				} else {
					return projection(d.coordinates)[0] + 20;
				}})
			.attr("y", function(d) { return projection(d.coordinates)[1] + 3} )
			.style("text-anchor", function(d){
				if (d.line == "ORANGE") {
					return "end";
				} else {
					return "start";
				}})
			.style("fill", "#ddd")
			.style("font-weight", 300)
			.style("opacity", .2)
			.style("font-size", 10)
}

CTPS.demoApp.generateRoute1 = function(route1) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var minmax = [];

route1.forEach(function(i){
	minmax.push(i.Stime)
	i.AvgEarliness = parseFloat(i.AvgEarliness);
})

// SVG Viewport
var routeChart = d3.select("#busses").append("svg")
	.attr("width", "100%")
	.attr("height", 600);

var colorKey = ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"];
var stopKey = ["Dudly", "Melwa", "Wasma", "masta", "hynes", "mit", "cntsq", "maput", "hhgat"];

var xScale = d3.scale.ordinal().domain(minmax).rangePoints([50, 1000]);
var yScale = d3.scale.linear().domain([-3000, 900]).range([550, 50]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom"); 
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

routeChart.append("g").attr("class", "axis")
	.attr("transform", "translate(0," + yScale(0) + ")")
	.style("font-size", "10px")
	.call(xAxis).selectAll("text").remove();

routeChart.append("g").attr("class", "axis")
	.attr("transform", "translate(50, 0)")
	.style("font-size", "12px")
	.call(yAxis); 

routeChart.selectAll(".stops")
	.data(route1)
	.enter()
	.append("circle")
		.attr("class", "stops")
		.attr("cx", function(d) { return xScale(d.Stime)})
		.attr("cy", function(d) { if (!isNaN(d.AvgEarliness)) {return yScale(d.AvgEarliness);}})
		.attr("r", 1)
		.style("fill", function(d) { return colorKey[stopKey.indexOf(d.Timepoint)]})

}