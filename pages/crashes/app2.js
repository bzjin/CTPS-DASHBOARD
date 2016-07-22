var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([20000]) // N.B. The scale and translation vector were determined empirically.
	.translate([65,830]);
	
var geoPath = d3.geo.path().projection(projection);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../json/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "../../json/motorized_crashes.json")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
		CTPS.demoApp.generatePlot(results[1]);
		CTPS.demoApp.generateAccessibleTable(results[1]);
	}); 

//Color Scale
var colorScale = d3.scale.linear()
    .domain([0, 50, 100, 200, 400, 800, 1600])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//var colorScale = d3.scale.linear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);

var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.properties.TOWN ;
	  })

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, crashdata) {	
	// SVG Viewport

	var svgContainer = d3.select("#map").append("svg")
		.attr("width", "100%")
		.attr("height", 450)

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
		.data(topojson.feature(mpoTowns, mpoTowns.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				return colorScale(findIndex(capTown, "mot_inj")+findIndex(capTown, "mot_inj")); 	
			})
			.style("opacity", 1)
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
		.on("click", function() {
				var thisreg = this.getAttribute("class");
				var yScale = d3.scale.linear().domain([0, findTownMax(thisreg)]).range([400, 50]);
				var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-480, 0, 0).tickFormat(d3.format("d"));

				d3.selectAll(".line").transition()
					.style("fill", "none");

				chartContainer.select(".yaxis").transition()
					.duration(750)
					.ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
                    .call(yAxis).selectAll("text").style("fill", colorScale(findTownMax(thisreg)))
                    .attr("transform", "translate(-5, 0)");


                circleMaker(thisreg);
	        }) 
		.on("mouseenter", function(d) { 
			tip.show(d); 
		})

	var chartContainer = d3.select("#chart").append("svg")
		.attr("width", "100%")
		.attr("height", 450)

	var nested_crashes = d3.nest()
	.key(function(d) { return d.town})
	.entries(crashdata);

	//Determine scales dynamically
	function findTownMax(town) { 
		var crashvalues = [];
		nested_crashes.forEach(function(i) { 
			if (i.key == town) {
				i.values.forEach(function(j){
					crashvalues.push(j.mot_inj);
				})
			}
		})
		return d3.max(crashvalues);
	}
//Label axes
	chartContainer.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -300)
		.attr("y", 10)
		.text("Number of Injuries")

//Assign scales and axes 
	var xScale = d3.scale.linear().domain([2004, 2013]).range([70, 550]);
	var yScale = d3.scale.linear().domain([0, findTownMax("Total")]).range([400, 50]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10).tickFormat(d3.format("d")); 
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-480, 0, 0).tickFormat(d3.format("d"));

	chartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 400)").style("stroke-width", "1px")
		.style("font-size", "14px")
		.call(xAxis);
	
	chartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(70, 0)")
		.style("font-size", "12px")
		.call(yAxis); 

	circleMaker("Total");

	function circleMaker (town) {
		yScale = d3.scale.linear().domain([0, findTownMax(town)]).range([400, 50]);

		//graph connecting lines
		nested_crashes.forEach(function(i) { 
			i.values.forEach(function(j) { 
				if (j.town == town) {
					var linemaker = d3.svg.area() //Bike injuries
					    .x(function(d) { return xScale(d.year); })
					    .y1(function(d) { return yScale(d.mot_inj); })
					    .y0(function(d) { return yScale(0)});
					chartContainer.append("path")
				      .datum(i.values)
				      .attr("class", "line")
				      .attr("d", linemaker)
				      .style("fill", function(d) { return colorScale(findTownMax(j.town)); })
				      .style("stroke-width", 0)
				      .style("opacity", 0.05)
				}
			})
		})
	}

	 //Color key
    var xPos = 5;
    var yPos = 30; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .html("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScale(50)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .html("<50 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(120)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .html("51-200 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(250)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .html("201-400 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(450)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .html("401-1200 crashes");
    svgContainer.append("rect")
      .style("fill", colorScale(1200)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .html(">1200 crashes");

}

CTPS.demoApp.generatePlot = function (crashdata) {

	var height = 1000;
	var width = 1000;
	var padding = 10;

	var nested_crashes = d3.nest()
		.key(function(d) { return d.town})
		.entries(crashdata);

	var svg = d3.select("#plot").append("svg")
				.attr("height", height)
				.attr("width", width);

	var xScale = d3.scale.linear().domain([0, 131]).range([0 + padding, width-padding]);
	var yScale = d3.scale.linear().domain([0, 131]).range([height, 10]);

	var xAxis = d3.svg.axis().scale(xScale).tickSize(0);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);

	svg.append("g")
	  .attr("class", "taxis")
	  .attr("transform", "translate(0, " + (height - padding) + ")")
	  .call(xAxis).selectAll("text").remove();

	svg.append("g")
		.attr("class", "taxis")
		.attr("transform", "translate(" + padding + ", 0)")
		.call(yAxis).selectAll("text").remove();

	crashdata.forEach(function(d){
		if (d.year == 2013 && d.town == "Total") { 
			var x = 1; 
			var y = 130; 
			
			for(var i = 1; i < d.mot_fat+1; i++) { 
				svg.append("circle")  
					.attr("cx", xScale(x))
					.attr("cy", yScale(y))
					.attr("r", 2.8)
					.attr("fill", "#e7298a")
				if (x == 130) { x = 1; y--; } else { x++; }
			}
			for(var i = 1; i < d.mot_inj+1; i++) { 
				svg.append("circle")  
					.attr("cx", xScale(x))
					.attr("cy", yScale(y))
					.attr("r", 2.8)
					.attr("stroke-width", .5)
					.attr("stroke", "#e7298a")
					.attr("fill", "none")
				if (x == 130) { x = 1; y--; } else { x++; }
			}
		}
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
		"dataIndex" : "mot_inj",
		"header" : "Bike Injuries"
	},{ 
		"dataIndex" : "mot_fat",
		"header" : "Bike Fatalities"
	}];

	var options = {
		"divId" : "crashTableDiv",
		"caption": "Nonmotorized Crash Data over Time: Bicycle and Pedestrian Injuries and Fatalities from 2004 to 2013",
	};

	$("#crashTable").accessibleGrid(colDesc, options, crashjson);
}
