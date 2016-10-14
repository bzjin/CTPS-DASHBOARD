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
	.defer(d3.csv, "../../data/csv/bridge_condition_timeline_2.csv")
	.awaitAll(function(error, results){ 
		//CTPS.demoApp.generateBridgeTimeline(results[0]);
		CTPS.demoApp.generateBridgeDeckArea(results[0]);
	}); 

CTPS.demoApp.generateBridgeTimeline = function(bridges) {

	var cleanedbridges = []; 
	bridges.forEach(function(i){
		if (i.healthIndex != -1) {
			cleanedbridges.push ({
				"bridgeId" : i.bridgeId,
				"healthIndex" : +i.healthIndex * 100,
				"adt" : +i.adt,
				"year" : +i.year,
				"structDef" : i.structDef,
				"town": i.town
			})
		}
	})

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
				"year" : +k.key, 
				"structDef" : countT, //# structurally def bridges
				"structDefNOT" : countF, //# good bridges
				"totalCount" : elseCount, //# all bridges
				"healthavg" : healthavg/elseCount
			})
			//placeholders: 
		})

		if (d3.max(structdefs, function(d) { return d.year}) != 2016 ) { 
			structdefs.push( { "year": 2016, "structDef": 200, "structDefNOT": 1000, "totalCount": 1200, "healthavg": 80});
		}
		if (d3.min(structdefs, function(d) { return d.year}) != 2007 ) { 
			structdefs.push( { "year": 2007, "structDef": 200, "structDefNOT": 1000, "totalCount": 1200, "healthavg": 80});
		}

		structdefs.sort(function(a,b){ 
			var nameA = a.year;
			var nameB = b.year; 
			if (nameA < nameB) { return -1 }
			if (nameA > nameB) { return 1 }
			return 0; 
		})

		i.dataArray = structdefs;
	})

	var towns = [];
	cleanedbridges.forEach(function(d) { 
		if (towns.indexOf(d.town) == -1) { towns.push(d.town)}
	})
	towns.sort();

	nested_struct_def = d3.nest() 
	.key(function(i) { return i.year })
	.entries(bridges) 

	var allBridges = []; //array stores cumlative structural deficient bridges and health index
	nested_struct_def.forEach(function(i){ 
		var countT = 0; 
		var countF = 0; 
		var elseCount = 0; 
		var healthCount = 0; 
		var healthPoints = 0; 
		var sdHealth = 0; //health for sd bridges
		var nsdHealth = 0; //health for nsd bridges
		var sdHealthCount = 0; //number for health sd bridges
		var nsdHealthCount = 0; //number for health nsd bridges

		i.values.forEach(function(j){ 
			if ( (j.structDef == "TRUE" || j.structDef == "True") && j.healthIndex != -1) { 
				countT++;
				sdHealth += +j.healthIndex;
				sdHealthCount++; 
				}
			if ( (j.structDef == "FALSE" || j.structDef == "False") && j.healthIndex != -1) { 
				countF++; 
				nsdHealth += +j.healthIndex;
				nsdHealthCount ++; 
			}
			if (j.healthIndex != -1) { 
				healthPoints++;
				healthCount += +j.healthIndex;
				elseCount++; 
			}
		})

		allBridges.push({
			"year" : +i.key, 
			"structDef" : countT, //# structurally def bridges
			"structDefNOT" : countF, //#good bridges
			"totalCount" : elseCount, //# good bridges
			"healthavg" : healthCount * 100 / healthPoints
		})
		
	})

	allBridges.sort(function(a,b){ 
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
	.attr("height", 600)
	.style("overflow", "visible")

	//Assign scales and axes 
	xScale = d3.scaleLinear().domain([2007, 2016]).range([70, 400]);
	yScale = d3.scaleLinear().domain([0, 100]).range([450, 50]);

	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	var yAxis = d3.axisLeft(yScale);

	timeline.append("text")
		.attr("x", -350)
		.attr("y", 20)
		.attr("transform", "rotate(-90)")
		.text("% Bridges, Average Health Index")

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.style("font-size", "12px").style("text-anchor", "end").attr("transform", "rotate(-45) translate(-5, -5)");
	
	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(70, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	//Line for average health index
	var valueline = d3.line()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.healthavg); });

	//Areas for structural deficient and not so
	var goodline = d3.area()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(100 * d.structDef/d.totalCount); })
	    .y0(yScale(100));

	var badline = d3.area()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(100 * d.structDef/d.totalCount); })
	    .y0(yScale(0));

	makeTimeline(allBridges);

	function makeTimeline(townData) {
		timeline.selectAll("path").filter(".charted").remove();

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", goodline(townData))
			.style("stroke-width", 0)
			.style("fill", colorScale(.8))
			.style("opacity", .2)

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", badline(townData))
			.style("stroke-width", 0)
			.style("fill", colorScale(0))
			.style("opacity", .8)

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", valueline(townData))
			.style("stroke", "#ddd")
			.style("fill", "none")
			.style("stroke-width", 3)
			.style("opacity", .8)

	} //end makeTimeline

	//Key
	timeline.append("text")
		.attr("x", 70)
		.attr("y", 520)
		.text("KEY: ")

	timeline.append("text")
			.attr("x", 220)
			.attr("y", 595)
			.text("% structurally deficient bridges")
			.style("font-weight", 300)
			.style("font-size", 12)

	timeline.append("rect")
		.attr("x", 140)
		.attr("y", 540)
		.attr("width", 50)
		.attr("height", 60)
		.style("fill", colorScale(.8))
		.style("opacity", .2)

	timeline.append("text")
			.attr("x", 220)
			.attr("y", 560)
			.text("% non structurally deficient bridges")
			.style("font-weight", 300)
			.style("font-size", 12)

	timeline.append("path")
		.attr("d", "M 195 540 L 210 540 L 210 578 L 195 578")
		.style("stroke", "#ddd")
		.style("fill", "none")

	timeline.append("path")
		.attr("d", "M 195 582 L 210 582 L 210 600 L 195 600")
		.style("stroke", "#ddd")
		.style("fill", "none")

	timeline.append("rect")
		.attr("x", 140)
		.attr("y", 580)
		.attr("width", 50)
		.attr("height", 20)
		.style("fill", colorScale(0))
		.style("opacity", .8)

	timeline.append("text")
			.attr("x", 115)
			.attr("y", 550)
			.text("Average")
			.style("font-weight", 300)
			.style("font-size", 12)
			.style("text-anchor", "end")

	timeline.append("text")
			.attr("x", 115)
			.attr("y", 565)
			.text("health index")
			.style("font-weight", 300)
			.style("font-size", 12)
			.style("text-anchor", "end")

	timeline.append("rect")
		.attr("x", 140)
		.attr("y", 550)
		.attr("width", 50)
		.attr("height", 3)
		.style("fill", "#ddd")
		.style("opacity", 1)

	timeline.append("path")
		.attr("d", "M 120 557 L 135 557")
		.style("stroke", "#ddd")
		.style("fill", "none")
 	/* 
 	Second Visualization (Timeline)
 	*/

	var timeline2 = d3.select("#timeline2").append("svg")
	.attr("width", "100%")
	.attr("height", 600)
	.style("overflow", "visible");

	var xScaleT = d3.scaleLinear().domain([2007, 2016]).range([20, 500]);
	var yScaleT = d3.scaleLinear().domain([0, 100]).range([450, 50]);

	var xAxisT = d3.axisBottom(xScaleT).tickFormat(d3.format("d"));//.tickSize(-400, 0, 0)
	var yAxisT = d3.axisLeft(yScaleT);//.tickSize(-600, 0, 0);

	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxisT)
		.selectAll("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(27, 0)");
	
	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(20, 0)")
		.call(yAxisT)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	bridgePoints();
	//plot individual points
	function bridgePoints() {
		cleanedbridges.forEach(function(i){

			timeline2.append("rect")
				.attr("class", "yr" + i.year + " bin" + e(e(i.healthIndex/5)*100) + " individuals " + i.town.toUpperCase())
				.attr("x", function() { 
					return xScaleT(i.year) + 8 + 8 * Math.floor(Math.random() * 5)
				})
				.attr("y", yScaleT(Math.ceil(i.healthIndex)))
				//.attr("y", yScale(i.healthIndex))
				.attr("width", function() { 
					if (i.healthIndex > 0) { return 8; }
					else { return 0 }
				})
				.attr("height", 4)
				.style("fill", function() { 
					if (i.structDef == "TRUE" || i.structDef == "True") { return "#ff6347";}
					else {return "#26a65b";}
				})
				.style("fill-opacity", function() { 
					if (i.structDef == "TRUE" || i.structDef == "True") { return .5;}
					else {return .2;}
				})
				.style("opacity", 1)	
		})
	}

	//Key
	timeline2.append("text")
		.attr("x", 70)
		.attr("y", 520)
		.text("KEY: ")

	timeline2.append("text")
		.attr("x", 90)
		.attr("y", 550)
		.text("structurally deficient bridge")
		.style("font-weight", 300)
		.style("font-size", 12)

	timeline2.append("rect")
		.attr("x", 70)
		.attr("y", 545)
		.attr("width", 8)
		.attr("height", 4)
		.style("fill", "#ff6347")
		.style("opacity", 1)

	timeline2.append("text")
		.attr("x", 90)
		.attr("y", 575)
		.text("non structurally deficient bridge")
		.style("font-weight", 300)
		.style("font-size", 12)

	timeline2.append("rect")
		.attr("x", 70)
		.attr("y", 570)
		.attr("width", 8)
		.attr("height", 4)
		.style("fill", "#26a65b")
		.style("opacity", 1)


	d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(" ", 2);
		var firstWord = arr[0]; 

		if (firstWord == "ALL") { 
			timeline2.selectAll("rect").remove();

			bridgePoints();
			makeTimeline(allBridges);
		} else {
			timeline2.selectAll("rect").filter(".individuals")
				.style("opacity", .1)

			timeline2.selectAll("." + firstWord)
				.style("opacity", 1)
				.style("fill-opacity", 1)

			nested_towns.forEach(function(i) {
				if (i.key == firstWord.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})) {
					makeTimeline(i.dataArray);
				}
			})
		}
	}) //end click function
	
} //end generateBridgeTimeline


CTPS.demoApp.generateBridgeDeckArea = function(bridges) {

	var cleanedbridges = []; 
	bridges.forEach(function(i){
		if (i.healthIndex != -1) {
			cleanedbridges.push ({
				"bridgeId" : i.bridgeId,
				"healthIndex" : +i.healthIndex * 100,
				"adt" : +i.adt,
				"year" : +i.year,
				"structDef" : i.structDef,
				"town": i.town,
				"deckArea": +i.deckArea
			})
		}
	})

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
				if ( n.structDef == "TRUE" || n.structDef == "True") { countT += n.deckArea;}
				if ( n.structDef == "FALSE" || n.structDef == "False") { countF += n.deckArea; }
				elseCount += n.deckArea;
				healthavg += n.healthIndex * n.deckArea; 
			})

			structdefs.push({
				"year" : +k.key, 
				"structDef" : countT, //# structurally def bridges
				"structDefNOT" : countF, //# good bridges
				"totalCount" : elseCount, //# all bridges
				"healthavg" : healthavg/elseCount
			})
			//placeholders: 
		})

		var m = 200; 
		if (d3.max(structdefs, function(d) { return d.year}) != 2016 ) { 
			structdefs.push( { "year": 2016, "structDef": 200*m, "structDefNOT": 1000*m, "totalCount": 1200*m, "healthavg": 80});
		}
		if (d3.min(structdefs, function(d) { return d.year}) != 2007 ) { 
			structdefs.push( { "year": 2007, "structDef": 200*m, "structDefNOT": 1000*m, "totalCount": 1200*m, "healthavg": 80});
		}

		structdefs.sort(function(a,b){ 
			var nameA = a.year;
			var nameB = b.year; 
			if (nameA < nameB) { return -1 }
			if (nameA > nameB) { return 1 }
			return 0; 
		})

		i.dataArray = structdefs;
	})

	var towns = [];
	cleanedbridges.forEach(function(d) { 
		if (towns.indexOf(d.town) == -1) { towns.push(d.town)}
	})
	towns.sort();

	nested_struct_def = d3.nest() 
	.key(function(i) { return i.year })
	.entries(bridges) 

	var allBridges = []; //array stores cumlative structural deficient bridges and health index
	nested_struct_def.forEach(function(i){ 
		var countT = 0; 
		var countF = 0; 
		var elseCount = 0; 
		var healthCount = 0; 
		var healthPoints = 0; 
		var sdHealth = 0; //health for sd bridges
		var nsdHealth = 0; //health for nsd bridges
		var sdHealthCount = 0; //number for health sd bridges
		var nsdHealthCount = 0; //number for health nsd bridges

		i.values.forEach(function(j){ 
			if ( (j.structDef == "TRUE" || j.structDef == "True") && j.healthIndex != -1) { 
				countT++;
				sdHealth += +j.healthIndex;
				sdHealthCount++; 
				}
			if ( (j.structDef == "FALSE" || j.structDef == "False") && j.healthIndex != -1) { 
				countF++; 
				nsdHealth += +j.healthIndex;
				nsdHealthCount ++; 
			}
			if (j.healthIndex != -1) { 
				healthPoints++;
				healthCount += +j.healthIndex;
				elseCount++; 
			}
		})

		allBridges.push({
			"year" : +i.key, 
			"structDef" : countT, //# structurally def bridges
			"structDefNOT" : countF, //#good bridges
			"totalCount" : elseCount, //# good bridges
			"healthavg" : healthCount * 100 / healthPoints
		})
		
	})

	allBridges.sort(function(a,b){ 
		var nameA = a.year;
		var nameB = b.year; 
		if (nameA < nameB) { return -1 }
		if (nameA > nameB) { return 1 }
		return 0; 
	})

	nested_ind_bridge = d3.nest()
	.key(function(i) { return i.bridgeId;})
	.entries(cleanedbridges);

	var timeline = d3.select("#deck_timeline").append("svg")
	.attr("width", "100%")
	.attr("height", 600)
	.style("overflow", "visible")

	//Assign scales and axes 
	xScale = d3.scaleLinear().domain([2007, 2016]).range([70, 400]);
	yScale = d3.scaleLinear().domain([0, 100]).range([450, 50]);

	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	var yAxis = d3.axisLeft(yScale);

	timeline.append("text")
		.attr("x", -350)
		.attr("y", 20)
		.attr("transform", "rotate(-90)")
		.text("% Bridges, Average Health Index")

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.style("font-size", "12px").style("text-anchor", "end").attr("transform", "rotate(-45) translate(-5, -5)");
	
	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(70, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	//Line for average health index
	var valueline = d3.line()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.healthavg); });

	//Areas for structural deficient and not so
	var goodline = d3.area()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(100 * d.structDef/d.totalCount); })
	    .y0(yScale(100));

	var badline = d3.area()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(100 * d.structDef/d.totalCount); })
	    .y0(yScale(0));

	makeTimeline(allBridges);

	function makeTimeline(townData) {
		timeline.selectAll("path").filter(".charted").remove();

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", goodline(townData))
			.style("stroke-width", 0)
			.style("fill", colorScale(.8))
			.style("opacity", .2)

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", badline(townData))
			.style("stroke-width", 0)
			.style("fill", colorScale(0))
			.style("opacity", .8)

		timeline.append("path")
			.attr("class", "charted")
			.attr("d", valueline(townData))
			.style("stroke", "#ddd")
			.style("fill", "none")
			.style("stroke-width", 3)
			.style("opacity", .8)

	} //end makeTimeline

	var xPos = 20; 
	//Key
	timeline.append("text")
		.attr("x", xPos)
		.attr("y", 520)
		.text("KEY: ")

	timeline.append("text")
			.attr("x", xPos + 150)
			.attr("y", 595)
			.text("% structurally deficient bridge deck area")
			.style("font-weight", 300)
			.style("font-size", 12)

	timeline.append("rect")
		.attr("x", xPos + 70)
		.attr("y", 540)
		.attr("width", 50)
		.attr("height", 60)
		.style("fill", colorScale(.8))
		.style("opacity", .2)

	timeline.append("text")
			.attr("x", xPos + 150)
			.attr("y", 560)
			.text("% non structurally deficient bridge deck area")
			.style("font-weight", 300)
			.style("font-size", 12)

	timeline.append("path")
		.attr("d", "M 145 540 L 160 540 L 160 578 L 145 578")
		.style("stroke", "#ddd")
		.style("fill", "none")

	timeline.append("path")
		.attr("d", "M 145 582 L 160 582 L 160 600 L 145 600")
		.style("stroke", "#ddd")
		.style("fill", "none")

	timeline.append("rect")
		.attr("x", xPos + 70)
		.attr("y", 580)
		.attr("width", 50)
		.attr("height", 20)
		.style("fill", colorScale(0))
		.style("opacity", .8)

	timeline.append("text")
			.attr("x", xPos + 45)
			.attr("y", 550)
			.text("Average")
			.style("font-weight", 300)
			.style("font-size", 12)
			.style("text-anchor", "end")

	timeline.append("text")
			.attr("x", xPos + 45)
			.attr("y", 565)
			.text("health index")
			.style("font-weight", 300)
			.style("font-size", 12)
			.style("text-anchor", "end")

	timeline.append("rect")
		.attr("x", xPos + 70)
		.attr("y", 550)
		.attr("width", 50)
		.attr("height", 3)
		.style("fill", "#ddd")
		.style("opacity", 1)

	timeline.append("path")
		.attr("d", "M 70 557 L 85 557")
		.style("stroke", "#ddd")
		.style("fill", "none")
 	/* 
 	Second Visualization (Timeline)
 	*/

	var timeline2 = d3.select("#timeline2_area").append("svg")
	.attr("width", "100%")
	.attr("height", 600)
	.style("overflow", "visible");

	var xScaleT = d3.scaleLinear().domain([2007, 2016]).range([20, 500]);
	var yScaleT = d3.scaleLinear().domain([0, 100]).range([450, 50]);

	var xAxisT = d3.axisBottom(xScaleT).tickFormat(d3.format("d"));//.tickSize(-400, 0, 0)
	var yAxisT = d3.axisLeft(yScaleT);//.tickSize(-600, 0, 0);

	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxisT)
		.selectAll("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(27, 0)");
	
	timeline2.append("g").attr("class", "axis")
		.attr("transform", "translate(20, 0)")
		.call(yAxisT)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	bridgePoints();
	//plot individual points
	function bridgePoints() {
		cleanedbridges.forEach(function(i){

			timeline2.append("rect")
				.attr("class", "yr" + i.year + " bin" + e(e(i.healthIndex/5)*100) + " individuals " + i.town.toUpperCase())
				.attr("x", function() { 
					return xScaleT(i.year) + 8 + 8 * Math.floor(Math.random() * 5)
				})
				.attr("y", yScaleT(Math.ceil(i.healthIndex)))
				//.attr("y", yScale(i.healthIndex))
				.attr("width", function() { 
					if (i.healthIndex > 0) { return 8; }
					else { return 0 }
				})
				.attr("height", 4)
				.style("fill", function() { 
					if (i.structDef == "TRUE" || i.structDef == "True") { return "#ff6347";}
					else {return "#26a65b";}
				})
				.style("fill-opacity", function() { 
					if (i.structDef == "TRUE" || i.structDef == "True") { return .5;}
					else {return .2;}
				})
				.style("opacity", 1)	
		})
	}

	var xPos = 20; 
	//Key
	timeline2.append("text")
		.attr("x", xPos)
		.attr("y", 520)
		.text("KEY: ")

	timeline2.append("text")
		.attr("x", xPos + 20)
		.attr("y", 550)
		.text("structurally deficient bridges")
		.style("font-weight", 300)
		.style("font-size", 12)

	timeline2.append("rect")
		.attr("x", xPos)
		.attr("y", 545)
		.attr("width", 8)
		.attr("height", 4)
		.style("fill", "#ff6347")
		.style("opacity", 1)

	timeline2.append("text")
		.attr("x", xPos + 20)
		.attr("y", 575)
		.text("non structurally deficient bridges")
		.style("font-weight", 300)
		.style("font-size", 12)

	timeline2.append("rect")
		.attr("x", xPos)
		.attr("y", 570)
		.attr("width", 8)
		.attr("height", 4)
		.style("fill", "#26a65b")
		.style("opacity", 1)


	d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(" ", 2);
		var firstWord = arr[0]; 

		if (firstWord == "ALL") { 
			timeline2.selectAll("rect").remove();

			bridgePoints();
			makeTimeline(allBridges);
		} else {
			timeline2.selectAll("rect").filter(".individuals")
				.style("opacity", .1)

			timeline2.selectAll("." + firstWord)
				.style("opacity", 1)
				.style("fill-opacity", 1)

			nested_towns.forEach(function(i) {
				if (i.key == firstWord.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})) {
					makeTimeline(i.dataArray);
				}
			})
		}
	}) //end click function
}