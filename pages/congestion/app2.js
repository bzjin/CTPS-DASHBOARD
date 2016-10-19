//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

//Define Color Scale
var colorScale = d3.scaleLinear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "../../data/json/CMP_2014_ART_ROUTES.topojson")
	.defer(d3.csv, "../../data/csv/arterial_route_id_table.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1], results[2]);
		//CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, arterials, route_ids) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var arterialRoads = topojson.feature(arterials, arterials.objects.CMP_2014_ART_ROUTES_EXT_MPO).features;

	var projScale = 45000,
		projXPos = 100,
		projYPos = 1720;

	var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos]);

	var projectionS = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos + 3, projYPos]);

	var projectionW = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos - 3]);
	
	var geoPath = d3.geoPath().projection(projection);
	var geoPathS = d3.geoPath().projection(projectionS);
	var geoPathW = d3.geoPath().projection(projectionW);

	// SVG Viewport
	var svgContainer = d3.select("#mapNonInterstate").append("svg")
		.attr("width", "100%")
		.attr("height", 800)
		.style("overflow", "visible");

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 150])
	  .html(function(d) {
	    return "<p><b>" + d.properties.RTE_NAME_ID.substring(0, d.properties.RTE_NAME_ID.lastIndexOf(" ")) + "</b></p><br>Speed Limit: " + d.properties.SPD_LIMIT + "<br>Speed Index: " + e(d.properties.AM_SPD_IX);
	  })

	svgContainer.call(tip); 

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
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
			.style("opacity", .2)
		.on("mouseenter", function(d) {
            	var mystring = this.getAttribute("class");
				var arr = mystring.split(" ");
				var thirdWord = arr[1]; 
				
				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
					.style("cursor", "pointer");

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
				
				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
		})

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

		var yScale = d3.scaleLinear().domain([0, d3.max(maxmins)]).range([685, 80]);
		var ySegment = d3.scaleLinear().domain([0, d3.max(maxmins)]).range([0, 605]);


		roadWindow.selectAll("rect, text").remove();

		var tip2 = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([0, -10])
		  .html(function(d) {
		    return "<b>" + d.properties.RTE_NAME_ID.substring(0, d.properties.RTE_NAME_ID.lastIndexOf(" ")) + "</b><br><br>Speed Limit: " + d.properties.SPD_LIMIT + "<br>Speed Index: " + e(d.properties.AM_SPD_IX);
		  })

		svgContainer.call(tip2); 
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
				.on("mouseenter", function(d) {
					d3.select(this).style("stroke", "white")
					tip2.show(d); 
				})
				.on("mouseleave", function (d) {
					d3.select(this).style("stroke", "none")
					tip2.hide(d);
				})

		roadWindow.selectAll(".textlabels")
			.data(crossGraph)
			.enter()
			.append("text")
				.attr("class", "textlabels")
				.text(function(d) { 
					if (Math.abs(d.properties.TO_MEAS - d.properties.FROM_MEAS) < 1000) { return ""}
					else if (d.properties.SEG_END == "NULL") { return ""}
					else { return d.properties.SEG_END;}})
				.attr("x", function(d) { 
					if (d.properties.DIRECTION == "Northbound" || d.properties.DIRECTION == "Eastbound") {
						return 75;
					} else {
						return 120;
					}})
				.attr("y", function(d) { return yScale(d.properties.NORMALIZEDSTART) ; })
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
