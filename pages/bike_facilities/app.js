var CTPS = {};
CTPS.demoApp = {};

/*var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([18000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,740]);
  
var geoPath = d3.geo.path().projection(projection);*/

//Color Scale
var colorScale = d3.scaleLinear()
    .domain([0, 25, 50, 100, 250, 500, 1000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//var colorScale = d3.scale.linear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);

var svg = d3.select("#facilities").append("svg")
  .attr("width", 700)
  .attr("height", 500),
    margin = {top: 40, right: 40, bottom: 40, left: 80},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, width]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function type(d) {
  if (!d.TOTAL_PERCENT) return;
  d.TOTAL_PERCENT = +d.TOTAL_PERCENT;
  return d;
}
//Using the queue.js library
d3.csv("../../json/bike_facilities_by_town.csv", type, function(error, data){
  if (error) throw error;
  CTPS.demoApp.generatePlot(data);
    //CTPS.demoApp.generateAccessibleTable(results[1]);
}); 

CTPS.demoApp.generatePlot = function(data) { 

x.domain(d3.extent(data, function(d) { return d.TOTAL_PERCENT; }));

var simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(function(d) { return x(d.TOTAL_PERCENT); }).strength(1))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide().radius(function(d) { return 1.3 * Math.sqrt(d.CENTERLINE_MILES)}).iterations(5))
    .stop();

for (var i = 0; i < 120; ++i) simulation.tick();

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10))
    .selectAll("text").style("fill", "#ddd");

var cell = g.append("g")
    .attr("class", "cells")
  .selectAll("g").data(d3.voronoi()
      .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
    .polygons(data)).enter().append("g");

cell.append("circle")
    .attr("r", function(d) { return 1.1* Math.sqrt(d.data.CENTERLINE_MILES)})
    .attr("cx", function(d) { return d.data.x; })
    .attr("cy", function(d) { return d.data.y; })
    .style("fill", "none")
    .style("stroke", function(d) { return colorScale(d.data.CENTERLINE_MILES)});

/*var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
              grad.append("stop").attr("offset", "50%").style("stop-color", "#f96f3b");
              grad.append("stop").attr("offset", "50%").style("stop-color", "white");
*/

cell.append("circle")
    .attr("r", function(d) { return 1.1* Math.sqrt(d.data.TOTAL_MILES)})
    .attr("cx", function(d) { return d.data.x; })
    .attr("cy", function(d) { return d.data.y; })
    .style("fill", function(d) { return colorScale(d.data.CENTERLINE_MILES)});


cell.append("path")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

cell.append("title")
    .text(function(d) { return d.data.TOWN + "\n" + d.data.TOTAL_PERCENT; });
}

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, bikeData, bikeRoads) {  
  // SVG Viewport

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 400)

  svgContainer.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < bikeData.length; i++) { 
      if (bikeData[i].MUNICIPALITY == town) {
        return bikeData[i][statistic]; 
      } 
    }
  }

  // Create Boston Region MPO map with SVG paths for individual towns.
  var mapcSVG = svgContainer.selectAll(".mpo")
    .data(topojson.feature(mpoTowns, mpoTowns.objects.collection).features)
    .enter()
    .append("path")
      //.attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      //.style("fill", function(d){ 
        //var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        //return colorScale(findIndex(capTown, "TOTAL_MILES"));  
      //})
      .style("fill", "#fff")
      .style("opacity", 1)
      .style("stroke", "#191b1d")
      .style("stroke-width", "1px")

   var bikeTrails = svgContainer.selectAll(".biketrails")
    .data(topojson.feature(bikeRoads, bikeRoads.objects.mpo_existing_bike_facilities_2016).features)
    .enter()
    .append("path")
      //.attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      .style("opacity", 1)
      .style("stroke", "#6af73c")
      .style("stroke-width", "1px")
}



CTPS.demoApp.generateAccessibleTable = function(crashjson){
  var colDesc = [{ // array of objects
    "dataIndex" : "year",
    "header" : "Year"
  },{ 
    "dataIndex" : "town",
    "header" : "Town"
  },{ 
    "dataIndex" : "bike_inj",
    "header" : "Bike Injuries"
  },{ 
    "dataIndex" : "bike_fat",
    "header" : "Bike Fatalities"
  },{ 
    "dataIndex" : "ped_inj",
    "header" : "Pedestrian Injuries"
  },{ 
    "dataIndex" : "ped_fat",
    "header" : "Pedestrian Fatalities"
  }];

  var options = {
    "divId" : "crashTableDiv",
    "caption": "Nonmotorized Crash Data over Time: Bicycle and Pedestrian Injuries and Fatalities from 2004 to 2013",
  };

  $("#crashTable").accessibleGrid(colDesc, options, crashjson);
}
