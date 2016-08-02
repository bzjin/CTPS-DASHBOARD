var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([19000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,790]);
  
var geoPath = d3.geo.path().projection(projection); 

//Using the queue.js library
queue()
  .defer(d3.json, "../../json/tract_census.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap3(results[0]);
    CTPS.demoApp.generateStats2(results[0]);
  }); 

//Color Scale
var colorScale = d3.scale.linear()
    .domain([0, 500000, 5000000, 10000000, 15000000, 20000000, 25000000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ddd"].reverse());


//Color Scale
var colorScalePerson = d3.scale.linear()
  .domain([0, 10, 50, 100, 500, 1000, 3000])
  .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ddd"].reverse());
////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap3 = function(tracts, equity) {  
  // SVG Viewport
  var colorScale = d3.scale.linear()
                  .domain([0, 1, 2, 3, 4])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"])

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([25000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,1015]);
  
var geoPath = d3.geo.path().projection(projection); 

  svgContainer = d3.select("#map3").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style></p><br>Town: " + d.properties.TOWN + "<br>% Minority: " + 
      d.properties.MINORITY_HH_PCT + "<br>% Low Income: " + d.properties.LOW_INC_HH_PCT + "<br>% Single Female Headed: " + d.properties.SINGLE_FEMALE_HOH_PCT +
      "<br>% Zero Vehicle: " + d.properties.ZERO_VEH_HH_PCT;
    })

  svgContainer.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  colorMap = function(percent) { 
  // Create Boston Region MPO map with SVG paths for individual towns.
    var tractMap = svgContainer.selectAll(".tracts")
      .data(topojson.feature(tracts, tracts.objects.tract_census_2).features)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function() { 
          if (percent == "MINORITY_HH_PCT") { return colorScale(0)}
          if (percent == "LOW_INC_HH_PCT") { return colorScale(1)}
          if (percent == "SINGLE_FEMALE_HOH_PCT") { return colorScale(2)}
          if (percent == "ZERO_VEH_HH_PCT") { return colorScale(3)}

        }  )
        .style("fill-opacity", function(d) { return d.properties[percent]/100; } )
        .style("opacity", 1)
        .on("mouseenter", function(d){
          d3.selectAll("." + this.getAttribute("class"))
              .style("stroke-width", 2)
              .style("stroke", "#ddd")
          tip.show(d);
        })
        .on("mouseleave", function(d){
           d3.selectAll("." + this.getAttribute("class"))
              .style("stroke-width", 0)
              .style("stroke", "#ddd")
         tip.hide(d);
        })
    } 
   //Color key
    var xPos = 5;
    var yPos = 40; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .text("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .2)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .text("20% households");
    svgContainer.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .4)
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("40% households");
    svgContainer.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .6)
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("60% households");
    svgContainer.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .8)
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("80% households");
    svgContainer.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", 1)
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("100% households");
}

CTPS.demoApp.generateStats2 = function(tracts){


var colorScale = d3.scale.linear()
                  .domain([0, 1, 2, 3])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"])

  var allChart = d3.select("#chartDemographics").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .attr("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];
  census.forEach(function(i){
    i.properties.MINORITY_HH_PCT = d3.round(i.properties.MINORITY_HH_PCT * 100, 2);
    i.properties.SINGLE_FEMALE_HOH_PCT = d3.round(i.properties.SINGLE_FEMALE_HOH_PCT * 100, 2);
    i.properties.LEP_POP_PCT = d3.round(i.properties.LEP_POP_PCT * 100, 2);
    i.properties.ZERO_VEH_HH_PCT = d3.round(i.properties.ZERO_VEH_HH_PCT * 100, 2);
    i.properties.LOW_INC_HH_PCT = d3.round(i.properties.LOW_INC_HH_PCT * 100, 2);
    maxmins.push(i.properties.MINORITY_HH);
    maxmins.push(i.properties.SINGLE_FEMALE_HOH);
    maxmins.push(i.properties.LOW_INC_HH);
    maxmins.push(i.properties.ZERO_VEH_HH);
  })

  var xScale = d3.scale.linear() 
              .domain([0, 100])
              .range([60, 550])

  var yScale = d3.scale.linear()
              .domain([d3.min(maxmins), d3.max(maxmins)])
              .range([430, 30])

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10).tickSize(-490, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style></p><br>Town: " + d.properties.TOWN + "<br>% Minority: " + 
      d.properties.MINORITY_HH_PCT + "<br>% Low Income: " + d.properties.LOW_INC_HH_PCT + "<br>% Single Female Headed: " + d.properties.SINGLE_FEMALE_HOH_PCT +
      "<br>% Zero Vehicle: " + d.properties.ZERO_VEH_HH_PCT;
    })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 4)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(60, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-2,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 10)
    .style("text-anchor", "middle")
    .text("Number of Households")

  allChart.append("text")
    .attr("x", 310)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Households")


  populatePoints("MINORITY_HH_PCT", "MINORITY_HH");
  populatePoints("LOW_INC_HH_PCT", "LOW_INC_HH");
  populatePoints("SINGLE_FEMALE_HOH_PCT", "SINGLE_FEMALE_HOH");
  populatePoints("ZERO_VEH_HH_PCT", "ZERO_VEH_HH");

  colorMap("MINORITY_HH_PCT");
  colorMap("LOW_INC_HH_PCT");
  colorMap("SINGLE_FEMALE_HOH_PCT");
  colorMap("ZERO_VEH_HH_PCT");

  function populatePoints(percent, households) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) { return xScale(Math.floor(d.properties[percent]/1.75)*1.75)})
      .attr("y", function(d) { return yScale(Math.floor(d.properties[households]/50) * 50) - 6 })
      //.attr("x", function(d) { return xScale(d.properties[percent])})
      //.attr("y", function(d) { return yScale(d.properties[households]) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", function(d) { return d.properties[percent]/100; } )
      .style("opacity", 1)
      .style("fill", function() { 
        if (households == "MINORITY_HH") { return colorScale(0)}
        if (households == "LOW_INC_HH") { return colorScale(1)}
        if (households == "SINGLE_FEMALE_HOH") { return colorScale(2)}
        if (households == "ZERO_VEH_HH") { return colorScale(3)}

      }  )
      .on("mouseenter", function(d){
          d3.selectAll("." + this.getAttribute("class"))
              .style("stroke-width", 2)
              .style("stroke", "#ddd")

          tip.show(d);
        })
        .on("mouseleave", function(d){
           d3.selectAll("." + this.getAttribute("class"))
              .style("stroke-width", 0)
              .style("stroke", "#ddd")

          tip.hide(d);
        })
  }

  d3.select(".allMetrics").on("click", function(){
    allChart.selectAll("rect").remove();

    populatePoints("MINORITY_HH_PCT", "MINORITY_HH");
    populatePoints("LOW_INC_HH_PCT", "LOW_INC_HH");
    populatePoints("SINGLE_FEMALE_HOH_PCT", "SINGLE_FEMALE_HOH");
    populatePoints("ZERO_VEH_HH_PCT", "ZERO_VEH_HH");

    svgContainer.selectAll("path").remove();

    colorMap("MINORITY_HH_PCT");
    colorMap("LOW_INC_HH_PCT");
    colorMap("SINGLE_FEMALE_HOH_PCT");
    colorMap("ZERO_VEH_HH_PCT");
  })

  d3.select(".minority").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("MINORITY_HH_PCT", "MINORITY_HH");

    svgContainer.selectAll("path").remove();
    colorMap("MINORITY_HH_PCT");

  })

  d3.select(".lowIncome").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("LOW_INC_HH_PCT", "LOW_INC_HH");

    svgContainer.selectAll("path").remove();
    colorMap("LOW_INC_HH_PCT");
  })

  d3.select(".singleFemale").on("click", function(){
    allChart.selectAll("rect").remove();
   populatePoints("SINGLE_FEMALE_HOH_PCT", "SINGLE_FEMALE_HOH");

    svgContainer.selectAll("path").remove();
    colorMap("SINGLE_FEMALE_HOH_PCT");
  })

  d3.select(".zeroVehicle").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("ZERO_VEH_HH_PCT", "ZERO_VEH_HH");

    svgContainer.selectAll("path").remove();
    colorMap("ZERO_VEH_HH_PCT");
  })

}