var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([14000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,580]);
  
var geoPath = d3.geo.path().projection(projection);

//Color Scale
var colorScale = d3.scale.linear()
    .domain([0, 25, 50, 100, 250, 500, 1000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//Color Scale for bar chart 
var colorScaleBars = d3.scale.linear()
    .domain([0, .01, .02, .05, .1, .2])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse())

//Using the queue.js library
queue()
  .defer(d3.json, "../../json/boston_region_mpo_towns.topo.json")
  //.defer(d3.json, "../../json/mpo_existing_bike_facilities_2016.topojson")
  .defer(d3.csv, "../../json/bike_facilities_by_town.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1]);
    CTPS.demoApp.generatePlot(results[1]);
    //CTPS.demoApp.generateAccessibleTable(results[1]);
  }); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, bikeData) {  
  // SVG Viewport
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      var percent_onroad = findIndex(capTown, "PERCENT_ONROAD") * 100;
      var percent_offroad = findIndex(capTown, "PERCENT_OFFROAD") * 100;
      var miles_onroad = findIndex(capTown, "TOTAL_ONROAD");
      var miles_offroad = findIndex(capTown, "TOTAL_OFFROAD");

      return "<p>" + capTown + "</p>" + d3.round(percent_onroad, 1) + "% On-Road (" + miles_onroad + " Miles)<br>" + d3.round(percent_offroad, 1) + "% Off-Road (" + miles_offroad + " Miles)" ;
    })

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 600)

  svgContainer.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < bikeData.length; i++) { 
      if (bikeData[i].TOWN == town) {
        return bikeData[i][statistic]; 
      } 
    }
  }

  var findTownIndex = function(townID) { 
    var towns = topojson.feature(mpoTowns, mpoTowns.objects.collection).features;
    for (var i = 0; i < towns.length; i++) { 
      if (towns[i].properties.TOWN_ID == townID) {
          var capTown = towns[i].properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          return capTown;
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
      .style("fill", function(d){ 
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return colorScaleBars(findIndex(capTown, "PERCENT_OFFROAD"));  
      })
      .style("opacity", function(d) { 
          var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          if (findIndex(capTown, "PERCENT_OFFROAD") == 0 ) { return .1 } 
          else { return 1}
      })
      .style("stroke", "#191b1d")
      .style("stroke-width", "1px")
      .on("mouseenter", function(d) { 
        tip.show(d);
      })
      .on("mouseleave", function(d) { 
        tip.hide(d);
      })

   /*var bikeTrails = svgContainer.selectAll(".biketrails")
    .data(topojson.feature(bikeRoads, bikeRoads.objects.mpo_existing_bike_facilities_2016).features)
    .enter()
    .append("path")
      //.attr("class", function(d){ return findTownIndex(d.properties.muni_id); })
      .attr("d", function(d, i) {return geoPath(d); })
      .style("stroke", "#191b1d")
      .style("fill", "none")
      .style("stroke-linecap", "round")
      .style("opacity", function(d) { return d.properties.TOTAL_PERCENT; })
      .style("stroke-width", "1px")*/

       //Color key
    var xPos = 5;
    var yPos = 330; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .text("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScaleBars(0)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .text("No bike facilities");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.02)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("0-5%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.05)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("5-15%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.1)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("10-20%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.2)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text(">20%"); 

}

CTPS.demoApp.generatePlot = function(bikeData) { 

var towns = [];
bikeData.forEach(function(i){
  i.PERCENT_ONROAD = +i.PERCENT_ONROAD;
  i.PERCENT_OFFROAD = +i.PERCENT_OFFROAD;

  if (i.PERCENT_ONROAD != 0 || i.PERCENT_OFFROAD != 0) { 
    towns.push(i.TOWN);
  }
})

bikeData.sort(function(a, b) { 
  var nameA = a.PERCENT_OFFROAD + a.PERCENT_ONROAD;
  var nameB = b.PERCENT_OFFROAD + b.PERCENT_ONROAD;
  if (nameA < nameB) { return -1}
  if (nameA > nameB) { return 1 }
  return 0;

}) 

plot();

function plot() { 

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      return d3.round(d.PERCENT_ONROAD*100, 1) + "% On-Road (" + d.TOTAL_ONROAD + " Miles)<br>" + d3.round(d.PERCENT_OFFROAD*100, 1) + "% Off-Road (" + d.TOTAL_OFFROAD + " Miles)" ;
    })


  var stacks = d3.select("#facilities").append("svg")
    .attr("class", "plots")
    .attr("width", "100%")
    .attr("height", 500)

  var bikeCities = [];
  bikeData.forEach(function(i){
    if (i.PERCENT_ONROAD != 0 || i.PERCENT_OFFROAD != 0) { 
      bikeCities.push(i.TOWN);
    }
  })
 console.log(bikeData)
  var onRoadPercent = d3.scale.linear()
              .domain([0, .2])
              .range([50, 200]);

  var onRoadMiles = d3.scale.linear()
              .domain([0, 30])
              .range([220, 370]);

  var yScale = d3.scale.ordinal()
          .domain(bikeCities)
          .rangePoints([30, 480]);
  
  var xAxis = d3.svg.axis().scale(onRoadPercent).orient("top").ticks(10).tickFormat(d3.format("d")); 

  stacks.selectAll(".onRoad")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "onRoad")
      .attr("x", onRoadPercent(0))
      .attr("y", function(d) { return yScale(d.TOWN)})
      .attr("width", function(d) { return onRoadPercent(d.PERCENT_ONROAD) - 50 })
      .style("fill", function(d) { return colorScaleBars(d.PERCENT_ONROAD)})
    

}
   
d3.select("#alphabetize").on("click", function(){
  d3.selectAll(".plots").remove();
  bikeData.sort(function(a, b) { 
    var nameA = a.TOWN;
    var nameB = b.TOWN;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot();
})

d3.select("#byNumber").on("click", function(){
  d3.selectAll(".plots").remove();
  bikeData.sort(function(a, b) { 
    var nameA = a.TOTAL_OFFROAD + a.TOTAL_ONROAD;
    var nameB = b.TOTAL_OFFROAD + b.TOTAL_ONROAD;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot();
})

d3.select("#byAverages").on("click", function(){
  d3.selectAll(".plots").remove();
  bikeData.sort(function(a, b) { 
    var nameA = a.PERCENT_OFFROAD + a.PERCENT_ONROAD;
    var nameB = b.PERCENT_OFFROAD + b.PERCENT_ONROAD;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0;
  }) 
  plot();
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
