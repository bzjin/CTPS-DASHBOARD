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

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 500)

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      return "<b>" + capTown + "</b><p>TIP Funding 2008-2013: <br>" + findIndex(capTown, "Total_FFY_2008_2013_TIPs") + "</p>";
    })

  svgContainer.call(tip); 

  //this function finds the statistic corresponding to the down selected on the map
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
      .on("click", function(d){
        d3.selectAll("circle")
          .style("opacity", .1)

        d3.selectAll("." + this.getAttribute("class")).filter("circle")
          .style("opacity", 1)
      })
}

CTPS.demoApp.generateStats = function(equity){
    //Create array for equity over the years
    var timeline = [];
    var fundingPop = [];

    equity.forEach(function(i){ 
        for (var j = 2008; j < 2022; j++){ 
          if (i['FFY_' + j + '_TIP'] != 0) {
            timeline.push({
              "town": i.MPO_Municipality,
              "year": j, 
              "funding": i['FFY_' + j + '_TIP'],
              "Median_Household_Income": i.Median_Household_Income,
              "MINORITY_2010": i.MINORITY_2010/i.Population*100,
              "Population": i.Population,
              "MILES_2010": i.MILES_2010,
              "CHAPTER_90": i.CHAPTER_90,
              "Employment": i.Employment,
              "SUBREGION": i.SUBREGION,
              "COMMUNITY_TYPE": i.COMMUNITY_TYPE
            })

            fundingPop.push(i.Population);
          }
        }
    })
    
    //nest timeline by towns to graph
    var nested_towns = d3.nest()
    .key(function(d) { return d.town; })
    .entries(timeline)

    var table = d3.select("#chart").append("svg")
      .attr("width", "100%")
      .attr("height", 500)
    
    var xScale = d3.scale.linear()
                    //.domain([d3.min(maxmins), d3.max(maxmins)])
                    .domain([2007.5, 2021.5])
                    .range([85, 650])

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));

    var yScale = d3.scale.linear()
                  .domain([0, d3.max(fundingPop)])
                  .range([440, 50]);

     var yAxis = d3.svg.axis().scale(yScale).orient("left");

    table.append("g").attr("class", "yaxis")
        .attr("transform", "translate(85, 0)")
        .call(yAxis)

    nested_towns.forEach(function(town){ 
         table.selectAll(".circle")
            .data(town.values)
            .enter()
            .append("circle")
                .attr("class", function(d) { return d.town + " .circle"; })
                //.attr("cx", yScale(i.year))
                .attr("cx", function(d) { return xScale(d.year)})
                .attr("cy", function(d) { return yScale(d.Population); })
                .attr("r", function(d) { return Math.sqrt(d.funding/20000)})
                .style("fill", function(d) { return colorScale(d.funding); })
                .style("stroke-width", 1)
                .style("stroke", "none")
                .style("opacity", .2)
      }) //end nested_towns forEach loop

    //Call first chart
    chartViz('Population');

    //generate xy chart of attribute over time per town
    function chartViz(attribute) { 
        table.selectAll("text").remove();

        table.append("g").attr("class", "axis")
              .attr("transform", "translate(0, 440)")
              .call(xAxis)
        
        var maxmins = [];

        timeline.forEach(function(i){
          if (i[attribute] != 0) { 
            maxmins.push(i[attribute]); //find max of attribute
          }
        })

        var yScale = d3.scale.linear()
                    .domain([0, d3.max(maxmins)])
                    //.domain([2007.8, 2021.2])
                    .range([440, 50]);

        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        table.selectAll(".yaxis").transition()
          .ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
          .call(yAxis)
        
        table.append("text")
          .attr("x", -250)
          .attr("y", 15)
          .attr("transform", "rotate(-90)")
          .text(function(){
            if (attribute == "Median_Household_Income") { return "Median Household Income"}
            if (attribute == "MINORITY_2010") { return "Minority Percent of Population"}
            if (attribute == "MILES_2010") { return "Number of Miles"}
            else { 
              return attribute;
            }
          })
          .style("text-anchor", "middle")
          .style("font-size", 14)

        table.append("text")
          .attr("x", 330)
          .attr("y", 475)
          .text("Year")
          
   

        table.selectAll("circle").transition()
            .duration( function(d, i) { return (d.year-2007)*200;})
            .ease("sin-in-out") 
            .attr("cy", function(d) { return yScale(d[attribute]); })



      } //end function chartViz

    

      //buttons: click to see funding graphed against another variable
      //button activation
      d3.selectAll("#byPopulation").on("click", function(){
        chartViz("Population");
      })

      d3.selectAll("#byIncome").on("click", function(){
        chartViz("Median_Household_Income");
      })

      d3.selectAll("#byMinority").on("click", function(){
        chartViz("MINORITY_2010");
      })

      d3.selectAll("#byMiles").on("click", function(){
        chartViz("MILES_2010");
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
