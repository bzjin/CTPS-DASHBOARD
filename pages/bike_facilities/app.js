var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([26000]) // N.B. The scale and translation vector were determined empirically.
  .translate([100,1050]);
  
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
  .defer(d3.json, "../../json/mpo_existing_bike_facilities_2016.topojson")
  .defer(d3.csv, "../../json/bike_facilities_by_town.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1], results[2]);
    CTPS.demoApp.generatePlot(results[2]);
    //CTPS.demoApp.generateAccessibleTable(results[1]);
  }); 
//ar colorScale = d3.scale.linear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.properties.TOWN ;
    })

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, bikeRoads, bikeData) {  
  // SVG Viewport

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 500)

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
        return colorScaleBars(findIndex(capTown, "TOTAL_PERCENT"));  
      })
      .style("opacity", function(d) { 
          var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          if (findIndex(capTown, "TOTAL_PERCENT") == 0 ) { return .1 } 
          else { return 1}
      })
      .style("stroke", "#191b1d")
      .style("stroke-width", "1px")

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
}

CTPS.demoApp.generatePlot = function(bikeData) { 

var towns = [];
bikeData.forEach(function(i){
  i.TOTAL_PERCENT = +i.TOTAL_PERCENT;
  if (i.TOTAL_PERCENT != 0) { 
    towns.push(i.TOWN);
  }
})

var bikes = {
  "TOWN": "All", 
  "children": bikeData
}
var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.TOTAL_MILES; });

var div = d3.select("#facilities").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

treemap.nodes.sort(function(a, b) { 
  var nameA = a.TOTAL_PERCENT;
  var nameB = b.TOTAL_PERCENT; 
  if (nameA < nameB) { return 1}
  if (nameA > nameB) { return -1 }
  return 0; 
})

var node = div.datum(bikes).selectAll(".node")
    .data(treemap.nodes)
  .enter().append("div")
    .attr("class", function(d) { return d.TOWN + " node"; } )
    .call(position)
    .style("opacity", function(d) { 
        return d.TOTAL_PERCENT + .8
    })
    .style("border", ".5px solid #191b1d")
    .style("border-radius", "3px")
    .style("background", function(d) { 
      return "linear-gradient(" + colorScaleBars(d.PERCENT_OFFROAD) + " " + 100*d.OFF_ROAD_MILES/d.TOTAL_MILES + "%, " +  colorScaleBars(d.PERCENT_ONROAD) + " " + 100*d.OFF_ROAD_MILES/d.TOTAL_MILES + "%," + colorScaleBars(d.PERCENT_ONROAD) + ")";
    })
      //return colorScaleBars(d.TOTAL_PERCENT)})
    .on("mouseenter", function(d) { 
    })



d3.selectAll("input").on("change", function change() {
  var value = this.value === "count"
      ? function() { return 1; }
      : function(d) { return d.TOTAL_MILES; };

node
  .data(treemap.value(value).nodes)
  .transition()
    .duration(1500)
    .call(position);
});

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 3) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 3) + "px"; });
  }
/*
 var stacks = d3.select("#stacks").append("svg")
  .attr("width", "100%")
  .attr("height", 500)

var xScale = d3.scale.linear()
            .domain([0, 109])
            .range([50, 900])

var xScaleWidth = d3.scale.linear()
            .domain([0, 109])
            .range([0, 850])

var yScale = d3.scale.linear()
            .domain([0, 50])
            .range([350, 50])

var yScaleHeight = d3.scale.linear()
            .domain([0, 50])
            .range([0, 300])

bikeData.sort(function(a, b) { 
  var nameA = a.OFF_ROAD_MILES;
  var nameB = b.OFF_ROAD_MILES; 
  if (nameA < nameB) { return -1}
  if (nameA > nameB) { return 1 }
  return 0; 
})

var xPos = 0; 
stacks.selectAll("stacks")
  .data(bikeData)
  .enter()
  .append("rect")
    .attr("class", "stacks")
    .attr("width", function(d) { 
      if (d.TOTAL_MILES != 0) { 
        return xScaleWidth(d.OFF_ROAD_MILES);
      } else { 
        return 0; 
      }
    })
    .attr("height", function(d) { return yScaleHeight(d.SHARED_USE_PATH_MILES)})
    .attr("x", function(d) { 
      xPos = xPos + +d.OFF_ROAD_MILES;
      return xScale(xPos - +d.OFF_ROAD_MILES);
    })
    .attr("y", function(d) { return yScale(d.SHARED_USE_PATH_MILES)})
    .style("fill", function(d) { return colorScaleBars(d.TOTAL_PERCENT)})*/

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
