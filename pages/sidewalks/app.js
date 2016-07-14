var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/sidewalks_over_time.json")
	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 

		CTPS.demoApp.generateSidewalk(results[0]);
		//CTPS.demoApp.generateBikeTrails(results[0]);

		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateSidewalk = function(allData) {	
  console.log(allData)
// Show name of MAPC Sub Region
// Define Zoom Behavior
// SVG Viewport
var timeline = d3.select("#sidewalks").append("svg")
    .attr("width", "100%")
    .attr("height", 550)

var towns = [];
var capitalized = [];
allData.forEach(function(i){
  if (towns.indexOf(i) == -1) {
    towns.push(i.town);
    capitalized.push(i.town.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}))
  }
})

console.log(capitalized);

var colorToYear = d3.scale.linear().domain([2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]).range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]);
xScale = d3.scale.linear().domain([0, 1.8]).range([150, 1000]);
yNames = d3.scale.ordinal().domain(capitalized).rangePoints([50, 1000]);
yScale = d3.scale.ordinal().domain(towns).rangePoints([50, 1150]);

var xAxis = d3.svg.axis().scale(xScale).orient("top").tickSize(-1000, 0, 0);
var yAxis = d3.svg.axis().scale(yNames).orient("left").tickSize(-850, 0, 0);

timeline.append("text")
    .attr("x", 400)
    .attr("y", 20)
    .style("font-weight", 300)
    .text("Sidewalk per Center Lane Mile")

timeline.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 450)")
    .call(xAxis)
  
timeline.append("g").attr("class", "axis")
    .attr("transform", "translate(150, 0)")
    .call(yAxis)
    .selectAll("text")
    .attr("transform", "translate(-70, 0)")
    .style("text-anchor", "start")
    .style("font-size", 10);

timeline.selectAll("sidewalks")
  .data(allData)
  .enter()
  .append("rect")
    .attr("class", "sidewalks")
    .attr("x", function(d) { return xScale(Math.ceil(d.sidewalk_to_miles*40)/40)+10;})
    .attr("y", function(d) { return yScale(d.town);})
    .attr("height", 10)
    .attr("width", 10)
    .style("fill", function(d){ return colorToYear(d.year)})
    //.style("fill", "#fdae61")
    .style("opacity", .5)
    .on("mouseenter", function(d){
      console.log(d.town)
    })

/*
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
*/
}