//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

//Define Color Scale
var colorScale = d3.scaleLinear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	


//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "../../data/csv/bus_route_1.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateBusPolar(results[0]);
		CTPS.demoApp.generateBusStops(results[0]);
	}); 

CTPS.demoApp.generateBusPolar = function(route1) {	
// Define Zoom Behavior
var minmax = [];
var parseTime = d3.timeParse("%I:%M:%S %p");

//var start = new Date(); 
route1.forEach(function(i){
	i.Stime = parseTime(i.Stime);
	i.timeString = parseTime(new Date(i.Stime));
	
	minmax.push(i.Stime);
	i.AvgEarliness = parseFloat(i.AvgEarliness); 
})

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
	//Radar chart...
var width = 1000,
    height = 600,
    radius = Math.min(width, height) / 2 - 60;

var r = d3.scaleLinear().domain([900, -1200]).range([0, radius]);
var deg = d3.scaleLinear().domain([new Date("Mon Jan 01 1900 00:00:00 GMT-0500(EST)"), new Date("Mon Jan 01 1900 23:59:59 GMT-0500(EST)")]).range([0, 2 * Math.PI]);

var line = d3.radialLine()
    .radius(function(d) { return r(d.AvgEarliness); })
    .angle(function(d) { return deg(d.Stime); });

var rushHour = d3.radialArea()
.innerRadius(0)
.outerRadius(radius)
.startAngle(deg(Math.PI))
.endAngle(deg(Math.PI*1.5))

var polarStations = d3.select("#busses").append("svg")
	.attr("id", "polarStations")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 1.7 + "," + height / 2 + ")");

/*polarStations.append("path")
	.attr("d", rushHour)
    .style("fill", "red");*/

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
}

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
    .style("opacity", .5)
    .style("stroke-dasharray", "1, 1");
//clock time labels
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
	  .offset([-40, 0])
	  .html(function(d) {
	    return stopKeyFull[stopKey.indexOf(d.Timepoint)] + "<br>Scheduled Arrival: " + d.timeString + "<br>Actual Arrival: " + d.avgtime;
	  })

polarStations.call(tip);

var start = new Date(); 
//Draw radar chart (circles, lines)
nested_runs.forEach(function(d){
	d.values.sort(function(a,b){
		var nameA = a.TimepointOrder;
		var nameB = b.TimepointOrder;
		if (nameA < nameB) { return -1 }
		if (nameA > nameB) { return 1 }
			return 0;
	})
	if (d.values[0].Direction == "Outbound"){
	polarStations.append("path")
	    .attr("class", "id-" + d.values[0].TMTripID + " line buslines")
	    .attr("d", line(d.values))
	    .attr("fill", "none")
	    .attr("stroke", "#fff")
	    .attr("stroke-width", .1);
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
	    .attr("fill", "#191b1d")
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
				.style("stroke-width", 1)
				.style("r", 3)
				.style("opacity", 1)

			tip.show(d);
	    })
	    .on("mouseleave", function(d) { 
			polarStations.selectAll(".line")
				.style("stroke-width", .1)
				.style("opacity", 1)

			polarStations.selectAll(".point")
				.style("stroke-width", .5)
				.style("r", 2)
				.style("opacity", 1)
			tip.hide(d);
	    })
	}
});


}

CTPS.demoApp.generateBusStops = function(route1) {	
// Show name of MAPC Sub Region
// Define Zoom Behavior
var minmax = [];
//var parseTime = d3.timeFormat("%I:%M:%S %p");

route1.forEach(function(i){
	//i.Stime = parseTime.parse(i.Stime);
	//i.timeString = parseTime(new Date(i.Stime));
	
	//i.AvgEarliness = parseFloat(i.AvgEarliness); 
	if ((i.Timepoint == "Dudly" && i.Direction == "Outbound" ) || (i.Timepoint == "hhgat" && i.Direction == "Inbound")) { 
		i.AvgRunning = 0; 
		i.ScheduledRunning = 0;
	}
	minmax.push(i.AvgRunning - i.ScheduledRunning);

})

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

var stopScale = d3.scalePoint().domain(stopKey).range([50, 450]);
var stopScaleNames = d3.scalePoint().domain(stopKeyFull).range([50, 450]);
var dayScale = d3.scaleLinear().domain([new Date("Mon Jan 01 1900 04:30:00 GMT-0500 (EST)"),new Date("Mon Jan 01 1900 14:00:00 GMT-0500 (EST)"), new Date("Mon Jan 01 1900 23:59:59 GMT-0500 (EST)")]).range(["#edf8b1","#41b6c4","#253494"]);
var yScale = d3.scaleLinear().domain([d3.min(minmax), d3.max(minmax)]).range([550, 50]);

var line = d3.line()
    .x(function(d) { return stopScale(d.Timepoint); })
    .y(function(d) { return yScale(d.AvgRunning - d.ScheduledRunning); });

var area = d3.area()
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

var xAxis = d3.axisBottom(stopScaleNames).ticks(10); 
var yAxis = d3.axisLeft(yScale).ticks(10);

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


}