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
      return "<b>" + capTown + "</b> <br>TIP 2008-2013: " + findIndex(capTown, "Total_FFY_2008_2013_TIPs") + "<br>TIP 2014-2021: " + findIndex(capTown, "Tota_FFY_2014_2021_TIPs");
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
      .style("stroke-width", 1)
      .on("mouseenter", function(d){
        d3.selectAll("." + this.getAttribute("class")).filter(".bars")
          .style("stroke-width", 10)
          .style("stroke", function(d) { return colorScale(d.Total_FFY_2008_2013_TIPs);  })
        d3.selectAll("." + this.getAttribute("class")).filter(".labels")
          .style("opacity", 1)
        d3.selectAll("." + this.getAttribute("class")).filter(".tipFunding")
          .style("stroke-width", 10)
          .style("opacity", 1)
          .style("stroke", function(d) { return colorScale(d.funding);  })
        tip.show(d);
      })
      .on("mouseleave", function(d){
        d3.selectAll("." + this.getAttribute("class")).filter(".bars").transition()
          .style("stroke-width", 0)
        d3.selectAll("." + this.getAttribute("class")).filter(".tipFunding").transition()
          .style("stroke-width", 0)
          .style("opacity", .2)
          //.style("stroke", function(d) { return colorScale(d.Total_FFY_2008_2013_TIPs);  })
        d3.selectAll("." + this.getAttribute("class")).filter(".labels").transition()
          .style("opacity", 0)
      })

      //Color key
    var xPos = 15;
    var yPos = 420; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .html("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScale(0)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .html("No funding");
    svgContainer.append("rect")
      .style("fill", colorScale(500000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .html("$500,000 - $5 million");
    svgContainer.append("rect")
      .style("fill", colorScale(10000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .html("$5 million - $15 million");
    svgContainer.append("rect")
      .style("fill", colorScale(20000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .html("$15 million - $25 million");
    svgContainer.append("rect")
      .style("fill", colorScale(25000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .html("> $25 million");
}

CTPS.demoApp.generateStats = function(equity){
  
  equity.forEach(function(i){
    i.percentMinority = d3.round(i.MINORITY_2010/i.Population*100, 2);
    i.percentEmployed = i.Employment/i.Population;
  })

  var width = 680; 
  var height = 80; 
  var padding = 30; 

generateStats = function(attribute, divID) { 
  //Sort towns by ascending attribute order
    equity.sort(function(a, b){
        var nameA = a[attribute];
        var nameB = b[attribute];
        if (nameA < nameB) { return -1}
        if (nameA > nameB) { return 1}
        return 0;
      })
    //Push towns into array for x axis
    townOrder = [];
    maxmins = [];
      equity.forEach(function(i){
        townOrder.push(i.MPO_Municipality);
        maxmins.push(i[attribute]);
    })


    var xScale = d3.scale.ordinal()
                .domain(townOrder)
                .rangePoints([padding, width - (2*padding)])

    var yScale = d3.scale.linear()
                .domain([0, d3.max(maxmins)])
                .range([height, padding])

    var yScaleHeight = d3.scale.linear()
                .domain([0, d3.max(maxmins)])
                .range([0, height - padding])

    var newChart = d3.select("#" + divID).append("svg")
      .attr("width", "100%")
      .attr("height", height)

    newChart.append("text")
      .attr("x", 5)
      .attr("y", 25)
      .text(function(d) { 
        if (attribute == "percentMinority") { return "Percent Minority Population"; }
        if (attribute == "MILES_2010") { return "Number of Centerline Miles"; }
        if (attribute == "Median_Household_Income") { return "Median Household Income"; }
        else { 
            return attribute;
        }
    })

    newChart.selectAll("." + attribute)
      .data(equity)
      .enter()
      .append("rect")
          .attr("class", function(d) { return d.MPO_Municipality + " bars " + attribute})
          .attr("x", function(d) { return xScale(d.MPO_Municipality);})
          .attr("y", function(d) { return yScale(d[attribute]);})
          .attr("width", 5)
          .attr("height", function(d) {return yScaleHeight(d[attribute])})
          .style("fill", function(d) {return colorScale(d.Total_FFY_2008_2013_TIPs)})
          .style("opacity", function(d) { 
            if (d.Total_FFY_2008_2013_TIPs == 0) { return .1;
            } else { return 1; }
          })
          .on("mouseenter", function(d) { 
          })

     newChart.selectAll("." + attribute + "labels")
      .data(equity)
      .enter()
      .append("text")
          .attr("class", function(d) { return d.MPO_Municipality + " labels " + attribute + "labels"})
          .attr("x", function(d) { return xScale(d.MPO_Municipality) + 2;})
          .attr("y", function(d) { return yScale(d[attribute]) - 15;})
          .text(function(d) { return d[attribute];})
          .style("text-anchor", "middle")
          .style("fill", "#fff")
          .style("opacity", 0)
          .style("font-weight", 300)
          .on("mouseenter", function(d) { 
          })
} //end of generateStats

generateStats("Population", "chartPop")
generateStats("percentMinority", "chartMinority")
generateStats("Median_Household_Income", "chartIncome")
generateStats("MILES_2010", "chartMiles")

 

  //TIP funding chart
  var tipFunding= d3.select("#tipFunding").append("svg")
      .attr("width", "100%")
      .attr("height", height*2.5)

 tipFunding.append("text")
      .attr("x", 5)
      .attr("y", 25)
      .text("TIP Funding by Year")

  var timeline = [];
  var maxFunding = [];

  //extract year for each town
  equity.forEach(function(i){ 
      for (var j = 2008; j < 2022; j++){ 
        if (i['FFY_' + j + '_TIP'] != 0) {
          timeline.push({
            "town": i.MPO_Municipality,
            "year": j, 
            "funding": i['FFY_' + j + '_TIP'],
            "SUBREGION": i.SUBREGION,
            "COMMUNITY_TYPE": i.COMMUNITY_TYPE
          })
          maxFunding.push(i['FFY_' + j + '_TIP']);
        }
      }
  })
  var xScale = d3.scale.linear()
              .domain([2007.5, 2021.5])
              .range([0, width - 2*padding])

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d")).ticks(14);

  tipFunding.append("g").attr("class", "axis")
    .attr("transform", "translate(0," + height*1.8 + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("transform", "translate(10, 3)");

  var yScale = d3.scale.linear()
              .domain([0, d3.max(maxFunding)])
              .range([height*1.8, 1.5*padding])

  tipFunding.selectAll(".tipFunding")
    .data(timeline)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.town + " tipFunding"})
        .attr("x", function(d) { return xScale(d.year)-10;})
        .attr("y", function(d) { return yScale(d.funding);})
        .attr("width", function(d) { 
          if (d.funding > 0) { return 40 }
          else { return 0 }
        })
        .attr("height", 5)
        .style("opacity", .2)
        .style("fill", function(d) { return colorScale(d.funding)})
        .on("mouseenter", function(d){ 
          console.log(this.getAttribute("class"))
        })

  tipFunding.selectAll(".tipFunds")
      .data(timeline)
      .enter()
      .append("text")
          .attr("class", function(d) { return d.town + " tipFunds labels"})
          .attr("x", function(d) { return xScale(d.year)+10;})
          .attr("y", function(d) { 
            if (d.year%2 == 1) { return yScale(d.funding)-15;}
            else { return yScale(d.funding)-10;}
          })
          .text(function(d) { return d.funding;})
          .style("text-anchor", "middle")
          .style("font-weight", 300)
          .style("font-size", 12)
          .style("fill", "#fff")
          .style("opacity", 0)
          .on("mouseenter", function(d) { 
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