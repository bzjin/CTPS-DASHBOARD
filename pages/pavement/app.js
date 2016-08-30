var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

//Define Color Scale
var colorScale = d3.scaleQuantize().domain([1, 5])
    .range(["#d7191c", "#d7191c", "#d7191c", "#fdae61","#ffffbf","#a6d96a","#1a9641"]);
var colors = ["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"];

var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geoPath().projection(projection);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.json, "../../JSON/psi_timeline.JSON")
	.defer(d3.json, "../../JSON/interstate_pavement_2015.topojson")
	.defer(d3.json, "../../JSON/townregion.json")
	.defer(d3.csv, "../../JSON/notable_exits_interstates.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateTimeline(results[0]);
		//CTPS.demoApp.generateADTgraph(results[1]);
		CTPS.demoApp.generateChart(results[1], results[2], results[3]);
	}); 
	//CTPS.demoApp.generateViz);

CTPS.demoApp.generateTimeline = function(psitimeline) { 
	var timeline = d3.select("#timeline").append("svg")
		.attr("width", 1200)
		.attr("height", 500)
		//.style("overflow", "scroll");

	timeline.append("text") 
		.attr("x", -250)
		.attr("y", 20)
		.style("text-anchor", "start")
		.attr("transform", "rotate(-90)")
		.text("PSI")
	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.values[0].FederalAidRouteNumber;
	  })

	timeline.call(tip2); 

	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	//var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScale= d3.scaleLinear().domain([2007, 2015]).range([50, 1000]);
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

	var nested_routes = d3.nest()
	.key(function(d) { return d.segmentid;})
	.entries(psitimeline);

	var valueline = d3.line()
		.curve(d3.curveBasis)
	    .x(function(d) { return xScale(d.psiyear); })
	    .y(function(d) { return yScale(d.psi); });

	timeline.sort(function(a, b) { 
		var nameA = a.psi;
		var nameB = b.psi; 
		if (nameA < nameB) { return -1; }
		if (nameA > nameB) { return 1; }
		return 0;
	})

	//draw lines for each RoadSegment_ID
	nested_routes.forEach(function(i){    
		timeline.append("path")
			.attr("class", i.values[0].FederalAidRouteNumber)
			.attr("d", function(d) { return valueline(i.values);})
			.style("stroke", function(d){
				var colors = ["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"];

				if (i.values[0].FederalAidRouteNumber == "I-90") { return colors[2];}
				if (i.values[0].FederalAidRouteNumber == "I-93") { return colors[1];}
				if (i.values[0].FederalAidRouteNumber == "I-95") { return colors[0];}
				if (i.values[0].FederalAidRouteNumber == "I290") { return colors[3];}
				if (i.values[0].FederalAidRouteNumber == "I495") { return colors[4];}				
			})
			.style("stroke-width", .5)
			.style("fill", "none")
			.style("opacity", .5)
			.on("mouseenter", function(d) {
				var thisreg = this.getAttribute("class");

				timeline.selectAll("path")
					.style("opacity", .05);

				timeline.selectAll("circle")
					.style("opacity", .05);

				timeline.selectAll("." + thisreg)
					.style("opacity", .5);

				tip2.show(i);
			})
			.on("mouseleave", function(d) {

				var thisreg = this.getAttribute("class");

				timeline.selectAll("path")
					.style("opacity", .5);

				timeline.selectAll("circle")
					.style("opacity", .5);

				tip2.hide(i);
			})
			//.style("stroke-width", .5)
		//	.style("stroke", "#ddd")*/
	})

	//circles connect points

	timeline.selectAll("circle")
		.data(psitimeline)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.FederalAidRouteNumber; } )
			.attr("cx", function(d) { return xScale(d.psiyear); })
			.attr("cy", function(d) { return yScale(d.psi); })
			.attr("r", 2)
			.style("fill", function(d) { 
				if (d.FederalAidRouteNumber == "I-90") { return colors[2];}
				if (d.FederalAidRouteNumber == "I-93") { return colors[1];}
				if (d.FederalAidRouteNumber == "I-95") { return colors[0];}
				if (d.FederalAidRouteNumber == "I290") { return colors[3];}
				if (d.FederalAidRouteNumber == "I495") { return colors[4];}	
			})
			.style("opacity", 1)
			.on("mouseenter", function(d) {
				var thisreg = this.getAttribute("class");

				timeline.selectAll("path")
					.style("opacity", .05);

				timeline.selectAll("circle")
					.style("opacity", .05);

				timeline.selectAll("." + thisreg)
					.style("opacity", .5);
			})
			.on("mouseleave", function(d) {

				var thisreg = this.getAttribute("class");

				timeline.selectAll("path")
					.style("opacity", .5);

				timeline.selectAll("circle")
					.style("opacity", .5);
			})
			//.style("stroke-width", .5)
		//	.style("stroke", "#ddd")*/

		//button activate code
		d3.selectAll("button").on("click", function(){
			var mystring = this.getAttribute("class");
			var arr = mystring.split(" ", 2);
			var firstWord = arr[0]; 			

			if (firstWord == "all") {
				timeline.selectAll("path").transition()
					.duration(750)
					.style("opacity", .5);

				timeline.selectAll("circle").transition()
					.duration(750)
					.style("opacity", .5);
			} else {
				timeline.selectAll("path").transition()
					.duration(750)
					.style("opacity", 0);

				timeline.selectAll("circle").transition()
					.duration(750)
					.style("opacity", 0);

				timeline.selectAll("." + firstWord).transition()
					.duration(500)
					.style("opacity", .5);
			}
		});
}


CTPS.demoApp.generateChart = function(interstateRoads, townregion, exits) {	

  var interstateRoads = topojson.feature(interstateRoads, interstateRoads.objects.interstates).features
//Create chart comparing interstate roads by coordinates
	//append town names
	interstateRoads.forEach(function(i){ 
		var citytomatch = i.properties.CITY;
		townregion.forEach(function(j){ 
			if(j.TOWN_ID == citytomatch) {
				i.properties.TOWN = j.TOWN; 
			}
		})
	})

	var chartContainer = d3.select("#chart").append("svg")
		.attr("width", 1050)
		.attr("height", 650);

		//axis lable	
	chartContainer.append("text")
		.style("font-size", "10px")
		.attr("x", "20px")
		.attr("y", "630px")
		.html("(Mile)");

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<b>" + d.properties.TOWN + "</b><br>PSI: " + d3.round(d.properties.PSI, 2) + "<br>" + d.properties.ROUTEDIRECTION;
	  })

	chartContainer.call(tip2); 

	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	var routekey = ["I-90", "I-93", "I-95", "I495", "I290"];
	var unhyphened = ["I90", "I93", "I95", "I495", "I290"];
	//Assign scales and axes 
	xScaleRoad = d3.scaleLinear().domain([0,62]).range([70, 1000]); // define displacement with respect to origin
	xScaleSegment = d3.scaleLinear().domain([0,62]).range([0, 930]); // define width
	yScale = d3.scalePoint().domain(routekey).range([80, 550]);
	yScaleU = d3.scalePoint().domain(unhyphened).range([80, 550]);

	var xAxis = d3.axisBottom(xScaleRoad).ticks(15);
	var yAxis = d3.axisLeft(yScale).tickSize(0);
	var yAxisU = d3.svg.axis().scale(yScaleU).orient("left").tickSize(0);

	chartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 620)")
		.call(xAxis).selectAll("text").style("font-weight", 300);
	
	chartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(40, 0)")
		.style("font-size", "14px")
		.call(yAxis);

	chartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(30, 0)")
		.call(yAxisU).selectAll("text").remove();

	function findFlipFrom(d) { // Use to invert mile markers (find corresponding opposite origin for different route directions)
		var tostorage = []; 
		var fromstorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.ROUTEKEY == d.properties.ROUTEKEY) { 
				tostorage.push(j.properties.ROUTETO); 
				fromstorage.push(j.properties.ROUTEFROM); 
			}
		})
		var max = d3.max(tostorage); 
		var min = d3.min(fromstorage);

		var maxmin = [max, min]
		return maxmin; 
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.forEach(function(i){ 
		if ((i.properties.ROUTEDIRECTION == "EB" || i.properties.ROUTEDIRECTION == "SB")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.ROUTETO - findFlipFrom(i)[0]);
		} else if (i.properties.ROUTEKEY == "I95 NB" || i.properties.ROUTEKEY == "I495 NB") { 
			i.properties.NORMALIZEDSTART = i.properties.ROUTEFROM - findFlipFrom(i)[1];
		} else {
			i.properties.NORMALIZEDSTART = i.properties.ROUTEFROM;
		}
	}); 

	function findFlipExit(d) { 
		var tostorage = []; 
		var fromstorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.ROUTEKEY == d.ROUTEKEY) { 
				tostorage.push(j.properties.ROUTETO); 
				fromstorage.push(j.properties.ROUTEFROM); 
			}
		})
		var max = d3.max(tostorage); 
		var min = d3.min(fromstorage);

		var maxmin = [max, min]
		return maxmin; 
	}

	exits.forEach(function(i){ 
		if ((i.ROUTE_DIR == "EB" || i.ROUTE_DIR == "SB")) { 
			i.NORMALIZEDSTART = -(i.MEASURE - findFlipExit(i)[0]);
		} else if (i.ROUTEKEY == "I95 NB" || i.ROUTEKEY == "I495 NB") { 
			i.NORMALIZEDSTART = i.MEASURE - findFlipExit(i)[1];
		} else {
			i.NORMALIZEDSTART = i.MEASURE;
		}
	}); 

	//Create interstate visualization by geographical coordinates
	//Fill in empty data with grey
	/*chartContainer.selectAll(".greybars")
		.data(interstateRoads.features)
		.enter()
		.append("rect")
			.attr("class", "greybars")
			.attr("height", 15)
			.attr("width", function(d) { 
					if (d.properties.FEDERALAIDROUTENUMBER == "I-90") { return xScaleRoad(25) } 
					if (d.properties.FEDERALAIDROUTENUMBER == "I495") { return xScaleRoad(35)}
				})
			.attr("x", xScaleRoad(0))
			.attr("y", function(d) { 
				return yScale(d.properties.FEDERALAIDROUTENUMBER);
			})
			.style("stroke", "none")
			.style("fill", "#ddd");*/
	//		
	var nested_directions = d3.nest()
	.key(function(d) { return d.properties.ROUTEKEY;})
	.entries(interstateRoads)

	chartContainer.selectAll(".labels")
		.data(nested_directions)
		.enter()
		.append("text")
		.attr("class", "labels")
			.attr("x", 65)
			.attr("y", function(d) { 
				if (d.values[0].properties.ROUTEDIRECTION == "EB" || d.values[0].properties.ROUTEDIRECTION == "NB") { 
					return yScale(d.values[0].properties.FEDERALAIDROUTENUMBER) - 8;
				} else {
					if (!isNaN(yScale(d.values[0].properties.FEDERALAIDROUTENUMBER))){
						return yScale(d.values[0].properties.FEDERALAIDROUTENUMBER) + 10;
					} else { 
						return -100000;
					}
				}})
			.style("stroke", "none")
			.style("font-size", 11)
			.style("fill", "#ddd")
			.style("font-weight", 300)
			.style("text-anchor", "end")
			.text(function(d) { return d.values[0].properties.ROUTEDIRECTION;});
//Append grey bars for segments outside the MPO region
	chartContainer.append("rect")
		.attr("height", 15)
		.attr("width", 50)
		.attr("x", xScaleRoad(30))
		.attr("y", yScale("I-90") + 10)
		.style("stroke", "none")
		.style("fill", "grey")
		.style("opacity", .5)
	chartContainer.append("rect")
		.attr("height", 15)
		.attr("width", 50)
		.attr("x", xScaleRoad(30))
		.attr("y", yScale("I-90") - 20)
		.style("stroke", "none")
		.style("fill", "grey")
				.style("opacity", .5)

	chartContainer.append("rect")
		.attr("height", 15)
		.attr("width", 650)
		.attr("x", xScaleRoad(1))
		.attr("y", yScale("I495") + 10)
		.style("stroke", "none")
		.style("fill", "grey")
				.style("opacity", .5)

	chartContainer.append("rect")
		.attr("height", 15)
		.attr("width", 650)
		.attr("x", xScaleRoad(1))
		.attr("y", yScale("I495") - 20)
		.style("stroke", "none")
		.style("fill", "grey")
				.style("opacity", .5)

	//Available data points
	chartContainer.selectAll(".bars")
		.data(interstateRoads)
		.enter()
		.append("rect")
			.attr("class", "bars")
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.ROUTETO))) { 
					return 0;
				} else { 
					return xScaleSegment(Math.abs(d.properties.ROUTETO-d.properties.ROUTEFROM)); 
				}})
			.attr("x", function(d) { 
				if (isNaN(parseInt(d.properties.ROUTETO))) { 
					return 0; 
				} else { 
					return xScaleRoad(d.properties.NORMALIZEDSTART)};
				})
			.attr("y", function(d) { 
				if (d.properties.ROUTEDIRECTION == "EB" || d.properties.ROUTEDIRECTION == "NB") { 
					return yScale(d.properties.FEDERALAIDROUTENUMBER) - 20;
				} else {
					if (!isNaN(yScale(d.properties.FEDERALAIDROUTENUMBER))){
						return yScale(d.properties.FEDERALAIDROUTENUMBER) + 10;
					} else { 
						return -100000;
					}
				}})
			.style("stroke", "none")
			.style("fill", function(d) { 
					if (!isNaN(d.properties.PSI)){
						return colorScale(d.properties.PSI);
					} else { 
						return "none"; 
					}
				})
			.on("mouseenter", tip2.show)
			.on("mouseleave", tip2.hide);	

	

	//Sort exits by interstate and then by PSI
	exits.sort(function(a, b) { 
		var nameA = a.ROUTEKEY;
		var nameB = b.ROUTEKEY;
		if (nameA < nameB) {return -1;}
		if (nameA > nameB) {return 1;}
		else { 
			var nameC = a.NORMALIZEDSTART;
			var nameD = b.NORMALIZEDSTART;
			if (nameC < nameD) {return -1;}
			if (nameC > nameD) {return 1;}
		}
	})


	var oddeven = 1; 
	exits.forEach(function(i){
		if (i.NAME != "NULL") { 
			if (i.ROUTE_NUM == "I90" || i.ROUTE_NUM == "I93" || i.ROUTE_NUM == "I95" || i.ROUTE_NUM == "I495" || i.ROUTE_NUM == "I290") {
				chartContainer.append("rect")
					.attr("class", "markers")
					.attr("height", function(){
						if (oddeven == -1) { return 20;}
						else {return 10;}
					})
					.attr("width", 1)
					.attr("x", function() {
						if ((i.ROUTE_NUM == "I495" && (i.NORMALIZEDSTART < 0 || i.NORMALIZEDSTART > 50)) || (i.ROUTE_NUM == "I95" && (i.NORMALIZEDSTART < 0 || i.NORMALIZEDSTART > 58))|| (i.ROUTE_NUM == "I93" && i.NORMALIZEDSTART > 37)) {
							return -9000;
						} else {
							return xScaleRoad(i.NORMALIZEDSTART);}
						})
					.attr("y", function(){
						if (oddeven == -1) { 
							if (i.ROUTE_DIR == "NB" || i.ROUTE_DIR == "EB") { 
								return yScaleU(i.ROUTE_NUM) - 40;
							} else { return yScaleU(i.ROUTE_NUM) + 12; }
						} else { 
							if (i.ROUTE_DIR == "NB" || i.ROUTE_DIR == "EB") { 
								return yScaleU(i.ROUTE_NUM) - 30;
							} else { return yScaleU(i.ROUTE_NUM) + 13; }
						}
					})
					.style("fill", "#ddd")
					.style("opacity", .5);

				chartContainer.append("text")
					.attr("class", "text")
					.html(i.NAME)
					.attr("x", function() {
						if ((i.ROUTE_NUM == "I495" && (i.NORMALIZEDSTART < 0 || i.NORMALIZEDSTART > 50)) || (i.ROUTE_NUM == "I95" && (i.NORMALIZEDSTART < 0 || i.NORMALIZEDSTART > 58))|| (i.ROUTE_NUM == "I93" && i.NORMALIZEDSTART > 37)) {
							return -9000;
						} else {
							return xScaleRoad(i.NORMALIZEDSTART);}
						})
					.attr("y", function(){
						if (oddeven == -1) { 
							if (i.ROUTE_DIR == "NB" || i.ROUTE_DIR == "EB") { 
								return yScaleU(i.ROUTE_NUM) - 45;
							} else { return yScaleU(i.ROUTE_NUM) + 42; }
						} else {
							if (i.ROUTE_DIR == "NB" || i.ROUTE_DIR == "EB") { 
								return yScaleU(i.ROUTE_NUM) - 35;
							} else { return yScaleU(i.ROUTE_NUM) + 32; }
						}
					})
					.style("opacity", function() { 
						if (oddeven == 1) { return .5;}
						else { return 1; }
					})
					.style("font-size", 10)
					.style("font-weight", 300)
					.style("text-anchor", "middle")
				oddeven = -oddeven; 
			}
		}
	})

	//Color key
	var xPos = 700;
	var yPos = 50; 
	var height = 600; 
	//background
	chartContainer.append("rect")
		.style("fill", "#191b1d").style("stroke", "white").style("stroke-width", 0)
		.attr("x", xPos-10).attr("y", yPos-11).attr("height", 90).attr("width", 240)
		.style("opacity", .8);
	//text and colors
	chartContainer.append("text")
		.style("font-weight", 700)
		.attr("x", xPos).attr("y", yPos - 10)
		.text("KEY");
	chartContainer.append("rect")
		.style("fill", "#d7191c").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 7)
		.text("0.0-2.5: Poor");
	chartContainer.append("rect")
		.style("fill", "#fdae61").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 22)
		.text("2.5-3.0: Minimally Acceptable");
	chartContainer.append("rect")
		.style("fill", "#ffffbf").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 37)
		.text("3.0-3.5: Acceptable");
	chartContainer.append("rect")
		.style("fill", "#a6d96a").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 52)
		.text("3.5-4.0: Good");
	chartContainer.append("rect")
		.style("fill", "#1a9641").style("stroke", "none")
		.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 67)
		.text("4.0-5.0: Excellent");
	chartContainer.append("rect")
		.style("fill", "grey").style("stroke", "none").style("opacity", .5)
		.attr("x", xPos).attr("y", yPos + 75).attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("font-weight", 300)
		.attr("x", xPos + 25).attr("y", yPos + 82)
		.text("Outside MPO Region");

} //CTPS.demoApp.generateChart

