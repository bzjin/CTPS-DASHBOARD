//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([19000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,790]);
  
var geoPath = d3.geoPath().projection(projection); 

//Using the d3.queue.js library
d3.queue()
  .defer(d3.json, "../../data/json/demographics_population.topojson")
  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0]); //Population map
    CTPS.demoApp.generateStats(results[0]);

    CTPS.demoApp.generateMap_R(results[0]); //Races map
    CTPS.demoApp.generateStats_R(results[0]);

    CTPS.demoApp.generateMap_H(results[0]); //Hispanic map
    CTPS.demoApp.generateStats_H(results[0]);

    CTPS.demoApp.generateMap_L(results[0]); //Languages map
    CTPS.demoApp.generateStats_L(results[0]);

    CTPS.demoApp.generateMap_D(results[0]); //Disabilities map
    CTPS.demoApp.generateStats_D(results[0]);
  }); 

//generate map for population statistics
CTPS.demoApp.generateMap = function(tracts) {  
  // SVG Viewport

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;

  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([25000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,1015]);
  
  var geoPath = d3.geoPath().projection(projection); 

  svgContainer = d3.select("#map_pop").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Minority: " + d.properties.MINORITY_PCT + "<br>% Unemployed: " + 
      d.properties.PCT_IN_LABOR_FORCE + "<br>% Over 75 years old: " + d.properties.PCT_75_PLUS + "<br>% Limited English Proficiency: " + d.properties.LEP_POP_PCT + 
      "<br>% Persons with a Disability: " + d.properties.ANY_DISABILITY_PCT;
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
    svgContainer.selectAll("rect").remove();
    svgContainer.selectAll("text").remove(); 
  
    var tractMap = svgContainer.selectAll(".tracts")
      .data(census)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function(d) { 
          if (percent == "PCT_IN_LABOR_FORCE") { return colorScale(1)}
          if (percent == "MINORITY_PCT") { return colorScale(0)}
          if (percent == "LEP_POP_PCT") { return colorScale(2)}
          if (percent == "PCT_75_PLUS") { return colorScale(3)}
          if (percent == "ANY_DISABILITY_PCT") { return colorScale(4)}
        }  )
        .style("fill-opacity", function(d) { return d.properties[percent]/50; } )
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
    
    if (percent == "LEP_POP_PCT") { var keyColor = colorScale(2)}
    if (percent == "PCT_IN_LABOR_FORCE") { var keyColor = colorScale(1)}
    if (percent == "MINORITY_PCT") { var keyColor = colorScale(0)}
    if (percent == "PCT_75_PLUS") { var keyColor = colorScale(3)}
    if (percent == "ANY_DISABILITY_PCT") { var keyColor = colorScale(4)}

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
        .style("fill", keyColor).style("stroke", "none").style("opacity", .2)
        .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
      svgContainer.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 7)
        .text("<10% population");
      svgContainer.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .4)
        .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
      svgContainer.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 22)
        .text("10-20% population");
      svgContainer.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .6)
        .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
      svgContainer.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 37)
        .text("20-30% population");
      svgContainer.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .8)
        .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
      svgContainer.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 52)
        .text("30-40% population");
      svgContainer.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", 1)
        .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
      svgContainer.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 67)
        .text(">50% population");
    }
}

CTPS.demoApp.generateStats = function(tracts){
  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"])

  var allChart = d3.select("#demographics_pop").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .style("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];
  census.forEach(function(i){
    i.properties.LEP_POP_PCT = e(i.properties.LEP_POP_PCT * 100);
    i.properties.PCT_75_PLUS = e(i.properties.PCT_75_PLUS * 100);
    i.properties.PCT_IN_LABOR_FORCE = e((1 - i.properties.PCT_IN_LABOR_FORCE) * 100);
    i.properties.LABOR_FORCE = e(i.properties.TOTAL_POP_2010 - i.properties.LABOR_FORCE); 
    i.properties.MINORITY_PCT = e(i.properties.MINORITY_PCT * 100);
    i.properties.ANY_DISABILITY_PCT = e(i.properties.ANY_DISABILITY_PCT * 100);
    maxmins.push(i.properties.TOTAL_POP_2010);
  })

  var w = $("#demographics_pop").width();

  var xScale = d3.scaleLinear() 
              .domain([0, 100])
              .range([80, w - 50])

  var yScale = d3.scaleLinear()
              .domain([d3.min(maxmins), 6000])
              .range([430, 30])

  var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(- w + 130, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Unemployed: " + 
      d.properties.PCT_IN_LABOR_FORCE + "<br>% Over 75 years old: " + d.properties.PCT_75_PLUS + "<br>% Limited English Proficiency: " + d.properties.LEP_POP_PCT +
      "<br>% With Any Disability: " + d.properties.ANY_DISABILITY_PCT;
    })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 5)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-5,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Population")

  allChart.append("text")
    .attr("x", 340)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Population")


  populatePoints("MINORITY_PCT", "MINORITY_POP");
  colorMap("MINORITY_PCT");

  function populatePoints(percent, population) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) { 
            if (percent == "LEP_POP_PCT" && isNaN(xScale(Math.floor(d.properties[percent])))) { 
                return -50000;
            } else { return xScale(Math.floor(d.properties[percent]/1.75) * 1.75);}
      })
      .attr("y", function(d) { return yScale(Math.floor(d.properties[population]/150) * 150) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", .3)
      .style("opacity", 1)
      .style("fill", function() { 
        if (percent == "PCT_IN_LABOR_FORCE") { return colorScale(1)}
        if (percent == "MINORITY_PCT") { return colorScale(0)}
        if (percent == "LEP_POP_PCT") { return colorScale(2)}
        if (percent == "PCT_75_PLUS") { return colorScale(3)}
        if (percent == "ANY_DISABILITY_PCT") { return colorScale(4)}
      } )
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

  d3.select(".all").on("click", function(){
    allChart.selectAll("rect").remove();

    populatePoints("MINORITY_PCT", "MINORITY_POP");
    populatePoints("PCT_IN_LABOR_FORCE", "LABOR_FORCE");
    populatePoints("LEP_POP_PCT", "LEP_POP");
    populatePoints("PCT_75_PLUS", "POP_75_PLUS");
    populatePoints("ANY_DISABILITY_PCT", "ANY_DISABILITY_POP");

    svgContainer.selectAll("path").remove();
  })

  d3.select(".minority").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("MINORITY_PCT", "MINORITY_POP");

    svgContainer.selectAll("path").remove();
    colorMap("MINORITY_PCT");
  })

  d3.select(".employed").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("PCT_IN_LABOR_FORCE", "LABOR_FORCE");

    svgContainer.selectAll("path").remove();
    colorMap("PCT_IN_LABOR_FORCE");
  })

  d3.select(".lep").on("click", function(){
    allChart.selectAll("rect").remove();
   populatePoints("LEP_POP_PCT", "LEP_POP");

    svgContainer.selectAll("path").remove();
    colorMap("LEP_POP_PCT");
  })

  d3.select(".over75").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("PCT_75_PLUS", "POP_75_PLUS");

    svgContainer.selectAll("path").remove();
    colorMap("PCT_75_PLUS");
  })

  d3.select(".disabled").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints("ANY_DISABILITY_PCT", "ANY_DISABILITY_POP");

    svgContainer.selectAll("path").remove();
    colorMap("ANY_DISABILITY_PCT");
  })

}

CTPS.demoApp.generateMap_R = function(tracts) {  
  // SVG Viewport

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;

  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([25000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,1015]);
  
  var geoPath = d3.geoPath().projection(projection); 

  svgContainer_R = d3.select("#map_race").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
 var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% White: " + 
      e(d.properties.WHITE_PCT_2010 * 100) + "<br>% African American or Black: " + e(d.properties.AFRICAN_AMERICAN_PCT_2010 * 100)  + "<br>% Native American / Alaskan native: " + e(d.properties.NATIVE_AMERICAN_PCT_2010 * 100) +
      "<br>% Asian: " + e(d.properties.ASIAN_PCT_2010 * 100) + "<br>% Pacific Islander / Hawaiian Native: " + e(d.properties.PACIFIC_ISLANDER_PCT_2010 * 100) + "<br>% Other Race: " + e(d.properties.OTHER_RACE_PCT_2010 * 100) +
      "<br>% Multiple Races: " + e(d.properties.MULTIPLE_RACE_PCT_2010 * 100) + "<br>% Hispanic Origin: " + e(d.properties.HISPANIC_PCT_2010 * 100);
    })

  svgContainer_R.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  colorMap_R = function(percent) { 

    if (percent == "WHITE_PCT_2010") { var keyColor = colorScale(0); var keyMult = 20;}
    if (percent == "AFRICAN_AMERICAN_PCT_2010") { var keyColor = colorScale(1); var keyMult = 5;}
    if (percent == "NATIVE_AMERICAN_PCT_2010") { var keyColor = colorScale(2); var keyMult = .3;}
    if (percent == "ASIAN_PCT_2010") { var keyColor = colorScale(3); var keyMult = 5;}
    if (percent == "PACIFIC_ISLANDER_PCT_2010") { var keyColor = colorScale(4); var keyMult = .2;}
    if (percent == "OTHER_RACE_PCT_2010") { var keyColor = colorScale(5); var keyMult = 5;}
    if (percent == "MULTIPLE_RACE_PCT_2010") { var keyColor = colorScale(6); var keyMult = 5;}
    if (percent == "HISPANIC_PCT_2010") { var keyColor = colorScale(7); var keyMult = 5;}

  // Create Boston Region MPO map with SVG paths for individual towns.
    svgContainer_R.selectAll("rect").remove();
    svgContainer_R.selectAll("text").remove(); 
  
    var tractMap = svgContainer_R.selectAll(".tracts")
      .data(census)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function(d) { 
          if (percent == "WHITE_PCT_2010") { return colorScale(0)}
          if (percent == "AFRICAN_AMERICAN_PCT_2010") { return colorScale(1)}
          if (percent == "NATIVE_AMERICAN_PCT_2010") { return colorScale(2)}
          if (percent == "ASIAN_PCT_2010") { return colorScale(3)}
          if (percent == "PACIFIC_ISLANDER_PCT_2010") { return colorScale(4)}
          if (percent == "OTHER_RACE_PCT_2010") { return colorScale(5)}
          if (percent == "MULTIPLE_RACE_PCT_2010") { return colorScale(6)}
          if (percent == "HISPANIC_PCT_2010") { return colorScale(7)}
        })
        .style("fill-opacity", function(d) { return d.properties[percent] * 3 / keyMult * 5; } )
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
       
     //Color key
      var xPos = 5;
      var yPos = 40; 
      var height = 600; 

      /*if (percent != "HISPANIC_PCT_2010") { 
         svgContainer_R.append("text")
          .attr("x", 100)
          .attr("y", 470)
          .style("font-weight", 300).style("font-size", 10)
          .text("*including Hispanic and non-Hispanic origin")
      } else {
        svgContainer_R.append("text")
          .attr("x", 100)
          .attr("y", 470)
          .style("font-weight", 300).style("font-size", 10)
          .text("*including all races")
      }*/

      //background
      svgContainer_R.append("text")
        .style("font-weight", 700)
        .attr("x", xPos).attr("y", yPos -7)
        .text("KEY");
      //text and colors
      svgContainer_R.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .15)
        .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
      svgContainer_R.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 7)
        .text("<" + keyMult + "% population");
      svgContainer_R.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .3)
        .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
      svgContainer_R.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 22)
        .text(keyMult + "-" + 2 * keyMult + "% population");
      svgContainer_R.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .45)
        .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
      svgContainer_R.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 37)
        .text(2 * keyMult + "-" + e(3 * keyMult) + "% population");
      svgContainer_R.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .6)
        .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
      svgContainer_R.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 52)
        .text(e(3 * keyMult) + "-" + 4 * keyMult + "% population");
      svgContainer_R.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .75)
        .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
      svgContainer_R.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 67)
        .text(function() {
          if (5 * keyMult == 100) { 
            return 5 * keyMult + "% population";
          } else {
            return ">" + 5 * keyMult + "% population";
          }
        })
    }
}

CTPS.demoApp.generateStats_R = function(tracts){
   var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var allChart = d3.select("#demographics_race").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .style("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];
  census.forEach(function(i){
    maxmins.push(i.properties.WHITE_POP_2010);
  })

  var w = $("#demographics_race").width();

  var xScale = d3.scaleLinear() 
              .domain([0, 100])
              .range([80, w - 50])

  var yScale = d3.scaleLinear()
              .domain([0, d3.max(maxmins)])
              .range([430, 30])

  var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(- w + 130, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% White: " + 
      e(d.properties.WHITE_PCT_2010 * 100) + "<br>% African American or Black: " + e(d.properties.AFRICAN_AMERICAN_PCT_2010 * 100)  + "<br>% Native American / Alaskan native: " + e(d.properties.NATIVE_AMERICAN_PCT_2010 * 100) +
      "<br>% Asian: " + e(d.properties.ASIAN_PCT_2010 * 100) + "<br>% Pacific Islander / Hawaiian Native: " + e(d.properties.PACIFIC_ISLANDER_PCT_2010 * 100) + "<br>% Other Race: " + e(d.properties.OTHER_RACE_PCT_2010 * 100) +
      "<br>% Multiple Races: " + e(d.properties.MULTIPLE_RACE_PCT_2010 * 100) + "<br>% Hispanic Origin: " + e(d.properties.HISPANIC_PCT_2010 * 100);
    })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 5)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-5,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Population")

  allChart.append("text")
    .attr("x", 340)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Population")

  populatePoints_R("WHITE_PCT_2010", "WHITE_POP_2010");

  colorMap_R("WHITE_PCT_2010");

  function populatePoints_R(percent, population) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) {  return xScale(Math.floor(d.properties[percent]/.0175) * 1.75);})
      .attr("y", function(d) { return yScale(Math.floor(d.properties[population]/150) * 150) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", .3)
      .style("opacity", 1)
      .style("fill", function() { 
          if (percent == "WHITE_PCT_2010") { return colorScale(0) }
          if (percent == "AFRICAN_AMERICAN_PCT_2010") { return colorScale(1)}
          if (percent == "NATIVE_AMERICAN_PCT_2010") { return colorScale(2)}
          if (percent == "ASIAN_PCT_2010") { return colorScale(3)}
          if (percent == "PACIFIC_ISLANDER_PCT_2010") { return colorScale(4)}
          if (percent == "OTHER_RACE_PCT_2010") { return colorScale(5)}
          if (percent == "MULTIPLE_RACE_PCT_2010") { return colorScale(6)}
          if (percent == "HISPANIC_PCT_2010") { return colorScale(7)}
      })
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

  d3.select(".white").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("WHITE_PCT_2010", "WHITE_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("WHITE_PCT_2010");
  })

  d3.select(".black").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("AFRICAN_AMERICAN_PCT_2010", "AFRICAN_AMERICAN_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("AFRICAN_AMERICAN_PCT_2010");
  })

  d3.select(".native").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("NATIVE_AMERICAN_PCT_2010", "NATIVE_AMERICAN_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("NATIVE_AMERICAN_PCT_2010");
  })

  d3.select(".asian").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("ASIAN_PCT_2010", "ASIAN_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("ASIAN_PCT_2010");
  })

  d3.select(".pacific").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("PACIFIC_ISLANDER_PCT_2010", "PACIFIC_ISLANDER_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("PACIFIC_ISLANDER_PCT_2010");
  })

  d3.select(".other").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("OTHER_RACE_PCT_2010", "OTHER_RACE_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("OTHER_RACE_PCT_2010");
  })

    d3.select(".multiple").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("MULTIPLE_RACE_PCT_2010", "MULTIPLE_RACE_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("MULTIPLE_RACE_PCT_2010");
  })

  d3.select(".hispanic").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_R("HISPANIC_PCT_2010", "HISPANIC_POP_2010");
    svgContainer_R.selectAll("path").remove();
    colorMap_R("HISPANIC_PCT_2010");
  })

}

CTPS.demoApp.generateMap_H = function(tracts) {  
  // SVG Viewport

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;

  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([25000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,1015]);
  
  var geoPath = d3.geoPath().projection(projection); 

  svgContainer_H = d3.select("#map_hisp").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
 var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "<br>% Hispanic Origin: " + e(d.properties.HISPANIC_PCT_2010 * 100);
    })

  svgContainer_H.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  colorMap_H = function(percent) { 
   if (percent == "HISPANIC_PCT_2010") { var keyColor = colorScale(7); var keyMult = 5;}
  // Create Boston Region MPO map with SVG paths for individual towns.
    svgContainer_H.selectAll("rect").remove();
    svgContainer_H.selectAll("text").remove(); 
  
    var tractMap = svgContainer_H.selectAll(".tracts")
      .data(census)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function(d) { 
          if (percent == "HISPANIC_PCT_2010") { return colorScale(7)}
        })
        .style("fill-opacity", function(d) { return d.properties[percent] * 3 / keyMult * 5; } )
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
       
     //Color key
      var xPos = 5;
      var yPos = 40; 
      var height = 600; 

      //background
      svgContainer_H.append("text")
        .style("font-weight", 700)
        .attr("x", xPos).attr("y", yPos -7)
        .text("KEY");
      //text and colors
      svgContainer_H.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .15)
        .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
      svgContainer_H.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 7)
        .text("<" + keyMult + "% population");
      svgContainer_H.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .3)
        .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
      svgContainer_H.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 22)
        .text(keyMult + "-" + 2 * keyMult + "% population");
      svgContainer_H.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .45)
        .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
      svgContainer_H.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 37)
        .text(2 * keyMult + "-" + e(3 * keyMult) + "% population");
      svgContainer_H.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .6)
        .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
      svgContainer_H.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 52)
        .text(e(3 * keyMult) + "-" + 4 * keyMult + "% population");
      svgContainer_H.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .75)
        .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
      svgContainer_H.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 67)
        .text(">" + 5 * keyMult + "% population");
    }
}

CTPS.demoApp.generateStats_H = function(tracts){
   var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var allChart = d3.select("#demographics_hisp").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .style("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];
  census.forEach(function(i){
    maxmins.push(i.properties.WHITE_POP_2010);
  })

  var w = $("#demographics_hisp").width();

  var xScale = d3.scaleLinear() 
              .domain([0, 100])
              .range([80, w - 50])

  var yScale = d3.scaleLinear()
              .domain([0, d3.max(maxmins)])
              .range([430, 30])

  var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(- w + 130, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN +
       "<br>% Hispanic Origin: " + e(d.properties.HISPANIC_PCT_2010 * 100);
    })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 5)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-5,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Population")

  allChart.append("text")
    .attr("x", 340)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Population")

  populatePoints_H("HISPANIC_PCT_2010", "HISPANIC_POP_2010");

  colorMap_H("HISPANIC_PCT_2010");

  function populatePoints_H(percent, population) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) {  return xScale(Math.floor(d.properties[percent]/.0175) * 1.75);})
      .attr("y", function(d) { return yScale(Math.floor(d.properties[population]/150) * 150) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", .3)
      .style("opacity", 1)
      .style("fill",  colorScale(7))
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
}


CTPS.demoApp.generateMap_L = function(tracts) {  
  // SVG Viewport

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;

  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([25000]) // N.B. The scale and translation vector were determined empirically.
  .translate([40,1015]);
  
  var geoPath = d3.geoPath().projection(projection); 

  svgContainer_L = d3.select("#map_lep").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Spanish: " + 
      e(100*d.properties.SPANISH_LEP_PCT) + "<br>% Chinese: " + e(100*d.properties.CHINESE_LEP_PCT) + "<br>% Portuguese: " + e(100*d.properties.PORTUGUESE_LEP_PCT) +
      "<br>% French: " + e(100*d.properties.FRENCH_CREOLE_LEP_PCT) + "<br>% Vietnamese: " + e(100*d.properties.VIETNAMESE_LEP_PCT);
    })

  svgContainer_L.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  colorMap_L = function(percent) { 
  // Create Boston Region MPO map with SVG paths for individual towns.
    svgContainer_L.selectAll("rect").remove();
    svgContainer_L.selectAll("text").remove(); 
  
    var tractMap = svgContainer_L.selectAll(".tracts")
      .data(census)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function(d) { 
          if (percent == "SPANISH_LEP_PCT") { return colorScale(0)}
          if (percent == "CHINESE_LEP_PCT") { return colorScale(1)}
          if (percent == "PORTUGUESE_LEP_PCT") { return colorScale(2)}
          if (percent == "FRENCH_CREOLE_LEP_PCT") { return colorScale(3)}
          if (percent == "VIETNAMESE_LEP_PCT") { return colorScale(4)}
        })
        .style("fill-opacity", function(d) { return d.properties[percent] * 20; } )
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
          if (percent == "SPANISH_LEP_PCT") { var keyColor = colorScale(0)}
          if (percent == "CHINESE_LEP_PCT") { var keyColor = colorScale(1)}
          if (percent == "PORTUGUESE_LEP_PCT") { var keyColor = colorScale(2)}
          if (percent == "FRENCH_CREOLE_LEP_PCT") { var keyColor = colorScale(3)}
          if (percent == "VIETNAMESE_LEP_PCT") { var keyColor = colorScale(4)}
     //Color key
      var xPos = 5;
      var yPos = 40; 
      var height = 600; 
      //background
      svgContainer_L.append("text")
        .style("font-weight", 700)
        .attr("x", xPos).attr("y", yPos -7)
        .text("KEY");
      //text and colors
      svgContainer_L.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .2)
        .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
      svgContainer_L.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 7)
        .text("<1% population");
      svgContainer_L.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .4)
        .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
      svgContainer_L.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 22)
        .text("1-2% population");
      svgContainer_L.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .6)
        .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
      svgContainer_L.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 37)
        .text("2-3% population");
      svgContainer_L.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .8)
        .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
      svgContainer_L.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 52)
        .text("3-4% population");
      svgContainer_L.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", 1)
        .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
      svgContainer_L.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 67)
        .text(">5% population");
    }
}

CTPS.demoApp.generateStats_L = function(tracts){
 var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var allChart = d3.select("#demographics_lep").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .style("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];
  census.forEach(function(i){
    maxmins.push(i.properties.TOTAL_POP_2010);
  })

  var w = $("#demographics_lep").width();

  var xScale = d3.scaleLinear() 
              .domain([0, 70])
              .range([80, w - 50])

  var yScale = d3.scaleLinear()
              .domain([0, 4000])
              .range([430, 30])

  var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(- w + 130, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Spanish: " + 
      e(100*d.properties.SPANISH_LEP_PCT) + "<br>% Chinese: " + e(100*d.properties.CHINESE_LEP_PCT) + "<br>% Portuguese: " + e(100*d.properties.PORTUGUESE_LEP_PCT) +
      "<br>% French: " + e(100*d.properties.FRENCH_CREOLE_LEP_PCT) + "<br>% Vietnamese: " + e(100*d.properties.VIETNAMESE_LEP_PCT);
     })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 5)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-5,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Population")

  allChart.append("text")
    .attr("x", 340)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Population")

  populatePoints_L("SPANISH_LEP_PCT", "SPANISH_LEP_POP");

  colorMap_L("SPANISH_LEP_PCT");

  function populatePoints_L(percent, population) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) { return xScale(Math.floor(d.properties[percent] * 80) / 0.8);})
      .attr("y", function(d) { return yScale(Math.floor(d.properties[population]/80) * 80) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", .3)
      .style("opacity", 1)
      .style("fill", function() { 
          if (percent == "SPANISH_LEP_PCT") { return colorScale(0)}
          if (percent == "CHINESE_LEP_PCT") { return colorScale(1)}
          if (percent == "PORTUGUESE_LEP_PCT") { return colorScale(2)}
          if (percent == "FRENCH_CREOLE_LEP_PCT") { return colorScale(3)}
          if (percent == "VIETNAMESE_LEP_PCT") { return colorScale(4)}
       })
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

  d3.select(".spanish").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_L("SPANISH_LEP_PCT", "SPANISH_LEP_POP");
    svgContainer_L.selectAll("path").remove();
    colorMap_L("SPANISH_LEP_PCT");
  })

  d3.select(".chinese").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_L("CHINESE_LEP_PCT", "CHINESE_LEP_POP");
    svgContainer_L.selectAll("path").remove();
    colorMap_L("CHINESE_LEP_PCT");
  })

  d3.select(".portuguese").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_L("PORTUGUESE_LEP_PCT", "PORTUGUESE_LEP_POP");
    svgContainer_L.selectAll("path").remove();
    colorMap_L("PORTUGUESE_LEP_PCT");
  })

  d3.select(".french").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_L("FRENCH_CREOLE_LEP_PCT", "FRENCH_CREOLE_LEP_POP");
    svgContainer_L.selectAll("path").remove();
    colorMap_L("FRENCH_CREOLE_LEP_PCT");
  })

  d3.select(".vietnamese").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_L("VIETNAMESE_LEP_PCT", "VIETNAMESE_LEP_POP");
    svgContainer_L.selectAll("path").remove();
    colorMap_L("VIETNAMESE_LEP_PCT");
  })

}

CTPS.demoApp.generateMap_D = function(tracts) {  
  // SVG Viewport

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;

  var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var projection = d3.geoConicConformal()
    .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
    .scale([25000]) // N.B. The scale and translation vector were determined empirically.
    .translate([40,1015]);
  
  var geoPath = d3.geoPath().projection(projection); 

  svgContainer_D = d3.select("#map_disabilities").append("svg")
                    .attr("width", "100%")
                    .attr("height", 500)
                    .style("overflow", "visible")

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Hearing Disability: " + 
      e(100*d.properties.HEARING_DISABILITY_PCT) + "<br>% Vision Disability: " + e(100*d.properties.VISION_DISABILITY_PCT) + "<br>% Cognitive Disability: " + e(100*d.properties.COGNITIVE_DISABILITY_PCT) +
      "<br>% Ambulatory Disability: " + e(100*d.properties.AMBULATORY_DISABILITY_PCT) + "<br>% Self-Care Disability: " + e(100*d.properties.SELF_CARE_DISABILITY_PCT) +
      "<br>% Independent Living Disability: " + e(100*d.properties.INDEP_LIVING_DISABILITY_PCT);
    })

  svgContainer_D.call(tip); 

  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  colorMap_D = function(percent) { 
  // Create Boston Region MPO map with SVG paths for individual towns.
    svgContainer_D.selectAll("rect").remove();
    svgContainer_D.selectAll("text").remove(); 
  
    var tractMap = svgContainer_D.selectAll(".tracts")
      .data(census)
      .enter()
      .append("path")
        .attr("class", function(d){ return "t" + d.properties.TRACT; })
        .attr("d", function(d, i) {return geoPath(d); })
        .style("fill", function(d) { 
          if (percent == "HEARING_DISABILITY_PCT") { return colorScale(0)}
          if (percent == "VISION_DISABILITY_PCT") { return colorScale(1)}
          if (percent == "COGNITIVE_DISABILITY_PCT") { return colorScale(2)}
          if (percent == "AMBULATORY_DISABILITY_PCT") { return colorScale(3)}
          if (percent == "SELF_CARE_DISABILITY_PCT") { return colorScale(4)}
          if (percent == "INDEP_LIVING_DISABILITY_PCT") { return colorScale(5)}
        })
        .style("fill-opacity", function(d) { return d.properties[percent] * 10; } )
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
          if (percent == "HEARING_DISABILITY_PCT") { var keyColor = colorScale(0)}
          if (percent == "VISION_DISABILITY_PCT") { var keyColor = colorScale(1)}
          if (percent == "COGNITIVE_DISABILITY_PCT") { var keyColor = colorScale(2)}
          if (percent == "AMBULATORY_DISABILITY_PCT") { var keyColor = colorScale(3)}
          if (percent == "SELF_CARE_DISABILITY_PCT") { var keyColor = colorScale(4)}
          if (percent == "INDEP_LIVING_DISABILITY_PCT") { var keyColor = colorScale(5)}
     //Color key
      var xPos = 5;
      var yPos = 40; 
      var height = 600; 
      //background
      svgContainer_D.append("text")
        .style("font-weight", 700)
        .attr("x", xPos).attr("y", yPos -7)
        .text("KEY");
      //text and colors
      svgContainer_D.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .2)
        .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
      svgContainer_D.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 7)
        .text("<2% population");
      svgContainer_D.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .4)
        .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
      svgContainer_D.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 22)
        .text("2-4% population");
      svgContainer_D.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .6)
        .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
      svgContainer_D.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 37)
        .text("4-6% population");
      svgContainer_D.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", .8)
        .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
      svgContainer_D.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 52)
        .text("6-8% population");
      svgContainer_D.append("rect")
        .style("fill", keyColor).style("stroke", "none").style("opacity", 1)
        .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
      svgContainer_D.append("text")
        .style("font-weight", 300)
        .attr("x", xPos + 25).attr("y", yPos + 67)
        .text(">10% population");
    }
}

CTPS.demoApp.generateStats_D = function(tracts){
 var colorScale = d3.scaleLinear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 7])
                  .range(["#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02", "#3288bd", "#fee08b","#80cdc1"])

  var allChart = d3.select("#demographics_disabilities").append("svg")
    .attr("width", "100%")
    .attr("height", 500)
    .style("overflow", "visible")

  var census = topojson.feature(tracts, tracts.objects.tract_census_2).features;
  var maxmins = [];

  census.forEach(function(i){
    maxmins.push(i.properties.TOTAL_POP_2010);
  })

  var w = $("#demographics_disabilities").width();

  var xScale = d3.scaleLinear() 
              .domain([0, 70])
              .range([80, w - 50])

  var yScale = d3.scaleLinear()
              .domain([0, 1500])
              .range([430, 30])

  var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")).tickSize(-400, 0, 0); 
  var yAxis = d3.axisLeft(yScale).ticks(10).tickSize(- w + 130, 0, 0);
//D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .style("font-family", "Open Sans")
    .html(function(d) {
      return "<p style='font-weight:700'>Tract " + d.properties.TRACT + "</style><br>Town: " + d.properties.TOWN + "</p><br>% Hearing Disability: " + 
      e(100*d.properties.HEARING_DISABILITY_PCT) + "<br>% Vision Disability: " + e(100*d.properties.VISION_DISABILITY_PCT) + "<br>% Cognitive Disability: " + e(100*d.properties.COGNITIVE_DISABILITY_PCT) +
      "<br>% Ambulatory Disability: " + e(100*d.properties.AMBULATORY_DISABILITY_PCT) + "<br>% Self-Care Disability: " + e(100*d.properties.SELF_CARE_DISABILITY_PCT) +
      "<br>% Independent Living Disability: " + e(100*d.properties.INDEP_LIVING_DISABILITY_PCT);
  })

  allChart.call(tip); 

  allChart.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 430)")
    .call(xAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .attr("transform", "translate(0, 5)");

  
  allChart.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "translate(-5,0)");

  allChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -250)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Population")

  allChart.append("text")
    .attr("x", 340)
    .attr("y", 470)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .text("Percent of Population")

  populatePoints_D("HEARING_DISABILITY_PCT", "HEARING_DISABILITY_POP");
  colorMap_D("HEARING_DISABILITY_PCT");

  function populatePoints_D(percent, population) { 
    allChart.selectAll("points")
    .data(census)
    .enter()
    .append("rect")
      .attr("class", function(d){ return "t" + d.properties.TRACT; })
      .attr("x", function(d) { return xScale(Math.floor(d.properties[percent] * 80) / 0.8);})
      .attr("y", function(d) { return yScale(Math.floor(d.properties[population]/30) * 30) - 6 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill-opacity", .3)
      .style("opacity", 1)
      .style("fill", function() { 
          if (percent == "HEARING_DISABILITY_PCT") { return colorScale(0)}
          if (percent == "VISION_DISABILITY_PCT") { return colorScale(1)}
          if (percent == "COGNITIVE_DISABILITY_PCT") { return colorScale(2)}
          if (percent == "AMBULATORY_DISABILITY_PCT") { return colorScale(3)}
          if (percent == "SELF_CARE_DISABILITY_PCT") { return colorScale(4)}
          if (percent == "INDEP_LIVING_DISABILITY_PCT") { return colorScale(5)}
       })
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

  d3.select(".hearing").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("HEARING_DISABILITY_PCT", "HEARING_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("HEARING_DISABILITY_PCT");
  })

  d3.select(".vision").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("VISION_DISABILITY_PCT", "VISION_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("VISION_DISABILITY_PCT");
  })

  d3.select(".cognitive").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("COGNITIVE_DISABILITY_PCT", "COGNITIVE_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("COGNITIVE_DISABILITY_PCT");
  })

  d3.select(".ambulatory").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("AMBULATORY_DISABILITY_PCT", "AMBULATORY_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("AMBULATORY_DISABILITY_PCT");
  })

  d3.select(".selfcare").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("SELF_CARE_DISABILITY_PCT", "SELF_CARE_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("SELF_CARE_DISABILITY_PCT");
  })

  d3.select(".independent").on("click", function(){
    allChart.selectAll("rect").remove();
    populatePoints_D("INDEP_LIVING_DISABILITY_PCT", "INDEP_LIVING_DISABILITY_POP");
    svgContainer_D.selectAll("path").remove();
    colorMap_D("INDEP_LIVING_DISABILITY_PCT");
  })

}