//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp ={};
var f = d3.format(".2");
var e = d3.format(".1f");


var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([22000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,930]);
  
var geoPath = d3.geoPath().projection(projection);

//Color Scale
var colorScale = d3.scaleLinear()
    .domain([0, 25, 50, 100, 250, 500, 1000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse());

//Color Scale for bar chart 
var colorScaleBars = d3.scaleLinear()
    .domain([0, .01, .02, .05, .1, .2])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse())

//Color Scale for bar chart 
var colorScaleBars2 = d3.scaleLinear()
    .domain([0, 1, 2, 5, 10, 60])
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf"].reverse())

//Using the d3.queue.js library
d3.queue()
  .defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
  .defer(d3.csv, "../../data/csv/bike_facilities_by_town.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1]);
    CTPS.demoApp.generatePlot(results[1]);
    CTPS.demoApp.generateAccessibleTable(results[1]);
  }); 

d3.queue()
  .defer(d3.json, "../../data/json/boston_region_mpo_towns.topo.json")
  .defer(d3.csv, "../../data/csv/off_road_bike_facilities_by_town.csv")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap2(results[0],results[1]);
    CTPS.demoApp.generatePlot2(results[1]);
  }); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, bikeData) {  
  // SVG Viewport
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      var percent_OFFROAD = findIndex(capTown, "PERCENT_ONROAD") * 100;
      var miles_onroad = findIndex(capTown, "TOTAL_ONROAD");
      return "<p>" + capTown + "</p>" + e(percent_onroad) + "% On-Road (" + miles_onroad + " Miles)";
    })

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
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return colorScaleBars(findIndex(capTown, "PERCENT_ONROAD"));  
      })
      .style("opacity", function(d) { 
          var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          if (findIndex(capTown, "PERCENT_ONROAD") == 0 ) { return .1 } 
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

plot();

function plot() { 
  var townsOn = [];
  var townsOff = [];

  bikeData.forEach(function(i){
    i.PERCENT_ONROAD = +i.PERCENT_ONROAD;
    i.PERCENT_OFFROAD = +i.PERCENT_OFFROAD;

    if ( i.PERCENT_OFFROAD != 0) { 
      townsOff.push(i.TOWN);
    }
    if (i.PERCENT_ONROAD != 0 ) { 
      townsOn.push(i.TOWN);
    }
  })

  bikeData.sort(function(a, b) { 
    var nameA = a.PERCENT_OFFROAD + a.PERCENT_ONROAD;
    var nameB = b.PERCENT_OFFROAD + b.PERCENT_ONROAD;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0;

  }) 

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([90, 0])
    .html(function(d) {
      return e(d.PERCENT_ONROAD * 100) + "% On-Road (" + d.TOTAL_ONROAD + " Miles)<br>" + e(d.PERCENT_OFFROAD*100) + "% Off-Road (" + d.TOTAL_OFFROAD + " Miles)" ;
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
  var onRoadPercent = d3.scaleLinear()
              .domain([0, .1])
              .range([100, 300]);

  var onRoadLabels = d3.scalePoint()
              .domain(["0%", "2%", "4%", "6%", "8%", "10%"])
              .range([100, 300]);

  var onRoadMiles = d3.scaleLinear()
              .domain([0, 30])
              .range([350, 650]);

  var yScale = d3.scalePoint()
          .domain(townsOn)
          .range([100, 400]);
  
  var xAxis = d3.axisTop(onRoadLabels).ticks(5); 
  var yAxis = d3.axisLeft(yScale);
  var yAxisM = d3.axisTop(onRoadMiles).ticks(5).tickFormat(d3.format("d"));

//Labels

stacks.append("text")
    .text("On-Road Miles to Centerline Miles")
    .attr("x", 200)
    .attr("y", 55)
    .style("text-anchor", "middle")

stacks.append("text")
    .text("On-Road Miles")
    .attr("x", 500)
    .attr("y", 55)
    .style("text-anchor", "middle")

 stacks.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 90)").style("stroke-width", "1px")
    .call(xAxis);

  stacks.append("g").attr("class", "axis")
    .attr("transform", "translate(100, 0)").style("stroke-width", "1px")
    .call(yAxis);

  stacks.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 90)").style("stroke-width", "1px")
    .call(yAxisM);

  stacks.selectAll(".onRoad")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "onRoad")
      .attr("x", function(d) { 
        if (d.PERCENT_ONROAD == 0){ return -10000 } 
        else { return onRoadPercent(d.PERCENT_ONROAD) }})
      .attr("y", function(d) { 
        if (isNaN(yScale(d.TOWN))) { return -10000}
        else { return yScale(d.TOWN) - 7.5}})
      .attr("width", 5)
      .attr("height", 15)
      .style("fill", function(d) { return colorScaleBars(d.PERCENT_ONROAD)})
      .style("opacity", 1)

  stacks.selectAll(".onRoadM")
    .data(bikeData)
    .enter()
    .append("rect")
      .attr("class", "onRoadM")
      .attr("x", onRoadMiles(0))
        .attr("y", function(d) { 
        if (isNaN(yScale(d.TOWN))) { return -10000}
        else { return yScale(d.TOWN) - 7.5}})      
      .attr("width", function(d) { 
          if (d.PERCENT_ONROAD == 0){ return 0 } 
          else {return onRoadMiles(d.TOTAL_ONROAD) - 345 }})
      .attr("height", 15)
      .style("fill", function(d) { return colorScaleBars(d.PERCENT_ONROAD)})
      .style("opacity", 1)
    
    

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
    var nameA = +a.TOTAL_ONROAD;
    var nameB = +b.TOTAL_ONROAD;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0; 
  })
  plot();
})

d3.select("#byAverages").on("click", function(){
  d3.selectAll(".plots").remove();
  bikeData.sort(function(a, b) { 
    var nameA = +a.PERCENT_ONROAD;
    var nameB = +b.PERCENT_ONROAD;
    if (nameA < nameB) { return -1}
    if (nameA > nameB) { return 1 }
    return 0;
  }) 
  plot();
})

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
      return "<p>" + d.properties.TOWN + "</p>" + f(existing) + " Existing Miles<br>" + f(constructing) + " Miles Under Construction or In Design<br>" + f(projected) + " Miles Planned and Envisioned";
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
        return colorScaleBars2(findIndex(d.properties.TOWN, "total"));  
      })
      .style("opacity", function(d) { 
          if (findIndex(d.properties.TOWN, "total") == 0 ) { return .1 } 
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
      .style("fill", colorScaleBars2(1)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("1-2 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(2)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("2-5 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(5)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("5-10 Miles");
    svgContainer.append("rect")
      .style("fill", colorScaleBars2(10)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
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
      .style("fill", "#66bd63")

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
      .style("fill", "orange")

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
      .style("fill", "grey")

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
      .style("fill", "#66bd63")

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
      .style("fill", "orange")

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
      .style("fill", "grey")

  var xPos = 420;
  var yPos = 125;
  //text and colors
  stacks.append("text")
    .style("font-weight", 700)
    .attr("x", xPos).attr("y", yPos - 10)
    .text("KEY");
  stacks.append("rect")
    .style("fill", "#66bd63").style("stroke", "none")
    .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", 15);
  stacks.append("text")
    .style("font-weight", 300).style("font-size", 12)
    .attr("x", xPos + 25).attr("y", yPos + 7)
    .text("Existing Facilities");
  stacks.append("rect")
    .style("fill", "orange").style("stroke", "none")
    .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", 15);
  stacks.append("text")
    .style("font-weight", 300).style("font-size", 12)
    .attr("x", xPos + 25).attr("y", yPos + 22)
    .text("Facilties Under Construction or In Design");
  stacks.append("rect")
    .style("fill", "grey").style("stroke", "none")
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
