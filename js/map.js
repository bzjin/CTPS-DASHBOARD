var CTPS = {};
CTPS.demoApp = {};

var projScale = 50000,
		projXPos = 400,
		projYPos = 1900;

//For projecting the map and municipality boundaries, NB and EB roads
var projection = d3.geo.conicConformal()
.parallels([41 + 43 / 60, 42 + 41 / 60])
.rotate([71 + 30 / 60, -41 ])
.scale([projScale]) 
.translate([projXPos, projYPos]);

var geoPath = d3.geo.path().projection(projection);
	
//Using the queue.js library
queue()
	.defer(d3.json, "json/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "js/arterials_summary.json")
	.defer(d3.csv, "js/front_page_summaries.csv")
	.defer(d3.json, "js/pavement_summary.json")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1], results[2], results[3]);
	}); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, congestion, summaries, pavement) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
var simplify = topojson.feature(pavement, pavement.objects.road_inv_mpo_nhs_interstate_2015).features;

	// SVG Viewport
	var svgContainer = d3.select("#map").append("svg")
		.attr("width", 1300)
		.attr("height", 800);

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(topojson.feature(cities, cities.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", function(d){ return "subregion " + d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "black")
			.style("stroke", "#212127")
			.style("stroke-width", 4)
			.style("opacity", 0);

	//Congestion Map
	var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);

	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(topojson.feature(congestion, congestion.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "interstate")
			.attr("d", function(d) {return geoPath(d)})
			.style("fill", "none")
			.style("stroke-width", 2)
			.style("stroke-linecap", "round")
			.style("stroke", "#ff6347")
			//.style("opacity", function(d) { return (1 - d.properties.AM_SPD_IX/1.8);})//function(d) { return (d.properties.AM_SPD_IX-.5);})
			.style("opacity", 0)

	var pavements = svgContainer.selectAll(".pavement")
			.data(topojson.feature(pavement, pavement.objects.road_inv_mpo_nhs_interstate_2015).features)
			.enter()
			.append("path")
				.attr("class", "pavement")
				.attr("d", function(d) {return geoPath(d)})
				.style("fill", "none")
				.style("stroke-width", 1)
				.style("stroke", "#191b1d")
				.style("stroke-linecap", "round")
				.style("opacity", 0)

	d3.selectAll(".subregion").transition()
		.duration(3000)
		.style("opacity", .2)

	d3.selectAll(".interstate").transition()
		.delay(function(d) { return d.properties.AM_SPD_IX*2000})
		.ease("elastic")
		.duration(6000)
		.style("fill", "none")
		.style("stroke-width", 1)
		.style("stroke", "#191b1d")
		.style("opacity", 1)

	//Hover over Crashes link
	d3.select("#crashes").on("mouseenter", function(){
		//load crashdata
		d3.json("json/motorized_crashes.json", function(crashdata){ 
			//find corresponding town values in crash
			var findIndex = function(town, statistic) { 
				for (var i = 0; i < crashdata.length; i++) { 
					if (crashdata[i].year == 2013 && crashdata[i].town == town) {
						return crashdata[i][statistic]; 
					} 
				}
			} // end findIndex

			var colorScale = d3.scale.linear()
    						.domain([0, 50, 100, 200, 400, 800, 1600])
   							.range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

			d3.selectAll(".subregion").transition()
				.delay(function (d, i) { return Math.floor(i/10)*100})
				.duration(3000)
				.ease("elastic")
				.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				return colorScale(findIndex(capTown, "mot_inj")+findIndex(capTown, "mot_inj")); 	
			})
		}) // end d3.json 
	})//end d3.select("#crashes") MOUSEENTER
	d3.select("#crashes").on("mouseleave", function(){
		d3.selectAll(".subregion").transition()
			.duration(750)
			.style("fill", "black")			
	})

	//Hover over PAVEMENT link

	d3.select("#pavement").on("mouseenter", function() {
		var colorPavement = d3.scale.quantize()
									.domain([0, 5])
									.range(["#d7191c", "#d7191c", "#d7191c", "#fdae61","#ffffbf","#a6d96a","#1a9641"])

		d3.selectAll(".pavement").transition()
				.delay(function(d) { return d.properties.PSI*500})
				.ease("elastic")
				.duration(3000)
				.style("stroke", function(d) { return colorPavement(d.properties.PSI)})
				.style("opacity", 1)
	});

	d3.select("#pavement").on("mouseleave", function(){
		d3.selectAll(".pavement").transition()
			.duration(750)
			.style("opacity", 0)
	})


	//Hover over CONGESTION link
	d3.select("#congestion").on("mouseenter", function(){
		//load crashdata
			var colorCong = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);

			d3.selectAll(".interstate").transition()
				.delay(function (d, i) { return Math.floor(i/100)*100})
				.duration(3000)
				.style("stroke", function(d){ 
					return colorCong(d.properties.AM_SPD_IX);
				})
				.style("opacity", .2)
		}) // end d3.json 
	d3.select("#congestion").on("mouseleave", function(){
		d3.selectAll(".interstate").transition()
			.duration(750)
			.style("stroke", "#191b1d")	
			.style("opacity", 1)
	})

	//find data corresponding to municipalities
	var findSummary= function(town, statistic) { 
		for (var i = 0; i < summaries.length; i++) { 
			if (summaries[i].Town == town) {
				return summaries[i][statistic]; 
			} 
		}
	} // end findIndex

//Hover over BRIDGES link
	d3.select("#bridges").on("mouseenter", function(){
		//load crashdata
		var colorBridge = d3.scale.linear().domain([1, .03, 0]).range(["#D73027", "#fee08b", "#00B26F"]);

		d3.selectAll(".subregion").transition()
			.delay(function (d, i) { return Math.floor(i/10)*100})
			.duration(3000)
			.ease("elastic")
			.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				if (isNaN(parseInt(findSummary(capTown, "Bridges")))){ 
					return "black";
				} else { 
					return colorBridge(findSummary(capTown, "Bridges"));
				}
			})
	})
	d3.select("#bridges").on("mouseleave", function(){
		d3.selectAll(".subregion").transition()
			.duration(750)
			.style("fill", "black")			
	})

//Hover over SIDEWALKS link
	d3.select("#sidewalks").on("mouseenter", function(){
		//load crashdata
		var colorSidewalks = d3.scale.linear().domain([0, .8, 1.5]).range(["#fff7bc","#fec44f","#d95f0e"]);

		d3.selectAll(".subregion").transition()
			.delay(function (d, i) { return Math.floor(i/10)*100})
			.duration(3000)
			.ease("elastic")
			.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
					return colorSidewalks(findSummary(capTown, "Sidewalks"));
			})
	})
	d3.select("#sidewalks").on("mouseleave", function(){
		d3.selectAll(".subregion").transition()
			.duration(750)
			.style("fill", "black")			
	})

//Hover over BIKES link
	d3.select("#bikes").on("mouseenter", function(){
		//load crashdata
		var colorBikes = d3.scale.linear().domain([0, .02, .3]).range(["#e0ecf4","#9ebcda","#8856a7"]);

		d3.selectAll(".subregion").transition()
			.delay(function (d, i) { return Math.floor(i/10)*100})
			.duration(3000)
			.ease("elastic")
			.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				if (findSummary(capTown, "Bike") == 0){ 
					return "black";
				} else { 
					return colorBikes(findSummary(capTown, "Bike"));
				}
			})
	})
	d3.select("#bikes").on("mouseleave", function(){
		d3.selectAll(".subregion").transition()
			.duration(750)
			.style("fill", "black")			
	})

//Hover over BIKES link
	d3.select("#funding").on("mouseenter", function(){
		//load crashdata
		var colorEquity = d3.scale.linear()
		    .domain([0, 500000, 5000000, 10000000, 15000000, 20000000, 25000000])
		    .range(["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"]);

		d3.selectAll(".subregion").transition()
			.delay(function (d, i) { return Math.floor(i/10)*100})
			.duration(3000)
			.ease("elastic")
			.style("fill", function(d){ 
				var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				if (findSummary(capTown, "Equity") == 0){ 
					return "black";
				} else { 
					return colorEquity(findSummary(capTown, "Equity"));
				}
			})
	})
	d3.select("#equity").on("mouseleave", function(){
		d3.selectAll(".subregion").transition()
			.duration(750)
			.style("fill", "black")			
	})
} // CTPS.demoApp.generateViz()

