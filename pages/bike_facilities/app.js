//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp ={};
var f = d3.format(".2");
var e = d3.format(".1f");


var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([21000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,930]);
  
var geoPath = d3.geoPath().projection(projection);

//Color Scale
var colorScale = d3.scaleThreshold()
    .domain([0, 25, 50, 100, 250, 500])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//Color Scale for bar chart 
var colorScaleBars = d3.scaleThreshold()
    .domain([0, .01, .02, .05, .1])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//Color Scale for bar chart 
var colorScaleBars2 = d3.scaleThreshold()
    .domain([0, 1, 2, 5, 10])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//Using the d3.queue.js library
d3.queue()
  .defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
  .defer(d3.csv, "../../data/csv/on_road_bike_faciliites_2011.csv")
  .defer(d3.csv, "../../data/csv/on_road_bike_facilities_2016.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1],results[2]);
    CTPS.demoApp.generatePlot(results[1], results[2]);
    CTPS.demoApp.generateAccessibleTable(results[2]);
  }); 

d3.queue()
  .defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
  .defer(d3.csv, "../../data/csv/on_road_bike_facilities_2016.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap2(results[0],results[1]);
    CTPS.demoApp.generatePlot2(results[1]);
  }); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, bike2011, bike2016) {  
  // SVG Viewport
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      var existing2011 = findIndex2011(capTown, "on_road_miles");
      if (isNaN(existing2011)) { existing2011 = 0; }
      var existing2016 = findIndex2016(d.properties.TOWN, "existing_miles");
      return "<p>" + capTown + "</p>" + e(existing2011) + " Existing Miles in 2011 <br>" + e(existing2016) + " Existing Miles in 2016";
    })

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 500)

  svgContainer.call(tip); 

  var findIndex2011 = function(town, statistic) { 
    for (var i = 0; i < bike2011.length; i++) { 
      if (bike2011[i].TOWN == town) {
        return bike2011[i][statistic]; 
      } 
    }
  }

   var findIndex2016 = function(town, statistic) { 
    for (var i = 0; i < bike2016.length; i++) { 
      if (bike2016[i].TOWN == town) {
        return bike2016[i][statistic]; 
      } 
    }
  }

  var findTownIndex = function(townID) { 
    var towns = topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features;
    for (var i = 0; i < towns.length; i++) { 
      if (towns[i].properties.TOWN_ID == townID) {
          var capTown = towns[i].properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          return capTown;
      }
    }
  }


  // Create Boston Region MPO map with SVG paths for individual towns.
  var mapcSVG = svgContainer.selectAll(".mpo")
    .data(topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      .style("fill", function(d){ 
        if (findIndex2016(d.properties.TOWN, "existing_miles") == 0 || isNaN(findIndex2016(d.properties.TOWN, "existing_miles")) ) { return colorScaleBars2(0) } 
        else {return colorScaleBars2(findIndex2016(d.properties.TOWN, "existing_miles"))};  
      })
      .style("opacity", function(d) { 
          if (findIndex2016(d.properties.TOWN, "existing_miles") == 0 || isNaN(findIndex2016(d.properties.TOWN, "existing_miles")) ) { return .1 } 
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

   
    var xPos = 5;
    var yPos = 50; 
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
      .style("fill", colorScaleBars(.005)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("0-1%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.015)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("1-2%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.025)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("2-5%");
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.07)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("5-10%"); 
    svgContainer.append("rect")
      .style("fill", colorScaleBars(.2)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 75).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 82)
      .text(">10%"); 

}

CTPS.demoApp.generatePlot = function(bike2011, bike2016) { 

plot();

function plot() { 
  var towns = [];

  bike2011.forEach(function(i){
    towns.push(i.TOWN);
  })

  bike2016.forEach(function(i){
    if (i.existing_miles != 0){
      towns.push(i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}))
    }
  })

  towns.sort();

  var stacks = d3.select("#facilities").append("svg")
    .attr("class", "plots")
    .attr("width", 2100)
    .attr("height", 820)
    .style("overflow-x", "scroll !important")

  stacks.append("text")
    .text("Existing On-Road Miles from 2011 to 2016")
    .attr("x", 100)
    .attr("y", 55)

  stacks.append("rect")
      .style("fill", "#8C3D65").style("stroke", "none")
      .attr("x", 445).attr("y", 42).attr("height", 15).attr("width", 25);
  stacks.append("text")
      .style("font-weight", 700)
      .attr("x", 485).attr("y", 55)
      .text("2011");
  stacks.append("rect")
      .style("fill", "#C576AC").style("stroke", "none")
      .attr("x", 545).attr("y", 42).attr("height", 15).attr("width", 25);
  stacks.append("text")
      .style("font-weight", 700)
      .attr("x", 585).attr("y", 55)
      .text("2016");

  var xScale = d3.scaleLinear()
              .domain([0, 160])
              .range([100, 2000]);

  var xScaleW = d3.scaleLinear()
              .domain([0, 160])
              .range([0, 1900]);

  var yScale = d3.scalePoint()
          .domain(towns)
          .range([100, 800]);
  
  var xAxis = d3.axisTop(xScale).ticks(10); 
  var yAxis = d3.axisLeft(yScale);

  stacks.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 90)").style("stroke-width", "1px")
    .call(xAxis);

  stacks.append("g").attr("class", "axis")
    .attr("transform", "translate(100, 0)").style("stroke-width", "1px")
    .call(yAxis).selectAll("text").style("font-size", 12);

  stacks.selectAll(".onRoad2016")
    .data(bike2016)
    .enter()
    .append("rect")
      .attr("class", "onRoad2016")
      .attr("x", xScale(0))
      .attr("y", function(d) { 
          var capTown = d.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
          if (isNaN(yScale(capTown))){ return -10000;}
          else {return yScale(capTown) - 3}})
      .attr("width", function(d){
          return xScaleW(d.existing_miles);
      })
      .attr("height", 8)
      .style("fill", "#C576AC")
      .style("opacity", 1)

  stacks.selectAll(".onRoad2011")
    .data(bike2011)
    .enter()
    .append("rect")
      .attr("class", "onRoad2011")
      .attr("x", xScale(0))
      .attr("y", function(d) { 
          return yScale(d.TOWN) - 3})
      .attr("width", function(d){
          return xScaleW(d.on_road_miles);
      })
      .attr("height", 8)
      .style("fill", "#8C3D65")
      .style("opacity", 1)
}

}



//////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap2 = function(mpoTowns, bikeData) {  
  // SVG Viewport
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      var existing = findIndex(capTown, "existing_miles");
      var constructing = findIndex(capTown, "constructing_miles");
      var projected = findIndex(capTown, "projected_miles");
      if (isNaN(existing)) { existing = 0; }
      if (isNaN(constructing)) { constructing = 0; }
      if (isNaN(projected)) { projected = 0; }
      return "<p>" + d.properties.TOWN + "</p>" + e(existing) + " Existing Miles<br>" + e(constructing) + " Miles Under Construction or In Design<br>" + e(projected) + " Miles Planned and Envisioned";
    })

  var svgContainer = d3.select("#map2").append("svg")
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

  towns = topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features;

  var findTownIndex = function(townID) { 
    for (var i = 0; i < towns.length; i++) { 
      if (towns[i].properties.TOWN_ID == townID) {
          var capTown = towns[i].properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          return capTown;
      }
    }
  }


  // Create Boston Region MPO map with SVG paths for individual towns.
  var mapcSVG = svgContainer.selectAll(".mpo")
    .data(towns)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      .style("fill", function(d){ 
        if (isNaN(findIndex(d.properties.TOWN, "total"))){console.log(d.properties.TOWN); return colorScaleBars2(0)}
        else {return colorScaleBars2(+findIndex(d.properties.TOWN, "total")); } 
      })
      .style("opacity", function(d) { 
          if (+findIndex(d.properties.TOWN, "total") == 0 || isNaN(findIndex(d.properties.TOWN, "total"))) { return .1 } 
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

       //Color key
    var xPos = 5;
    var yPos = 50; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .text("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(0)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .text("No bike facilities");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(.5)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("0-1 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(1.5)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("1-2 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(4)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("2-5 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(8)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("5-10"); 
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(15)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 75).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 82)
      .text("More than 10 Miles"); 

}

CTPS.demoApp.generatePlot2 = function(bikeData) { 

plot2();

function plot2() { 

  var towns = [];
  
  bikeData.forEach(function(i){
    i.TOWN = i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    if ( i.total != 0 ) {
      towns.push(i.TOWN);
    }
  })

  var stacks = d3.select("#facilities2").append("svg")
    .attr("class", "plots2")
    .attr("width", "100%")
    .attr("height", 1100)

  var offroadPercent = d3.scaleLinear()
              .domain([0, 1])
              .range([100, 300]);

  var offroadMiles = d3.scaleLinear()
              .domain([0, 100])
              .range([350, 650]);

  var yScale = d3.scalePoint()
          .domain(towns)
          .range([100, 1050]);
  
  var xAxisP = d3.axisTop(offroadPercent).ticks(5); 
  var xAxisM = d3.axisTop(offroadMiles).ticks(5).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(yScale);

//Labels

  stacks.append("text")
      .text("By Percent")
      .attr("x", 100)
      .attr("y", 55)
      .style("text-anchor", "left")

  stacks.append("text")
      .text("By Mile")
      .attr("x", 350)
      .attr("y", 55)
      .style("text-anchor", "left")

  stacks.append("g").attr("class", "axis")
      .attr("transform", "translate(0, 90)").style("stroke-width", "1px")
      .call(xAxisP);

  stacks.append("g").attr("class", "axis")
      .attr("transform", "translate(0, 90)").style("stroke-width", "1px")
      .call(xAxisM);

  stacks.append("g").attr("class", "axis")
      .attr("transform", "translate(100, 0)").style("stroke-width", "1px")
      .call(yAxis)
      .selectAll("text").style("font-size", 12);

  stacks.selectAll(".existing_percent")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadPercent(0) })
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadPercent(d.existing_percent) - 100})
      .attr("height", 7)
      .style("fill", "#C576AC")

  stacks.selectAll(".constructing_percent")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadPercent(d.existing_percent) })
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadPercent(d.constructing_percent) - 100})
      .attr("height", 7)
      .style("fill", "#EEBEE3")

  stacks.selectAll(".projected_percent")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadPercent(d.existing_percent) + offroadPercent(d.constructing_percent) - 100})
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadPercent(d.projected_percent) - 100})
      .attr("height", 7)
      .style("fill", "#662753")

stacks.selectAll(".existing_miles")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadMiles(0) })
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadMiles(d.existing_miles) - 350})
      .attr("height", 7)
      .style("fill", "#C576AC")

  stacks.selectAll(".constructing_miles")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadMiles(d.existing_miles) })
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadMiles(d.constructing_miles) - 350})
      .attr("height", 7)
      .style("fill", "#EEBEE3")

  stacks.selectAll(".projected_miles")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "offroad")
      .attr("x", function(d) { return offroadMiles(d.existing_miles) + offroadMiles(d.constructing_miles) - 350})
      .attr("y", function(d) {
          if (isNaN(yScale(d.TOWN))) { return -1000000;}
          else { return yScale(d.TOWN) - 3; }
      })
      .attr("width", function(d) { return offroadMiles(d.projected_miles) - 350})
      .attr("height", 7)
      .style("fill", "#662753")

  var xPos = 450;
  var yPos = 120;
  //text and colors
  stacks.append("text")
    .style("font-weight", 700)
    .attr("x", xPos).attr("y", yPos - 10)
    .text("KEY");
  stacks.append("rect")
    .style("fill", "#C576AC").style("stroke", "none")
    .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", 15);
  stacks.append("text")
    .style("font-weight", 300).style("font-size", 12)
    .attr("x", xPos + 25).attr("y", yPos + 7)
    .text("Existing Facilities");
  stacks.append("rect")
    .style("fill", "#EEBEE3").style("stroke", "none")
    .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", 15);
  stacks.append("text")
    .style("font-weight", 300).style("font-size", 12)
    .attr("x", xPos + 25).attr("y", yPos + 22)
    .text("Facilties Under Construction or In Design");
  stacks.append("rect")
    .style("fill", "#662753").style("stroke", "none")
    .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", 15);
  stacks.append("text")
    .style("font-weight", 300).style("font-size", 12)
    .attr("x", xPos + 25).attr("y", yPos + 37)
    .text("Planned and Envisioned");
}
   
d3.select("#alphabetize2").on("click", function(){
  d3.selectAll(".plots2").remove();
  bikeData.sort(function(a, b) { 
    var nameA = a.TOWN;
    var nameB = b.TOWN;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot2();
})

d3.select("#byPercent").on("click", function(){
  d3.selectAll(".plots2").remove();
  bikeData.sort(function(a, b) { 
    var nameA = +a.existing_percent;
    var nameB = +b.existing_percent;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot2();
})

d3.select("#byCount").on("click", function(){
  d3.selectAll(".plots2").remove();
  bikeData.sort(function(a, b) { 
    var nameA = +a.existing_miles;
    var nameB = +b.existing_miles;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot2();
})
}

CTPS.demoApp.generateAccessibleTable = function(bikejson){
  var colDesc = [{
    "dataIndex" : "TOWN",
    "header" : "Town"
  },{ 
    "dataIndex" : "TOTAL_ONROAD",
    "header" : "On-Road Miles"
  },{ 
    "dataIndex" : "PERCENT_ONROAD",
    "header" : "On-Road Miles to Centerline Miles"
  },{ 
    "dataIndex" : "TOTAL_OFFROAD",
    "header" : "Off-Road Miles"
  }];

  var options = {
    "divId" : "bikeTableDiv",
    "caption": "On Road and Off Road Bike Facilities",
  };

  $("#accessibleTable").accessibleGrid(colDesc, options, bikejson);
}
