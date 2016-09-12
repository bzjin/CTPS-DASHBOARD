//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "bridge_condition_2007.csv")
	.defer(d3.csv, "bridge_condition_2008.csv")
	.defer(d3.csv, "bridge_condition_2009.csv")
	.defer(d3.csv, "bridge_condition_2010.csv")
	.defer(d3.csv, "bridge_condition_2011.csv")
	.defer(d3.csv, "bridge_condition_2012.csv")
	.defer(d3.csv, "bridge_condition_2013.csv")
	.defer(d3.csv, "bridge_condition_2014.csv")
	.defer(d3.csv, "bridge_condition_2015.csv")
	.defer(d3.csv, "bridge_condition_2016.csv")

	.awaitAll(function(error, results){ 

	CTPS.demoApp.generateBridgeAverages(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9]);
}); 

/* AN EXPLANATION : The following function prunes each of bridge data sets into one collection of bridge condition data over time. 
It was necessary to invidividually pull attributes out of each dataset because of inconsistent naming of the attributes. It is possible
to change any of the attributes that are currently being selected.s

The console will print out the array that is used in dashboard page. 

THE "RAW DATA" : Each of the csvs that are loaded in the above d3.queue are included in the same folder as this app code. 

THE FINAL PRODUCT : The JSON array "bridge_condition_timeline.JSON" in the JSON folder is the result of this code.
*/

CTPS.demoApp.generateBridgeAverages = function(yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015, yr2016){
	var pushed = []; 
	yr2007.forEach(function(i){
		pushed.push({
			"bridgeId" : i.allbridgesAug07_BIN,
			"healthIndex" : i.allbridgesAug07_Health_Index,
			"year" : 2007,
			"structDef" : i.allbridgesAug07_Struct_Def,
			"town": i.allbridgesAug07_Town_Name
		})
	})

	yr2008.forEach(function(i){
		pushed.push({
			"bridgeId" : i.All_Bridges_2008April_BIN,
			"healthIndex" : i.All_Bridges_2008April_Health_Index,
			"year" : 2008,
			"structDef" : i.All_Bridges_2008April_Struct_Def,
			"town": i.All_Bridges_2008April_Town_Name
		})
	})

	yr2009.forEach(function(i){
		pushed.push({
			"bridgeId" : i.All_Bridges_2009April_BIN,
			"healthIndex" : i.All_Bridges_2009April_Health_Index,
			"year" : 2009,
			"structDef" : i.All_Bridges_2009April_Struct_Def,
			"town": i.All_Bridges_2009April_Town_Name
		})
	})

	yr2010.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridgesMay10_BIN,
			"healthIndex" : i.AllBridgesMay10_Health_Index,
			"year" : 2010,
			"structDef" : i.AllBridgesMay10_Struct_Def,
			"town": i.AllBridgesMay10_Town_Name
		})
	})

	yr2011.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridges_2011April_BIN,
			"healthIndex" : i.AllBridges_2011April_Health_Index,
			"year" : 2011,
			"structDef" : i.AllBridges_2011April_Struct_Def,
			"town": i.AllBridges_2011April_Town_Name
		})
	})
	yr2012.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridges_2012April_1_BIN,
			"healthIndex" : i.AllBridges_2012April_1_Health_Index,
			"year" : 2012,
			"structDef" : i.AllBridges_2012April_1_Struct_Def,
			"town": i.AllBridges_2012April_1_Town_Name
		})
	})
	yr2013.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridges_2013April_BIN,
			"healthIndex" : i.AllBridges_2013April_Health_Index,
			"year" : 2013,
			"structDef" : i.AllBridges_2013April_Struct_Def,
			"town": i.AllBridges_2013April_Town_Name
		})
	})
	yr2014.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridges_2014April_BIN,
			"healthIndex" : i.AllBridges_2014April_Health_Index,
			"year" : 2014,
			"structDef" : i.AllBridges_2014April_Struct_Def,
			"town": i.AllBridges_2014April_Town_Name
		})
	})
	yr2015.forEach(function(i){
		pushed.push({
			"bridgeId" : i.BIN,
			"healthIndex" : i.AllBridges_2015April_Health_Index,
			"year" : 2015,
			"structDef" : i.AllBridges_2015April_Struct_Def,
			"town": i.AllBridges_2015April_Town_Name
		})
	})
	yr2016.forEach(function(i){
		pushed.push({
			"bridgeId" : i.AllBridges_2016April_BIN,
			"healthIndex" : i.AllBridges_2016April_Health_Index,
			"year" : 2016,
			"structDef" : i.AllBridges_2016April_Struct_Def,
			"town": i.AllBridges_2016April_Town_Name
		})
	})

	d3.select("#text").append('text')
	.text(JSON.stringify(pushed))
	.attr("x", 5)
	.attr("y", 5)
		console.log(JSON.stringify(pushed));
}
