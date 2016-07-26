var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.linear()
                .domain([0, 100000, 200000, 300000, 400000])
                .range(["#a6611a","#dfc27d","#f5f5f5","#80cdc1"]);	

var arcScale = d3.scale.linear()
                .domain([0, 100, 250, 500, 1000, 1250, 1500, 2000])
                .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"])

var lineSize = d3.scale.linear()
                .domain([0, 3000])
                .range([1,25]);

var opacityScale = d3.scale.linear()
                .domain([0, 200000, 400000, 600000, 800000])
                .range([0, .03, .05, .1, .15]);

var flowVolume = d3.scale.linear()
                .domain([-400, 400])
                .range(["#d53e4f","#3288bd"])



var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([24000]) // N.B. The scale and translation vector were determined empirically.
  .translate([250, 1000]);
  
  var geoPath = d3.geo.path().projection(projection);
//Using the queue.js library
queue()
	.defer(d3.json, "../../JSON/PLAN_2035_DISTRICTS_EXTENDED.topojson")
	.defer(d3.csv, "../../JSON/highway_coming.csv")
  .defer(d3.csv, "../../JSON/highway_going.csv")
	.awaitAll(function(error, results){ 

		CTPS.demoApp.generateMap(results[0], results[1], results[2]);
		//CTPS.demoApp.generateBikeTrails(results[0]);
	}); 
	//CTPS.demoApp.generateViz);

CTPS.demoApp.generateMap = function(district_geo, highway_coming, highway_going) { 
  console.log(highway_going, highway_coming)
 // SVG Viewport
  var svg = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", 600)
    .style("overflow-x", "visible");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 10])
    .html(function(d) {
      return "<h4>District " + d.properties.DISTRICT_NUM + "</h4><br>" + d.properties.DIST_DESCRIPTION;
    })

  svg.call(tip); 

  // Define the gradient
  var gradientOut = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradientOut")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

  // Define the gradient colors
  gradientOut.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", flowVolume(-400))
      .attr("stop-opacity", .3);

  gradientOut.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", flowVolume(400))
      .attr("stop-opacity", 1);

  // Define the gradient
  var gradientIn = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradientIn")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

  // Define the gradient colors
  gradientIn.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", flowVolume(400))
      .attr("stop-opacity", .3);

  gradientIn.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", flowVolume(-400))
      .attr("stop-opacity", 1);

  var districts = svg.append("g").attr("id", "districts");
  var centroids = svg.append("g").attr("id", "centroids");
  var arcs = svg.append("g").attr("id", "arcs");

  // Create Boston Region MPO map with SVG paths for individual towns.
  var map = svg.selectAll(".district")
    .data(topojson.feature(district_geo, district_geo.objects.features).features)
    .enter()
    .append("path")
      .attr("id", function(d) { 
          return "d" + d.properties.DISTRICT_NUM; 
      })
      .attr("class", function(d) { 
        return "d" + d.properties.DISTRICT_NUM + " district areas"; 
      })
      .attr("d", function(d, i) {
        return geoPath(d); 
      })
      .style("fill", "#ddd")
      .style("stroke", "#191b1d")
      .style("stroke-width", "1px")
      .style("opacity", function(d) { 
        var thisDistrict = this.getAttribute("class").split(' ')[0];
        return opacityScale(+highway_coming[45][thisDistrict] + +highway_going[45][thisDistrict]);
      })
      .on("mouseenter", function(d) { 
        var thisDistrict = this.getAttribute("class").split(' ')[0];
        d3.selectAll("." + thisDistrict)
          .style("opacity", function(d) { 
              return .2 + opacityScale(+highway_coming[45][thisDistrict] + +highway_going[45][thisDistrict]);
          })
        tip.show(d);
      })
     .on("mouseleave", function(d) { 
        svg.selectAll(".district").filter(".areas")
          .style("opacity", function(d){
            var thisDistrict = this.getAttribute("class").split(' ')[0];
            return opacityScale(+highway_coming[45][thisDistrict] + +highway_going[45][thisDistrict]);
          })
        tip.hide(d);
      })
      .on("click", function(d) {clicked(d)});

     
  function clicked(selected) {
  //var coming = selected.properties;
  var selname = "d" + selected.properties.DISTRICT_NUM;
  var coming = highway_coming;
  var going = highway_going;

  var homex = geoPath.centroid(selected)[0];
  var homey = geoPath.centroid(selected)[1];

  svg.selectAll("circle").filter(".district").remove();

  svg.selectAll("circle")
      .data(topojson.feature(district_geo, district_geo.objects.features).features)
      .enter()
      .append("circle")
        .attr("class", function(d) { 
          return "d" + d.properties.DISTRICT_NUM + " district"; 
        })
        .attr("cx", function(d) {
          return geoPath.centroid(d)[0];
        })
        .attr("cy", function(d) {
          return geoPath.centroid(d)[1];
        })
        .attr("r", function(d) { 
          var thisDistrict = this.getAttribute("class").split(' ')[0];
          var outgoing = highway_going[selected.properties.DISTRICT_NUM][thisDistrict]
          var incoming = highway_coming[selected.properties.DISTRICT_NUM][thisDistrict]
          var finalval = incoming - outgoing; 
          return Math.sqrt(Math.abs(finalval));
        })
        .attr("stroke", function(d) { 
          var thisDistrict = this.getAttribute("class").split(' ')[0];
          var outgoing = highway_going[selected.properties.DISTRICT_NUM][thisDistrict]
          var incoming = highway_coming[selected.properties.DISTRICT_NUM][thisDistrict]
          var finalval = incoming - outgoing; 
          return flowVolume(finalval);
        })
        .attr("fill", "none")
        .attr("stroke-width", 0)
        .call(popup)
  
  svg.selectAll(".goingline")
    .attr("stroke-dasharray", 0)
    .remove()
  
  svg.selectAll(".goingline")
    .data(highway_going)
    .enter().append("path")
    .attr("class", "goingline")
    .style("stroke-width", 1)
    .style("fill", "none")
    .style("stroke", function(d, i) {
      var finalval = coming[i][selname] - going[i][selname];
      if (finalval > 0) { return "url(#gradientIn)";
      } else { return "url(#gradientOut)";}
      })
    .style("opacity", function(d, i) { 
      var finalval = .5/Math.abs(coming[i][selname] - going[i][selname]);
    })
    .style("stroke-linecap", "round")
        .call(transition)
    .attr("d", function(d,i) {
      var abb = d.abbrev;
      var finalval = coming[i][selname] - going[i][selname];
      console.log(finalval)
      var theState = d3.select("#" + abb);
    
      if(!isNaN(finalval)) {
        var startx = geoPath.centroid(theState[0][0].__data__)[0];
        var starty = geoPath.centroid(theState[0][0].__data__)[1];
        if(finalval > 0) {
          return "M" + startx + "," + starty + " Q" + (startx + homex)/2 + " " + (starty + homey)/1.5 +" " + homex+" "   + homey;
        } else {
          return "M" + homex + "," + homey + " Q" + (startx + homex)/2 + " " + (starty + homey)/2.5 +" " + startx+" "   + starty;
        }
      }
    })

} //end function "clicked"

  
  function transition(path) {
    path.transition()
        .duration(1500)
        .attrTween("stroke-dasharray", tweenDash)
        .style("opacity", .5)
  }

  function popup(circle) {
    circle.transition()
        .delay(750)
        .duration(750)
        .style("stroke-width", 1)
  }

  function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t); };
  }

  //Color key

    //Color key
    var xPos = 40;
    var yPos = 400; 
    var height = 600; 
    //background
    svg.append("text")
      .style("font-weight", 700)
      .attr("x", xPos + 20).attr("y", yPos - 40)
      .html("KEY").style("text-anchor","middle");

    //text and colors
    svg.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 20).attr("cy", yPos).attr("r", 30)
    svg.append("text")
      .style("font-weight", 300).style("text-anchor", "start")
      .attr("x", xPos + 60).attr("y", yPos + 7)
      .style("font-size", 12).html("900 trips");
    svg.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 20).attr("cy", yPos + 60).attr("r", 20)
    svg.append("text")
      .style("font-weight", 300).style("text-anchor", "start")
      .attr("x", xPos + 60).attr("y", yPos + 67)
      .style("font-size", 12).html("400 trips");
    svg.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 20).attr("cy", yPos + 100).attr("r", 10)
    svg.append("text")
      .style("font-weight", 300).style("text-anchor", "start")
      .attr("x", xPos + 60).attr("y", yPos + 107)
      .style("font-size", 12).html("100 trips");
    svg.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", flowVolume(400))
      .attr("cx", xPos + 20).attr("cy", yPos + 130).attr("r", 5)
    svg.append("text")
      .style("font-weight", 300).style("text-anchor", "start")
      .attr("x", xPos + 60).attr("y", yPos + 133)
      .style("font-size", 12).html("More inbound trips");
    svg.append("circle")
      .attr("class", "key")
      .style("stroke", flowVolume(-400)).style("fill", "none")
      .attr("cx", xPos + 20).attr("cy", yPos + 153).attr("r", 5)
    svg.append("text")
      .style("font-weight", 300).style("text-anchor", "start")
      .attr("x", xPos + 60).attr("y", yPos + 157)
      .style("font-size", 12).html("More outbound trips");

    //Make bar chart
    function sankey(source) { 
       var barChart = d3.select("#barChart").append("svg")
      .attr("width", "100%")
      .attr("height", 600)
      .attr("x", 600)
      .attr("y", 100)
      .style("overflow", "visible")


      var districtNames = [];
      for (var i = 0; i < 45; i++) { 
        if (i < 42){
          districtNames.push("d" + i);
        } else { 
          districtNames.push("d" + 9 + i);
        }
      }
      console.log(districtNames)

      var yScale = d3.scale.ordinal()
                  .domain(districtNames)
                  .rangePoints([50, 550])

      /*var xScaleIn = d3.scale.linear()
                  .domain([0, 50000])
                  .range([250, 0])*/

      var xScaleOut = d3.scale.linear()
                  .domain([0, 50000])
                  .range([50, 510])

      barChart.selectAll(".barsOut")
        .data(highway_going)
        .enter()
        .append("circle")
          .attr("class", "barsOut")
          .attr("cx", function(d) { return xScaleOut(d.d1)})
          .attr("cy", function(d) { return yScale(d.abbrev) })
          .attr("r", function(d) { return Math.sqrt(d.d1) })
          .attr("height", 5)
          .style("fill", "none")

      }//end Sankey function
}
