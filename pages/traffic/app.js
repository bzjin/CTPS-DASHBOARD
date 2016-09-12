//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

var projection = d3.geoConicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([21000]) // N.B. The scale and translation vector were determined empirically.
  .translate([30,830]);
  
var geoPath = d3.geoPath().projection(projection); 

//Using the d3.queue.js library
d3.queue()
  .defer(d3.json, "../../json/boston_region_mpo_towns.topo.json")
  .defer(d3.json, "../../json/traffic_signals.topojson")
  .defer(d3.csv, "../../json/miles_per_town.csv")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1], results[2]);
    //CTPS.demoApp.generateStats(results[1]);
  }); 

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(mpoTowns, traffic, miles) {  
  // SVG Viewport

  var svgContainer = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 600)
    .style("overflow", "visible")
  


  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  var colorScale = d3.scaleLinear()
                  .domain([0, 5, 10, 20, 40, 75, 100, 120, 800])
                  .range(["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"].reverse())

                  
  var towns = [];
  var signalCount = [];

  var signalArray = topojson.feature(traffic, traffic.objects.mpo_traffic_signals).features;
  var mpoTownsArray = topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features;

  mpoTownsArray.forEach(function(i){ 
    miles.forEach(function(j){
      if (j.Town.toUpperCase() == i.properties.TOWN) { 
        if (signalCount.indexOf(i.properties.TOWN) < 0) { 
          signalCount.push({
            "town": i.properties.TOWN,
            "count": 0,
            "miles": j.Miles
          })
        }
      }
    })
  })

  signalArray.forEach(function(i) { 
    signalCount.forEach(function(j){
      if (i.properties.city_town == j.town){
        j.count++;
      }
    })
  })

  signalCount.sort(function(a,b) { return a.town - b.town; });
  signalCount.forEach(function(i){ 
     towns.push(i.town)
  })
  // Create Boston Region MPO map with SVG paths for individual towns.
  var mapcSVG = svgContainer.selectAll(".mpo")
    .data(topojson.feature(mpoTowns, mpoTowns.objects.boston_region_mpo_towns).features)
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

  var defs = svgContainer.append("defs");
  var filter = defs.append("filter").attr("id","gooeyCodeFilter");
  filter.append("feGaussianBlur")
    .attr("in","SourceGraphic")
    .attr("stdDeviation","0")
    //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
    .attr("color-interpolation-filters","sRGB") 
    .attr("result","blur");
  filter.append("feColorMatrix")
    .attr("in","blur")
    .attr("mode","matrix")
    .attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7")
    .attr("result","gooey");

  var circleWrapper = svgContainer.append("g")
    .attr("class", "circleWrapper")
    .style("filter", "url(#gooeyCodeFilter)");
        
  circleWrapper.selectAll("circle")
    .data(topojson.feature(traffic, traffic.objects.mpo_traffic_signals).features)
    .enter()
    .append("circle")
      .attr("class", function(d) { return d.properties.city_town + " signals" })
      .attr("cx", function(d) {return projection(d.geometry.coordinates)[0]; })
      .attr("cy", function(d) {return projection(d.geometry.coordinates)[1]; })
      .style("stroke-width", 0)
      .attr("r", 1)
      .style("stroke", function(d) { 
        var whichCity = this.getAttribute("class").split(' ')[0];
        var totalSignals = 0; 
        signalCount.forEach(function(j){
            if (d.properties.city_town == j.town){ totalSignals = j.count; }
        })
        return colorScale(totalSignals);
      })
      /*.style("fill",  function(d) { 
        var whichCity = this.getAttribute("class").split(' ')[0];
        var totalSignals = 0; 
        var signalsPerMile = 0; 
        signalCount.forEach(function(j){
            if (d.properties.city_town == j.town){ 
              totalSignals = j.count;
              signalsPerMile = j.count/j.miles; }
        })
        return colorScale(totalSignals);
      })*/
      .style("fill", "white")

      .style("fill-opacity", 1)
      .style("opacity", .5)
      .on("mouseenter", function(d){
        tip.show(d);
      })
      .on("mouseleave", function(d){
        tip.hide(d);
      })



  var chart = d3.select("#chart").append("svg")
    .attr("width", "100%")
    .attr("height", 600)
    .style("overflow", "visible")


  var xScale = d3.scalePoint().domain(towns).range([50, 600])
 //var xScale = d3.scaleLinear().domain([0, 2]).range([50, 500]);
  var yScale = d3.scaleLinear().domain([0, 2.2]).range([380, 30])

  
chart.selectAll(".lines")
    .data(signalCount)
    .enter()
    .append("line")
      .attr("class", "lines")
      .attr("x1", function(d) { return xScale(d.town)})
      .attr("x2", function(d) { return xScale(d.town)})
      .attr("y1", function(d) { return yScale(d.count/d.miles)})
      .attr("y2", function(d) { return yScale(0)})
      .style("stroke", function(d) { return colorScale(d.count)})
      .style("stroke-width", .5)
      .style("opacity", 1)

  chart.selectAll(".miles")
    .data(signalCount)
    .enter()
    .append("circle")
      .attr("class", function(d) { return d.town + " miles"})
      .attr("cx", function(d) { return xScale(d.town)})
      //.attr("cx", function(d) { return xScale(d.count/d.miles)})
      .attr("cy", function(d) { return yScale(d.count/d.miles)})
      .attr("r", function(d) { return Math.sqrt(d.miles)})
      .style("fill-opacity", .2)
      //.style("fill", function(d) { return colorScale(d.count)})
          .style("fill", "white")

      .style("opacity", 1)
      .on("click", function(d){
        var whichCity = this.getAttribute("class").split(' ')[0];
        d3.selectAll("circle")
          .style("opacity", .1)
        d3.selectAll("." + whichCity)
          .style("opacity", 1)
          console.log(whichCity)
      })

  chart.selectAll(".perMile")
    .data(signalCount)
    .enter()
    .append("circle")
      .attr("class", function(d) { return d.town + " perMile"})
      .attr("cx", function(d) { return xScale(d.town)})
      //.attr("cx", function(d) { return xScale(d.count/d.miles)})
      .attr("cy", function(d) { return yScale(d.count/d.miles)})
      .attr("r", function(d) { return Math.sqrt(d.count)})
      //.style("fill", function(d) { return colorScale(d.count)})
      .style("fill", "white")
      .style("opacity", 1)
      .on("click", function(d){
        var whichCity = this.getAttribute("class").split(' ')[0];
        d3.selectAll("circle").transition()
          .style("opacity", .1)
        d3.selectAll("." + whichCity)
          .style("opacity", 1)
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