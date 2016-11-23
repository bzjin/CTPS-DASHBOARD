//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

//Define Color Scale
var colorScale = d3.scaleThreshold()
	.domain([2.3, 2.8, 3.5])
    .range(["#d7191c","#ffc04c","#a6d96a","#1a9641"]);

var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geoPath().projection(projection);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "../../data/csv/noninterstate_pavement_bins_2014.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateCities(results[0]);
		CTPS.demoApp.generateAccessibleTable(results[0]);
});

d3.queue()
	.defer(d3.csv, "../../data/csv/noninterstate_psi_avg_timeline_by_city.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateCityTimeline(results[0]);
	}); 

CTPS.demoApp.generateCityTimeline = function(cityavg_time) {
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

	//Assign scales and axes 
	xScale = d3.scaleLinear().domain([2007, 2015]).range([50, 1000]);
	yScale = d3.scaleLinear().domain([0, 5]).range([450, 50]);

	var xAxis = d3.axisBottom(xScale).tickSize(-400, 0, 0).tickFormat(d3.format("d"));
	var yAxis = d3.axisLeft(yScale).tickSize(-950, 0, 0).tickFormat(d3.format("d"));

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

	
	var valueline = d3.line()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.median); });

	var valuearea = d3.area()
		.curve(d3.curveBasis)
	    .x0(function(d) { return xScale(d.year); })
	    .x1(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.firstQuartile); })
	    .y0(function(d) { return yScale(d.thirdQuartile); })

	var valuerange = d3.area()
		.curve(d3.curveBasis)
	    .x0(function(d) { return xScale(d.year); })
	    .x1(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.minimum); })
	    .y0(function(d) { return yScale(d.maximum); })

	graphAll();
	function graphAll() { 
		nested_routes.forEach(function(i){  
			timeline.append("path")
			      .attr("class", i.values[0].town + "minmax uncolor")
			      .attr("d", valuerange(i.values))
			      .style("fill", "white")
			      .style("opacity", 0);

			timeline.append("path")
			      .attr("class", i.values[0].town + "area uncolor glow")
			      .attr("d", valuearea(i.values))
			      .style("fill", "#e26a6a")
			      .style("opacity", .01);

			timeline.append("path")
				.attr("class", function(d) { return i.values[0].town + " medians"})
				.attr("d", function(d) { return valueline(i.values);})
				.style("stroke", "white")
				.style("stroke-width", .5)
				.style("fill", "none")
				.style("opacity", .5)
		})
	}
			//.style("stroke-width", .5)
		//	.style("stroke", "#ddd")
	//button activation
	d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(' ');
		var firstWord = arr[0]; 

		if (firstWord == "ALL") { 
			timeline.selectAll("path").filter(".uncolor")
			      .style("fill", "white")
			      .style("opacity", 0);

			timeline.selectAll("path").filter(".glow")
			      .style("fill", "#e26a6a")
			      .style("opacity", .01);

			timeline.selectAll("path").filter(".medians")
				.style("stroke", "#ddd")
				.style("stroke-width", .5)
				.style("fill", "none")
				.style("opacity", .5)
		} else {
			timeline.selectAll("path")
				.style("opacity", .05)
				.style("stroke", "white")
				.style("stroke-width", .5);

			timeline.selectAll("." + firstWord)
				.style("opacity", 1)
				.style("stroke", "white")
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
		}
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
		.style("fill", "white").style("stroke", "none").style("opacity", .1)
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
		.style("fill", "white").style("stroke", "none")
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
	var city_names = [];
	//Sort cities into an array by MAPC Subregion for x-axis
	avgpsi.sort(function(a,b) { 
		var nameA = a.TOWN;
		var nameB = b.TOWN; 
		if (nameA < nameB) { return -1; }
		if (nameA > nameB) { return 1; }
		return 0; 
	})

	avgpsi.forEach(function(i){ 
		i.TOWN = i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
		city_names.push(i.TOWN);
		i.BIN_0 = +i.BIN_0;
		i.BIN_1 = +i.BIN_1;
		i.BIN_2 = +i.BIN_2;
		i.BIN_3 = +i.BIN_3;
		i.BIN_4 = +i.BIN_4;
		i.BIN_5 = +i.BIN_5;
	})

	//Begin creating visual elements 
	 
	var cityContainer = d3.select("#citygradients").append("svg")
		.attr("width", "100%")
		.attr("height", 1500)
		.style("overflow", "visible")
	
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
	yScale = d3.scalePoint().domain(city_names).range([83, 1430]);

	xScaleSegment = d3.scaleLinear().domain([0, 1]).range([0, 300]);
	xScaleGraph = d3.scaleLinear().domain([0, 5]).range([100, 400]);

	xScaleSegmentPercent = d3.scaleLinear().domain([0, 1]).range([0, 130]);
	xScaleGraphPercent = d3.scaleLinear().domain([0, 1]).range([420, 550])

	xScaleSegmentBars = d3.scaleLinear().domain([0, 360]).range([0, 480]);
	xScaleGraphBars = d3.scaleLinear().domain([0, 360]).range([570, 1050]);

	var xAxis = d3.axisTop(xScaleGraph).tickSize(-1350, 0, 0).ticks(6).tickPadding(2);
	var yAxis = d3.axisLeft(yScale).tickSize(-300, 0, 0);
	var xAxis2 = d3.axisTop(xScaleGraphBars).tickSize(-1350, 0, 0).ticks(6).tickPadding(2);


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
	    return "Average PSI: " + f(d.CITY_AVG) ;
	  })

	cityContainer.call(tip3); 

	function dataVizAll() {
		//cityContainer.selectAll(".gradient").remove();
		cityContainer.selectAll("rect").filter(".data_rect").remove();

		for (i = 0; i < 5; i++) { 
			cityContainer.selectAll(".distribution" + i)
				.data(avgpsi)
				.enter()
				.append("rect")
					.attr("class", "data_rect distribution" + i)
					.attr("height", 10)
					.attr("width", function(d) {
						if (i == 4 ) { return 0; } 
						else { return Math.sqrt(xScaleSegment(d["BIN_" + i]));}})
					.attr("y", function(d) { 
						return yScale(d.TOWN) - 10})
					.attr("x", function(d) { 
						if (i == 0) { return xScaleGraph(1.5) - Math.sqrt(xScaleSegment(d["BIN_" + i]))/2 ; }
						if (i == 1) { return xScaleGraph(2.55) - Math.sqrt(xScaleSegment(d["BIN_" + i]))/2 }
						if (i == 2) { return xScaleGraph(3.3) - Math.sqrt(xScaleSegment(d["BIN_" + i]))/2}
						if (i == 3) { return xScaleGraph(3.5) - Math.sqrt(xScaleSegment(d["BIN_" + i]))/2 }
					})
					.style("stroke", "none")
					.style("fill", "grey")
					.style("opacity", .2)
		}
		
		cityContainer.selectAll(".averages")
			.data(avgpsi)
			.enter()
			.append("rect")
				.attr("class", "data_rect averages")
				.attr("y", function(d) { return yScale(d.TOWN) - 10;})
				.attr("x", function(d) { return xScaleGraph(d.CITY_AVG)})
				.attr("width", 2)
				.attr("height", 10)
				.style("fill", function(d) { return colorScale(d.CITY_AVG)})
				.style("opacity", 1)
				.style("stroke", "none")

		psiBins();
	
		//displays total lane mileage in PSI bins
		function psiBins () { 
			var psiColors = d3.scaleThreshold()
					.domain([2.3, 2.8, 3.5, 5])
   					.range(["#d7191c","#ffc04c","#a6d96a","#1a9641", "grey"]);

			for (i = 0; i < 5; i++) { 
				cityContainer.selectAll(".actual_miles" + i)
					.data(avgpsi)
					.enter()
					.append("rect")
						.attr("class", "data_rect actual_miles" + i)
						.attr("height", 10)
						.attr("width", function(d) {
							if (i < 4) { return xScaleSegmentBars(d["BIN_" + (i + 1)])}
							else { return xScaleSegmentBars(d.BIN_4);}})
						.attr("y", function(d) { 
							return yScale(d.TOWN) - 10})
						.attr("x", function(d) { 
							if (i == 0) { return xScaleGraphBars(0); }
							if (i == 1) { return xScaleGraphBars(d.BIN_1) }
							if (i == 2) { return xScaleGraphBars(d.BIN_1 + d.BIN_2) }
							if (i == 3) { return xScaleGraphBars(d.BIN_1 + d.BIN_2 + d.BIN_3) }
							if (i == 4) { return xScaleGraphBars(d.BIN_1 + d.BIN_2 + d.BIN_3 + d.BIN_4) }
						})
						.style("stroke", "none")
						.style("fill", psiColors(i + 1.4))
			
				//displays lane mileage in PSI bins by percent
				cityContainer.selectAll(".percent_miles" + i)
					.data(avgpsi)
					.enter()
					.append("rect")
						.attr("class", "data_rect percent_miles" + i)
						.attr("height", 10)
						.attr("width", function(d) { 
							if (i < 4) { return xScaleSegmentPercent(d["BIN_" + (i + 1)]/d.CITY_TOTAL)}
							else { return xScaleSegmentPercent(d.BIN_0/d.CITY_TOTAL); }})
						.attr("y", function(d) { 
							return yScale(d.TOWN) - 10})
						.attr("x", function(d) { 
							if (i == 0) { return xScaleGraphPercent(0); }
							if (i == 1) { return xScaleGraphPercent(d.BIN_1/d.CITY_TOTAL) }
							if (i == 2) { return xScaleGraphPercent((d.BIN_1 + d.BIN_2)/d.CITY_TOTAL) }
							if (i == 3) { return xScaleGraphPercent((d.BIN_1 + d.BIN_2 + d.BIN_3)/d.CITY_TOTAL) }
							if (i == 4) { return xScaleGraphPercent((d.BIN_1 + d.BIN_2 + d.BIN_3 + d.BIN_4)/d.CITY_TOTAL) }	
						})
						.style("stroke", "none")
						.style("fill", psiColors(i + 1.4))						
				}
		}//end psiBins function
	}//end dataVizAll();

	dataVizAll(); 

	//Color key
	var xPos = 815;
	var yPos = 100; 
	var height = 600; 

	//text and colors
	cityContainer.append("rect")
		.style("fill", colorScale(1)).style("stroke", "none")
		.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 7)
		.text("0.0-2.3: Poor");

	cityContainer.append("rect")
		.style("fill", colorScale(2.5)).style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 22)
		.text("2.3-2.8: Fair");

	cityContainer.append("rect")
		.style("fill", colorScale(2.9)).style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 37)
		.text("2.8-3.5: Good");

	cityContainer.append("rect")
		.style("fill", colorScale(4)).style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 52)
		.text("3.5-5.0: Excellent");

	cityContainer.append("rect")
		.style("fill", "grey").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 67)
		.text("No data");

	//button activation 
	d3.select("#alphabetize").on("click", function(){
		avgpsi.sort(function(a,b) { 
				var nameA = a.TOWN;
				var nameB = b.TOWN; 
				if (nameA < nameB) { return -1; }
				if (nameA > nameB) { return 1; }
				return 0; 
			})
		
		city_names = []; 

		avgpsi.forEach(function(i){ 
			city_names.push(i.TOWN);
		})

		yScale = d3.scalePoint().domain(city_names).range([80, 1430]);
		var yAxis = d3.axisLeft(yScale).tickSize(-300, 0, 0);
		
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
				var nameA = a.CITY_AVG;
				var nameB = b.CITY_AVG; 
				if (nameA < nameB) { return -1; }
				if (nameA > nameB) { return 1; }
				return 0; 
			})
		
		city_names = []; 

		avgpsi.forEach(function(i){ 
			city_names.push(i.TOWN);
		})

		yScale = d3.scalePoint().domain(city_names).range([80, 1430]);
		var yAxis = d3.axisLeft(yScale).tickSize(-300, 0, 0);
		
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

CTPS.demoApp.generateAccessibleTable = function(noninterstateBins){
  var colDesc = [{
    "dataIndex" : "TOWN",
    "header" : "Town"
  },{ 
    "dataIndex" : "BIN_0",
    "header" : "PSI values 0.0 to 2.3 (Poor)"
  },{ 
    "dataIndex" : "BIN_1",
    "header" : "PSI values 2.3 to 2.8 ("
  },{ 
    "dataIndex" : "BIN_2",
    "header" : "PSI values 2.8 to 3.5"
  },{ 
    "dataIndex" : "BIN_3",
    "header" : "PSI values 3.5 to 5.0"
  },{ 
    "dataIndex" : "BIN_4",
    "header" : "No Data"
  }];

  var options = {
    "divId" : "nonInterstatePSIbinsTableDiv",
    "caption": "Centerline Miles of Non-Interstate Pavement in Each PSI Range",
  };

  $("#accessibleTable").accessibleGrid(colDesc, options, noninterstateBins);
}

