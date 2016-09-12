var fs = require("fs");
var d3 = require("./d3.js"); // d3.js version 4.

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The one externally-visible function in this module is "generate_crash_data"
//
// Parameters:
//     1. inputFileName - input CSV file name. 
//     2. motorizedOutputFileName - name of output CSV file for motorized crash data
//     3. nonmotorizedOutputFileName - name of output CSV file for nonmotorized crash data
//     4. jsonFileName - name of file for output of intermediate results, in JSON format.
//        This parameter is optional. If it is passed, as a debuggin aid, the intermediate
//        JSON array is is written to the named file. If it is not passed, no such file
//        is generated.
//
// Description of file formats
//
// Format of iput CSV file
//
// Column names:
// 	OBJECTID,City_num,RPA,Town_Name,
// 	All_Injuries_2004 ... ,All_Injuries_2013,
// 	All_Fatalities_2004 ... All_Fatalities_2013,
// 	2004_All_Crashes ... 2013_All_Crashes,
// 	2004_All_Bicycle_Crashes ... 2013_All_Bicycle_Crashes,
// 	2004_Bicycle_Fatal_Crashes ... 2013_Bicycle_Fatal_Crashes,
// 	2004_Bicycle_Number_Fatalities ... 2013_Bicycle_Number_Fatalities,
// 	2004_Bicycle_Injury_Crashes ... 2013_Bicycle_Injury_Crashes,
// 	2004_Bicycle_Number_Injuries ... 2013_Bicycle_Number_Injuries,
// 	2004_All_Pedestrian_Crashes ... 2013_All_Pedestrian_Crashes,
// 	2004_Pedestrian_Fatal_Crashes ... 2013_Pedestrian_Fatal_Crashes,
// 	2004_Pedestrian_NumberFatalities ... 2013_Pedestrian_NumberFatalities,
// 	2004_Pedestrian_Injury_Crashes ... 2013_Pedestrian_Injury_Crashes,
// 	2004_Pedestrian_Number_Injuries ... 2013_Pedestrian_Number_Injuries,
// 	2004_All_Truck_Crashes ... 2013_All_Truck_Crashes,
// 	2004_Truck_Fatal_Crashes ... 2013_Truck_Fatal_Crashes,
// 	2004_Truck_Number_Fatalities ... 2013_Truck_Number_Fatalities,
// 	2004_Truck_Injury_Crashes ... 2013_Truck_Injury_Crashes,
// 	2004_Truck_Number_Injuries ... 2013_Truck_Number_Injuries
//
//
// Format of output CSV file for motorized crashes
//
// After the header record, the file consists of 10 "blocks" of 102 records,
// one for each of the 101 towns in the MPO area in alphabetical order,
// followed by a "Total" line.
//
// Column names:
// 	town (text)
//  year (number)
//  tot_inj (number)
//  tot_fat (number)
//	mot_inj (number)
// 	mot_fat (number)
//	trk_inj (number)
//	trk_fat (number)
// 
//
// Format of output CSV file for nonmotorized crashes
//
// After the header record, the file consists of 10 "blocks" of 102 records,
// one for each of the 101 towns in the MPO area in alphabetical order,
// followed by a "Total" line.
//
// Column names:
//	town (text)
//	year (number)
// 	bike_inj (number)
//	bike_fat (number)
//	bike_tot (number)
//	ped_inj (number)
//	ped_fat (number)
//	ped_tot (number)
//
// AUTHORS: Beatrice Jin (primary author), Ben Krepp (conversion to run under node. 
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.generate_crash_data = function(inputFileName, motorizedOutputFileName, nonmotorizedOutputFileName, jsonFileName) {
	// Variable used to accumulate the "master" array of data in JSON format.
	var masterArray = [];
	
	// Helper function.
	function generateMasterData(crashdata) {
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2004,
				"bike_inj" : i["2004_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2004_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2004_All_Bicycle_Crashes"],
				"ped_inj" : i["2004_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2004_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2004_All_Pedestrian_Crashes"],
				"trk_inj" : i['2004_Truck_Number_Injuries'],
				"trk_fat" : i['2004_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2004,
				"tot_fat" : i.All_Fatalities_2004,
				"mot_inj" : i.All_Injuries_2004 - i["2004_Bicycle_Injury_Crashes"] - i["2004_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2004 - i["2004_Bicycle_Fatal_Crashes"] - i["2004_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2005,
				"bike_inj" : i["2005_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2005_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2005_All_Bicycle_Crashes"],
				"ped_inj" : i["2005_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2005_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2005_All_Pedestrian_Crashes"],
				"trk_inj" : i['2005_Truck_Number_Injuries'],
				"trk_fat" : i['2005_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2005,
				"tot_fat" : i.All_Fatalities_2005,
				"mot_inj" : i.All_Injuries_2005 - i["2005_Bicycle_Injury_Crashes"] - i["2005_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2005 - i["2005_Bicycle_Fatal_Crashes"] - i["2005_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2006,
				"bike_inj" : i["2006_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2006_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2006_All_Bicycle_Crashes"],
				"ped_inj" : i["2006_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2006_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2006_All_Pedestrian_Crashes"],
				"trk_inj" : i['2006_Truck_Number_Injuries'],
				"trk_fat" : i['2006_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2006,
				"tot_fat" : i.All_Fatalities_2006,
				"mot_inj" : i.All_Injuries_2006 - i["2006_Bicycle_Injury_Crashes"] - i["2006_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2006 - i["2006_Bicycle_Fatal_Crashes"] - i["2006_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2007,
				"bike_inj" : i["2007_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2007_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2007_All_Bicycle_Crashes"],
				"ped_inj" : i["2007_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2007_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2007_All_Pedestrian_Crashes"],
				"trk_inj" : i['2007_Truck_Number_Injuries'],
				"trk_fat" : i['2007_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2007,
				"tot_fat" : i.All_Fatalities_2007,
				"mot_inj" : i.All_Injuries_2007 - i["2007_Bicycle_Injury_Crashes"] - i["2007_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2007 - i["2007_Bicycle_Fatal_Crashes"] - i["2007_Pedestrian_Fatal_Crashes"] 
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2008,
				"bike_inj" : i["2008_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2008_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2008_All_Bicycle_Crashes"],
				"ped_inj" : i["2008_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2008_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2008_All_Pedestrian_Crashes"],
				"trk_inj" : i['2008_Truck_Number_Injuries'],
				"trk_fat" : i['2008_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2008,
				"tot_fat" : i.All_Fatalities_2008,
				"mot_inj" : i.All_Injuries_2008 - i["2008_Bicycle_Injury_Crashes"] - i["2008_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2008 - i["2008_Bicycle_Fatal_Crashes"] - i["2008_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2009,
				"bike_inj" : i["2009_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2009_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2009_All_Bicycle_Crashes"],
				"ped_inj" : i["2009_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2009_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2009_All_Pedestrian_Crashes"],
				"trk_inj" : i['2009_Truck_Number_Injuries'],
				"trk_fat" : i['2009_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2009,
				"tot_fat" : i.All_Fatalities_2009,
				"mot_inj" : i.All_Injuries_2009 - i["2009_Bicycle_Injury_Crashes"] - i["2009_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2009 - i["2009_Bicycle_Fatal_Crashes"] - i["2009_Pedestrian_Fatal_Crashes"] 
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2010,
				"bike_inj" : i["2010_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2010_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2010_All_Bicycle_Crashes"],
				"ped_inj" : i["2010_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2010_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2010_All_Pedestrian_Crashes"],
				"trk_inj" : i['2010_Truck_Number_Injuries'],
				"trk_fat" : i['2010_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2010,
				"tot_fat" : i.All_Fatalities_2010,
				"mot_inj" : i.All_Injuries_2010 - i["2010_Bicycle_Injury_Crashes"] - i["2010_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2010 - i["2010_Bicycle_Fatal_Crashes"] - i["2010_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2011,
				"bike_inj" : i["2011_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2011_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2011_All_Bicycle_Crashes"],
				"ped_inj" : i["2011_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2011_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2011_All_Pedestrian_Crashes"],
				"trk_inj" : i['2011_Truck_Number_Injuries'],
				"trk_fat" : i['2011_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2011,
				"tot_fat" : i.All_Fatalities_2011,
				"mot_inj" : i.All_Injuries_2011 - i["2011_Bicycle_Injury_Crashes"] - i["2011_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2011 - i["2011_Bicycle_Fatal_Crashes"] - i["2011_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2012,
				"bike_inj" : i["2012_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2012_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2012_All_Bicycle_Crashes"],
				"ped_inj" : i["2012_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2012_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2012_All_Pedestrian_Crashes"],
				"trk_inj" : i['2012_Truck_Number_Injuries'],
				"trk_fat" : i['2012_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2012,
				"tot_fat" : i.All_Fatalities_2012,
				"mot_inj" : i.All_Injuries_2012 - i["2012_Bicycle_Injury_Crashes"] - i["2012_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2012 - i["2012_Bicycle_Fatal_Crashes"] - i["2012_Pedestrian_Fatal_Crashes"]
			});
		});
		crashdata.forEach(function(i){
			masterArray.push({
				"town" : i.Town_Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
				"year" : 2013,
				"bike_inj" : i["2013_Bicycle_Injury_Crashes"],
				"bike_fat" : i["2013_Bicycle_Fatal_Crashes"],
				"bike_tot" : i["2013_All_Bicycle_Crashes"],
				"ped_inj" : i["2013_Pedestrian_Injury_Crashes"],
				"ped_fat" : i["2013_Pedestrian_Fatal_Crashes"],
				"ped_tot" : i["2013_All_Pedestrian_Crashes"],
				"trk_inj" : i['2013_Truck_Number_Injuries'],
				"trk_fat" : i['2013_Truck_Number_Fatalities'],
				"tot_inj" : i.All_Injuries_2013,
				"tot_fat" : i.All_Fatalities_2013,
				"mot_inj" : i.All_Injuries_2013 - i["2013_Bicycle_Injury_Crashes"] - i["2013_Pedestrian_Injury_Crashes"],
				"mot_fat" : i.All_Fatalities_2013 - i["2013_Bicycle_Fatal_Crashes"] - i["2013_Pedestrian_Fatal_Crashes"]
			});
		});		
	} // generateMasterData()
	
	
	// ***** Execution begins here. *****
	console.log("Starting processing.")
	
	var fileContents = fs.readFileSync("./" + inputFileName);
	var textContents = fileContents.toString();
	var csvContents = d3.csvParse(textContents);
	// The following call produces the JSON array "masterArray".
	generateMasterData(csvContents);
	
	var outstr;
	var comma = ',';
	var newline = '\n';

	// As a debigging aid, dump the JSON array if one is requested.	
	if (arguments.length === 4) {
		outstr = JSON.stringify(masterArray);
		fs.writeFile("./" + jsonFileName, outstr, function(err) { if (err) return console.log("Error writing temp JSON file. " + err); });
		console.log("Intermediate JSON output saved in: " + jsonFileName);
	}
	
	// Output JSON records for motorized crashes in CSV format.
	outstr = '';	
	masterArray.forEach(function(i) {
		outstr += i.town + comma;
		outstr += i.year + comma;
		outstr += i.tot_inj + comma;
		outstr += i.tot_fat + comma;
		outstr += i.mot_fat + comma;
		outstr += i.trk_inj + comma;
		outstr += i.trk_fat + newline;
	});
	fs.writeFile("./" + motorizedOutputFileName, outstr, 
	             function(err) { if (err) return console.log("Error writing CSV file for motorized crashes. " + err);} );
	
	// Output JSON records for nonmotorized crashes in CSV format.
	var outstr = '';	
	masterArray.forEach(function(i) {
		outstr += i.town + comma;
		outstr += i.year + comma;
		outstr += i.bike_inj + comma;
		outstr += i.bike_fat + comma;
		outstr += i.bike_tot + comma;
		outstr += i.ped_inj + comma;
		outstr += i.ped_fat + comma;
		outstr += i.ped_tot + newline;
	});
	fs.writeFile("./" + nonmotorizedOutputFileName, outstr, 
	             function(err) { if (err) return console.log("Error writing CSV file for nonmotorized crashes. " + err); } );
				 
	console.log("Processing complete. Output in " + motorizedOutputFileName + " and " + nonmotorizedOutputFileName + ".");
	
} // generate_crash_data()
