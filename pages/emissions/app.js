//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

//Define Color Scale
var colorScale = d3.scaleLinear()
	.domain([0, .5, 1])
	.range(["#ff6347","#ffffbf","#1a9850"])


var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geoPath().projection(projection);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "../../data/csv/CTPS_TOWNS_MAPC_VMT.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateEmissions(results[0]);
		//CTPS.demoApp.generateBridgePlots(results[0]);
	}); 

CTPS.demoApp.generateEmissions = function(emissions) {
	generateLineGraph("VOC");
	generateLineGraph("NOX");
	generateLineGraph("CO");
	generateLineGraph("CO2");

	function generateLineGraph(emittant) {

		var chart = d3.select("#emissions" + emittant).append("svg")
			    .attr("width", "100%")
			    .attr("height", 650)

	    var w = $("#emissions" + emittant).width();

		chart.selectAll("points")
			.data(emissions)
			.enter()
			.append("circle")
				.attr("class", function(d) { return d.TOWN;})

		var towns = [];

		emissions.forEach(function(i){
		    towns.push(i.TOWN);

			var VOC_SOV_array = [];
		    VOC_SOV_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_SOV_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_SOV_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_SOV_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_SOV_NT"] })
		    i.VOC_SOV_array = VOC_SOV_array; 

		    var VOC_HOV_array = [];
		    VOC_HOV_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_HOV_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_HOV_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_HOV_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_HOV_NT"] })
		    i.VOC_HOV_array = VOC_HOV_array; 

			var VOC_TRK_array = [];
		    VOC_TRK_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_TRK_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_TRK_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_TRK_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_TRK_NT"] })
		    i.VOC_TRK_array = VOC_TRK_array; 
		})

		if (emittant == "VOC") { 
			var metric = "grams of";
			var acronym = "volatile organic compound";
			var max = 300000;
		} else if (emittant == "NOX") { 
			var metric = "grams of";
			var acronym = "nitrogen oxide";
			var max = 1000000;
		} else if (emittant == "CO") { 
			var metric = "kilograms of";
			var acronym = "carbon monoxide";
			var max = 25000;
		} else if (emittant == "CO2") { 
			var metric = "kilograms of";
			var acronym = "carbon dioxide";
			var max = 300000;
		} 


		chart.append("text")
				.attr("x", w/2).attr("y", 40)
				.style("text-anchor", "middle").style("font-weight", 300).style("font-size", 10)
				.text(metric)
			chart.append("text")
				.attr("x", w/2).attr("y", 55)
				.style("text-anchor", "middle").style("font-weight", 300).style("font-size", 10)
				.text(acronym)


		var xScale = d3.scalePoint().domain(["AM", "MD", "PM", "NT"]).range([50, w - 10]);
		var yScale = d3.scaleLinear().domain([0, max]).range([600, 80]);

		var xAxis = d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale).tickSize(-(w-60), 0, 0);

		chart.append("text")
				.attr("x", w/2).attr("y", 20)
				.style("text-anchor", "middle").style("font-weight", 700).style("font-size", 16)
				.text(emittant)

		chart.append("g").attr("class", "axis")
			.attr("transform", "translate(0, 600)")
			.call(xAxis).selectAll("text").style("font-size", "12px").style("text-anchor", "end");
		
		chart.append("g").attr("class", "axis")
			.attr("transform", "translate(50, 0)")
			.call(yAxis).selectAll("text").style("font-size", "12px")

		var VOC_line = d3.area()
			.curve(d3.curveBasis)
		    .x(function(i) { return xScale(i.time); })
		    .y1(function(i) { if (!isNaN(yScale(i.stat))) { return yScale(i.stat) }})
		    .y0(yScale(0))

		/*var tip = d3.tip()
		    .attr('class', 'd3-tip')
		    .offset([0, 10])
		    .html(function(d) {
		      return d.town + "<br>" + d.year + "<br>Sidewalk Miles: " + d.sidewalk_miles + "<br>Centerline Miles: " + d.center_line_miles;
		    })*/

		//chart.call(tip); 

		  chart.selectAll(".VOC_SOV")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN })
		      .attr("d", function(d) { return VOC_line(d.VOC_SOV_array)})
		      .style("fill", "white").style("stroke", "white").style("stroke-width", .5)
		      .style("fill-opacity", .01)

		   chart.selectAll(".VOC_HOV")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN })
		      .attr("d", function(d) { return VOC_line(d.VOC_HOV_array)})
		      .style("fill", "orange").style("stroke", "orange").style("stroke-width", .5)
		      .style("fill-opacity", .01)

			chart.selectAll(".VOC_TRK")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN })
		      .attr("d", function(d) { return VOC_line(d.VOC_TRK_array)})
		      .style("fill", "pink").style("stroke", "pink").style("stroke-width", .5)
		      .style("fill-opacity", .01)

		      /*.on("mouseenter", function(d){
		        var mystring = this.getAttribute("class");

		        d3.selectAll("." + mystring)
		          .style("opacity", 1)
		      })
		      .on("mouseleave", function(d){

		        d3.selectAll("circle:not(.key)")
		          .style("opacity", .1)
		        
		        d3.selectAll("rect")
		          .style("opacity", 0)
		      });*/


} //end generateLineGraph


d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(" ", 2);
		var firstWord = arr[0]; 

		if (firstWord == "ALL") { 
			d3.selectAll("path")
				.style("opacity", 1)
				.style("fill-opacity", .01)
		} else {
			d3.selectAll("path")
				.style("opacity", .01)

			d3.selectAll("." + firstWord)
				.style("opacity", 1)
				.style("fill-opacity", .2)
		}
}) //end click function
	}
