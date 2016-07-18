var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	


//Using the queue.js library
queue()
	//.defer(d3.json, "../../JSON/boston_region_mpo_towns.topo.json")
	//.defer(d3.json, "../../JSON/MBTA_NODE.geojson")
	//.defer(d3.json, "../../JSON/red_line_boardings.json")
	//.defer(d3.json, "../../JSON/green_line_boardings.json")
	//.defer(d3.json, "../../JSON/blue_line_boardings.json")
	//.defer(d3.json, "../../JSON/orange_line_boardings.json")
	.defer(d3.csv, "../../JSON/bus_routes.csv")
	//.defer(d3.json, "../../JSON/mbta_bus_route_1.geojson")
	//.defer(d3.json, "../../JSON/mbta_bus_route_1_stops.geojson")


	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 

		//CTPS.demoApp.generateMBTA(results[0],results[1], results[2], results[3], results[4], results[5]);

		CTPS.demoApp.generateBusPolar(results[0]);
		//CTPS.demoApp.generateBusStops(results[0]);
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

CTPS.demoApp.generateBusPolar = function(bus_routes) {	
// Define Zoom Behavior
var minmax = [];
var parseTime = d3.time.format("%H:%M:%S %p");

var nested_bus = d3.nest()
.key(function(d) { return d.Route})
.entries(bus_routes);

nested_bus.forEach(function(route) { //iterate through each bus route and create an SVG for each route

	var stopKey = [];
	route.values.forEach(function(i){ //change object types of the data
		i.Stime = parseTime.parse(i.Stime);

		i.timeString = parseTime(new Date(i.Stime));
		
		i.AvgEarliness = parseFloat(i.AvgEarliness); 

		if ((i.PointType == "Startpoint" ) || (i.PointType == "Endpoint")) { 
			i.AvgRunning = 0; 
			i.ScheduledRunning = 0;
		}
		if (i.Route == 1) { 
			minmax.push(i.AvgRunning - i.ScheduledRunning);
		}
		if (stopKey.indexOf(i.Timepoint) == -1) { //Create stop key
			stopKey.push(i.Timepoint);
		}
		/*var index = -1; 
		if(stopKey.indexOf(i.Timepoint) == -1){		
			index = route1.indexOf(i);
		}
		if (index > -1) {
		    route1.splice(index, 1);
		}*/
	}) 
	//var colorKey = ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"];
	var stopKeyFull = ["Dudley Station", "Washington St @ Williams St", "Washington St @ Mass Ave", "Mass Ave Station", "Hynes Station", "MIT", "Central Square", "Mt Auburn St @ Putnam Ave", "Mass Ave @ Holyoke St"];


		//Radar chart...
	var width = 320,
	    height = 320,
	    radius = Math.min(width, height) / 2 - 50;

	var r = d3.scale.linear().domain([900, -1500]).range([0, radius]);
	var deg = d3.scale.linear().domain([new Date("Mon Jan 01 1900 00:00:00 GMT-0500(EST)"), new Date("Mon Jan 01 1900 23:59:59 GMT-0500(EST)")]).range([0, Math.PI * 2]);

	var area = d3.svg.line.radial()
	    .radius(function(d) { return r(d.MedianEarliness); })
	    //.innerRadius(function(d) { return r(0); })
	    .angle(function(d) { return deg(d.Stime); });

	/*var areaLow = d3.svg.line.radial()
	    .outerRadius(function(d) { return r(d.LowEarliness); })
	    .innerRadius(function(d) { return r(0); })
	    .angle(function(d) { return deg(d.Stime); });

	var areaHigh = d3.svg.line.radial()
	    .outerRadius(function(d) { return r(d.HighEarliness); })
	    .innerRadius(function(d) { return r(0); })
	    .angle(function(d) { return deg(d.Stime); });*/

	var rushHour = d3.svg.area.radial()
	.innerRadius(0)
	.outerRadius(radius)
	.startAngle(deg(Math.PI))
	.endAngle(deg(Math.PI*1.5))

	var polarStations = d3.select("#busses").append("svg")
		.attr("id", "polarStations")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	polarStations.append("text")
		.html("Route " + route.key)
		.style("text-anchor", "middle")
		.attr("x", 0)
		.attr("y", 0)

	/*polarStations.append("path")
		.attr("d", rushHour)
	    .style("fill", "red");*/

	/*Color key
	var svg2 = d3.select("#polarStations").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .style("position", "absolute")
	    .style("z-index", 1)
	    .attr("x", 0)

	//Color key
	for (var i = 0; i < 9; i++){
		svg2.append("circle")
			.attr("cx", 50)
			.attr("cy", height/3.9 + 25 * (i+1))
			.attr("r", 5)
			.style("stroke", colorKey[i])
			.style("stroke-width", 1)
			.style("fill", "none")

		svg2.append("text")
			.text(stopKeyFull[i])
			.attr("x", 60)
			.attr("y", height/3.9 + 25 * (i+1) + 5)
			.style("fill", "#fff")
			.style("font-size", 12)
	}*/

	var gr = polarStations.append("g")
	    .attr("class", "r axis")
	  .selectAll("g")
	    .data([600, 300, 0, -300, -600, -900, -1200])
	  .enter().append("g");

	//lateness boundaries
	gr.append("circle")
	    .attr("r", r)
	    .style("fill", "none")
	    .style("stroke", "#fff")
	    .style("stroke-width", .5)
	    .style("stroke-dasharray", "1, 1")
	    .style("opacity", .5);

	//on-time boundary (thicker)
	gr.append("circle")
	    .attr("r", r(0))
	    .style("fill", "none")
	    .style("stroke", "#fff")
	    .style("stroke-width", 1)
	    .style("stroke-dasharray", "3, 3")
	    .style("opacity", 1)

	//lateness boundaries text
	var latenessMin = ["", "5 min early", "", "5 min late", "10 min late", "15 min late", ""]
	gr.append("text")
	    .attr("y", function(d) { return -r(d) - 4; })
	    .attr("transform", "rotate(37)")
	    .style("font-weight", 300)
	    .style("font-size", 10)
	    .style("text-anchor", "middle")
	    .html(function(d, i) { return latenessMin[i]; });

	polarStations.append("text")
	    .attr("y", -r(0) - 4)
	    .attr("transform", "rotate(37)")
	    .style("font-weight", 700)
	    .style("font-size", 12)
	    .style("text-anchor", "middle")
	    .html("On time");

	//clock time boundaries (straight lines)
	var times = ["12AM", "6AM", "12PM", "6PM"];
	var ga = polarStations.append("g")
	    .attr("class", "axis")
	    .attr("transform", "rotate(-180)")
	  .selectAll("g")
	    .data(d3.range(0, 360, 90))
	  .enter().append("g")
	    .attr("transform", function(d) { return "rotate(" + -d + ")"; });

	ga.append("line")
	    .attr("x2", radius)
	    .style("stroke", "#fff")
	    .style("stroke-width", .5)
	    .style("opacity", .5)
	    .style("stroke-dasharray", "1, 1");
	//clock time labels
	ga.append("text")
		.style("font-size", 10)
		.style("font-weight", 700)
	    .attr("x", radius + 6)
	    .attr("dy", ".35em")
	    .style("text-anchor", function(d) { return d < 165 || d > 345 ? "end" : null; })
	    .attr("transform", function(d) { return d < 165 || d > 345 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
	    .text(function(d) { return times[times.length - 1 - parseInt(d/90)]; });

	var nested_runs = d3.nest()
	.key(function(d) { return d.TMTripID})
	.entries(route.values);

	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-40, 0])
		  .html(function(d) {
		    return stopKeyFull[stopKey.indexOf(d.Timepoint)] + "<br>Scheduled Arrival: " + d.timeString + "<br>Actual Arrival: " + d.AvgArrival;
		  })

	polarStations.call(tip);

	polarStations.selectAll(".buslines")
		.data(route.values)
		.enter()
		.append("line")
		    .attr("class", function(d) { return "id-" + d.TMTripID + " route" + d.Route + " line buslines";})
		    .attr("x1", function(d) { return r(0)*Math.cos(deg(d.Stime))})
		    .attr("x2", function(d) { return r(d.AvgEarliness)*Math.cos(deg(d.Stime))})
		    .attr("y1", function(d) { return r(0)*Math.sin(deg(d.Stime))})
		    .attr("y2", function(d) { return r(d.AvgEarliness)*Math.sin(deg(d.Stime))})
		    .attr("stroke", "#fff")
		    .style("stroke-width", .5)
		    .style("fill", "none")
		    .style("opacity", .5)
		    .on("mouseenter", function(d) { 
		    	var mystring = this.getAttribute("class");
		        var arr = mystring.split(" ");
		        var firstWord = arr[0];

		        polarStations.selectAll("." + firstWord) 
		        	.style("stroke", "#ff6347") 
		        	.style("opacity", 1)
		   			.style("stroke-width", 1)
		    })	
		    .on("mouseleave", function(d){
		    	 polarStations.selectAll(".buslines")
		    	 	.style("stroke", "#fff")
		    		.style("opacity", .5)
		   			 .style("stroke-width", .5)

		    })//Draw radar chart (circles, lines)

	nested_runs.forEach(function(d){
		d.values.sort(function(a,b){
			var nameA = a.TimepointOrder;
			var nameB = b.TimepointOrder;
			if (nameA < nameB) { return -1 }
			if (nameA > nameB) { return 1 }
				return 0;
		})
		/*polarStations.append("path")
		    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
		    .attr("d", areaLow(d.values))
		    .attr("fill", "#99d594")
		    	    .style("opacity", .1)

		
		polarStations.append("path")
		    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
		    .attr("d", area(d.values))
		    .attr("stroke", "#fff")
		    .style("stroke-width", .5)
		    .style("fill", "none")
			    .style("opacity", .5)

		
		polarStations.append("path")
		    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
		    .attr("d", areaHigh(d.values))
		    .attr("fill", "#fc8d59")
		    .style("opacity", .1)*/
	}) //end nested_runs forEach loop
}) //end nested_bus forEach loop
}
/*CTPS.demoApp.generateBusStops = function(route1) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var minmax = [];
//var parseTime = d3.time.format("%I:%M:%S %p");

var nested_bus = d3.nest()
.key(function(d) { return d.Route})
.entries(route1)

nested_bus.forEach(function(route) { //iterate through each bus route and create an SVG for each route

	var stopKey = [];
	route.values.forEach(function(i){
		//i.Stime = parseTime.parse(i.Stime);
		//i.timeString = parseTime(new Date(i.Stime));
		
		//i.AvgEarliness = parseFloat(i.AvgEarliness); 
		if ((i.PointType == "Startpoint" ) || (i.PointType == "Endpoint") { 
			i.AvgRunning = 0; 
			i.ScheduledRunning = 0;
		}
		if (i.Route == 1) { 
			minmax.push(i.AvgRunning - i.ScheduledRunning);
		}
		if (stopKey.indexOf(i.Timepoint) == -1) { 
			stopKey.push(i.Timepoint);
		}
	})
	//var finish = new Date();
	//console.log(start, finish, finish - start);

	// SVG Viewport
	//var routeChart = d3.select("#busses").append("svg")
		//.attr("width", "100%")
		//.attr("height", 600);

	var colorKey = ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"];
	var stopKey = ["Dudly", "Melwa", "Wasma", "masta", "hynes", "mit", "cntsq", "maput", "hhgat"];
	var stopKeyFull = ["Dudley Station", "Washington St @ Williams St", "Washington St @ Mass Ave", "Mass Ave Station", "Hynes Station", "MIT", "Central Square", "Mt Auburn St @ Putnam Ave", "Mass Ave @ Holyoke St"];

	route1.forEach(function(i){
		var index = -1; 
		if(stopKey.indexOf(i.Timepoint) == -1){		
			index = route1.indexOf(i);
		}
		if (index > -1) {
		    route1.splice(index, 1);
		}
	})
	route1.forEach(function(i){
		var index = -1; 
		if(stopKey.indexOf(i.Timepoint) == -1){		
			index = route1.indexOf(i);
		}
		if (index > -1) {
		    route1.splice(index, 1);
		}
	})

	//Stop chart
	var width = 500,
	    height = 600;

	var stopScale = d3.scale.ordinal().domain(stopKey).rangePoints([50, 450]);
	var stopScaleNames = d3.scale.ordinal().domain(stopKeyFull).rangePoints([50, 450]);
	var dayScale = d3.scale.linear().domain([new Date("Mon Jan 01 1900 04:30:00 GMT-0500 (EST)"),new Date("Mon Jan 01 1900 14:00:00 GMT-0500 (EST)"), new Date("Mon Jan 01 1900 23:59:59 GMT-0500 (EST)")]).range(["#edf8b1","#41b6c4","#253494"]);
	var yScale = d3.scale.linear().domain([d3.min(minmax), d3.max(minmax)]).range([550, 50]);

	var line = d3.svg.line()
	    .x(function(d) { return stopScale(d.Timepoint); })
	    .y(function(d) { return yScale(d.AvgRunning - d.ScheduledRunning); });

	var area = d3.svg.area()
	    .x(function(d) { return stopScale(d.Timepoint); })
	    .y0(function(d) { return yScale(d.AvgRunning - d.ScheduledRunning); })
	    .y1(function(d) { return yScale(0); });

	//Inbound
	var inboundStops = d3.select("#inboundStops").append("svg")
	    .attr("width", width)
	    .attr("height", height)

	var outboundStops = d3.select("#outboundStops").append("svg")
	    .attr("width", width)
	    .attr("height", height)

	var xAxis = d3.svg.axis().scale(stopScaleNames).orient("bottom").ticks(10); 
	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

	inboundStops.append("g").attr("class", "axis")
		.attr("transform", "translate(0, " + yScale(0) + ")").style("stroke-width", "1px")
		.call(xAxis).selectAll("text")
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", "10px")

	outboundStops.append("g").attr("class", "axis")
		.attr("transform", "translate(0, " + yScale(0) + ")").style("stroke-width", "1px")
		.call(xAxis).selectAll("text")
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", "10px")


	var nested_runs = d3.nest()
	.key(function(d) { return d.TMTripID})
	.entries(route1);


	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-40, 0])
		  .html(function(d) {
		  	if (d.Direction == "Inbound"){
		  		if (d.Timepoint != "hhgat") {
		    		return stopKeyFull[stopKey.indexOf(d.Timepoint) + 1] + " to " + stopKeyFull[stopKey.indexOf(d.Timepoint)] + "<br>Scheduled Running Time: " + parseInt(d.ScheduledRunning/60) + " min " + d.ScheduledRunning%60 + " s " + "<br>Actual Running Time: " + parseInt(d.AvgRunning/60) + " min " + d.AvgRunning%60 + " s" ;
		  		} else { 
		  			return stopKeyFull[stopKey.indexOf(d.Timepoint)] + ": 1st stop"
		  		}
		  	} else { 
		  		if (d.Timepoint != "Dudly") {
		    		return stopKeyFull[stopKey.indexOf(d.Timepoint) - 1] + " to " + stopKeyFull[stopKey.indexOf(d.Timepoint)] + "<br>Scheduled Running Time: " + parseInt(d.ScheduledRunning/60) + " min " + d.ScheduledRunning%60 + " s " + "<br>Actual Running Time: " + parseInt(d.AvgRunning/60) + " min " + d.AvgRunning%60 + " s" ;
		  		} else { 
		  			return stopKeyFull[stopKey.indexOf(d.Timepoint)] + ": 1st stop"
		  		}
		  	}
		  })

	inboundStops.call(tip);
	outboundStops.call(tip);

	//Draw stops chart (circles, lines)
	nested_runs.forEach(function(d){
		d.values.sort(function(a,b){
			var nameA = a.TimepointOrder;
			var nameB = b.TimepointOrder;
			if (nameA < nameB) { return -1 }
			if (nameA > nameB) { return 1 }
				return 0;
		})
		if (d.values[0].Direction == "Inbound") { 
			inboundStops.append("path")
			    .attr("class", "area buslines")
			    .attr("d", area(d.values))
			    .style("stroke", "none")
			    .style("fill", dayScale(d.values[0].Stime))
			    .style("opacity", .02);
		} else { 
			outboundStops.append("path")
			    .attr("class", "area buslines")
			    .attr("d", area(d.values))
			    .style("stroke", "none")
			    .style("fill", dayScale(d.values[0].Stime))
			    .style("opacity", .02);
		}
	});

	console.log(d.values[0])
	nested_runs.forEach(function(d){
		if (d.values[0].Direction == "Inbound") { 
			inboundStops.append("path")
			    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
			    .attr("d", line(d.values))
			    .attr("fill", "none")
			    .attr("stroke", dayScale(d.values[0].Stime))
			    .attr("stroke-width", .1);
			inboundStops.selectAll("point")
			    .data(d.values)
			    .enter()
			    .append("circle")
			    .attr("class", function(d) { return "id-" + d.TMTripID + " point"})
			    .attr("cx", function(d) { return stopScale(d.Timepoint)})
			    .attr("cy", function(d) { return yScale(d.AvgRunning - d.ScheduledRunning)})
			    .style("fill", "#191b1d")
			    .style("opacity", .1)
			    .attr("r", 2)
			    .style("fill", function(d) { return dayScale(d.Stime);})
			    .on("mouseenter", function(d) { 
			    	var mystring = this.getAttribute("class");
					var arr = mystring.split(" ", 2);
					var firstWord = arr[0]; 

					inboundStops.selectAll(".line")
						.style("opacity", .1)

					inboundStops.selectAll(".point")
						.style("opacity", .1)

					inboundStops.selectAll("." + firstWord)
						.style("stroke-width", 1)
						.style("r", 3)
						.style("opacity", 1)

					tip.show(d);
			    })
			    .on("mouseleave", function(d) { 
					inboundStops.selectAll(".line")
						.style("stroke-width", .1)
						.style("opacity", 1)

					inboundStops.selectAll(".point")
						.style("stroke-width", .5)
						.style("r", 2)
						.style("opacity", .1)
					tip.hide(d);
			    })
		} else {
			outboundStops.append("path")
			    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
			    .attr("d", line(d.values))
			    .attr("fill", "none")
			    .attr("stroke", dayScale(d.values[0].Stime))
			    .attr("stroke-width", .1);
			outboundStops.selectAll("point")
			    .data(d.values)
			    .enter()
			    .append("circle")
			    .attr("class", function(d) { return "id-" + d.TMTripID + " point"})
			    .attr("cx", function(d) { return stopScale(d.Timepoint)})
			    .attr("cy", function(d) { return yScale(d.AvgRunning - d.ScheduledRunning)})
			    .style("fill", "#191b1d")
			    .style("opacity", .1)
			    .attr("r", 2)
			    .style("fill", function(d) { return dayScale(d.Stime);})
			    .on("mouseenter", function(d) { 
			    	var mystring = this.getAttribute("class");
					var arr = mystring.split(" ", 2);
					var firstWord = arr[0]; 

					outboundStops.selectAll(".line")
						.style("opacity", .1)

					outboundStops.selectAll(".point")
						.style("opacity", .1)

					outboundStops.selectAll("." + firstWord)
						.style("stroke-width", 1)
						.style("r", 3)
						.style("opacity", 1)

					tip.show(d);
			    })
			    .on("mouseleave", function(d) { 
					outboundStops.selectAll(".line")
						.style("stroke-width", .1)
						.style("opacity", 1)

					outboundStops.selectAll(".point")
						.style("stroke-width", .5)
						.style("r", 2)
						.style("opacity", .1)
					tip.hide(d);
			    })
		}
		});
})//end for-each loop for nested_bus
}*/