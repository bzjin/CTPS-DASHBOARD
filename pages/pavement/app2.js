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
	.defer(d3.json, "../../JSON/city_lane_avgs.JSON")
	//.defer(d3.json, "../../JSON/noninterstate_psi_avg_timeline_by_city.JSON")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateCities(results[0]);
		//CTPS.demoApp.generateTimeline(results[1]); FANCY CRAZY ART FOR ALL ROAD SEGMENT PSI
		//CTPS.demoApp.generateCityTimeline(results[0]);
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

	var nested_routes = d3.nest()
	.key(function(d) { return d.town;})
	.entries(cityavg_time);

	var valueline = d3.svg.line()
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.median); });

	/*var q1 = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.firstQuartile); })

	var q3 = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.year); })
	    .y(function(d) { return yScale(d.thirdQuartile); })*/

	var valuearea = d3.svg.area()
	//.interpolate("basis")
	    .x0(function(d) { return xScale(d.year); })
	    .x1(function(d) { return xScale(d.year); })
	    .y1(function(d) { return yScale(d.firstQuartile); })
	    .y0(function(d) { return yScale(d.thirdQuartile); })

	nested_routes.forEach(function(i){  

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
			.on("mouseenter", function(d) {
				var thisreg = this.getAttribute("class");
				timeline.selectAll("path")
					.style("opacity", .05)
					.style("stroke", "#ddd")
					.style("stroke-width", .5);

				timeline.selectAll("circle")
					.style("opacity", .05)
					.style("stroke-width", 0)
					.attr("fill", "#ddd")
					.attr("r", 2);

				timeline.selectAll("." + thisreg)
					.style("opacity", 1)
					.style("stroke", "#ddd")
					.style("stroke-width", 2);

				timeline.selectAll("circle." + thisreg)
					.style("fill", "#e26a6a")
					.attr("r", 4);

				timeline.selectAll(".uncolor")
					.style("opacity", .01)
					.style("stroke", "none")

				timeline.selectAll("." + thisreg + "area")
					.style("opacity", .2)
					.style("stroke", "none")

				})
			.on("mouseleave", function(d) {
				timeline.selectAll("path")
					.style("opacity", .5)
					.style("stroke", "#ddd")
					.style("stroke-width", .5);

				timeline.selectAll("circle")
					.style("opacity", .5)
					.style("stroke-width", 0)
					.attr("fill", "#ddd")
					.attr("r", 2);
				timeline.selectAll(".uncolor")
					.style("opacity", .01)
					.style("stroke", "none")
			})
	})

	timeline.selectAll(".yearboxes")
		.data(cityavg_time)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.town; } )
			.attr("cx", function(d) { return xScale(d.year); })
			.attr("cy", function(d) { return yScale(d.median); })
			.attr("r", 2)
			.style("fill", "#ddd")
			.style("opacity", .5)
			.on("mouseenter", function(d) {
				var thisreg = this.getAttribute("class");
				timeline.selectAll("path")
					.style("opacity", .05)
					.style("stroke", "#ddd")
					.style("stroke-width", .5);

				timeline.selectAll("circle")
					.style("opacity", .05)
					.style("stroke-width", 0)
					.attr("fill", "#ddd")
					.attr("r", 2);

				d3.selectAll("." + thisreg)
					.style("opacity", 1)
					.style("stroke", "#ddd")
					.style("stroke-width", 2)
					.style("color","#e26a6a")
					.style("font-weight", 700);

				timeline.selectAll("circle." + thisreg)
					.style("fill", "#e26a6a")
					.attr("r", 4);

				timeline.selectAll(".uncolor")
					.style("opacity", .01)
					.style("stroke", "none")

				timeline.selectAll("." + thisreg + "area")
					.style("opacity", .2)
					.style("stroke", "none")

				})
			.on("mouseleave", function(d) {
				d3.selectAll(".townpicker")
					.style("opacity", 1)
					.style("stroke", "none")
					.style("stroke-width", 0)
					.style("color","#fff")
					.style("font-weight", 300);
					
				d3.selectAll("." + thisreg)
					.style("opacity", 1)
					.style("stroke", "none")
					.style("stroke-width", 0)

				timeline.selectAll("path")
					.style("opacity", .5)
					.style("stroke", "#ddd")
					.style("stroke-width", .5);

				timeline.selectAll("circle")
					.style("opacity", .5)
					.style("stroke-width", 0)
					.attr("fill", "#ddd")
					.attr("r", 2);
				timeline.selectAll(".uncolor")
					.style("opacity", .01)
					.style("stroke", "none")
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

		timeline.selectAll("circle")
			.style("opacity", .05)
			.style("stroke-width", 0)
			.attr("fill", "#e26a6a")
			.attr("r", 2);

		timeline.selectAll("." + firstWord)
			.style("opacity", 1)
			.style("stroke", "#ddd")
			.style("stroke-width", 2);

		timeline.selectAll("circle." + firstWord)
			.style("fill", "#e26a6a")
			.attr("r", 4);

		timeline.selectAll(".uncolor")
			.style("opacity", .01)
			.style("stroke", "none")

		timeline.selectAll("." + firstWord + "area")
			.style("opacity", .2)
			.style("stroke", "none")
	})
}

/*CTPS.demoApp.generateTimeline = function(psitimeline) { 
	var timeline = d3.select("#timeline").append("svg")
		.attr("width", 1200)
		.attr("height", 500);

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.values[0].route;
	  })

	timeline.call(tip2); 

	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale= d3.scale.linear().domain([0,5]).range([50, 1100]);
	yScale = d3.scale.linear().domain([2007, 2015]).range([50, 450]);

	var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(11).tickSize(-450, 0, 0).tickFormat(d3.format("d"));
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("d"));

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 50)")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(0, -5)");

	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 500)")
		.call(xAxis)
		.selectAll("text")
		.remove();
	
	timeline.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(0, 25)");

	var nested_routes = d3.nest()
	.key(function(d) { return d.segmentid;})
	.entries(psitimeline);

	var valueline = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return xScale(d.psi); })
	    .y(function(d) { return yScale(d.psiyear)+20; });

	timeline.sort(function(a, b) { 
		var nameA = a.psi;
		var nameB = b.psi; 
		if (nameA < nameB) { return -1; }
		if (nameA > nameB) { return 1; }
		return 0;
	})

	nested_routes.forEach(function(i){    
		timeline.append("path")
			.attr("class", i.values[0].route)
			.attr("d", function(d) { return valueline(i.values);})
			.style("stroke", "#ddd")
			.style("stroke-width", .5)
			.style("fill", "none")
			.style("opacity", function(d) { return i.values[0].lanes/16;});
	})


	timeline.selectAll(".yearboxes")
		.data(psitimeline)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.route; } )
			.attr("cx", function(d) { return xScale(d.psi); })
			.attr("cy", function(d) { return yScale(d.psiyear) + 20; })
			.attr("r", 2)
			.style("fill", "#ddd")
			.style("opacity", function(d) { return d.lanes/4;});
			//.style("stroke-width", .5)
		//	.style("stroke", "#ddd")

}*/

CTPS.demoApp.generateCities = function(avgpsi) {	

//Create bar chart comparing interstate highways by MAPC Subregions and cities
	//Data sorting (could be worth "baking" outside of code)
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

	//Begin creating visual elements 
	 
	var cityContainer = d3.select("#citygradients").append("svg")
		.attr("width", "100%")
		.attr("height", 1500)
	
	//Title labels
	cityContainer.append("text")
		.attr("x", 0).attr("y", 45)
		.html("City");

	cityContainer.append("text")
		.attr("x", 100).attr("y", 45)
		.html("PSI Distribution");

	cityContainer.append("text")
		.attr("x", 420).attr("y",45)
		.html("% City Pavement");

	cityContainer.append("text")
		.attr("x", 570).attr("y", 45)
		.html("Lane Miles of City Pavement");

	cityContainer.append("line")
		.attr("x1", 0)
		.attr("x2", 1050)
		.attr("y1", 50)
		.attr("y2", 50)
		.style("stroke", "#ddd")
		.style("stroke-width", 0.5)
		.style("opacity", .8);

	//define axes
	yScale = d3.scale.ordinal().domain(city_names).rangePoints([80, 1430]);

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

		//displays psi distribution in grey gradients of town
		var bars_cities = cityContainer.selectAll(".gradient").remove();
		var bars_cities = cityContainer.selectAll(".gradient")
			.data(avgpsi)
			.enter()
			.append("rect")
				.attr("class", function(d) { return "c" + d.city + " gradient"})
				.attr("y", function(d) { return yScale(d.city)-10})
				.attr("x", function(d) { 
					if (!isNaN(d.psi)){
						return xScaleGraph(d.psi)
					} else { 
						return -100;
					}})
				.attr("width", 10)
				.attr("height", 10)
				.style("fill", "grey")
				.style("opacity", function(d) {return d.partlength * d.lanes * 0.5 ; })
				.style("stroke", "none")
				.on("mouseenter", function (d) { 
					tip3.show(d);
				})
				.on("mouseleave", tip3.hide);
		
		//displays average PSI of town
		var averages = cityContainer.selectAll(".averages").remove();
		var averages = cityContainer.selectAll(".averages")
			.data(avgpsi)
			.enter()
			.append("rect")
				.attr("class", "averages")
				.attr("y", function(d) { return yScale(d.city)-10;})
				.attr("x", function(d) { return xScaleGraph(d.cityavg);})
				.attr("width", 2)
				.attr("height", 10)
				.style("fill", function (d) { return colorScale(d.cityavg); })
				.style("opacity", 1)
				.style("stroke", "none")
				.on("mouseenter", tip3.show)
				.on("mouseleave", tip3.hide);

		var nested_cities = d3.nest()
			.key(function(d) { return d.city; })
			.key(function(d) { return colorScale(d.psi); })
			.entries(avgpsi);

		var psisums = []; 

		nested_cities.forEach(function(i) { 
			i.values.forEach(function(j){
				var psisum = d3.sum(j.values, function(d) { return d.partlength * d.lanes;}); 
				var totalsum = j.values[0].citytotal; 
				psisums.push({
					"city_name" : i.key, 
					"psiRange" : j.key,
					"sum" : psisum,
					"totalsum" : totalsum
				});
			});
		}); 

		//console.log(nested_cities[478].values);

		var findCityStack = function(cityString, hexCode) {
		    for (var i = 0; i < psisums.length; i++) {
		        if (psisums[i].city_name == cityString) {
		        	if (psisums[i].psiRange == hexCode) { 
		        		return psisums[i].sum;
		        	}
		        } 
		    }
			return 0;
		}

		//displays total lane mileage in PSI bins
		var bars_cities = cityContainer.selectAll(".bars_cities").remove();
		var bars_cities = cityContainer.selectAll(".bars_cities")
			.data(psisums)
			.enter()
			.append("rect")
				.attr("class", "bars_cities")
				.attr("height", 10)
				.attr("width", function(d) { 
					if (d.psiRange != undefined) { 
						return xScaleSegmentBars(d.sum);
					} else {
						return 0; 
					}})
				.attr("y", function(d) { return yScale(d.city_name)-10;})
				.attr("x", function(d) { 
					if (d.psiRange == "undefined" ) { return -5000; }
					if (d.psiRange == "#d7191c" ) { return xScaleGraphBars(0); }
					if (d.psiRange == "#fdae61" ) { return xScaleGraphBars(findCityStack(d.city_name, "#d7191c"));}
					if (d.psiRange == "#ffffbf" ) { return xScaleGraphBars(findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61"));}
					if (d.psiRange == "#a6d96a" ) { return xScaleGraphBars(findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61")+findCityStack(d.city_name, "#ffffbf"));}
					if (d.psiRange == "#1a9641" ) { return xScaleGraphBars(findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61")+findCityStack(d.city_name, "#ffffbf")+findCityStack(d.city_name, "#a6d96a"));}
				})
				.style("stroke", "none")
				.style("fill", function(d) { return d.psiRange;})

		//displays lane mileage in PSI bins by percent
		var percent_cities = cityContainer.selectAll(".percent_cities").remove();
		var percent_cities = cityContainer.selectAll(".percent_cities")
			.data(psisums)
			.enter()
			.append("rect")
				.attr("class", "percent_cities")
				.attr("height", 10)
				.attr("width", function(d) { 
					if (d.psiRange != undefined) { 
						return xScaleSegmentPercent(d.sum/d.totalsum);
					} else {
						return 0; 
					}})
				.attr("y", function(d) { return yScale(d.city_name)-10;})
				.attr("x", function(d) { 
					if (d.psiRange == "undefined" ) { return -5000; }
					if (d.psiRange == "#d7191c" ) { return xScaleGraphPercent(0); }
					if (d.psiRange == "#fdae61" ) { return xScaleGraphPercent(findCityStack(d.city_name, "#d7191c")/d.totalsum);}
					if (d.psiRange == "#ffffbf" ) { return xScaleGraphPercent((findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61"))/d.totalsum);}
					if (d.psiRange == "#a6d96a" ) { return xScaleGraphPercent((findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61")+findCityStack(d.city_name, "#ffffbf"))/d.totalsum);}
					if (d.psiRange == "#1a9641" ) { return xScaleGraphPercent((findCityStack(d.city_name, "#d7191c")+findCityStack(d.city_name, "#fdae61")+findCityStack(d.city_name, "#ffffbf")+findCityStack(d.city_name, "#a6d96a"))/d.totalsum);}
				})
				.style("stroke", "none")
				.style("fill", function(d) { return d.psiRange;})
	}

	dataVizAll(); 

	//Color key
	var xPos = 815;
	var yPos = 100; 
	var height = 600; 
	//background
	cityContainer.append("rect")
		.style("fill", "#191b1d").style("stroke", "white").style("stroke-width", 1)
		.attr("x", xPos-10).attr("y", yPos-11).attr("height", 90).attr("width", 240)
		.style("opacity", .8);
	//text and colors
	cityContainer.append("rect")
		.style("fill", "#d7191c").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 7)
		.html("0.0-2.5: Dismal");
	cityContainer.append("rect")
		.style("fill", "#fdae61").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 22)
		.html("2.5-3.0: Minimally Acceptable");
	cityContainer.append("rect")
		.style("fill", "#ffffbf").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 37)
		.html("3.0-3.5: Acceptable");
	cityContainer.append("rect")
		.style("fill", "#a6d96a").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 52)
		.html("3.5-4.0: Good");
	cityContainer.append("rect")
		.style("fill", "#1a9641").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
	cityContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 67)
		.html("4.0-5.0: Excellent");

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
			.duration(750)
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

