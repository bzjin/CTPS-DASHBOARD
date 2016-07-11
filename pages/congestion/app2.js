var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.geo.json")
	.defer(d3.json, "../../JSON/CMP_2014_ART_ROUTES.geojson")
	//.defer(d3.json, "JSON/road_inv_mpo_nhs_noninterstate_2015.geojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
		//CTPS.demoApp.generateChart(results[1]);
		CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mapcSubregions, interstateRoads) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var projScale = 45000,
		projXPos = 100,
		projYPos = 1720;

	var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos]);

	var projectionS = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos + 3, projYPos]);

	var projectionW = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos - 3]);
	
	var geoPath = d3.geo.path().projection(projection);
	var geoPathS = d3.geo.path().projection(projectionS);
	var geoPathW = d3.geo.path().projection(projectionW);

	var maxmin = []; 
	interstateRoads.features.forEach(function(i) { 
		maxmin.push(i.properties.AM_SPD_IX);
	})

	// SVG Viewport
	var svgContainer = d3.select("#mapNonInterstate").append("svg")
		.attr("width", "100%")
		.attr("height", 800);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 150])
	  .html(function(d) {
	    return d.properties.RTE_NAME + ": <p>" + d.properties.ROAD_NAME + "</p>Speed Limit: " + d.properties.SPD_LIMIT + "<br>Speed Index: " + d3.round(d.properties.AM_SPD_IX, 3);
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

	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(interstateRoads.features)
		.enter()
		.append("path")
			.attr("class", function(d) { return "interstate mapsegment" + d.id + " " + d.properties.RTE_NAME.replace(/\//g, '-').replace(' ', '-') + "-" + d.properties.ROAD_NAME.replace('/', 'or').split(' ').join('-');})
			.attr("d", function(d, i) { 
				if (d.properties.DIRECTION == "Northbound" || d.properties.DIRECTION == "Eastbound") { 
					return geoPath(d); 
				} else if (d.properties.DIRECTION == "Southbound") {
					return geoPathS(d);
				} else if (d.properties.DIRECTION == "Westbound") {
					return geoPathW(d);
				}})
			.style("fill", "none")
			.style("stroke-width", 1)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.AM_SPD_IX);
			})
			.style("opacity", .2)//function(d) { return (d.properties.AM_SPD_IX-.5);})
		.on("mouseenter", function(d) {
            	var mystring = this.getAttribute("class");
				var arr = mystring.split(" ");
				var thirdWord = arr[2]; 
				console.log(thirdWord)
				
				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
				tip.show(d); 
			})
		.on("mouseleave", function (d) {
				tip.hide(d);
			})
		.on("click", function(d) {
			crossSection(d);

			var mystring = this.getAttribute("class");
				var arr = mystring.split(" ");
				var thirdWord = arr[2]; 
				console.log(thirdWord)
				
				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
		})
	
	function findFlipFrom(d) { 
		var storage = []; 
		var shift = [];
		interstateRoads.features.forEach(function(j){ 
			if (j.properties.ROAD_NAME == d.properties.ROAD_NAME && j.properties.RTE_NAME == d.properties.RTE_NAME && j.properties.DIRECTION == d.properties.DIRECTION) { 
				storage.push(j.properties.TO_MEAS); 
				shift.push(j.properties.FROM_MEAS);
			}
		})
		return [d3.max(storage), d3.min(shift), d3.min(storage)]; 
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.features.forEach(function(i){ 
		if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
			i.properties.NORMALIZEDSTART = Math.abs(Math.abs(-(i.properties.FROM_MEAS - findFlipFrom(i)[0]))) ;
		} else {
			i.properties.NORMALIZEDSTART = Math.abs(i.properties.TO_MEAS - findFlipFrom(i)[1]);
		}
	}); 

	var roadWindow = d3.select("#crossSection").append("svg")
		.attr("width", "100%")
		.attr("height", 800)
		.style("overflow", "visible")

	function crossSection(d) { 
		var crossGraph = [];
		interstateRoads.features.forEach(function(i){
			if (i.properties.ROAD_NAME == d.properties.ROAD_NAME && i.properties.RTE_NAME == d.properties.RTE_NAME) {
				crossGraph.push(i);
			}
		})

		var maxmins = []; 
		var directions = 0; 
		crossGraph.forEach(function(j){
			maxmins.push(j.properties.NORMALIZEDSTART + Math.abs(d.properties.TO_MEAS - d.properties.FROM_MEAS))
			maxmins.push(j.properties.NORMALIZEDSTART);
			if (j.properties.DIRECTION == "Northbound" || j.properties.DIRECTION == "Southbound") { directions++; }
		})

		var yScale = d3.scale.linear().domain([0, d3.max(maxmins)]).range([600, 150]);
		var ySegment = d3.scale.linear().domain([0, d3.max(maxmins)]).range([0, 450]);

		roadWindow.selectAll("rect, text").remove();

		//Append labels
		roadWindow.append("text")
			.text(function(){
				if (directions > 0) { 
					return "NB SB";
				} else {
					return "EB WB";
				}
			})
			.attr("x", 97)
			.attr("y", 615)
			.style("font-weight", 300)
			.style("text-anchor", "middle")

		roadWindow.append("text")
			.html(crossGraph[0].properties.RTE_NAME)
			.attr("x", 100)
			.attr("y", 120)
			.style("text-anchor", "middle")
		
		roadWindow.append("text")
			.html(crossGraph[0].properties.ROAD_NAME)
			.attr("x", 100)
			.attr("y", 140)
			.style("text-anchor", "middle")

		roadWindow.selectAll(".crossSectionAM")
			.data(crossGraph)
			.enter()
			.append("rect")
				.attr("class", "crossSectionAM")
				.attr("width", 15)
				.attr("height", function(d) { return ySegment(Math.abs(d.properties.TO_MEAS - d.properties.FROM_MEAS)); })
				.attr("x", function(d) { 
					if (d.properties.DIRECTION == "Northbound" || d.properties.DIRECTION == "Eastbound") {
						return 80;
					} else {
						return 100;
					}})
				.attr("y", function(d) { return yScale(d.properties.NORMALIZEDSTART); })
				.style("fill", function(d) { return colorScale(d.properties.AM_SPD_IX)})

		roadWindow.selectAll(".textlabels")
			.data(crossGraph)
			.enter()
			.append("text")
				.attr("class", "textlabels")
				.text(function(d) { return d.properties.SEG_END;})
				.attr("x", function(d) { 
					if (d.properties.DIRECTION == "Northbound" || d.properties.DIRECTION == "Eastbound") {
						return 75;
					} else {
						return 120;
					}})
				.attr("y", function(d) { return yScale(d.properties.NORMALIZEDSTART); })
				.style("fill", "#fff")
				.style("font-size", 10)
				.style("font-weight", 300)
				.style("text-anchor", function(d){
					if (d.properties.DIRECTION == "Northbound" || d.properties.DIRECTION == "Eastbound") {
						return "end";
					} else {
						return "start";
					}})
			
	} 

	
} // CTPS.demoApp.generateViz()


CTPS.demoApp.generateChart = function(interstateRoads) {	
//Create chart comparing interstate roads by coordinates
	//Create AM chart
	var amchartContainer = d3.select("#amchart").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

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
		return d.properties.ROAD_NAME + " " + directionKey;})
	.entries(interstateRoads.features)

	console.log(nested_directions)

	

	var routes = []; 
	var maxmins = [];

	interstateRoads.features.forEach(function(i){ 
		routes.push(i.properties.ROAD_NAME)
		maxmins.push(i.properties.TO_MEAS)
	})
	routes.sort(); 
	//Assign scales and axes 
	xScaleRoad = d3.scale.linear().domain([d3.max(maxmins), 0]).range([5, 300]);
	xScaleSegment = d3.scale.linear().domain([0, d3.max(maxmins)]).range([0, 295]);
	yScale = d3.scale.ordinal().domain(routes).rangePoints([90, 520]);

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
		interstateRoads.features.forEach(function(j){ 
			if (j.properties.ROAD_NAME == d.properties.ROAD_NAME && j.properties.DIRECTION == d.properties.DIRECTION) { 
				fromstorage.push(j.properties.FROM_MEAS); 
			}
		})
		var frommax = d3.max(fromstorage);

		var tostorage = []; 
		interstateRoads.features.forEach(function(j){ 
			if (j.properties.ROAD_NAME == d.properties.ROAD_NAME && j.properties.DIRECTION == d.properties.DIRECTION) { 
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
	interstateRoads.features.forEach(function(i){ 
		if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.FROM_MEAS - amfindFlipFrom(i)[0]) + amfindFlipFrom(i)[1];
		} else {
			i.properties.NORMALIZEDSTART = i.properties.TO_MEAS;
		}
	}); 

	amchartContainer.selectAll(".ambars")
		.data(interstateRoads.features)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " ambars";})
			.attr("height", 5)
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
					return yScale(d.properties.ROAD_NAME) - 2 ;
				} else {
					return yScale(d.properties.ROAD_NAME) - 12;

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
		.html(function(d) { return d.properties.ROAD_NAME; });
	
	//Create PM Charts

var pmchartContainer = d3.select("#pmchart").append("svg")
		.attr("width", "100%")
		.attr("height", 600);


	pmchartContainer.call(tip2); 

pmchartContainer.selectAll(".labels")
		.data(nested_directions)
		.enter()
		.append("text")
		.attr("class", "labels")
			.attr("x", 35)
			.attr("y", function(d) { 
				if (d.values[0].properties.DIRECTION == "Eastbound" || d.values[0].properties.DIRECTION == "Northbound") { 
					return yScale(d.values[0].properties.ROAD_NAME) - 8;
				} else {
					return yScale(d.values[0].properties.ROAD_NAME) + 10;
				}})
			.style("stroke", "none")
			.style("font-size", 11)
			.style("fill", "#ddd")
			.style("font-weight", 400)
			.style("text-anchor", "middle")
			.text(function(d) { return d.key;});

function pmfindFlipFrom(d) { 
		var storage = []; 
		interstateRoads.features.forEach(function(j){ 
			if (j.properties.ROAD_NAME == d.properties.ROAD_NAME && j.properties.DIRECTION == d.properties.DIRECTION) { 
				storage.push(j.properties.TO_MEAS); 
			}
		})
		var max = d3.max(storage); 
		return max; 
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.features.forEach(function(i){ 
		if ((i.properties.DIRECTION == "Westbound" || i.properties.DIRECTION == "Southbound")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.TO_MEAS - pmfindFlipFrom(i));
		} else if (i.properties.ROAD_NAME == "MA-2" && i.properties.DIRECTION == "Eastbound") {
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
		.data(interstateRoads.features)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " pmbars" ;})
			.attr("height", 5)
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
					return yScale(d.properties.ROAD_NAME) - 2 ;
				} else {
					return yScale(d.properties.ROAD_NAME) - 12;

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
		.html(function(d) { return d.properties.ROAD_NAME; });

}

CTPS.demoApp.generateTraveller = function(towns, congestion) { 
	//Map of free flow
	// SVG Viewport
	congestion.features.sort(function(a,b){
		var nameA = a.properties.ROAD_NAME;
		var nameB = b.properties.ROAD_NAME;
		if (nameA < nameB) { return -1}
		if (nameA > nameB) { return 1}
	
			return 0;
		
	})

	var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([18000]) // N.B. The scale and translation vector were determined empirically.
	.translate([40,750]);
	
	var geoPath = d3.geo.path().projection(projection);

	var freeFlow = d3.select("#freeFlow2").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	//Free Flow Map
	var mapcSVG = freeFlow.selectAll(".freeFlow")
		.data(towns.features)
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
		.data(congestion.features)
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
	var amCong = d3.select("#amCong2").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var mapcSVGam = amCong.selectAll(".amCong")
		.data(towns.features)
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
		.data(congestion.features)
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
	var pmCong = d3.select("#pmCong2").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var mapcSVGpm = pmCong.selectAll(".pmCong")
		.data(towns.features)
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
		.data(congestion.features)
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
	d3.selectAll("#congAnim2").on("click", function() { 
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
			.style("stroke-width", function(d) { return 1/(d.properties.AM_SPD_IX *d.properties.PM_SPD_IX)* 2; })
			.style("opacity", 1)

		//PM Animation
		var timecounterpm = 0;
	    d3.selectAll(".pmCongRoad").transition()
			.delay(function(d) { 
				timecounterpm += (1/d.properties.PM_SPD_IX) * d.properties.SPD_LIMIT ;
				return timecounterpm;
			})
			.duration(function(d) { return (1/d.properties.PM_SPD_IX) * 2400; })
			.style("stroke-width", function(d) { return 1/(d.properties.PM_SPD_IX*d.properties.PM_SPD_IX) * 2; })
			.style("opacity", 1)
	})

}