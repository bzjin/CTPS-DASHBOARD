//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");
var g = d3.format(".0s");

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
	.defer(d3.csv, "../../data/csv/CTPS_TOWNS_MAPC_VMT.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateEmissions(results[0]);
		CTPS.demoApp.generateVMTVHT(results[0]);
	}); 

CTPS.demoApp.generateEmissions = function(emissions) {
	generateLineGraph("VOC", "BOSTON");
	generateLineGraph("NOX", "BOSTON");
	generateLineGraph("CO", "BOSTON");
	generateLineGraph("CO2", "BOSTON");

	function generateLineGraph(emittant, city) {

		var chart = d3.select("#emissions" + emittant).append("svg")
			    .attr("width", "100%")
			    .attr("height", 650)

	    var w = $("#emissions" + emittant).width();

		chart.selectAll("points")
			.data(emissions)
			.enter()
			.append("circle")
				.attr("class", function(d) { return d.TOWN;})

		var towns = [];

		emissions.forEach(function(i){
		    towns.push(i.TOWN);

			var VOC_SOV_array = [];
		    VOC_SOV_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_SOV_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_SOV_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_SOV_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_SOV_NT"] })
		    i.VOC_SOV_array = VOC_SOV_array; 

		    var VOC_HOV_array = [];
		    VOC_HOV_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_HOV_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_HOV_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_HOV_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_HOV_NT"] })
		    i.VOC_HOV_array = VOC_HOV_array; 

			var VOC_TRK_array = [];
		    VOC_TRK_array.push(
		    	{ "time": "AM",
		    	  "stat": +i[emittant + "_TRK_AM"] },
		    	{ "time": "MD",
		    	  "stat": +i[emittant + "_TRK_MD"] },
		    	{ "time": "PM",
		    	  "stat": +i[emittant + "_TRK_PM"] }, 
		    	{ "time": "NT",
		    	  "stat": +i[emittant + "_TRK_NT"] })
		    i.VOC_TRK_array = VOC_TRK_array; 
		})

		if (emittant == "VOC") { 
			var metric = "grams of";
			var acronym = "volatile organic compound";
			emissions.forEach(function(i){
				if (i.TOWN == city) { max = +i[emittant + "_SOV_NT"] + 5000; }
			})
		} else if (emittant == "NOX") { 
			var metric = "grams of";
			var acronym = "nitrogen oxide";
			emissions.forEach(function(i){
				if (i.TOWN == city) { max = +i[emittant + "_SOV_NT"] + 5000}
			})
		} else if (emittant == "CO") { 
			var metric = "kilograms of";
			var acronym = "carbon monoxide";
			emissions.forEach(function(i){
				if (i.TOWN == city) { max = +i[emittant + "_SOV_NT"] + 500}
			});
		} else if (emittant == "CO2") { 
			var metric = "kilograms of";
			var acronym = "carbon dioxide";
			emissions.forEach(function(i){
				if (i.TOWN == city) { max = +i[emittant + "_SOV_NT"] + 5000}
			})
		} 


		chart.append("text")
				.attr("x", w/2).attr("y", 40)
				.style("text-anchor", "middle").style("font-weight", 300).style("font-size", 10)
				.text(metric)
			chart.append("text")
				.attr("x", w/2).attr("y", 55)
				.style("text-anchor", "middle").style("font-weight", 300).style("font-size", 10)
				.text(acronym)


		var xScale = d3.scalePoint().domain(["AM", "MD", "PM", "NT"]).range([50, w - 10]);
		var yScale = d3.scaleLinear().domain([0, max]).range([600, 80]);

		var xAxis = d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale).tickSize(-(w-60), 0, 0).tickFormat(function(g){
			        if(Math.floor(g) != g)
			        { return; } else { return g; }});;

		chart.append("text")
				.attr("x", w/2).attr("y", 20)
				.style("text-anchor", "middle").style("font-weight", 700).style("font-size", 16)
				.text(emittant)

		chart.append("g").attr("class", "axis")
			.attr("transform", "translate(0, 600)")
			.call(xAxis).selectAll("text").style("font-size", "12px").style("text-anchor", "end");
		
		chart.append("g").attr("class", "axis")
			.attr("transform", "translate(50, 0)")
			.call(yAxis).selectAll("text").style("font-size", "12px")

		var VOC_line = d3.area()
			.curve(d3.curveBasis)
		    .x(function(i) { return xScale(i.time); })
		    .y1(function(i) { if (!isNaN(yScale(i.stat))) { return yScale(i.stat) }})
		    .y0(yScale(0))

		/*var tip = d3.tip()
		    .attr('class', 'd3-tip')
		    .offset([0, 10])
		    .html(function(d) {
		      return d.town + "<br>" + d.year + "<br>Sidewalk Miles: " + d.sidewalk_miles + "<br>Centerline Miles: " + d.center_line_miles;
		    })*/
		//chart.call(tip); 
		  chart.selectAll(".VOC_SOV")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN + " area"})
		      .attr("d", function(d) { return VOC_line(d.VOC_SOV_array)})
		      .style("fill", "white").style("stroke", "white").style("stroke-width", .5)
		      .style("fill-opacity", .01)

		   chart.selectAll(".VOC_HOV")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN + " area"})
		      .attr("d", function(d) { return VOC_line(d.VOC_HOV_array)})
		      .style("fill", "orange").style("stroke", "orange").style("stroke-width", .5)
		      .style("fill-opacity", .01)

			chart.selectAll(".VOC_TRK")
		    .data(emissions)
		    .enter()
		    .append("path")
		      .attr("class", function(d) { return d.TOWN + " area"})
		      .attr("d", function(d) { return VOC_line(d.VOC_TRK_array)})
		      .style("fill", "pink").style("stroke", "pink").style("stroke-width", .5)
		      .style("fill-opacity", .01)


} //end generateLineGraph


d3.selectAll(".townpicker").on("click", function(){
		var mystring = this.getAttribute("class");
		var arr = mystring.split(" ", 2);
		var firstWord = arr[0]; 

		if (firstWord == "ALL") { 
			d3.selectAll(".emissions svg").remove();

			generateLineGraph("VOC", "BOSTON");
			generateLineGraph("NOX", "BOSTON");
			generateLineGraph("CO", "BOSTON");
			generateLineGraph("CO2", "BOSTON");

			d3.selectAll(".area")
				.style("opacity", 1)
				.style("fill-opacity", 0)
			 	.style("stroke-width", .5)
		} else {
			d3.selectAll(".emissions svg").remove();

			generateLineGraph("VOC", firstWord);
			generateLineGraph("NOX", firstWord);
			generateLineGraph("CO", firstWord);
			generateLineGraph("CO2", firstWord);

			d3.selectAll(".area")
				.style("opacity", 0)

			d3.selectAll("." + firstWord)
				.style("opacity", 1)
				.style("fill-opacity", .2)
		}
}) //end click function

} //end generateEmissions

CTPS.demoApp.generateVMTVHT = function(emissions) {
	var chart = d3.select("#VMTVHT").append("svg")
		    .attr("width", 3000)
		    .attr("height", 650)
		    .style("overflow", "scroll !important")

    var w = 3000;

	var towns = [];
	emissions.forEach(function(i){
		i.TOWN = i.TOWN.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
		towns.push(i.TOWN);
	})


	var xScale = d3.scalePoint().domain(towns).range([50, w-50]);
	yScale = d3.scaleLinear().domain([0, 400000]).range([550, 80]);
	yScaleH = d3.scaleLinear().domain([0, 400000]).range([0, 470]);

	var xAxis = d3.axisBottom(xScale);
	yAxis = d3.axisLeft(yScale).tickSize(-(w-100), 0, 0).tickFormat(function(g){
		        if(Math.floor(g) != g)
		        { return; } else { return g; }});

	chart.append("text")
			.attr("x", 575).attr("y", 20)
			.style("text-anchor", "middle").style("font-weight", 700).style("font-size", 16)
			.text("VMT")

	chart.append("g").attr("class", "xaxis")
		.attr("transform", "translate(20, 555)")
		.call(xAxis)
			.selectAll("text").style("font-size", "12px").style("text-anchor", "end").attr("transform", "rotate(-45)");
	
	chart.append("g").attr("class", "axis yaxis")
		.attr("transform", "translate(60, 0)")
		.call(yAxis).selectAll("text").style("font-size", "12px").attr("transform", "translate(-10,0)");

	var VOC_line = d3.area()
		.curve(d3.curveBasis)
	    .x(function(i) { return xScale(i.time); })
	    .y1(function(i) { if (!isNaN(yScale(i.stat))) { return yScale(i.stat) }})
	    .y0(yScale(0))

	var colorTime = ["#edf8b1","#7fcdbb","#1d91c0","#253494"]
	var bW = 4; 
	var sP = 15; 

	makeBars("VMT", "SOV");
	tag = "SOV";
	function makeBars(emittant, vehicle){
	chart.selectAll(".VMT_AM")
	    .data(emissions)
	    .enter()
	    .append("rect")
	      .attr("class", function(d) { return d.TOWN + " rectangle"})
	      .attr("x", function(d) { return xScale(d.TOWN) + sP;})
	      .attr("y", function(d) { return yScale(d[emittant + "_" + vehicle + "_AM"])})
	      .attr("width", bW)
	      .attr("height", function(d) { return yScaleH(d[emittant + "_" + vehicle + "_AM"])})
	      .style("fill", colorTime[0]).style("stroke-width", 0)

	chart.selectAll(".VMT_MD")
	    .data(emissions)
	    .enter()
	    .append("rect")
	      .attr("class", function(d) { return d.TOWN + " rectangle"})
	      .attr("x", function(d) { return xScale(d.TOWN) + sP + bW;})
	      .attr("y", function(d) { return yScale(d[emittant + "_" + vehicle + "_MD"])})
	      .attr("width", bW)
	      .attr("height", function(d) { return yScaleH(d[emittant + "_" + vehicle + "_MD"])})
	      .style("fill", colorTime[1]).style("stroke-width", 0)

	chart.selectAll(".VMT_PM")
	    .data(emissions)
	    .enter()
	    .append("rect")
	      .attr("class", function(d) { return d.TOWN + " rectangle"})
	      .attr("x", function(d) { return xScale(d.TOWN) + sP + (2 * bW);})
	      .attr("y", function(d) { return yScale(d[emittant + "_" + vehicle + "_PM"])})
	      .attr("width", bW)
	      .attr("height", function(d) { return yScaleH(d[emittant + "_" + vehicle + "_PM"])})
	      .style("fill", colorTime[2]).style("stroke-width", 0)

	chart.selectAll(".VMT_NT")
	    .data(emissions)
	    .enter()
	    .append("rect")
	      .attr("class", function(d) { return d.TOWN + " rectangle"})
	      .attr("x", function(d) { return xScale(d.TOWN) + sP + (3 * bW);})
	      .attr("y", function(d) { return yScale(d[emittant + "_" + vehicle + "_NT"])})
	      .attr("width", bW)
	      .attr("height", function(d) { return yScaleH(d[emittant + "_" + vehicle + "_NT"])})
	      .style("fill", colorTime[3]).style("stroke-width", 0)
	 } //end makeBars

	d3.selectAll("#bySOV").on("click", function(){
			yScale = d3.scaleLinear().domain([0, 400000]).range([550, 80]);
			yScaleH = d3.scaleLinear().domain([0, 400000]).range([0, 470]);

			yAxis = d3.axisLeft(yScale).tickSize(-(w-100), 0, 0).tickFormat(function(g){
		        if(Math.floor(g) != g)
		        { return; } else { return g; }});

			chart.select(".yaxis").transition()
				.duration(750)
                .call(yAxis);

            d3.selectAll("#VMTVHT .rectangle").remove();
			makeBars("VMT", "SOV");
			tag = "SOV"

	})

	d3.selectAll("#byHOV").on("click", function(){
			yScale = d3.scaleLinear().domain([0, 130000]).range([550, 80]);
			yScaleH = d3.scaleLinear().domain([0, 130000]).range([0, 470]);

			yAxis = d3.axisLeft(yScale).tickSize(-(w-100), 0, 0).tickFormat(function(g){
		        if(Math.floor(g) != g)
		        { return; } else { return g; }});

			chart.select(".yaxis").transition()
				.duration(750)
                .call(yAxis);

            d3.selectAll("#VMTVHT .rectangle").remove();
			makeBars("VMT", "HOV");
			tag = "HOV";

	})

	d3.selectAll("#byTRK").on("click", function(){
			yScale = d3.scaleLinear().domain([0, 150000]).range([550, 80]);
			yScaleH = d3.scaleLinear().domain([0, 150000]).range([0, 470]);

			yAxis = d3.axisLeft(yScale).tickSize(-(w-100), 0, 0).tickFormat(function(g){
		        if(Math.floor(g) != g)
		        { return; } else { return g; }});

			chart.select(".yaxis").transition()
				.duration(750)
                .call(yAxis);

            d3.selectAll("#VMTVHT .rectangle").remove();
			makeBars("VMT", "TRK");
			tag = "TRK";

	})

	d3.select("#alphabetize").on("click", function(){
      d3.selectAll("#VMTVHT .rectangle").remove();
	  emissions.sort(function(a, b) { 
	    var nameA = a.TOWN;
	    var nameB = b.TOWN;
	    if (nameA < nameB) { return -1}
	    if (nameA > nameB) { return 1 }
	    return 0; 
	  })
	  makeBars("VMT", tag);
	})

	d3.select("#byAverages").on("click", function(){
	  d3.selectAll(".plots2").remove();
	  emissions.sort(function(a, b) { 
	    var nameA = +a["VMT_" + tag + "_AM"];
	    var nameB = +b["VMT_" + tag + "_AM"];
	    if (nameA < nameB) { return -1}
	    if (nameA > nameB) { return 1 }
	    return 0; 
	  })
	  makeBars("VMT", tag);
	})
}