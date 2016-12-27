//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([18000]) // N.B. The scale and translation vector were determined empirically.
	.translate([40,800]);
	
var geoPath = d3.geoPath().projection(projection);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
	.defer(d3.csv, "../../data/csv/nonmotorized_crashes.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
		CTPS.demoApp.generatePlot(results[1]);
		CTPS.demoApp.generateAccessibleTable(results[1]);
	}); 

//Color Scale
var colorScale = d3.scaleThreshold()
    .domain([0, 5, 10, 50, 200])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//var colorScale = d3.scaleLinear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, crashdata) {	
	// SVG Viewport


	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		var town = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	    return "<p>" + town + "</p><b>2013 Statistics</b><br>Bike Injuries: " + findIndex(town, "bike_inj") + "<br>Bike Fatalities: " + findIndex(town, "bike_fat") + 
	    "<br>Pedestrian Injuries: " + findIndex(town, "ped_inj") + "<br>Pedestrian Fatalities: " + findIndex(town, "ped_fat") + "<br><br> Total Bicycle Crashes: " + 
	    findIndex(town, "bike_tot") + "<br> Total Pedestrian Crashes: " + findIndex(town, "ped_tot");
	  })

	var svgContainer = d3.select("#map").append("svg")
		.attr("width", "100%")
		.attr("height", 400)

	svgContainer.call(tip); 

	var findIndex = function(town, statistic) { 
		for (var i = 0; i < crashdata.length; i++) { 
			if (crashdata[i].year == 2013 && crashdata[i].town == town) {
				return crashdata[i][statistic]; 
			} 
		}
	}

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".mpo")
		.data(topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", function(d){
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 
				var total = +findIndex(capTown, "bike_tot") + +findIndex(capTown, "ped_tot");
				return colorScale(total); 	
			})
			.style("opacity", 1)
			.style("stroke", "#191b1d")
			.style("stroke-width", 1)
		.on("click", function() {
				var thisreg = this.getAttribute("class");

				svgContainer.selectAll("path")
					.style("opacity", 1)

				d3.selectAll("." + thisreg)
					.style("opacity", .5)

				var yScale = d3.scaleLinear().domain([0, findTownMax(thisreg)[0]]).range([400, 20]);
				var yAxis = d3.axisLeft(yScale).tickSize(-250, 0, 0).tickFormat(function(e){
			        if(Math.floor(e) != e)
			        { return; } else { return e; }});

				d3.selectAll(".area").transition()
					.style("fill", "none");

				chartContainer.select(".yaxis").transition()
					.duration(750)
                    .call(yAxis).selectAll("text").style("fill", colorScale(findTownMax(thisreg)[0]))
                    .attr("transform", "translate(-5,0)");

				var yScale = d3.scaleLinear().domain([0, findTownMax(thisreg)[1]]).range([400, 20]);
				var yAxis = d3.axisLeft(yScale).tickSize(-250, 0, 0).tickFormat(function(e){
			        if(Math.floor(e) != e)
			        { return; } else { return e; }});

                chartContainer2.select(".yaxis").transition()
					.duration(750)
                    .call(yAxis).selectAll("text").style("fill", colorScale(findTownMax(thisreg)[1]))
                    .attr("transform", "translate(-5,0)");

                circleMaker(thisreg);
	        }) 
		.on("mouseenter", function(d) {
			d3.select(this).style("stroke", "white").style("cursor", "pointer");
			tip.show(d); 
		})
		.on("mouseleave", function(d) { 
			d3.select(this).style("stroke", "#191b1d");
			tip.hide(d);
		})

	var chartContainer = d3.select("#bikeChart").append("svg")
		.attr("width", "100%")
		.attr("height", 500)

	var chartContainer2 = d3.select("#pedChart").append("svg")
		.attr("width", "100%")
		.attr("height", 500)

	var nested_crashes = d3.nest()
	.key(function(d) { return d.town})
	.entries(crashdata);

	//Determine scales dynamically
	function findTownMax(town) { 
		var crashvalues = [];
		crashvalues[0] = [];
		crashvalues[1] = [];
		nested_crashes.forEach(function(i) { 
			if (i.key == town) {
				i.values.forEach(function(j){
					crashvalues[0].push(+j.bike_inj);
					crashvalues[1].push(+j.ped_inj);
				})
			}
		})
		return [d3.max(crashvalues[0]), d3.max(crashvalues[1])];
	}
//Label axes
	chartContainer.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -270)
		.attr("y", 10)
		.style("font-weight", 300)
		.text("Number of Injuries")

	chartContainer2.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -270)
		.attr("y", 10)
		.style("font-weight", 300)
		.text("Number of Injuries")

//Assign scales and axes 
	var xScale = d3.scaleLinear().domain([2004, 2013]).range([50, 300]);
	var yScale = d3.scaleLinear().domain([0, findTownMax("Total")[0]]).range([400, 20]);

	var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")); 
	var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-250, 0, 0);

	chartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 400)").style("stroke-width", "1px")
		.call(xAxis).selectAll("text").style("font-size", "12px").style("text-anchor", "end").attr("transform", "rotate(-45)");
	
	chartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(50, 0)")
		.call(yAxis).selectAll("text").style("font-size", "12px")
		.attr("transform", "translate(-5,0)");

	var yScale = d3.scaleLinear().domain([0, findTownMax("Total")[1]]).range([400, 20]);
	var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-250, 0, 0);

	chartContainer2.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 400)").style("stroke-width", "1px")
		.call(xAxis).selectAll("text").style("font-size", "12px").style("text-anchor", "end").attr("transform", "rotate(-45)");
	
	chartContainer2.append("g").attr("class", "yaxis")
		.attr("transform", "translate(50, 0)")
		.call(yAxis).selectAll("text").style("font-size", "12px")
		.attr("transform", "translate(-5,0)");


	circleMaker("Total");

	function circleMaker (town) {
		//graph connecting lines
		chartContainer.selectAll("path").remove();
		chartContainer2.selectAll("path").remove();

		nested_crashes.forEach(function(i) { 
			i.values.forEach(function(j) { 
				if (j.town == town) {
					yScale = d3.scaleLinear().domain([0, findTownMax(town)[0]]).range([400, 20]);

					var areamaker = d3.area() //Bike injuries
					    .x(function(d) { return xScale(d.year); })
					    .y1(function(d) { return yScale(d.bike_inj); })
					    .y0(function(d) { return yScale(0)});
					chartContainer.append("path")
				      .datum(i.values)
				      .attr("class", "area")
				      .attr("d", areamaker)
				      .style("fill", colorScale(findTownMax(i.key)[0]))
				      .style("stroke", "none")
				      .style("opacity", .1);

				     yScale = d3.scaleLinear().domain([0, findTownMax(town)[1]]).range([400, 20]);

			        var areamaker2 = d3.area() //Bike injuries
				      .x(function(d) { return xScale(d.year); })
				      .y1(function(d) { return yScale(d.ped_inj); })
				      .y0(function(d) { return yScale(0)});
				    chartContainer2.append("path")
				      .datum(i.values)
				      .attr("class", "area")
				      .attr("d", areamaker2)
				      .style("fill", colorScale(findTownMax(i.key)[1]))
				      .style("stroke", "none")
				      .style("opacity", .1);
				}
			})
		})

		
	}

	 //Color key
    var xPos = 5;
    var yPos = 60; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700).style("font-size", 18)
      .attr("x", xPos).attr("y", yPos - 35)
      .text("Total Bicycle and Pedestrian Crashes");

    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .text("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScale(1)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .text("<5 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(7)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("5-10 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(20)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("10-50 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(100)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("50-200 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(240)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text(">200 crashes");

}

CTPS.demoApp.generatePlot = function (crashdata) {

	var height = 150;
	var width = 180;
	var padding = 20;
	var xMax = 20;
	var yMax = 20;

	var nested_crashes = d3.nest()
		.key(function(d) { return d.town})
		.entries(crashdata);

	nested_crashes.forEach(function (town) {
		var xScale = d3.scaleLinear().domain([0, xMax]).range([0 + padding, width - 10]);
		var yScale = d3.scaleLinear().domain([0, yMax]).range([height + 10, 20]);

		var xAxis = d3.axisBottom(xScale).tickSize(0);
		var yAxis = d3.axisLeft(yScale).tickSize(0);

		var svg = d3.select("#plot").append("svg")
				.attr("height", height)
				.attr("width", width)
				.attr("id", "plot" + town.key);

		svg.append("g")
		  .attr("class", "taxis")
		  .attr("transform", "translate(0, " + (height - padding) + ")")
		  .call(xAxis).selectAll("text").remove();

		svg.append("g")
			.attr("class", "taxis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis).selectAll("text").remove();
		
		svg.append("text")
			.attr("x", padding + 5)
			.attr("y", 10)
			.style("text-anchor", "start")
			.style("font-size", 14)
			.text(function(){
				if (town.key != "Total") {
					return town.key;
				}});

		town.values.forEach(function(d){
			if (d.year == 2013 && d.town != "Total") { 
				var x = 1; 
				var y = yMax - 1; 
				for(var i = 1; i < +d.bike_inj+1; i++) { 
					svg.append("circle")  
						.attr("cx", xScale(x))
						.attr("cy", yScale(y))
						.attr("r", 3)
						.attr("stroke-width", .5)
						.attr("stroke", "#e7298a")
						.attr("fill", "none")
					if (x == xMax -1) { x = 1; y--; } else { x++; }
				}
				for(var i = 1; i < +d.bike_fat+1; i++) { 
					svg.append("circle")  
						.attr("cx", xScale(x))
						.attr("cy", yScale(y))
						.attr("r", 3)
						.attr("fill", "#e7298a")
					if (x == xMax - 1) { x = 1; y--; } else { x++; }
				}
				for(var i = 1; i < +d.ped_inj+1; i++) { 
					svg.append("circle")  
						.attr("cx", xScale(x))
						.attr("cy", yScale(y))
						.attr("r", 3)
						.attr("stroke-width", .5)
						.attr("stroke", "#7570b3")
						.attr("fill", "none")
					if (x == xMax - 1) { x = 1; y--; } else { x++; }
				}
				for(var i = 1; i < +d.ped_fat+1; i++) { 
					svg.append("circle")  
						.attr("cx", xScale(x))
						.attr("cy", yScale(y))
						.attr("r", 3)
						.style("fill", "#7570b3")
					if (x == xMax - 1) { x = 1; y--; } else { x++; }
				}
				if ((d.bike_inj + d.ped_inj + d.bike_fat + d.ped_fat) == 0) {
					d3.select("#plot" + town.key).remove();
				}
			}
		})


	});	
}

CTPS.demoApp.generateAccessibleTable = function(crashjson){
	var colDesc = [{ // array of objects
		"dataIndex" : "year",
		"header" : "Year"
	},{ 
		"dataIndex" : "town",
		"header" : "Town"
	},{ 
		"dataIndex" : "bike_inj",
		"header" : "Bike Injuries"
	},{ 
		"dataIndex" : "bike_fat",
		"header" : "Bike Fatalities"
	},{ 
		"dataIndex" : "ped_inj",
		"header" : "Pedestrian Injuries"
	},{ 
		"dataIndex" : "ped_fat",
		"header" : "Pedestrian Fatalities"
	}];

	var options = {
		"divId" : "crashTableDiv",
		"caption": "Nonmotorized Crash Data over Time: Bicycle and Pedestrian Injuries and Fatalities from 2004 to 2013",
	};

	$("#crashTable").accessibleGrid(colDesc, options, crashjson);
}
