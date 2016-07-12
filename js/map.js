$(function() {
    function count($this){
        var current = parseInt($this.html(), 10);
        current = current + 1 ; /* Where 5 is increment */

	    $this.html(++current);
	    if(current > $this.data('count')){
	        $this.html($this.data('count'));
	    } else {    
	        setTimeout(function(){count($this)}, 5);
	    }
	}         
  $(".countUp").each(function() {
      $(this).data('count', parseInt($(this).html(), 10));
      $(this).html('0');
      count($(this));
  });
});

var yolo = d3.select("#progress-test").append("svg")
	.attr("width", 135)
	.attr("height", 20)
	.style("border", "grey 1.5px solid")

yolo.append("rect")
	.attr("width", 65)
	.attr("height", 12)
	.attr("x", 65)
	.attr("y", 3)
	.style("fill", "#66bd63")

var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);

var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([50000]) // N.B. The scale and translation vector were determined empirically.
	.translate([400,1900]);
	
var geoPath = d3.geo.path().projection(projection);	

//Using the queue.js library
queue()
	.defer(d3.json, "json/boston_region_mpo_towns.topo.json")
	.defer(d3.json, "json/CMP_2014_EXP_ROUTES.topojson")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1]);
	}); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, congestion) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior

	// SVG Viewport
	var svgContainer = d3.select("#map").append("svg")
		.attr("width", 1300)
		.attr("height", 800);

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(topojson.feature(cities, cities.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "subregion")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "black")
			.style("stroke", "#212127")
			.style("stroke-width", 4)
			.style("opacity", 0);


	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(topojson.feature(congestion, congestion.objects.collection).features)
		.enter()
		.append("path")
			.attr("class", "interstate")
			.attr("d", function(d, i) { return geoPath(d); })
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linecap", "round")
			.style("stroke", function(d) { 
				if (colorScale(d.properties.AM_SPD_IX) != "white") {
					return colorScale(d.properties.AM_SPD_IX)
				} else { 
					return "black";
				}
			})
			.style("opacity", function(d) { return (1 - d.properties.AM_SPD_IX);})//function(d) { return (d.properties.AM_SPD_IX-.5);})

	d3.selectAll(".subregion").transition()
		.duration(3000)
		.style("opacity", .2)

	d3.selectAll(".interstate").transition()
		.delay(1000)
		.duration(3000)
		.style("stroke-width", function(d) { return 1/d.properties.AM_SPD_IX}); 
} // CTPS.demoApp.generateViz()

