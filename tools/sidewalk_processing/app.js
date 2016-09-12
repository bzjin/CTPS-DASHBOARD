//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

//Define Color Scale
var colorScale = d3.scaleQuantize().domain([1, 5])
    .range(["#EE3B3B", "#EE3B3B", "#EE3B3B", "#FFD53E", "#E3FF30", "#76EE00", "#00B26F", "#00B26F"]);

var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geoPath().projection(projection);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "sidewalk_data_2006.csv")
	.defer(d3.csv, "sidewalk_data_2007.csv")
	.defer(d3.csv, "sidewalk_data_2008.csv")
	.defer(d3.csv, "sidewalk_data_2009.csv")
	.defer(d3.csv, "sidewalk_data_2010.csv")
	.defer(d3.csv, "sidewalk_data_2011.csv")
	.defer(d3.csv, "sidewalk_data_2012.csv")
	.defer(d3.csv, "sidewalk_data_2013.csv")
	.defer(d3.csv, "sidewalk_data_2014.csv")
	.defer(d3.csv, "sidewalk_data_2015.csv")

	.awaitAll(function(error, results){ 

		CTPS.demoApp.generateSidewalks(results[0], results[1], results[2], results[3],results[4], results[5],results[6], results[7], results[8], results[9]);
	}); 
	//CTPS.demoApp.generateViz);

/* 
AN EXPLANATION: A short piece of code appending all of the sidewalk csvs to each other and assigning each data point its appropriate year.
THE FINAL RESULT: Produces "sidewalk_over_time.JSON" in the JSON folder
*/

CTPS.demoApp.generateSidewalks = function(yr2006, yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015){
	var allYears = [yr2006, yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015];
	var printOut = [];
	var counter = 1; 

	allYears.forEach(function(i){
		i.forEach(function(j){
			printOut.push({
				"year": counter + 2005,
				"center_line_miles": f(j.SUM_CENTERLINE_MILES),
				"sidewalk_miles": f(j.SUM_SIDEWALK_EITHER_MILES),
				"sidewalk_to_miles": f(j.SUM_SIDEWALK_EITHER_MILES/j.SUM_CENTERLINE_MILES),
				"sidewalk_any_miles": f(j.SUM_SIDEWALK_MILES),
				"town": j.TOWN
			})
		})
		counter++;
	})
	console.log(JSON.stringify(printOut));
}

