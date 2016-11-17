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
  .defer(d3.json, "../../json/town_census.topojson")
  .defer(d3.json, "../../json/equity.json")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[0],results[1]);
    CTPS.demoApp.generateStats(results[0], results[1]);
    CTPS.demoApp.generateMap2(results[0],results[1]);
    CTPS.demoApp.generatePerPerson(results[1]);
  }); 

//Color Scale
var colorScale = d3.scaleLinear()
    .domain([0, 500000, 5000000, 10000000, 15000000, 20000000, 25000000])
    .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ddd"].reverse());


//Color Scale
var colorScalePerson = d3.scaleLinear()
  .domain([0, 10, 50, 100, 500, 1000, 3000])
  .range(["#9e0142", "#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ddd"].reverse());


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
      return "<h4>" + capTown + "</h4><br><p>TIP 2008-2013: <b>$" + d3.format(',')(findIndex(capTown, "Total_FFY_2008_2013_TIPs")) + "</b><br>TIP 2014-2021: <b>$" + d3.format(',')(findIndex(capTown, "Tota_FFY_2014_2021_TIPs")) + "</b></p>";
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
    .data(topojson.feature(mpoTowns, mpoTowns.objects.town_census).features)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.properties.TOWN; })
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
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        d3.selectAll("." + this.getAttribute("class")).filter(".bars")
          .style("stroke-width", 10)
          .style("stroke", function(d) { 
            return colorScale(findIndex(capTown, "Total_FFY_2008_2013_TIPs"));   
          })
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
        tip.hide(d);
      })

      //Color key
    var xPos = 15;
    var yPos = 420; 
    var height = 600; 
    //background
    svgContainer.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos -7)
      .text("KEY");
    //text and colors
    svgContainer.append("rect")
      .style("fill", colorScale(0)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .text("No funding");
    svgContainer.append("rect")
      .style("fill", colorScale(500000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("$500,000 - $5 million");
    svgContainer.append("rect")
      .style("fill", colorScale(10000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("$5 million - $15 million");
    svgContainer.append("rect")
      .style("fill", colorScale(20000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("$15 million - $25 million");
    svgContainer.append("rect")
      .style("fill", colorScale(25000000)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("> $25 million");
}

CTPS.demoApp.generateStats = function(mpoTowns, equity){
  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }
  var census = topojson.feature(mpoTowns, mpoTowns.objects.town_census).features;

  census.forEach(function(i){
    i.properties.MINORITY_HH_PCT = f(i.properties.MINORITY_HH_PCT * 100);
    i.properties.SINGLE_FEMALE_HOH_PCT = f(i.properties.SINGLE_FEMALE_HOH_PCT * 100);
    i.properties.LEP_POP_PCT = f(i.properties.LEP_POP_PCT * 100);
    i.properties.ZERO_VEH_HH_PCT = f(i.properties.ZERO_VEH_HH_PCT * 100);
    i.properties.LOW_INC_HH_PCT = f(i.properties.LOW_INC_HH_PCT * 100);
  })

  var width = 680; 
  var height = 80; 
  var padding = 30; 

generateStats = function(attribute, divID) { 
  //Sort towns by ascending attribute order
    census.sort(function(a, b){
        var nameA = a.properties[attribute];
        var nameB = b.properties[attribute];
        if (nameA < nameB) { return -1}
        if (nameA > nameB) { return 1}
        return 0;
      })
    //Push towns into array for x axis
    townOrder = [];
    maxmins = [];
      census.forEach(function(i){
        townOrder.push(i.properties.TOWN);
        maxmins.push(i.properties[attribute]);
    })


    var xScale = d3.scalePoint()
                .domain(townOrder)
                .range([padding, width - (2*padding)])

    var yScale = d3.scaleLinear()
                .domain([0, d3.max(maxmins)])
                .range([height, padding])

    var yScaleHeight = d3.scaleLinear()
                .domain([0, d3.max(maxmins)])
                .range([0, height - padding])

    var newChart = d3.select("#" + divID).append("svg")
      .attr("width", "100%")
      .attr("height", height)

    newChart.append("text")
      .attr("x", 5)
      .attr("y", 25)
      .text(function(d) { 
        if (attribute == "MINORITY_HH_PCT") { return "Municipalities by Percent Minority Households"; }
        if (attribute == "LOW_INC_HH_PCT") { return "Municipalities by Percent Low Income Households"; }
        if (attribute == "ZERO_VEH_HH_PCT") { return "Municipalities by Percent Zero Vehicle Households"; }
        if (attribute == "SINGLE_FEMALE_HOH_PCT") { return "Municipalities by Percent Households Headed by Unmarried Female"; }

    })

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-30, 0])
    .html(function(d) {
      return d.properties.TOWN;
    })

    newChart.call(tip); 

    newChart.selectAll("." + attribute)
      .data(census)
      .enter()
      .append("rect")
          .attr("class", function(d) { return d.properties.TOWN + " bars " + attribute})
          .attr("x", function(d) { return xScale(d.properties.TOWN);})
          .attr("y", function(d) { return yScale(d.properties[attribute]);})
          .attr("width", 5)
          .attr("height", function(d) {return yScaleHeight(d.properties[attribute])})
          .style("fill", function(d) {
            var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            return colorScale(findIndex(capTown, "Total_FFY_2008_2013_TIPs"));  
           })
          .style("opacity", function(d) { 
            var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            if (findIndex(capTown, "Total_FFY_2008_2013_TIPs") == 0) { return .1 } 
            else { return 1 }  
           })
          .on("mouseenter", function(d) { 
            var townClass = this.getAttribute("class").split(' ')[0];

            d3.selectAll("." + townClass).filter(".bars")
              .style("stroke-width", 10)
              .style("stroke", function(d) { 
                return colorScale(findIndex(townClass, "Total_FFY_2008_2013_TIPs"));   
              })
            d3.selectAll("." + townClass).filter(".labels")
              .style("opacity", 1)
            d3.selectAll("." + townClass).filter(".tipFunding")
              .style("stroke-width", 10)
              .style("opacity", 1)
              .style("stroke", function(d) { return colorScale(d.funding);  })
            tip.show(d);
          })
          .on("mouseleave", function(d){
            var townClass = this.getAttribute("class").split(' ')[0];
            d3.selectAll("." + townClass).filter(".bars").transition()
              .style("stroke-width", 0)
            d3.selectAll("." + townClass).filter(".tipFunding").transition()
              .style("stroke-width", 0)
              .style("opacity", .2)
              //.style("stroke", function(d) { return colorScale(d.Total_FFY_2008_2013_TIPs);  })
            d3.selectAll("." + townClass).filter(".labels").transition()
              .style("opacity", 0)
            tip.hide(d);
          })

     newChart.selectAll("." + attribute + "labels")
      .data(census)
      .enter()
      .append("text")
          .attr("class", function(d) { return d.properties.TOWN + " labels " + attribute + "labels"})
          .attr("x", function(d) { return xScale(d.properties.TOWN) + 2;})
          .attr("y", function(d) { return yScale(d.properties[attribute]) - 15;})
          .text(function(d) { return d3.format(',')(d.properties[attribute]);})
          .style("text-anchor", "middle")
          .style("fill", "#fff")
          .style("opacity", 0)
          .style("font-weight", 300)

} //end of generateStats

generateStats("MINORITY_HH_PCT", "chartMinority")
generateStats("LOW_INC_HH_PCT", "chartIncome")
generateStats("ZERO_VEH_HH_PCT", "chartLEP")
generateStats("SINGLE_FEMALE_HOH_PCT", "chartFemale")

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
  var xScale = d3.scaleLinear()
              .domain([2007.5, 2021.5])
              .range([0, width - 2*padding])

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(14);

  tipFunding.append("g").attr("class", "axis")
    .attr("transform", "translate(0," + height*1.8 + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("transform", "translate(10, 3)");

  var yScale = d3.scaleLinear()
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
          .text(function(d) {
            if (d.funding > 1000000) { return "$" + e(d.funding/1000000) + "m"}
            else { return "$" + e(d.funding/100000) + "k"; }
          })
          .style("text-anchor", "middle")
          .style("font-weight", 300)
          .style("font-size", 12)
          .style("fill", "#fff")
          .style("opacity", 0)
          .on("mouseenter", function(d) { 
          })

}
////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap2 = function(mpoTowns, equity) {  
  var findIndex = function(town, statistic) { 
    for (var i = 0; i < equity.length; i++) { 
      if (equity[i].MPO_Municipality == town) {
        return equity[i][statistic]; 
      } 
    }
  }

  var svgContainer = d3.select("#map2").append("svg")
    .attr("width", "100%")
    .attr("height", 600)

  //D3 Tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      return "<h4>" + capTown + "</h4> <br><p>TIP dollars per person 2008-2013: <b>$" + f(findIndex(capTown, "Total_FFY_2008_2013_TIPs")/findIndex(capTown, "Population")) + "</b><br>TIP dollars per person 2014-2021: $<b>" + f(findIndex(capTown, "Tota_FFY_2014_2021_TIPs")/findIndex(capTown, "Population")) + "</b></p>";
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
  var mapcSVG2 = svgContainer.selectAll(".perPerson")
    .data(topojson.feature(mpoTowns, mpoTowns.objects.town_census).features)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})})
      .attr("d", function(d, i) {return geoPath(d); })
      .style("fill", function(d){ 
        var capTown = d.properties.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return colorScalePerson(findIndex(capTown, "Total_FFY_2008_2013_TIPs")/findIndex(capTown, "Population"));  
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
        d3.selectAll("." + this.getAttribute("class")).filter(".labels2")
          .style("opacity", 1)
        d3.selectAll("." + this.getAttribute("class")).filter(".tipFunding2")
          .style("stroke-width", 10)
          .style("opacity", 1)
          .style("stroke", function(d) { return colorScalePerson(d.funding);  })
        tip.show(d);
      })
      .on("mouseleave", function(d){
        d3.selectAll("." + this.getAttribute("class")).filter(".tipFunding2").transition()
          .style("stroke-width", 0)
          .style("opacity", .2)
          //.style("stroke", function(d) { return colorScale(d.Total_FFY_2008_2013_TIPs);  })
        d3.selectAll("." + this.getAttribute("class")).filter(".labels2").transition()
          .style("opacity", 0)
        tip.hide(d);
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
      .style("fill", colorScalePerson(0)).style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 7)
      .html("No funding");
    svgContainer.append("rect")
      .style("fill", colorScalePerson(10)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .html("$10 per person");
    svgContainer.append("rect")
      .style("fill", colorScalePerson(150)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .html("$100 per person");
    svgContainer.append("rect")
      .style("fill", colorScalePerson(500)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .html("$500 per person");
    svgContainer.append("rect")
      .style("fill", colorScalePerson(1500)).style("stroke", "none")
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    svgContainer.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .html("> $1000 per person");
}

CTPS.demoApp.generatePerPerson = function(equity) { 
//TIP funding chart
  var fundPerson = d3.select("#perPerson").append("svg")
      .attr("width", "100%")
      .attr("height", 600)

 fundPerson.append("text")
      .attr("x", 5)
      .attr("y", 45)
      .style("font-size", 16)
      .text("TIP Funding Per Person Over Time")

  var timeline = [];
  var maxFunding = [];

  //extract year for each town
  equity.forEach(function(i){ 
      for (var j = 2008; j < 2022; j++){ 
        if (i['FFY_' + j + '_TIP'] != 0) {
          timeline.push({
            "town": i.MPO_Municipality,
            "year": j, 
            "funding": i['FFY_' + j + '_TIP']/i.Population,
            "SUBREGION": i.SUBREGION,
            "COMMUNITY_TYPE": i.COMMUNITY_TYPE
          })
          maxFunding.push(i['FFY_' + j + '_TIP']/i.Population);
        }
      }
  })

  var xScale = d3.scaleLinear()
              .domain([2007.5, 2021.5])
              .range([60, 650])

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(14);

  fundPerson.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 470)")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("transform", "translate(10, 3)");

  var yScale = d3.scaleLinear()
              .domain([0, d3.max(maxFunding)])
              .range([470, 100])

  var yAxis = d3.axisLeft(yScale)
              .tickFormat(function(d) { return "$" + d; });

  fundPerson.append("g").attr("class", "yaxis")
    .attr("transform", "translate(60, 0)")
    .call(yAxis)
//D3 Tooltip
  var tip2 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-30, 0])
    .html(function(d) {
      return d.town;  
    })

  fundPerson.call(tip2); 

  fundPerson.selectAll(".fundPerson")
    .data(timeline)
    .enter()
    .append("rect")
        .attr("class", function(d) { return d.town + " fundPerson tipFunding2"})
        .attr("x", function(d) { return xScale(d.year)-10;})
        .attr("y", function(d) { return yScale(d.funding);})
        .attr("width", function(d) { 
          if (d.funding > 0) { return 35 }
          else { return 0 }
        })
        .attr("height", 5)
        .style("opacity", .7)
        .style("fill", function(d) { return colorScalePerson(d.funding)})
        .on("mouseenter", function(d){
          var thisTown = this.getAttribute("class").split(' ')[0];
          d3.selectAll("." + thisTown).filter(".labels2")
            .style("opacity", 1)
          d3.selectAll("." + thisTown).filter(".tipFunding2")
            .style("stroke-width", 10)
            .style("opacity", 1)
            .style("stroke", function(d) { return colorScalePerson(d.funding);  })
          tip2.show(d);
        })
        .on("mouseleave", function(d){
          var thisTown = this.getAttribute("class").split(' ')[0];
          d3.selectAll("." + thisTown).filter(".tipFunding2").transition()
            .style("stroke-width", 0)
            .style("opacity", .2)
            //.style("stroke", function(d) { return colorScale(d.Total_FFY_2008_2013_TIPs);  })
          d3.selectAll("." + thisTown).filter(".labels2").transition()
            .style("opacity", 0)
          tip2.hide(d);
        })

  fundPerson.selectAll(".tipfunds")
      .data(timeline)
      .enter()
      .append("text")
          .attr("class", function(d) { return d.town + " tipfunds labels2"})
          .attr("x", function(d) { return xScale(d.year)+10;})
          .attr("y", function(d) { 
            if (d.year%2 == 1) { return yScale(d.funding)-15;}
            else { return yScale(d.funding)-10;}
          })
          .text(function(d) { return "$" + f(d.funding);})
          .style("text-anchor", "middle")
          .style("font-weight", 300)
          .style("font-size", 12)
          .style("fill", "#fff")
          .style("opacity", 0)
          .on("mouseenter", function(d) { 
          })
}

