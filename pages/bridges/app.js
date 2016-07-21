var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.quantize().domain([1, 5])
    .range(["#d7191c", "#d7191c", "#d7191c", "#fdae61","#ffffbf","#a6d96a","#1a9641"]);

var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geo.path().projection(projection);	

//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/bridge_condition_timeline.JSON")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateBridgeTimeline(results[0]);
		CTPS.demoApp.generateBridgePlots(results[0]);
	}); 

CTPS.demoApp.generateBridgeTimeline = function(bridges) {

	var cleanedbridges = []; 
	bridges.forEach(function(i){
		if (i.healthIndex != -1) {
			cleanedbridges.push ({
				"bridgeId" : i.bridgeId,
				"healthIndex" : +i.healthIndex,
				"overFeature" : i.overFeature, 
				"underFeature" : i.underFeature,
				"adt" : +i.adt,
				"year" : i.year,
				"structDef" : i.structDef,
				"town": i.town
			})
		}
	})

	nested_struct_def = d3.nest() 
	.key(function(i) { return i.year })
	.entries(bridges) 

	var structdefs = [];
	nested_struct_def.forEach(function(i){ 
		var countT = 0; 
		var countF = 0; 
		var elseCount = 0; 
		var healthCount = 0; 
		var healthPoints = 0; 

		i.values.forEach(function(j){ 
			if ( j.structDef == "TRUE" || j.structDef == "True") { countT++;}
			if ( j.structDef == "FALSE" || j.structDef == "False") { countF++; }
			elseCount++;
			if (j.healthIndex != -1) { 
				healthPoints++;
				healthCount += +j.healthIndex;
			}
		})

		structdefs.push({
			"year" : i.key, 
			"structDef" : countT, //# structurally def bridges
			"structDefNOT" : countF, //#good bridges
			"totalCount" : elseCount, //# good bridges
			"healthavg" : healthCount/healthPoints
		})
		
	})

	//placeholders: 
	structdefs.push( { "year": 2008, "structDef": 900, "structDefNOT": 300, "totalCount": 1200, "healthavg": .8});
	structdefs.push( { "year": 2009, "structDef": 900, "structDefNOT": 300, "totalCount": 1200, "healthavg": .8});
	structdefs.push( { "year": 2011, "structDef": 900, "structDefNOT": 300, "totalCount": 1200, "healthavg": .8});
	
	structdefs.sort(function(a,b){ 
		var nameA = a.year;
		var nameB = b.year; 
		if (nameA < nameB) { return -1 }
		if (nameA > nameB) { return 1 }
		return 0; 
	})

	nested_ind_bridge = d3.nest()
	.key(function(i) { return i.bridgeId;})
	.entries(cleanedbridges);

	var timeline = d3.select("#timeline").append("svg")
	.attr("width", "100%")
	.attr("height", 500);

		//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale= d3.scale.linear().domain([2007, 2016]).range([70, 400]);
	yScale = d3.scale.linear().domain([0, 1]).range([450, 50]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-400, 0, 0).tickFormat(d3.format("d"));
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-330, 0, 0);

	timeline.append("text")
		.attr("x", -350)
		.attr("y", 20)
		.attr("transform", "rotate(-90)")
		.text("% Bridges, Average Health Index")

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(0, 5)");
	
	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(70, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	var valueline = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.healthavg); });

	var goodline = d3.svg.area()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(1- d.structDefNOT/d.totalCount); })
	    .y0(yScale(1));

	var badline = d3.svg.area()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.structDef/d.totalCount); })
	    .y0(yScale(0));

	
	timeline.append("path")
		.attr("d", function(d) { return goodline(structdefs);})
		.style("stroke", "#26a65b")
		.style("stroke-width", 1)
		.style("fill", "#26a65b")
		.style("opacity", .8)

	timeline.append("path")
		.attr("d", function(d) { return badline(structdefs);})
		.style("stroke", "#ff6347")
		.style("stroke-width", 1)
		.style("fill", "#ff6347")
		.style("opacity", .8)

	timeline.append("path")
		.attr("d", function(d) { return valueline(structdefs);})
		.style("stroke", "#ddd")
		.style("fill", "none")
		.style("stroke-width", 3)
		.style("opacity", .8)

	var timeline2 = d3.select("#timeline2").append("svg")
	.attr("width", "100%")
	.attr("height", 500);

		//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale= d3.scale.linear().domain([2007, 2016]).range([30, 580]);
	yScale = d3.scale.linear().domain([0, 1]).range([450, 50]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-400, 0, 0).tickFormat(d3.format("d"));
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-600, 0, 0);

	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(30, 5)");
	
	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(30, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	var nested_years = d3.nest()
	.key(function(d) { return d.year})
	.entries(cleanedbridges)

	var years = [];
	nested_years.forEach(function(i){ 
		var goodbins = [];
		var badbins = [];
		for (var k = 0; k < 21; k++) { 
			goodbins.push(0);
			badbins.push(0);
		}
		i.values.forEach(function(j){
			var rounded = d3.round(d3.round(j.healthIndex/5, 2)*100, 0);
			var index = parseInt(rounded);
			if (j.structDef == "TRUE" || j.structDef == "True") { badbins[index]++;
			} else { goodbins[index]++; }
		})
		years.push({
			"year" : i.key,
			"goodbins" : goodbins,
			"badbins" : badbins
		})
	})

	//binned circles
	years.forEach(function(i){
		i.goodbins.forEach(function(j){
			timeline2.append("circle")
			.attr("class", "yr" + i.year + " bin" + i.goodbins.indexOf(j) + " aggregates")
			.attr("cx", xScale(i.year) + 30)
			.attr("cy", yScale(i.goodbins.indexOf(j)/20))
			.attr("r", Math.sqrt(j) * 1.5)
			.style("stroke", "#26a65b")
			.style("fill", "none")
			.style("stroke-width", 1)
			.style("opacity", 1)
			.on("mouseenter", function(){ 
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 3);
				var firstWord = arr[0]; 
				var secondWord = arr[1];
				console.log(secondWord)

				d3.selectAll("." + firstWord).transition()
					.style("opacity", 0);

				d3.selectAll("." + firstWord).filter(".individuals").transition()
					.style("opacity", 1);
			})
		})
	})

	years.forEach(function(i){
		i.badbins.forEach(function(j){
			timeline2.append("circle")
			.attr("class", "yr" + i.year + " bin" + i.badbins.indexOf(j) + " aggregates")
			.attr("cx", xScale(i.year) + 30)
			.attr("cy", yScale(i.badbins.indexOf(j)/20))
			.attr("r", Math.sqrt(j) * 1.5)
			.style("stroke", "#ff6347")
			.style("fill", "none")
			.style("stroke-width", 1.5)
			.style("opacity", 1)
			.on("mouseenter", function(){ 
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 3);
				var firstWord = arr[0]; 
				var secondWord = arr[1]

				d3.selectAll("." + firstWord).transition()
					.style("opacity", 0);

				d3.selectAll("." + firstWord).filter(".individuals").transition()
					.style("opacity", 1);
			})
		})
	})

	//individual points
	cleanedbridges.forEach(function(i){
		timeline2.append("circle")
			.attr("class", "yr" + i.year + " bin" + d3.round(d3.round(i.healthIndex/5, 2)*100) + " individuals")
			.attr("cx", xScale(i.year) + 8 + 5 * Math.floor(Math.random() * 10))
			//.attr("cy", yScale(d3.round(i.healthIndex/2, 2)*2))
			.attr("cy", yScale(i.healthIndex))
			.attr("r", 2)
			.style("stroke", function() { 
				if (i.structDef == "TRUE" || i.structDef == "True") { return "none";}
				else {return "#26a65b";}
			})
			.style("fill", function() { 
				if (i.structDef == "TRUE" || i.structDef == "True") { return "#ff6347";}
				else {return "none";}
			})
			.style("stroke-width", .5)
			.style("opacity", 0)
			.on("mouseenter", function(){ 
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("opacity", 0);

				d3.selectAll("." + firstWord).filter(".aggregates").transition()
					.style("opacity", 1);
			})	
	})
	
}


CTPS.demoApp.generateBridgePlots = function(bridges) {
	/*var bridgeContainer = d3.select("#chart").append("svg")
		.attr("width", 1200)
		.attr("height", 500);

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.values[0].town;
	  })

	bridgeContainer.call(tip2); 

	var maxminsADT = [];*/
	var cleanedbridges = []; 
	bridges.forEach(function(i){
		//maxminsADT.push(i.adt);
			cleanedbridges.push ({
				"bridgeId" : i.bridgeId,
				"healthIndex" : +i.healthIndex,
				"overFeature" : i.overFeature, 
				"underFeature" : i.underFeature,
				"adt" : +i.adt,
				"year" : +i.year,
				"structDef" : i.structDef,
				"town": i.town
			})
	})
	

	console.log(cleanedbridges);
/*
	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale = d3.scale.linear().domain([2007, 2016]).range([50, 250]);
	yScale = d3.scale.linear().domain([0, 1]).range([450, 50]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d")).ticks(3);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("d"));

	bridgeContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(0, 5)");
	
	bridgeContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	var nested_bridges = d3.nest()
	.key(function(d) { return d.bridgeId;})
	.entries(cleanedbridges);

	var valueline = d3.svg.line()
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.healthIndex); });

	cleanedbridges.forEach(function(i){    
		if (i.year == 2007 || i.year == 2016){
			bridgeContainer.append("circle")
				.attr("class", i.bridgeId)
				.attr("cx", xScale(i.year))
				.attr("cy", yScale(i.healthIndex))
				.attr("r", 2)
				.style("fill", function() { 
					if (i.structDef == "TRUE") { return "red";} 
					else {return "white"}
				})
				.style("stroke-width", 0)
				.style("opacity", 1)
		}
	})
	console.log(nested_bridges)
	nested_bridges.forEach(function(i){
		i.values.sort(function(a, b){
    		var nameA = a.year; 
    		var nameB = b.year; 
    		if (nameA < nameB) {return -1;}
    		if (nameA > nameB) {return 1;}
    		return 0;
    	})
		if (i.values.length == 2) { 
			bridgeContainer.append("path")
				.attr("class", i.key)
				.attr("d", valueline(i.values))
				.style("stroke", function() {
					if(i.values[1].healthIndex > i.values[0].healthIndex) { return "#26a65b";}
					else { return "#ff6347"; }
				})
				.style("fill", "none")
				.style("stroke-width", .5)
				.style("opacity", 1)
		}
	})*/

	var height = 100;
	var width = 100;
	var padding = 10;

	var nested_towns = d3.nest()
		.key(function(d) { return d.town})
		.entries(cleanedbridges);

	nested_towns.sort(function(a, b){
		var nameA = a.key; 
		var nameB = b.key; 
		if (nameA < nameB) {return -1;}
		if (nameA > nameB) {return 1;}
		return 0;
	})

	nested_towns.forEach(function(i) {
		var xScale = d3.scale.linear().domain([2007, 2016]).range([0 + padding, width]);
		var yScale = d3.scale.linear().domain([0, 1]).range([height, 30]);

		var xAxis = d3.svg.axis().scale(xScale).tickSize(0);
		var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);

		var svg = d3.select("#chart").append("svg")
				.attr("height", height)
				.attr("width", width);
		
		svg.append("g")
		  .attr("class", "taxis")
		  .attr("transform", "translate(0, " + (height - padding) + ")")
		  .call(xAxis).selectAll("text").remove();

		svg.append("g")
			.attr("class", "taxis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis).selectAll("text").remove();
		
		svg.append("text")
			.attr("x", .5*(width + padding))
			.attr("y", height * 0.1)
			.style("text-anchor", "middle")
			.style("font-size", 12)
			.text(i.key);

		var nested_struct_def = d3.nest() 
			.key(function(j) { return j.year })
			.entries(i.values) 

		var structdefs = [];

		//count bridges
		nested_struct_def.forEach(function(k){ 
			var countT = 0; 
			var countF = 0; 
			var elseCount = 0; 
			healthavg = 0; 

			k.values.forEach(function(n){ 
				if ( n.structDef == "TRUE" || n.structDef == "True") { countT++;}
				if ( n.structDef == "FALSE" || n.structDef == "False") { countF++; }
				elseCount++;
				healthavg += +n.healthIndex; 
			})

			structdefs.push({
				"year" : k.key, 
				"structDef" : countT/elseCount, //# structurally def bridges
				"structDefNOT" : countF/elseCount, //# good bridges
				"totalCount" : elseCount, //# all bridges
				"healthIndex" : healthavg/elseCount
			})
			//placeholders: 
		})

		structdefs.push( { "year": 2008, "structDef": .2, "structDefNOT": .8, "totalCount": 1200, "healthIndex": .8});
		structdefs.push( { "year": 2009, "structDef": .2, "structDefNOT": .8, "totalCount": 1200, "healthIndex": .8});
		structdefs.push( { "year": 2011, "structDef":.2, "structDefNOT": .8, "totalCount": 1200, "healthIndex": .8});
		
		structdefs.sort(function(a,b){ 
				var nameA = a.year;
				var nameB = b.year; 
				if (nameA < nameB) { return -1 }
				if (nameA > nameB) { return 1 }
				return 0; 
			})

		var valueline = d3.svg.area()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.healthIndex); });

		var goodline = d3.svg.area()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(1-d.structDefNOT); })
	    .y0(yScale(1));

		var badline = d3.svg.area()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.structDef); })
	    .y0(yScale(0));
		
		svg.append("path")
			.attr("d", function(d) { return goodline(structdefs);})
			.style("stroke", "#26a65b")
			.style("stroke-width", 1)
			.style("fill", "#26a65b")
			.style("opacity", .8)

		svg.append("path")
			.attr("d", function(d) { return badline(structdefs);})
			.style("stroke", "#ff6347")
			.style("stroke-width", 1)
			.style("fill", "#ff6347")
			.style("opacity", .8)

		svg.append("path")
			.attr("d", function(d) { return valueline(structdefs);})
			.style("stroke", "#ddd")
			.style("fill", "none")
			.style("stroke-width", 3)
			.style("opacity", .8)	
		})

}

