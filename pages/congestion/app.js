var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "../../JSON/CMP_2014_EXP_ROUTES.topojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
		CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTimes(results[1]);
		CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, congestion) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([22000]) // N.B. The scale and translation vector were determined empirically.
	.translate([120, 950]);
	
	var geoPath = d3.geo.path().projection(projection);

	var maxmin = []; 

	var interstateRoads = topojson.feature(congestion, congestion.objects.collection).features;

	interstateRoads.forEach(function(i) { 
		maxmin.push(i.properties.AM_SPD_IX);
	})

	// SVG Viewport
	var svgContainer = d3.select("#map").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 10])
	  .html(function(d) {
	    return d.properties.ROUTE_NUM + "<br>Speed Limit: " + d.properties.SPD_LIMIT + "<br>Speed Index: " + d.properties.AM_SPD_IX;
	  })

	svgContainer.call(tip); 

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
			.style("opacity", .1);

	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "interstate mapsegment" + d.id;})
			.attr("d", function(d, i) { return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke-width", function(d) { return (1/d.properties.AM_SPD_IX*5); })
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.AM_SPD_IX);
			})
			.style("opacity", .2)//function(d) { return (d.properties.AM_SPD_IX-.5);})
		.on("mouseenter", function(d) {
            	tip.show(d);
            })
        .on("mouseleave", function(d) {
            	tip.hide(d);
	     })
} // CTPS.demoApp.generateViz()


CTPS.demoApp.generateChart = function(congestion) {	
//Create chart comparing interstate roads by coordinates
	//Create AM chart
	var interstateRoads = topojson.feature(congestion, congestion.objects.collection).features;

	var twoCharts = d3.select("#speedindex").append("svg")
		.attr("id", "twoCharts")
		.attr("width", 800)
		.attr("height", 600)

	var amchartContainer = d3.select("#twoCharts").append("svg")
		.attr("width", 310)
		.attr("height", 600)
		.attr("x", 0)
		.attr("y", 0);

	//axis label
	amchartContainer.append("text")
		.style("font-size", "14px")
		.attr("x", "180px")
		.attr("y", "45px")
		.html("AM Speed Index");

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr("background", "black")
	  .attr("color", "white")
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.properties.SEG_BEGIN + " <br>to " + d.properties.SEG_END + "<br> AM/PM Speed Index: <br><b>" + d3.round(d.properties.AM_SPD_IX, 2) + " / " + d3.round(d.properties.PM_SPD_IX, 2) + "</b>";
	  })
	  .style("line-height", 1.4)

	amchartContainer.call(tip2); 
	

	var nested_directions = d3.nest()
	.key(function(d) {
		var directionKey = ""; 
		if (d.properties.DIRECTION == "Northbound") { directionKey = "NB"};
		if (d.properties.DIRECTION == "Eastbound") { directionKey = "EB"};
		if (d.properties.DIRECTION == "Westbound") { directionKey = "WB"};
		if (d.properties.DIRECTION == "Southbound") { directionKey = "SB"};
		return d.properties.ROUTE_NUM + " " + directionKey;})
	.entries(interstateRoads)

	console.log(nested_directions)

	

	var routes = []; 
	var maxmins = [];

	interstateRoads.forEach(function(i){ 
		routes.push(i.properties.ROUTE_NUM)
		maxmins.push(i.properties.TO_MEAS)
	})
	routes.sort(); 
	var routesByTotal = ["I-95", "I-495", "I-93", "I-90", "MA-3", "MA-2", "MA-128", "US-1", "MA-24", "US-3", "I-290"];
	//Assign scales and axes 
	xScaleRoad = d3.scale.linear().domain([d3.max(maxmins), 0]).range([5, 300]);
	xScaleSegment = d3.scale.linear().domain([0, d3.max(maxmins)]).range([0, 295]);
	yScale = d3.scale.ordinal().domain(routesByTotal).rangePoints([90, 520]);

	var xAxis = d3.svg.axis().scale(xScaleRoad).orient("bottom").ticks(7);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);

	amchartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 540)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);
	
	amchartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(40, 0)")
		.style("font-size", "10px")
		.call(yAxis).selectAll("text").remove(); 

	function amfindFlipFrom(d) { 
		var fromstorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.ROUTE_NUM == d.properties.ROUTE_NUM && j.properties.DIRECTION == d.properties.DIRECTION) { 
				fromstorage.push(j.properties.FROM_MEAS); 
			}
		})
		var frommax = d3.max(fromstorage);

		var tostorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.ROUTE_NUM == d.properties.ROUTE_NUM && j.properties.DIRECTION == d.properties.DIRECTION) { 
				tostorage.push(j.properties.TO_MEAS); 
			}
		})

		var tomax = d3.max(tostorage);

		var returnarray = [];
		returnarray.push(frommax); 
		returnarray.push(tomax - frommax);

		return returnarray;
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.forEach(function(i){ 
		if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.FROM_MEAS - amfindFlipFrom(i)[0]) + amfindFlipFrom(i)[1];
		} else if (i.properties.ROUTE_NUM == "MA-2" && i.properties.DIRECTION == "Eastbound") {
			i.properties.NORMALIZEDSTART = i.properties.TO_MEAS - 5751.4697;
		} else {
			i.properties.NORMALIZEDSTART = i.properties.TO_MEAS;
		}
	}); 

	amchartContainer.selectAll(".ambars")
		.data(interstateRoads)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " ambars";})
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.TO_MEAS))) { 
					return 0;
				} else { 
					return xScaleSegment(Math.abs(d.properties.TO_MEAS-d.properties.FROM_MEAS)); 
				}})
			.attr("x", function(d) { 
				if (isNaN(parseInt(d.properties.FROM_MEAS))) { 
					return -50;
				} else { 
					return xScaleRoad(d.properties.NORMALIZEDSTART)};
				})
			.attr("y", function(d) { 
				if (d.properties.DIRECTION == "Eastbound" || d.properties.DIRECTION == "Northbound") { 
					return yScale(d.properties.ROUTE_NUM) - 2 ;
				} else {
					return yScale(d.properties.ROUTE_NUM) - 20;

				}
			})
			.style("stroke", "none")
			.style("fill", function(d) { 
					if (!isNaN(d.properties.AM_SPD_IX)){
						return colorScale(d.properties.AM_SPD_IX);
					} else { 
						return "#191b1d"; 
					}
				})
			.on("mouseenter", function (d) { 
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "#ddd")
					.style("stroke-width", 1)
					.attr("transform", "translate(0, -3)")
					.attr("height", 21);

				d3.selectAll(".map" + firstWord).transition()
					.style("opacity", 1)
					.style("stroke-width", function(d) { return (4/d.properties.AM_SPD_IX*5); })

				tip2.show(d); 
			})
			.on("mouseleave", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "none")
					.style("stroke-width", 0)
					.attr("transform", "translate(0, 0)")
					.attr("height", 15)

				d3.selectAll(".map" + firstWord).transition()
					.style("opacity", .2)
					.style("stroke-width", function(d) { return (1/d.properties.AM_SPD_IX*5); });

				tip2.hide(d);
			})
		.html(function(d) { return d.properties.ROUTE_NUM; });
	
	//Create PM Charts

var pmchartContainer = d3.select("#twoCharts").append("svg")
		.attr("width", 380)
		.attr("height", 600)
		.attr("x", 305)
		.attr("y", 0);


	pmchartContainer.call(tip2); 

pmchartContainer.selectAll(".labels")
		.data(nested_directions)
		.enter()
		.append("text")
		.attr("class", "labels")
			.attr("x", 35)
			.attr("y", function(d) { 
				if (d.values[0].properties.DIRECTION == "Eastbound" || d.values[0].properties.DIRECTION == "Northbound") { 
					return yScale(d.values[0].properties.ROUTE_NUM) - 8;
				} else {
					return yScale(d.values[0].properties.ROUTE_NUM) + 10;
				}})
			.style("stroke", "none")
			.style("font-size", 11)
			.style("fill", "#ddd")
			.style("font-weight", 400)
			.style("text-anchor", "middle")
			.text(function(d) { return d.key;});

	function pmfindFlipFrom(d) { 
			var storage = []; 
			interstateRoads.forEach(function(j){ 
				if (j.properties.ROUTE_NUM == d.properties.ROUTE_NUM && j.properties.DIRECTION == d.properties.DIRECTION) { 
					storage.push(j.properties.TO_MEAS); 
				}
			})
			var max = d3.max(storage); 
			return max; 
		}

		//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
		interstateRoads.forEach(function(i){ 
			if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
				i.properties.NORMALIZEDSTART = -(i.properties.TO_MEAS - pmfindFlipFrom(i));
			} else if (i.properties.ROUTE_NUM == "MA-2" && i.properties.DIRECTION == "Eastbound") {
				i.properties.NORMALIZEDSTART = i.properties.FROM_MEAS - 5751.4697;
			} else {
				i.properties.NORMALIZEDSTART = i.properties.FROM_MEAS;
			}
		}); 
	//Assign scales and axes 
	xScaleRoad = d3.scale.linear().domain([0,d3.max(maxmins)]).range([75, 370]);
	xScaleSegment = d3.scale.linear().domain([0,d3.max(maxmins)]).range([0, 295]);

	var xAxis = d3.svg.axis().scale(xScaleRoad).orient("bottom").ticks(7);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);

	pmchartContainer.append("text")
	.attr("x", 75)
	.attr("y", 45)
	.style("font-size", "14px")
	.style("text-align", "center")
	.html("PM Speed Index");

	pmchartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 540)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);
	
	pmchartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(40, 0)")
		.style("font-size", "12px")
		.call(yAxis).selectAll("text").remove();

	pmchartContainer.selectAll(".pmbars")
		.data(interstateRoads)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " pmbars" ;})
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.TO_MEAS))) { 
					return 0;
				} else { 
					return xScaleSegment(Math.abs(d.properties.TO_MEAS-d.properties.FROM_MEAS)); 
				}})
			.attr("x", function(d) { 
				if (isNaN(parseInt(d.properties.FROM_MEAS))) { 
					return -50;
				} else { 
					return xScaleRoad(d.properties.NORMALIZEDSTART)};
				})
			.attr("y", function(d) { 
				if (d.properties.DIRECTION == "Eastbound" || d.properties.DIRECTION == "Northbound") { 
					return yScale(d.properties.ROUTE_NUM) - 2 ;
				} else {
					return yScale(d.properties.ROUTE_NUM) - 20;

				}
			})
			.style("stroke", "none")
			.style("fill", function(d) { 
					if (!isNaN(d.properties.PM_SPD_IX)){
						return colorScale(d.properties.PM_SPD_IX);
					} else { 
						return "#191b1d"; 
					}
				})
			.on("mouseenter", function (d) { 
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "#ddd")
					.style("stroke-width", 1)
					.attr("transform", "translate(0, -3)")
					.attr("height", 21);

				d3.selectAll(".map" + firstWord).transition()
					.style("opacity", 1)
					.style("stroke-width", function(d) { return (4/d.properties.AM_SPD_IX*5); })

				tip2.show(d); 
			})
			.on("mouseleave", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "none")
					.style("stroke-width", 0)
					.attr("transform", "translate(0, 0)")
					.attr("height", 15)

				d3.selectAll(".map" + firstWord).transition()
					.style("opacity", .2)
					.style("stroke-width", function(d) { return (1/d.properties.AM_SPD_IX*5); });

				tip2.hide(d);
			})
		.html(function(d) { return d.properties.ROUTE_NUM; });

}

CTPS.demoApp.generateTimes = function(interstateRoads) {	

	var cumulativeTime = d3.select("#cumulativetime").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var nested_roads = d3.nest()
	.key(function(d) { return d.properties.ROUTE_NUM + " " + d.properties.DIRECTION; })
	.entries(interstateRoads);

		//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr("background", "black")
	  .attr("color", "white")
	  .offset([-10, 0])
	  .html(function(d) {
			return d.properties.ROUTE_NUM + " " + d.properties.DIRECTION;
	  });

	cumulativeTime.call(tip2); 

	var routes = []; 
	var maxmins = [];

	interstateRoads.forEach(function(i){ 
		routes.push(i.properties.ROUTE_NUM)
		maxmins.push(i.properties.TO_MEAS)
	})
	routes.sort(); 

	//Assign scales and axes 
	/*xScaleRoad = d3.scale.linear().domain([0, d3.max(maxmins)]).range([50, 1050]);
	xScaleSegment = d3.scale.linear().domain([0, d3.max(maxmins)]).range([0, 1000]);
	yScale = d3.scale.linear().domain([0, 50]).range([550, 60]);

	var xAxis = d3.svg.axis().scale(xScaleRoad).orient("bottom").ticks(7);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 550)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);
	
	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.style("font-size", "10px")
		.call(yAxis); 

	function findFlipFrom(d) { 
		var storage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.ROUTE_NUM == d.properties.ROUTE_NUM && j.properties.DIRECTION == d.properties.DIRECTION) { 
				storage.push(j.properties.TO_MEAS); 
			}
		})
		var max = d3.max(storage); 
		return max; 
	}

		//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.forEach(function(i){ 
		if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.TO_MEAS - findFlipFrom(i));
			i.properties.NORMALIZEDEND = -(i.properties.FROM_MEAS - findFlipFrom(i));
		} else if (i.properties.ROUTE_NUM == "MA-2" && i.properties.DIRECTION == "Eastbound") {
			i.properties.NORMALIZEDSTART = i.properties.FROM_MEAS - 5751.4697;
			i.properties.NORMALIZEDEND = i.properties.TO_MEAS - 5751.4697; 
		} else {
			i.properties.NORMALIZEDSTART = i.properties.FROM_MEAS;
			i.properties.NORMALIZEDEND = i.properties.TO_MEAS;
		}
	}); 

	nested_roads.forEach(function(i) { 
		var amcumulative = 0; 
		var pmcumulative = 0; 

		i.values.sort(function(a,b) { 
			var nameA = a.properties.NORMALIZEDSTART; // ignore upper and lowercase
			var nameB = b.properties.NORMALIZEDSTART;
			  if (nameA < nameB) {return -1; }
			  if (nameA > nameB) {return 1;}
			  return 0; 
		});

		i.values.forEach(function(j){ 
			cumulativeTime.append("line")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " lines")
					.attr("x1", xScaleRoad(j.properties.NORMALIZEDSTART))
					.attr("x2", xScaleRoad(j.properties.NORMALIZEDEND))
					.attr("y1", yScale(amcumulative))
					.attr("y2", function() { 
						if (isNaN(j.properties.AM_DEL_MI)) { 
							return yScale(amcumulative); 
						} else {
							return yScale(amcumulative + j.properties.AM_DEL_MI)
						}
					})
					.style("stroke", "#FFd056")
					.style("stroke-width", 2)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".lines").transition()
							.attr("opacity", 0.2)
							.attr("stroke-width", 2);

						d3.selectAll("." + firstWord).transition()
							.style("stroke-width", 2)
							.style("opacity", 1)
							.attr("r", 3);

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".lines").transition()
							.attr("opacity", 1)
							.style("stroke-width", 2);

						d3.selectAll(".circles").transition()
							.attr("r", 0);

						tip2.hide(j);
					});

			cumulativeTime.append("circle")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " circles")
					.attr("cx", xScaleRoad(j.properties.NORMALIZEDEND))
					.attr("cy", function() { 
						if (isNaN(j.properties.AM_DEL_MI)) { 
							return yScale(amcumulative); 
						} else {
							return yScale(amcumulative + j.properties.AM_DEL_MI)
						}
					})
					.attr("r", 0)
					.style("fill", "#FFd056");

			cumulativeTime.append("line")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " lines")
					.attr("x1", xScaleRoad(j.properties.NORMALIZEDSTART))
					.attr("x2", xScaleRoad(j.properties.NORMALIZEDEND))
					.attr("y1", yScale(pmcumulative))
					.attr("y2", function() { 
						if (isNaN(j.properties.PM_DEL_MI)) { 
							return yScale(pmcumulative); 
						} else {
							return yScale(pmcumulative + j.properties.PM_DEL_MI)
						}
					})
					.style("stroke", "#408DFF")
					.style("stroke-width", 2)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".lines").transition()
							.attr("opacity", 0.2)
							.attr("stroke-width", 2);

						d3.selectAll("." + firstWord).transition()
							.style("stroke-width", 2)
							.style("opacity", 1)
							.attr("r", 3);

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".lines").transition()
							.attr("opacity", 1)
							.style("stroke-width", 2);

						d3.selectAll(".circles").transition()
							.attr("r", 0);

						tip2.hide(j);
					});

			cumulativeTime.append("circle")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " circles")
					.attr("cx", xScaleRoad(j.properties.NORMALIZEDEND))
					.attr("cy", function() { 
						if (isNaN(j.properties.PM_DEL_MI)) { 
							return yScale(pmcumulative); 
						} else {
							return yScale(pmcumulative + j.properties.PM_DEL_MI)
						}
					})
					.attr("r", 0)
					.style("fill", "#408DFF");

			if (!isNaN(j.properties.AM_DEL_MI)) { 
				amcumulative += j.properties.AM_DEL_MI; 
			} 

			if (!isNaN(j.properties.PM_DEL_MI)) { 
				pmcumulative += j.properties.PM_DEL_MI; 
			}
		})
	})*/

	//Assign scales and axes 
	xScale = d3.scale.linear().domain([0, 3.5]).range([50, 1050]);
	yScale = d3.scale.linear().domain([0, 6]).range([550, 60]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(7);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 550)").style("stroke-width", "1px")
		.style("font-size", "14px")
		.call(xAxis);
	
	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.style("font-size", "14px")
		.call(yAxis); 

	cumulativeTime.append("line")
		.attr("x1", xScale(1))
		.attr("x2", xScale(1))
		.attr("y1", yScale(0))
		.attr("y2", yScale(6))
		.attr("stroke-width", .5)
		.attr("stroke", "#ddd")

	cumulativeTime.append("line")
		.attr("x1", xScale(0))
		.attr("x2", xScale(3.5))
		.attr("y1", yScale(1))
		.attr("y2", yScale(1))
		.attr("stroke-width", .5)
		.attr("stroke", "#ddd")

	nested_roads.forEach(function(i) { 
		var amcumulative = 0; 
		var pmcumulative = 0; 

		i.values.sort(function(a,b) { 
			var nameA = a.properties.NORMALIZEDSTART; // ignore upper and lowercase
			var nameB = b.properties.NORMALIZEDSTART;
			  if (nameA < nameB) {return -1; }
			  if (nameA > nameB) {return 1;}
			  return 0; 
		});

		i.values.forEach(function(j){ 

			cumulativeTime.append("circle")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " circles")
					.attr("cx", xScale(j.properties.AM_SPD_IX))
					.attr("cy", yScale(j.properties.AM_AVTT_IX))
					.attr("r", j.properties.LANES * j.properties.LANES)
					.style("stroke", "#FFd056")
					.style("fill", "#191b1d")
					.style("stroke-width", 1)
					.style("opacity", .5)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".circles")
							.style("opacity", .1);

						d3.selectAll("." + firstWord)
							.style("stroke-width", 2)
							.style("opacity", 1)

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".circles")
							.style("stroke-width", 1)
							.style("opacity", .5);

						tip2.hide(j);
					});

			cumulativeTime.append("circle")
					.attr("class", j.properties.ROUTE_NUM + j.properties.DIRECTION + " circles")
					.attr("cx", xScale(j.properties.PM_SPD_IX))
					.attr("cy", yScale(j.properties.PM_AVTT_IX))
					.attr("r", j.properties.LANES * j.properties.LANES)
					.style("stroke", "#408DFF")
					.style("fill", "#191b1d")
					.style("opacity", .5)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".circles")
							.style("opacity", .1);

						d3.selectAll("." + firstWord)
							.style("stroke-width", 2)
							.style("opacity", 1)

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".circles")
							.style("stroke-width", 1)
							.style("opacity", .5);

						tip2.hide(j);
					});
		})
	})

	cumulativeTime.append("text")
		.attr("x", xScale(2))
		.attr("y", yScale(1.05))
		.text("Congested Travel Time = Free Flow Travel Time")

	cumulativeTime.append("text")
		.attr("x", xScale(-1.2))
		.attr("y", yScale(2.7))
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "start")
		.text("Travelling at Speed Limit")


}

CTPS.demoApp.generateTraveller = function(cities, congestion) { 
	//Map of free flow
	// SVG Viewport
	var interstateRoads = topojson.feature(congestion, congestion.objects.collection).features;
	console.log(interstateRoads);

	interstateRoads.sort(function(a,b){
		var nameA = a.properties.ROUTE_NUM;
		var nameB = b.properties.ROUTE_NUM;
		if (nameA < nameB) { return -1}
		if (nameA > nameB) { return 1}
		else { 
			var nameC = a.properties.FROM_MEAS;
			var nameD = b.properties.FROM_MEAS;
			if (nameC < nameD) { return -1}
			if (nameC > nameD) { return 1}
			return 0;
		}
	})

	var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([18000]) // N.B. The scale and translation vector were determined empirically.
	.translate([40,750]);
	
	var geoPath = d3.geo.path().projection(projection);

	var freeFlow = d3.select("#freeFlow").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	//Free Flow Map
	var mapcSVG = freeFlow.selectAll(".freeFlow")
		.data(topojson.feature(cities, cities.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "freeFlow")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVG = freeFlow.selectAll(".freeFlowRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "freeFlowRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", "#ddd")
			.style("opacity", 0)

	//AM Congestion Road
	var amCong = d3.select("#amCong").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	var mapcSVGam = amCong.selectAll(".amCong")
		.data(topojson.feature(cities, cities.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "amCong")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVGam = amCong.selectAll(".amCongRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "amCongRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.AM_SPD_IX);
			})
			.style("opacity", 0)

	//PM Congestion Road
	var pmCong = d3.select("#pmCong").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	var mapcSVGpm = pmCong.selectAll(".pmCong")
		.data(topojson.feature(cities, cities.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "pmCong")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVGpm = pmCong.selectAll(".pmCongRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "pmCongRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.PM_SPD_IX);
			})
			.style("opacity", 0)

	//Minute counters
	/*freeFlow.append("text")
		.attr("class", "freeFlow")
		.attr("x", 0)
		.attr("y", 30)
		.style("font-weight", 300)
		.text("Time spent in congestion:" + minutes + " min")*/

	//Click button to start animation
	d3.selectAll("#congAnim").on("click", function() { 
	//Freeflow Animation
		var timecounter = 0;
	    var minutes = 0; 

	    d3.selectAll(".freeFlowRoad")
			.transition()
			.delay(function(d) { 
				timecounter += d.properties.SPD_LIMIT ;
				return timecounter;
			})
			.duration(2400)
			.style("stroke-width", 3)
			.style("opacity", 1)
			

		//AM Animation
		var timecounteram = 0;
	    d3.selectAll(".amCongRoad").transition()
			.delay(function(d) { 
				timecounteram += (1/d.properties.AM_SPD_IX) * d.properties.SPD_LIMIT ;
				return timecounteram;
			})
			.duration(function(d) { return (1/d.properties.AM_SPD_IX) * 2400; })
			.style("stroke-width", function(d) { return 1/d.properties.AM_SPD_IX * 5; })
			.style("opacity", 1)

		//PM Animation
		var timecounterpm = 0;
	    d3.selectAll(".pmCongRoad").transition()
			.delay(function(d) { 
				timecounterpm += (1/d.properties.PM_SPD_IX) * d.properties.SPD_LIMIT ;
				return timecounterpm;
			})
			.duration(function(d) { return (1/d.properties.PM_SPD_IX) * 2400; })
			.style("stroke-width", function(d) { return 1/d.properties.PM_SPD_IX * 5; })
			.style("opacity", 1)
	})

}