var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "../../JSON/CMP_2014_ART_ROUTES.topojson")
	.defer(d3.csv, "../../JSON/arterial_route_id_table.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1], results[2]);
		//CTPS.demoApp.generateChart(results[1]);
		CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, arterials, route_ids) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var arterialRoads = topojson.feature(arterials, arterials.objects.collection).features;
	
	arterialRoads.forEach(function(i){
		route_ids.forEach(function(j){
			if (i.properties.RID == j.RID) { 
				i.properties.RTE_NAME_ID = j.ROUTE;
				i.properties.RTE_DIR_ID = j.DIRECTON;
			}
		})
	})
	
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

	// SVG Viewport
	var svgContainer = d3.select("#mapNonInterstate").append("svg")
		.attr("width", "100%")
		.attr("height", 800);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 150])
	  .html(function(d) {
	    return d.properties.RTE_NAME_ID.substring(0, d.properties.RTE_NAME_ID.lastIndexOf(" ")) + "<br>Speed Limit: " + d.properties.SPD_LIMIT + "<br>Speed Index: " + d3.round(d.properties.AM_SPD_IX, 3);
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
		.data(arterialRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { 
				if (parseInt(d.properties.RID)%2 == 1) { 
					var twoBarrels = d.properties.RID + 1; 
				} else {
					var twoBarrels = d.properties.RID;
				}
				return "interstate mapsegment" + twoBarrels + " " + d.properties.RTE_NAME.replace(/\//g, '-').replace(' ', '-') + "-" + d.properties.ROAD_NAME.replace('/', 'or').split(' ').join('-');})
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
				var thirdWord = arr[1]; 
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
				var thirdWord = arr[1]; 
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
		arterialRoads.forEach(function(j){ 
			if (j.properties.RID == d.properties.RID) { 
				storage.push(j.properties.TO_MEAS); 
				shift.push(j.properties.FROM_MEAS);
			}
		})
		return [d3.max(storage), d3.min(shift)]; 
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	arterialRoads.forEach(function(i){ 
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
		arterialRoads.forEach(function(i){
			if (d.properties.RTE_NAME_ID.substring(0, d.properties.RTE_NAME_ID.lastIndexOf(" ")) == i.properties.RTE_NAME_ID.substring(0, i.properties.RTE_NAME_ID.lastIndexOf(" "))) {
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

		var yScale = d3.scale.linear().domain([0, d3.max(maxmins)]).range([685, 80]);
		var ySegment = d3.scale.linear().domain([0, d3.max(maxmins)]).range([0, 605]);

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
			.attr("y", 700)
			.style("font-weight", 300)
			.style("font-size", 10)
			.style("text-anchor", "middle")

		roadWindow.append("text")
			.html(crossGraph[0].properties.RTE_NAME_ID.substring(0, d.properties.RTE_NAME_ID.lastIndexOf(" ")))
			.attr("x", 100)
			.attr("y", 50)
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
//Color key
		var xPos = 5;
		var yPos = 50; 
		var height = 600; 
		//background
		svgContainer.append("text")
			.style("font-weight", 700)
			.attr("x", xPos).attr("y", yPos -7)
			.text("KEY");
		//text and colors
		svgContainer.append("rect")
			.style("fill", colorScale(.5)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 7)
			.text("0.5 : Very congested");
		svgContainer.append("rect")
			.style("fill", colorScale(.7)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 22)
			.text("0.7 : Congested");
		svgContainer.append("rect")
			.style("fill", colorScale(.9)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 37)
			.text("0.9 : Not congested");
		svgContainer.append("rect")
			.style("fill", colorScale(1)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 52)
			.text("1.0 : At speed limit");
		svgContainer.append("rect")
			.style("fill", colorScale(1.25)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 67)
			.text("1.2 : Above speed limit");
	
} // CTPS.demoApp.generateViz()

//Animation
CTPS.demoApp.generateTraveller = function(towns, arterials) { 
	//Map of free flow
	// SVG Viewport
	topojson.feature(arterials, arterials.objects.collection).features.sort(function(a,b){
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
		.attr("height", 400);

	//Free Flow Map
	var mapcSVG = freeFlow.selectAll(".freeFlow")
		.data(topojson.feature(towns, towns.objects.collection).features)
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
		.data(topojson.feature(arterials, arterials.objects.collection).features)
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
		.attr("height", 400);

	var mapcSVGam = amCong.selectAll(".amCong")
		.data(topojson.feature(towns, towns.objects.collection).features)
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
		.data(topojson.feature(arterials, arterials.objects.collection).features)
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
		.attr("height", 400);

	var mapcSVGpm = pmCong.selectAll(".pmCong")
		.data(topojson.feature(towns, towns.objects.collection).features)
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
		.data(topojson.feature(arterials, arterials.objects.collection).features)
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