var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "../../JSON/MBTA_NODE.geojson")
	.defer(d3.json, "../../JSON/red_line_boardings.json")
	.defer(d3.json, "../../JSON/green_line_boardings.json")
	.defer(d3.json, "../../JSON/blue_line_boardings.json")
	.defer(d3.json, "../../JSON/orange_line_boardings.json")
	.defer(d3.csv, "../../JSON/bus_route_1.csv")
	//.defer(d3.json, "../../JSON/mbta_bus_route_1.geojson")
	//.defer(d3.json, "../../JSON/mbta_bus_route_1_stops.geojson")


	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMBTA(results[0],results[1], results[2], results[3], results[4], results[5]);
		CTPS.demoApp.generateRoute1(results[6], results[7], results[8]);
		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMBTA = function(cities, mbta_nodes, red, green, blue, orange) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var projScale = 90000,
	projXPos = -400,
	projYPos = 2925;

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
	.attr("height", 500);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 150])
  .html(function(d) {
  	return null;
  })

svgContainer.call(tip); 
console.log(cities.objects.collection.geometries)
// Create Boston Region MPO map with SVG paths for individual towns.
var mapcSVG = svgContainer.selectAll(".subregion")
	.data(topojson.feature(cities, cities.objects.collection).features)
	.enter()
	.append("path")
		.attr("class", "subregion")
		.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
		.attr("d", function(d, i) {return geoPath(d); })
		.style("fill", "#ddd")
		.style("stroke", "#191b1d")
		.style("stroke-width", "1px")
		.style("opacity", .05);

var nodesSVG = svgContainer.selectAll(".nodes")
		.data(allLines)
		.enter()
		.append("circle")
			.attr("class", function(d) { return "nodes"})
			.attr("cx", function(d) { return projection(d.coordinates)[0]} )
			.attr("cy", function(d) { return projection(d.coordinates)[1]} )
			//.attr("r", function(d) { return Math.sqrt(d.boardings[0])/10})
			.style("stroke", function(d){
				if (d.line == "RED") { return "#ff6347"}
				if (d.line == "BLUE") { return "#39B7CD"}
				if (d.line == "GREEN") { return "#26a65b"}
				if (d.line == "ORANGE") { return "#f89406"}
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

//line chart 
var nested_stations = d3.nest()
.key(function(d) { return d.station;})
.entries(allLines);

var mbtaGraph = d3.select("#graphMBTA").append("svg")
.attr("width", "100%")
.attr("height", 500);

var xScale = d3.scale.linear().domain([1999, 2010]).range([100, 450]);
var yScale = d3.scale.linear().domain([0, 25000]).range([450, 50]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5).tickFormat(d3.format("d")); 
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

mbtaGraph.append("g").attr("class", "axis")
	.attr("transform", "translate(0," + yScale(0) + ")")
	.style("font-size", "10px")
	.call(xAxis).selectAll("text").style("font-weight", 300);

mbtaGraph.append("g").attr("class", "axis")
	.attr("transform", "translate(100, 0)")
	.style("font-size", "12px")
	.call(yAxis).selectAll("text").style("font-weight", 300);

var valueline = d3.svg.line()
.interpolate("basis")
.x(function(d, i) { return xScale(i + 1999)})
.y(function(d, i) { return yScale(d)});

console.log(nested_stations);

nested_stations.forEach(function(i){ 
	mbtaGraph.append("path")
	.attr("d", valueline(i.values[0].boardings))
	.style("stroke-width", 1)
	.style("fill", "none")
	.style("stroke", function(){
		if (i.values[0].line == "RED") { return "#ff6347"}
		if (i.values[0].line == "BLUE") { return "#39B7CD"}
		if (i.values[0].line == "GREEN") { return "#26a65b"}
		if (i.values[0].line == "ORANGE") { return "#f89406"}
	})
})

}

CTPS.demoApp.generateRoute1 = function(route1, routes, stops) {	
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

var minmax = [];
var parseTime = d3.time.format("%I:%M:%S %p");

route1.forEach(function(i){
	i.Stime = parseTime.parse(i.Stime);
	i.timeString = parseTime(new Date(i.Stime));
	
	minmax.push(i.Stime);
	i.AvgEarliness = parseFloat(i.AvgEarliness); 
})

// SVG Viewport
//var routeChart = d3.select("#busses").append("svg")
	//.attr("width", "100%")
	//.attr("height", 600);

var colorKey = ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"];
var stopKey = ["Dudly", "Melwa", "Wasma", "masta", "hynes", "mit", "cntsq", "maput", "hhgat"];
var stopKeyFull = ["Dudley Station", "Washington St @ Williams St", "Washington St @ Mass Ave", "Mass Ave Station", "Hynes Station", "MIT", "Central Square", "Mt Auburn St @ Putnam Ave", "Mass Ave @ Holyoke St"];
var stopGradient = [								
            {offset: "0%", color: colorKey[0]},		
            {offset: "10%", color: colorKey[0]},	
            {offset: "20%", color: colorKey[1]},		
            {offset: "30%", color: colorKey[2]},		
            {offset: "40%", color: colorKey[3]},	
            {offset: "50%", color: colorKey[4]},
            {offset: "60%", color: colorKey[5]},
            {offset: "70%", color: colorKey[6]},	
            {offset: "80%", color: colorKey[7]},	
            {offset: "90%", color: colorKey[8]},	
            {offset: "100%", color: colorKey[8]}	
	]
        
/*
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
*/

//Radar chart...
var width = 960,
    height = 600,
    radius = Math.min(width, height) / 2 - 60;

var r = d3.scale.linear().domain([900, -3000]).range([0, radius]);
var deg = d3.scale.linear().domain([new Date("Mon Jan 01 1900 00:00:00 GMT-0500(EST)"), new Date("Mon Jan 01 1900 23:59:59 GMT-0500(EST)")]).range([0, 2 * Math.PI]);

var line = d3.svg.line.radial()
    .radius(function(d) { return r(d.AvgEarliness); })
    .angle(function(d) { return deg(d.Stime); });

var polarStations = d3.select("#busses").append("svg")
	.attr("id", "polarStations")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Color key
var svg2 = d3.select("#polarStations").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("z-index", 1)
    .attr("x", 0)
//Color key
for (var i = 0; i < 9; i++){
	svg2.append("circle")
		.attr("cx", 10)
		.attr("cy", 20 * (i+1))
		.attr("r", 5)
		.style("stroke", colorKey[i])
		.style("stroke-width", 1)
		.style("fill", "none")

	svg2.append("text")
		.text(stopKeyFull[i])
		.attr("x", 20)
		.attr("y", 20 * (i+1) + 5)
		.style("fill", "#fff")
		.style("font-weight", 300)
		.style("font-size", 12)
}

var gr = polarStations.append("g")
    .attr("class", "r axis")
  .selectAll("g")
    .data([600, 300, 0, -600, -1200, -1800, -2400, -3000])
  .enter().append("g");

gr.append("circle")
    .attr("r", r)
    .style("fill", "none")
    .style("stroke", "#fff")
    .style("stroke-width", .5)
    .style("opacity", .5);

gr.append("circle")
    .attr("r", r(0))
    .style("fill", "none")
    .style("stroke", "#fff")
    .style("stroke-width", 1)
    .style("stroke-dasharray", ("3, 3"))
    .style("opacity", 1)

var times = ["12:00AM", "1:00AM", "2:00AM", "3:00AM", "4:00AM", "5:00AM", "6:00AM", "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM", "1:00PM", "2:00PM", "3:00PM", "4:00PM", "5:00PM", "6:00PM", "7:00PM", "8:00PM", "9:00PM", "10:00PM", "11:00PM"];
var ga = polarStations.append("g")
    .attr("class", "axis")
    .attr("transform", "rotate(-105)")
  .selectAll("g")
    .data(d3.range(0, 360, 15))
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + -d + ")"; });

ga.append("line")
    .attr("x2", radius)
    .style("stroke", "#fff")
    .style("stroke-width", .5)
    .style("opacity", .5);

ga.append("text")
	.style("font-size", 10)
	.style("font-weight", 300)
    .attr("x", radius + 6)
    .attr("dy", ".35em")
    .style("text-anchor", function(d) { return d < 165 || d > 345 ? "end" : null; })
    .attr("transform", function(d) { return d < 165 || d > 345 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
    .text(function(d) { return times[times.length - 1 - parseInt(d/15)]; });

var nested_runs = d3.nest()
.key(function(d) { return d.TMTripID})
.entries(route1);

var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return stopKeyFull[stopKey.indexOf(d.Timepoint)] + "<br>Scheduled Arrival: " + d.timeString + "<br>Average Arrival: " + d.avgtime;
	  })

polarStations.call(tip);

nested_runs.forEach(function(d){
	d.values.sort(function(a,b){
		var nameA = a.TimepointOrder;
		var nameB = b.TimepointOrder;
		if (nameA < nameB) { return -1 }
		if (nameA > nameB) { return 1 }
			return 0;
	})
	polarStations.append("path")
	    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
	    .attr("d", line(d.values))
	    .attr("fill", "none")
	    .attr("stroke", "#fff")
	    .attr("stroke-width", 1);
	polarStations.selectAll("point")
	    .data(d.values)
	    .enter()
	    .append("circle")
	    .attr("class", function(d) { return "id-" + d.TMTripID + " point"})
	    .attr("transform", function(d) {
	    // use the line function and parse out the coordinates
	      var coors = line([d]).slice(1).slice(0, -1);
	      return "translate(" + coors + ")"
	    })
	    .attr("fill", "none")
	    .attr("r", 2)
	    .attr("stroke-width", .5)
	    .style("stroke", function(d) { return colorKey[stopKey.indexOf(d.Timepoint)]})
	    .on("mouseenter", function(d) { 
	    	var mystring = this.getAttribute("class");
			var arr = mystring.split(" ", 2);
			var firstWord = arr[0]; 

			polarStations.selectAll(".line")
				.style("opacity", .1)

			polarStations.selectAll(".point")
				.style("opacity", .1)

			polarStations.selectAll("." + firstWord)
				.style("stroke-width", 2)
				.style("r", 5)
				.style("opacity", 1)

			tip.show(d);
	    })
	    .on("mouseleave", function(d) { 
			polarStations.selectAll(".line")
				.style("stroke-width", .1)
				.style("opacity", .1)

			polarStations.selectAll(".point")
				.style("stroke-width", .5)
				.style("r", 2)
				.style("opacity", 1)
			tip.hide(d);
	    })

	polarStations.selectAll(".buslines").append("linearGradient")				
        .attr("id", "line-gradient")			
        .attr("gradientUnits", "userSpaceOnUse")		
		    .selectAll("stop")						
		        .data(stopGradient)					
		    .enter().append("stop")			
		        .attr("offset", function(d) { return d.offset; })	
		        .attr("stop-color", function(d) { return d.color; })
;
});


}