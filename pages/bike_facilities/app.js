var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([18000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,740]);
  
var geoPath = d3.geo.path().projection(projection); 

//Using the queue.js library
queue()
  .defer(d3.json, "../../json/boston_region_mpo_towns.topo.json")
  .defer(d3.csv, "../../json/bike_facilities_by_town.csv")
  .defer(d3.json, "../../json/mpo_existing_bike_facilities_2016.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1], results[2]);
    CTPS.demoApp.generatePlot(results[1]);
    //CTPS.demoApp.generateAccessibleTable(results[1]);
  }); 

//Color Scale
var colorScale = d3.scale.linear()
    .domain([0, 5, 10, 20, 40, 240, 900])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//var colorScale = d3.scale.linear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.properties.TOWN ;
    })

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

CTPS.demoApp.generatePlot = function(bikeData) {  
    var facilities = d3.select("#facilities").append("svg")
      .attr("width", "100%")
      .attr("height", 500)

    var xNow = 0;
    var xPos = 20; 
    var yNow = 0; 
    var yPos = 20; 

    facilities.selectAll(".box")
      .data(bikeData)
      .enter()
      .append("rect")
        .attr("class", "box")
        .attr("x", function(d) { 
          xPos += xNow; 
          xNow = d.BICYCLE_LANE_MILES + 1;
          return xPos; 
        })
        .attr("y", function(d){ 
          yPos += yNow; 
          yNow = d.SHARED_USE_PATH_MILES + 1;
          return yPos; 
        })
        .attr("width", function(d){ return +d.BICYCLE_LANE_MILES})
        .attr("height", function(d){ return +d.SHARED_USE_PATH_MILES})
        .style("fill", "#ddd")
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
