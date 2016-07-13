var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

		var start = new Date(); 

//Using the queue.js library
queue()
	.defer(d3.csv, "../../JSON/sidewalk_and_bike_facility_mileage.csv")
	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		var finish = new Date(); 
		console.log( finish-start);
		CTPS.demoApp.generateSidewalk(results[0]);
		//CTPS.demoApp.generateBikeTrails(results[0]);

		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateSidewalk = function(allData) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
// SVG Viewport

var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.linear().domain([0, 100, 800]).range(["#d8b365","#191b1d","#5ab4ac"]);

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.SIDEWALK_MI; });

var div = d3.select("#sidewalks").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

var sidewalks = { "name": "Sidewalks", "children": allData };

var node = div.datum(sidewalks).selectAll(".node")
  .data(treemap.nodes)
.enter().append("div")
  .attr("class", "node")
  .call(position)
  .style("background", function(d) { return color(d.SIDEWALK_MI); })
  .text(function(d) { return d.children ? null : d.name; });

d3.selectAll("input").on("change", function change() {
var value = this.value === "count"
    ? function() { return 1; }
    : function(d) { return d.SIDEWALK_MI; };

node
    .data(treemap.value(value).nodes)
  .transition()
    .duration(1500)
    .call(position);
});

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

}//GenerateSidewalk end

CTPS.demoApp.generateBikeTrails = function(allData) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var svgContainer = d3.select("#bikeTrails").append("svg")
	.attr("width", "100%")
	.attr("height", 500);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 150])
  .html(function(d) {
  	return null;
  })

svgContainer.call(tip); 

}