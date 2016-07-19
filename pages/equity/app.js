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
  .defer(d3.json, "../../json/equity.json")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1]);
    CTPS.demoApp.generateStats(results[1]);
    //CTPS.demoApp.generateAccessibleTable(results[1]);
  }); 

//Color Scale
var colorScale = d3.scale.linear()
    .domain([0, 500000, 5000000, 10000000, 15000000, 20000000, 25000000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ddd"].reverse());

//var colorScale = d3.scale.linear().domain([0, 20, 100, 200]).range(["#ffffcc", "#f9bf3b","#ff6347", "#ff6347"]);



////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, equity) {  
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
      return findIndex(capTown, "Total_FFY_2008_2013_TIPs");
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
      .style("fill", function(d){ 
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return colorScale(findIndex(capTown, "Total_FFY_2008_2013_TIPs"));  
      })
      .style("opacity", function(d) { 
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        if (findIndex(capTown, "Total_FFY_2008_2013_TIPs") == 0) { 
          return .1;
        } else {
          return 1;
        }
      })
      .style("stroke", "#191b1d")
      .style("stroke-width", "1px")
      .on("mouseenter", function(d){
        tip.show(d);
      })
}

CTPS.demoApp.generateStats = function(equity){
  var maxmins = [];
  maxmins = [[],[],[],[],[]]
  equity.forEach(function(i){
    maxmins[0].push(i.Population);
    maxmins[1].push(i.Median_Household_Income);
    maxmins[2].push(i.MINORITY_2010);
    maxmins[3].push(i.MILES_2010);
  })
  console.log(maxmins[0].length)

  var width = 300; 
  var height = 200; 
  var padding = 10; 
  //Population by town
  var chartPop = d3.select("#chartPop").append("svg")
      .attr("width", "100%")
      .attr("height", height)

  equity.sort(function(a, b){
    var nameA = a.Population;
    var nameB = b.Population;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1}
    return 0;
  })

  townOrder = [];
  equity.forEach(function(i){
    townOrder.push(i.MPO_Municipality)
  })

  var xScale = d3.scale.ordinal()
              .domain(townOrder)
              .rangePoints([padding, width - padding])

  var yScale = d3.scale.linear()
              .domain([0, d3.max(maxmins[0])])
              .range([height-padding, padding])

  var yScaleHeight = d3.scale.linear()
              .domain([0, d3.max(maxmins[0])])
              .range([0, height - (2*padding)])

  chartPop.selectAll(".population")
    .data(equity)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.MPO_Municipality + " population"})
        .attr("x", function(d) { return xScale(d.MPO_Municipality);})
        .attr("y", function(d) { return yScale(d.Population);})
        .attr("width", 2)
        .attr("height", function(d) {return yScaleHeight(d.Population)})
        .style("fill", "#ddd")

  equity.sort(function(a, b){
    var nameA = a.Median_Household_Income;
    var nameB = b.Median_Household_Income;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1}
    return 0;
  })

  townOrder = [];
  equity.forEach(function(i){
    townOrder.push(i.MPO_Municipality)
  })
//Income by town
  var chartIncome = d3.select("#chartIncome").append("svg")
      .attr("width", "100%")
      .attr("height", height)

  var xScale = d3.scale.ordinal()
              .domain(townOrder)
              .rangePoints([padding, width - padding])

  var yScale = d3.scale.linear()
              .domain([0, d3.max(maxmins[1])])
              .range([height-padding, padding])

  var yScaleHeight = d3.scale.linear()
              .domain([0, d3.max(maxmins[1])])
              .range([0, height-(2*padding)])


  chartIncome.selectAll(".income")
    .data(equity)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.MPO_Municipality + " income"})
        .attr("x", function(d) { return xScale(d.MPO_Municipality);})
        .attr("y", function(d) { return yScale(d.Median_Household_Income);})
        .attr("width", 2)
        .attr("height", function(d) {return yScaleHeight(d.Median_Household_Income)})
        .style("fill", "#ddd")

//Minorities by town

equity.sort(function(a, b){
    var nameA = a.MINORITY_2010;
    var nameB = b.MINORITY_2010;
    if (nameA < nameB) { return -1}

    if (nameA > nameB) { return 1}
    return 0;
  })

  townOrder = [];
  equity.forEach(function(i){
    townOrder.push(i.MPO_Municipality)
  })
  var chartMinority = d3.select("#chartMinority").append("svg")
      .attr("width", "100%")
      .attr("height", height)

var xScale = d3.scale.ordinal()
              .domain(townOrder)
              .rangePoints([padding, width - padding])

 var yScale = d3.scale.linear()
              .domain([0, d3.max(maxmins[2])])
              .range([height-padding, padding])

  var yScaleHeight = d3.scale.linear()
              .domain([0, d3.max(maxmins[2])])
              .range([0, height-(2*padding)])

  chartMinority.selectAll(".minority")
    .data(equity)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.MPO_Municipality + " minority"})
        .attr("x", function(d) { return xScale(d.MPO_Municipality);})
        .attr("y", function(d) { return yScale(d.MINORITY_2010);})
        .attr("width", 2)
        .attr("height", function(d) {return yScaleHeight(d.MINORITY_2010)})
        .style("fill", "#ddd")

//Miles by town
  var chartMiles = d3.select("#chartMiles").append("svg")
      .attr("width", "100%")
      .attr("height", height)

  equity.sort(function(a, b){
    var nameA = a.MILES_2010;
    var nameB = b.MILES_2010;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1}
    return 0;
  })

  townOrder = [];
  equity.forEach(function(i){
    townOrder.push(i.MPO_Municipality)
  })

  var xScale = d3.scale.ordinal()
              .domain(townOrder)
              .rangePoints([padding, width - padding])

 var yScale = d3.scale.linear()
              .domain([0, d3.max(maxmins[3])])
              .range([height-padding, padding])

  var yScaleHeight = d3.scale.linear()
              .domain([0, d3.max(maxmins[3])])
              .range([0, height-(2*padding)])

  chartMiles.selectAll(".miles")
    .data(equity)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.MPO_Municipality + " miles"})
        .attr("x", function(d) { return xScale(d.MPO_Municipality);})
        .attr("y", function(d) { return yScale(d.MILES_2010);})
        .attr("width", 2)
        .attr("height", function(d) {return yScaleHeight(d.MILES_2010)})
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
