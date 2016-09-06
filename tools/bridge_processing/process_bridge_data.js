var fs = require("fs");
var d3 = require("./d3.js");

// AN EXPLANATION : The following function prunes each of bridge data sets into one collection of bridge condition data over time. 
// It was necessary to invidividually pull attributes out of each dataset because of inconsistent naming of the attributes. 
// It is possibleto change any of the attributes that are currently being selected.
// The array to be used in the dashboard page is written to the file passed in as the outputFileName parameter.
//
// THE "RAW DATA" : The input CSVs should be in the same directory as the file containing this code. 
//
// THE FINAL PRODUCT : The JSON array produced from processing the input CSVs is written to the file named 
//                     by the outputFileName parameter.
//
// -- BJ (primary author) && BK (conversion to run under node.js)

exports.generate_bridge_timeline = function(outputFileName) {
	// Variable used to accumulate the JSON to be written out.
	var pushed = [];
	// Helper function.
	function generateBridgeAverages(yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015, yr2016){
		yr2007.forEach(function(i){
			pushed.push({
				"bridgeId" : i.allbridgesAug07_BIN,
				"healthIndex" : i.allbridgesAug07_Health_Index,
				"overFeature" : i.allbridgesAug07_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.allbridgesAug07_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.allbridgesAug07_Item_29,
				"year" : 2007,
				"structDef" : i.allbridgesAug07_Struct_Def,
				"town": i.allbridgesAug07_Town_Name
			});
		});

		yr2008.forEach(function(i){
			pushed.push({
				"bridgeId" : i.All_Bridges_2008April_BIN,
				"healthIndex" : i.All_Bridges_2008April_Health_Index,
				"overFeature" : i.All_Bridges_2008April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.All_Bridges_2008April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.All_Bridges_2008April_Item_29,
				"year" : 2008,
				"structDef" : i.All_Bridges_2008April_Struct_Def,
				"town": i.All_Bridges_2008April_Town_Name
			});
		});

		yr2009.forEach(function(i){
			pushed.push({
				"bridgeId" : i.All_Bridges_2009April_BIN,
				"healthIndex" : i.All_Bridges_2009April_Health_Index,
				"overFeature" : i.All_Bridges_2009April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.All_Bridges_2009April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.All_Bridges_2009April_Item_29,
				"year" : 2009,
				"structDef" : i.All_Bridges_2009April_Struct_Def,
				"town": i.All_Bridges_2009April_Town_Name
			});
		});

		yr2010.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridgesMay10_BIN,
				"healthIndex" : i.AllBridgesMay10_Health_Index,
				"overFeature" : i.AllBridgesMay10_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridgesMay10_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridgesMay10_Item_29,
				"year" : 2010,
				"structDef" : i.AllBridgesMay10_Struct_Def,
				"town": i.AllBridgesMay10_Town_Name
			});
		});

		yr2011.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridges_2011April_BIN,
				"healthIndex" : i.AllBridges_2011April_Health_Index,
				"overFeature" : i.AllBridges_2011April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridges_2011April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2011April_Item_29,
				"year" : 2011,
				"structDef" : i.AllBridges_2011April_Struct_Def,
				"town": i.AllBridges_2011April_Town_Name
			});
		});
		
		yr2012.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridges_2012April_1_BIN,
				"healthIndex" : i.AllBridges_2012April_1_Health_Index,
				"overFeature" : i.AllBridges_2012April_1_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridges_2012April_1_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2012April_1_Item_29,
				"year" : 2012,
				"structDef" : i.AllBridges_2012April_1_Struct_Def,
				"town": i.AllBridges_2012April_1_Town_Name
			});
		});
			
		yr2013.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridges_2013April_BIN,
				"healthIndex" : i.AllBridges_2013April_Health_Index,
				"overFeature" : i.AllBridges_2013April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridges_2013April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2013April_Item_29,
				"year" : 2013,
				"structDef" : i.AllBridges_2013April_Struct_Def,
				"town": i.AllBridges_2013April_Town_Name
			});
		});
		
		yr2014.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridges_2014April_BIN,
				"healthIndex" : i.AllBridges_2014April_Health_Index,
				"overFeature" : i.AllBridges_2014April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridges_2014April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2014April_Item_29,
				"year" : 2014,
				"structDef" : i.AllBridges_2014April_Struct_Def,
				"town": i.AllBridges_2014April_Town_Name
			});
		});
		
		yr2015.forEach(function(i){
			pushed.push({
				"bridgeId" : i.BIN,
				"healthIndex" : i.AllBridges_2015April_Health_Index,
				"overFeature" : i.Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2015April_Item_29,
				"year" : 2015,
				"structDef" : i.AllBridges_2015April_Struct_Def,
				"town": i.AllBridges_2015April_Town_Name
			});
		});	
		
		yr2016.forEach(function(i){
			pushed.push({
				"bridgeId" : i.AllBridges_2016April_BIN,
				"healthIndex" : i.AllBridges_2016April_Health_Index,
				"overFeature" : i.AllBridges_2016April_Item_7.replace(/ +(?= )/g, ' '), 
				"underFeature" : i.AllBridges_2016April_Item_6A.replace(/ +(?= )/g, ' '),
				"adt" : i.AllBridges_2016April_Item_29,
				"year" : 2016,
				"structDef" : i.AllBridges_2016April_Struct_Def,
				"town": i.AllBridges_2016April_Town_Name
			});
		});	
	} // generateBridgeAverages()

	// ***** Execution begins here. *****
	console.log("Starting processing.");
	var results = [];
	[ "bridge_condition_2007.csv", "bridge_condition_2008.csv", "bridge_condition_2009.csv", 
	  "bridge_condition_2010.csv", "bridge_condition_2011.csv", "bridge_condition_2012.csv",
	  "bridge_condition_2013.csv", "bridge_condition_2014.csv", "bridge_condition_2015.csv",
	  "bridge_condition_2016.csv"
	].forEach(function(csvFileName) {
		var fileContents = fs.readFileSync("./" + csvFileName);
		var textContents = fileContents.toString();
		var data = d3.csvParse(textContents);
		results.push(data);
	});
	console.log("Length of results array is: " + results.length);
	// Generate the JSON for bridge data from the "results" array, accumulating it in the "pushed" array ...
	generateBridgeAverages(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9]);
	// ... and write it out.
	var outstr = JSON.stringify(pushed);
	fs.writeFile("./" + outputFileName, outstr, function(err) { if (err) return console.log(err); });
	console.log("Processing complete. Output in " + outputFileName);

}