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
	.defer(d3.json, "../../JSON/noninterstate_psi_avg_timeline_by_city.JSON")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateCityTimeline(results[0]);
	}); 

queue()
	.defer(d3.json, "../../JSON/city_lane_avgs.JSON")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateCities(results[0]);
});

CTPS.demoApp.generateCityTimeline = function(cityavg_time) {
	console.log(cityavg_time);
	var timeline = d3.select("#timeline").append("svg")
		.attr("width", 1200)
		.attr("height", 500);

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.values[0].town;
	  })

	timeline.call(tip2); 

	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale = d3.scale.linear().domain([2007, 2015]).range([50, 1000]);
	yScale = d3.scale.linear().domain([0, 5]).range([450, 50]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-400, 0, 0).tickFormat(d3.format("d"));
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-950, 0, 0).tickFormat(d3.format("d"));

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 450)")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(0, 5)");
	
	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-5, 0)");

	timeline.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -250)
		.attr("y", 10)
		.style("font-weight", 300)
		.style("text-anchor", "middle")
		.text("Present Serviceability Index (PSI)")

	var nested_routes = d3.nest()
	.key(function(d) { return d.town;})
	.entries(cityavg_time);

	
	var valueline = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.median); });

	var valuearea = d3.svg.area()
		.interpolate("basis")
	    .x0(function(d) { return xScale(d.year); })
	    .x1(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.firstQuartile); })
	    .y0(function(d) { return yScale(d.thirdQuartile); })

	var valuerange = d3.svg.area()
		.interpolate("basis")
	    .x0(function(d) { return xScale(d.year); })
	    .x1(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.minimum); })
	    .y0(function(d) { return yScale(d.maximum); })

	nested_routes.forEach(function(i){  
		timeline.append("path")
		      .attr("class", i.values[0].town + "minmax uncolor")
		      .attr("d", valuerange(i.values))
		      .style("fill", "#fff")
		      .style("opacity", 0);

		timeline.append("path")
		      .attr("class", i.values[0].town + "area uncolor")
		      .attr("d", valuearea(i.values))
		      .style("fill", "#e26a6a")
		      .style("opacity", .01);

		timeline.append("path")
			.attr("class", i.values[0].town)
			.attr("d", function(d) { return valueline(i.values);})
			.style("stroke", "#ddd")
			.style("stroke-width", .5)
			.style("fill", "none")
			.style("opacity", .5)
	})
			//.style("stroke-width", .5)
		//	.style("stroke", "#ddd")
	//button activation
	d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(" ", 2);
		var firstWord = arr[0]; 

		timeline.selectAll("path")
			.style("opacity", .05)
			.style("stroke", "#ddd")
			.style("stroke-width", .5);

		timeline.selectAll("." + firstWord)
			.style("opacity", 1)
			.style("stroke", "#ddd")
			.style("stroke-width", 2);

		timeline.selectAll(".uncolor")
			.style("opacity", 0)
			.style("stroke", "none")

		timeline.selectAll("." + firstWord + "area")
			.style("opacity", .3)
			.style("stroke", "none")

		timeline.selectAll("." + firstWord + "minmax")
			.style("opacity", .1)
			.style("stroke", "none")
	})
	
	//Color key
	var xPos = 840;
	var yPos = 350; 
	var height = 600; 
	//background
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 700)
		.attr("x", xPos).attr("y", yPos -7)
		.text("KEY");
	//text and colors
	timeline.append("rect")
		.style("fill", "#fff").style("stroke", "none").style("opacity", .1)
		.attr("x", xPos).attr("y", yPos).attr("height", "80px").attr("width", height/10)
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 300)
		.attr("x", xPos + 70).attr("y", yPos + 3)
		.text("Maximum");
	timeline.append("rect")
		.style("fill", "#e26a6a").style("stroke", "none").style("opacity", .3)
		.attr("x", xPos).attr("y", yPos + 20).attr("height", "40px").attr("width", height/10);
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 300)
		.attr("x", xPos + 70).attr("y", yPos + 25)
		.text("75% Quartile");
	timeline.append("rect")
		.style("fill", "fff").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 38).attr("height", "4px").attr("width", height/10);
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 300)
		.attr("x", xPos + 70).attr("y", yPos + 45)
		.text("Median");
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 300)
		.attr("x", xPos + 70).attr("y", yPos + 65)
		.text("25% Quartile");
	timeline.append("text").style("font-size", 12)
		.style("font-weight", 300)
		.attr("x", xPos + 70).attr("y", yPos + 85)
		.text("Minimum");
}


CTPS.demoApp.generateCities = function(avgpsi) {	

//Create bar chart comparing interstate highways by MAPC Subregions and cities
	//Data sorting (could be worth "baking" outside of code)
	avgpsi.forEach(function(i){ 
		i.psiRed = 0; 
		i.psiOrange = 0;
		i.psiYellow = 0; 
		i.psiGreen = 0; 
		i.psiGreat = 0;

		i['data'].forEach(function(j){
			if (j.psi < 2.5) { i.psiRed += j.partlength * j.lanes}
			else if (j.psi < 3) { i.psiOrange += j.partlength * j.lanes}
			else if (j.psi < 3.5) { i.psiYellow += j.partlength * j.lanes}
			else if (j.psi < 4) { i.psiGreen += j.partlength * j.lanes}
			else if (j.psi < 5) { i.psiGreat += j.partlength * j.lanes}
		})
	})

	
	var city_names = [];
	//Sort cities into an array by MAPC Subregion for x-axis
	avgpsi.sort(function(a,b) { 
		var nameA = a.cityavg;
		var nameB = b.cityavg; 
		if (nameA < nameB) { return -1; }
		if (nameA > nameB) { return 1; }
		return 0; 
	})

	avgpsi.forEach(function(i){ 
		city_names.push(i.city);
	})

console.log(avgpsi)
	//Begin creating visual elements 
	 
	var cityContainer = d3.select("#citygradients").append("svg")
		.attr("width", "100%")
		.attr("height", 1500)
		.style("overflow", "scroll")
	
	//Title labels
	cityContainer.append("text")
		.attr("x", 0).attr("y", 45)
		.html("Municipality");

	cityContainer.append("text")
		.attr("x", 100).attr("y", 45)
		.html("PSI Distribution");

	cityContainer.append("text")
		.attr("x", 420).attr("y",45)
		.html("% Pavement");

	cityContainer.append("text")
		.attr("x", 570).attr("y", 45)
		.html("Lane Miles");

	cityContainer.append("line")
		.attr("x1", 0)
		.attr("x2", 1050)
		.attr("y1", 50)
		.attr("y2", 50)
		.style("stroke", "#ddd")
		.style("stroke-width", 0.5)
		.style("opacity", .8);

	//define axes
	yScale = d3.scale.ordinal().domain(city_names).rangePoints([83, 1430]);

	xScaleSegment = d3.scale.linear().domain([0, 5]).range([0, 300]);
	xScaleGraph = d3.scale.linear().domain([0, 5]).range([100, 400]);

	xScaleSegmentPercent = d3.scale.linear().domain([0, 1]).range([0, 130]);
	xScaleGraphPercent = d3.scale.linear().domain([0, 1]).range([420, 550])

	xScaleSegmentBars = d3.scale.linear().domain([0, 360]).range([0, 480]);
	xScaleGraphBars = d3.scale.linear().domain([0, 360]).range([570, 1050]);

	var xAxis = d3.svg.axis().scale(xScaleGraph).orient("top").tickSize(-1350, 0, 0).ticks(6).tickPadding(2);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-300, 0, 0);
	var xAxis2 = d3.svg.axis().scale(xScaleGraphBars).orient("top").tickSize(-1350, 0, 0).ticks(6).tickPadding(2);


	//Chart Title Labels
	cityContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 70)")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(0, -3)");	

	cityContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 70)")
		.call(xAxis2)
		.selectAll("text")
		.attr("transform", "translate(0, -3)");	  
	
	cityContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(100, 0)")
		.call(yAxis)
		.selectAll("text")
			.attr("x", -98)
			.attr("transform", "translate(0, -3)")
			.style("text-anchor", "start")
			.style("font-weight", 300)
			.style("font-size", 12);


//mouseover function	
	var tip3 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 10])
	  .html(function(d) {
	    return "Average PSI: " + d3.round(d.cityavg, 2) ;
	  })

	cityContainer.call(tip3); 

	function dataVizAll() {
		//cityContainer.selectAll(".gradient").remove();
		cityContainer.selectAll("rect").remove();

		avgpsi.forEach(function(index){
			cityContainer.selectAll(".gradient")
				.data(index['data'])
				.enter()
				.append("rect")
					.attr("class", function(d) { return "c" + index.city; })
					.attr("y", function(d) { return yScale(index.city)-10})
					.attr("x", function(d) { return xScaleGraph(d.psi) })
					.attr("width", function(d) {
						if (!isNaN(d.psi)){ return 10; }
						else { return 0}})
					.attr("height", 10)
					.style("fill", "grey")
					.style("opacity", function(d) { return d.partlength * d.lanes * .5; })
					.style("stroke", "none")
					.on("mouseenter", function (d) { 
						tip3.show(index);
					})
					.on("mouseleave", tip3.hide);
			
			//displays average PSI of town
			

			cityContainer
				.append("rect")
					.attr("y", yScale(index.city) - 10)
					.attr("x", xScaleGraph(index.cityavg))
					.attr("width", 2)
					.attr("height", 10)
					.style("fill", colorScale(index.cityavg))
					.style("opacity", 1)
					.style("stroke", "none")


			var psiColors = d3.scale.linear()
							.domain([0, 1, 2, 3, 4])
							.range(["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"])

			psiBins("psiRed");
			psiBins("psiOrange");
			psiBins("psiYellow");
			psiBins("psiGreen");
			psiBins("psiGreat");

			//displays total lane mileage in PSI bins
			function psiBins (psiBin) { 
				cityContainer
					.append("rect")
						.attr("class", "bars_cities")
						.attr("height", 10)
						.attr("width", xScaleSegmentBars(index[psiBin]))
						.attr("y", yScale(index.city) - 10)
						.attr("x", function() { 
							if (psiBin == "psiRed") { return xScaleGraphBars(0); }
							if (psiBin == "psiOrange") { return xScaleGraphBars(index.psiRed) }
							if (psiBin == "psiYellow") { return xScaleGraphBars(index.psiRed + index.psiOrange) }
							if (psiBin == "psiGreen") { return xScaleGraphBars(index.psiRed + index.psiOrange + index.psiYellow) }
							if (psiBin == "psiGreat") { return xScaleGraphBars(index.psiRed + index.psiOrange + index.psiYellow + index.psiGreen) }								
						})
						.style("stroke", "none")
						.style("fill", function() { 
							if (psiBin == "psiRed") { return psiColors(0) }
							if (psiBin == "psiOrange") { return psiColors(1) }
							if (psiBin == "psiYellow") { return psiColors(2) }
							if (psiBin == "psiGreen") { return psiColors(3) }
							if (psiBin == "psiGreat") { return psiColors(4) }								
						})
			
				//displays lane mileage in PSI bins by percent
				cityContainer
					.append("rect")
						.attr("class", "bars_cities")
						.attr("height", 10)
						.attr("width", xScaleSegmentPercent(index[psiBin]/index.citytotal))
						.attr("y", yScale(index.city) - 10)
						.attr("x", function() { 
							if (psiBin == "psiRed") { return xScaleGraphPercent(0); }
							if (psiBin == "psiOrange") { return xScaleGraphPercent(index.psiRed/index.citytotal) }
							if (psiBin == "psiYellow") { return xScaleGraphPercent((index.psiRed + index.psiOrange)/index.citytotal) }
							if (psiBin == "psiGreen") { return xScaleGraphPercent((index.psiRed + index.psiOrange + index.psiYellow)/index.citytotal) }
							if (psiBin == "psiGreat") { return xScaleGraphPercent((index.psiRed + index.psiOrange + index.psiYellow + index.psiGreen)/index.citytotal) }								
						})
						.style("stroke", "none")
						.style("fill", function() { 
							if (psiBin == "psiRed") { return psiColors(0) }
							if (psiBin == "psiOrange") { return psiColors(1) }
							if (psiBin == "psiYellow") { return psiColors(2) }
							if (psiBin == "psiGreen") { return psiColors(3) }
							if (psiBin == "psiGreat") { return psiColors(4) }								
						})
			}//end psiBins function
		}) //end forEach loop
	}//end dataVizAll();

	dataVizAll(); 

	//Color key
	var xPos = 815;
	var yPos = 100; 
	var height = 600; 

	//text and colors
	cityContainer.append("rect")
		.style("fill", "#d7191c").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 7)
		.text("0.0-2.5: Dismal");
	cityContainer.append("rect")
		.style("fill", "#fdae61").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 22)
		.text("2.5-3.0: Minimally Acceptable");
	cityContainer.append("rect")
		.style("fill", "#ffffbf").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 37)
		.text("3.0-3.5: Acceptable");
	cityContainer.append("rect")
		.style("fill", "#a6d96a").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 52)
		.text("3.5-4.0: Good");
	cityContainer.append("rect")
		.style("fill", "#1a9641").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 67)
		.text("4.0-5.0: Excellent");

	//button activation 
	d3.select("#alphabetize").on("click", function(){
		avgpsi.sort(function(a,b) { 
				var nameA = a.city;
				var nameB = b.city; 
				if (nameA < nameB) { return -1; }
				if (nameA > nameB) { return 1; }
				return 0; 
			})
		
		city_names = []; 

		avgpsi.forEach(function(i){ 
			city_names.push(i.city);
		})

		yScale = d3.scale.ordinal().domain(city_names).rangePoints([80, 1430]);
		var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-300, 0, 0);
		
		cityContainer.select(".yaxis").transition()
			.call(yAxis)
		.selectAll("text")
			.attr("x", -95)
			.attr("transform", "translate(0, -3)")
			.style("text-anchor", "start");

		dataVizAll();
	})

	d3.select("#byAverages").on("click", function(){
		avgpsi.sort(function(a,b) { 
				var nameA = a.cityavg;
				var nameB = b.cityavg; 
				if (nameA < nameB) { return -1; }
				if (nameA > nameB) { return 1; }
				return 0; 
			})
		
		city_names = []; 

		avgpsi.forEach(function(i){ 
			city_names.push(i.city);
		})

		yScale = d3.scale.ordinal().domain(city_names).rangePoints([80, 1430]);
		var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-300, 0, 0);
		
		cityContainer.select(".yaxis").transition()
			.duration(750)
			.call(yAxis)
		.selectAll("text")
			.attr("x", -95)
			.attr("transform", "translate(0, -3)")
			.style("text-anchor", "start");

		dataVizAll();
	})
}

