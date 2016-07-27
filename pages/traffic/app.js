var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([35000]) // N.B. The scale and translation vector were determined empirically.
  .translate([100,1350]);
  
var geoPath = d3.geo.path().projection(projection); 

//Using the queue.js library
queue()
  .defer(d3.json, "../../json/boston_region_mpo_towns.topo.json")
  .defer(d3.json, "../../json/traffic_signals.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1]);
    //CTPS.demoApp.generateStats(results[1]);
  }); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, traffic) {  
  // SVG Viewport

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 600)

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      return capTown
    })

  svgContainer.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  // Create Boston Region MPO map with SVG paths for individual towns.
  var mapcSVG = svgContainer.selectAll(".mpo")
    .data(topojson.feature(mpoTowns, mpoTowns.objects.collection).features)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      .style("fill", "black")
      .style("stroke", "#191b1d")
      .style("stroke-width", 1)
      .on("mouseenter", function(d){
        tip.show(d);
      })
      .on("mouseleave", function(d){
        tip.hide(d);
      })

var signalArray = topojson.feature(traffic, traffic.objects.mpo_traffic_signals).features;
var mpoTownsArray = topojson.feature(mpoTowns, mpoTowns.objects.collection).features;

  svgContainer.selectAll(".signals")
    .data(topojson.feature(traffic, traffic.objects.mpo_traffic_signals).features)
    .enter()
    .append("circle")
      .attr("class", "signals")
      .attr("cx", function(d) {return projection(d.geometry.coordinates)[0]; })
      .attr("cy", function(d) {return projection(d.geometry.coordinates)[1]; })
      .attr("r", 2)
      .attr("fill", "none")
      .style("stroke", "white")
      .style("stroke-width", .5)
      .style("opacity", .5)
      .on("mouseenter", function(d){
        tip.show(d);
      })
      .on("mouseleave", function(d){
        tip.hide(d);
      })

  var signalCount = [];
  mpoTownsArray.forEach(function(i){ 
    if (signalCount.indexOf(i.properties.TOWN) < 0) { 
      signalCount.push({
        "town": i.properties.TOWN,
        "count": 0
      })
    }
  })

  var differentTypes = [];

  signalArray.forEach(function(i){ 
    if (differentTypes.indexOf(i.properties.Signal_Type) < 0) { 
      differentTypes.push(i.properties.Signal_Type);
    }
  })
  console.log(differentTypes)

  signalArray.forEach(function(i) { 
    signalCount.forEach(function(j){
      if (i.properties.city_town == j.town){
        j.count++;
      }
    })
  })

  signalCount.forEach(function(i){
    console.log(i.count)
  })
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