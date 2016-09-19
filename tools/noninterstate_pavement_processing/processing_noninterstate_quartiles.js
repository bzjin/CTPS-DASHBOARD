var fs = require("fs");
var d3 = require("./d3.js"); // d3.js version 4.


// AN EXPLANATION: A short piece of code appending all of the sidewalk CSVs to each other as JSON objects,
//                 and assigning each data point its appropriate year.
// THE FINAL RESULT: Produces output JSON file, with the name given by the outputFileName parameter.

exports.generate_noninterstate_quartiles = function(outputFileName) {
	// Variable used to accumulate the JSON to be written out.
	var accumulator = []
	// Helper function.
	function generateNoninterstates(yr2006, yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015) {
		var allYears = [yr2006, yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015];
		var counter = 1; 
		allYears.forEach(function(i){
			i.forEach(function(j){
				// Apologies for all the parseFloat() and toFixed() calls below.
				// Sadly, it appears that D3 V-4 doesn't support the d3.round() function.
				accumulator.push({
					"year": counter + 2005,
					"center_line_miles": parseFloat(j.SUM_CENTERLINE_MILES).toFixed(5),
					"sidewalk_miles": parseFloat(j.SUM_SIDEWALK_EITHER_MILES).toFixed(5),
					"sidewalk_to_miles": (parseFloat(j.SUM_SIDEWALK_EITHER_MILES) / parseFloat(j.SUM_CENTERLINE_MILES)).toFixed(5),
					"sidewalk_any_miles": parseFloat(j.SUM_SIDEWALK_MILES).toFixed(5),
					"town": j.TOWN
				});
			});
			counter++;
		});	
	} // generateSidewalks()
	
	// ***** Execution begins here. *****
	console.log("Starting processing.");
	var results = [];
	[ "mpo_nhs_noninterstate_2006.geojson", "mpo_nhs_noninterstate_2007.geojson", "mpo_nhs_noninterstate_2008.geojson", "mpo_nhs_noninterstate_2009.geojson",
	  "mpo_nhs_noninterstate_2010.geojson", "mpo_nhs_noninterstate_2011.geojson", "mpo_nhs_noninterstate_2012.geojson", "mpo_nhs_noninterstate_2013.geojson",
	  "mpo_nhs_noninterstate_2014.geojson", "mpo_nhs_noninterstate_2015.geojson"
	].forEach(function(csvFileName) {
		var fileContents = fs.readFileSync("./" + geojsonFileName);
		var textContents = fileContents.toString();
		var data = d3.jsonParse(textContents);
		results.push(data);
	});
	console.log("Length of results array is: " + results.length);
	// Generate the JSON for sidewalks data from the "results" array in the "accumulator" array...
	generateNoninterstates(results[0], results[1], results[2], results[3],results[4], results[5],results[6], results[7], results[8], results[9]);
	// ... and write it out.
	var outstr = JSON.stringify(accumulator);
	fs.writeFile("./" + outputFileName, outstr, function(err) { if (err) return console.log(err); });
	console.log("Processing complete. Output in " + outputFileName);
}
