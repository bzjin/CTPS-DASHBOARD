var CTPS = {};
CTPS.demoApp = {};

//Define Color Scale
var colorScale = d3.scale.quantize().domain([1, 5])
    .range(["#EE3B3B", "#EE3B3B", "#EE3B3B", "#FFD53E", "#E3FF30", "#76EE00", "#00B26F", "#00B26F"]);

var projection = d3.geo.conicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([25000]) // N.B. The scale and translation vector were determined empirically.
	.translate([100,1000]);
	
var geoPath = d3.geo.path().projection(projection);	

//Using the queue.js library
queue()
	
	//.defer(d3.csv, "bridge_condition_2007.csv")
	//.defer(d3.csv, "bridge_condition_2010.csv")
	//.defer(d3.csv, "bridge_condition_2012.csv")
	//.defer(d3.csv, "bridge_condition_2013.csv")
	//.defer(d3.csv, "bridge_condition_2014.csv")
	//.defer(d3.csv, "bridge_condition_2015.csv")
	//.defer(d3.csv, "bridge_condition_2016.csv")
	.defer(d3.json, "mpo_nhs_noninterstate_2007.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2008.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2009.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2010.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2011.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2012.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2013.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2014.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2015.geojson")
	.defer(d3.json, "townregion.json")

	//.defer(d3.json, "JSON/average_psi_by_city.JSON")
	.awaitAll(function(error, results){ 
		//CTPS.demoApp.generateBridgeAverages(results[0], results[1], results[2], results[3], results[4], results[5], results[6]);
		CTPS.demoApp.generateNonInterstateYears(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9]);
		//CTPS.demoApp.generateChart(results[0], results[1]);
		//CTPS.demoApp.generateCities(results[2]);
	}); 
	//CTPS.demoApp.generateViz);
/*CTPS.demoApp.generateBridgeAverages = function(yr2007, yr2010, yr2012, yr2013, yr2014, yr2015, yr2016){
	var pushed = []; 
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
		})
	})

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
		})
	})

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
		})
	})
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
		})
	})
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
		})
	})
	yr2015.forEach(function(i){
		pushed.push({
			"bridgeId" : i.BIN,
			"healthIndex" : i.AllBridges_2015April_Health_Index,
			"overFeature" : i.AllBridges_2015April_Item_7.replace(/ +(?= )/g, ' '), 
			"underFeature" : i.AllBridges_2015April_Item_6A.replace(/ +(?= )/g, ' '),
			"adt" : i.AllBridges_2015April_Item_29,
			"year" : 2015,
			"structDef" : i.AllBridges_2015April_Struct_Def,
			"town": i.AllBridges_2015April_Town_Name
		})
	})
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
		})
	})

		console.log(JSON.stringify(pushed));
}
	//FOR GENERATING TOWN AVG PSI FOR NONINTERSTATES*/

CTPS.demoApp.generateNonInterstateYears = function(yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015, townids){

	var pushed = [];
	var resultsarray = [yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014]

	function matchTownToId (idno){
		for (var i = 0; i < townids.length; i++){ 
			if(townids[i].TOWN_ID == idno) {
				var townname = townids[i].TOWN; 
			}
		}
		return townname; 
	}
	//Clean out undefined garbage (PSI and Routeto and Routerfrom)
	resultsarray.forEach(function(thisarray){
		thisarray.features.forEach(function(element){
			var index = -1; 
			if (isNaN(element.properties.PSI) || isNaN(element.properties.RouteTo) || isNaN(element.properties.RouteFrom) || isNaN(element.properties.NumberOfTravelLanes) ) {
				index = thisarray.features.indexOf(element);
			}
			if (index > -1) {
			    thisarray.features.splice(index, 1);
			}
		})
	})

	yr2015.features.forEach(function(element){
		var index = -1; 
		if (isNaN(element.properties.PSI) || isNaN(element.properties.ROUTETO) || isNaN(element.properties.ROUTEFROM) || isNaN(element.properties.NUMBEROFTRAVELLANES)) {
			index = yr2015.features.indexOf(element);
		}
		if (index > -1) {
		   	yr2015.features.splice(index, 1);
		}
	})

	//For organizing up to 2014
	function nonInterstateTownPSIs (yeararray) {
		yeararray.features.sort(function(a,b){
			var nameA = a.properties.PSI; 
			var nameB = b.properties.PSI;
			if (nameA < nameB) { return -1 }
			if (nameA > nameB) { return 1 }
			return 0; 
		})
		var nested_quartiles = d3.nest()
		.key(function(d) { return d.properties.City;})
		.entries(yeararray.features)

		nested_quartiles.forEach(function(i) { 
			i.values.sort(function(c, d){
				var nameC = c.properties.PSI; 
				var nameD = d.properties.PSI;
				if (nameC < nameD) { return -1 }
				if (nameC > nameD) { return 1 }
				return 0; 
			})
			var cumuLength = 0;
			i.values.forEach(function(j){
				cumuLength += (j.properties.RouteTo - j.properties.RouteFrom) * j.properties.NumberOfTravelLanes;
				j.properties.cumulative = cumuLength;
			})
		})

		var nested_array = d3.nest()
		.key(function(d) { return d.properties.City;})
		.rollup(function(v) { 
			return {
			    total: d3.sum(v, function(d) { return (d.properties.RouteTo - d.properties.RouteFrom) * d.properties.NumberOfTravelLanes; }),
			    avgtotal: d3.sum(v, function(d) { return (d.properties.RouteTo - d.properties.RouteFrom) * d.properties.NumberOfTravelLanes * d.properties.PSI;} )
		 	 }; 
		})
		.entries(yeararray.features)

		nested_array.forEach(function(i){ 
			nested_quartiles.forEach(function(j) { 
				if (i.key == j.key) { //find matching towns
					var firstQuartile = 0; 
					var thirdQuartile = 0; 
					var median = 0; 

					if (j.values.length > 1) {
						for (var k = 0; k < j.values.length-1; k++) { //scroll through cumulative lengths
							var firstStorage = [];
							var medStorage = [];
							var thirdStorage = []; 

							if (j.values[k].properties.cumulative < i.values.total/4) {
								firstStorage.push(j.values[k+1].properties.PSI);
								firstQuartile = d3.max(firstStorage);
							} if (j.values[k].properties.cumulative < i.values.total*3/4) {
								thirdStorage.push(j.values[k+1].properties.PSI);
								thirdQuartile = d3.max(thirdStorage);
							} if (j.values[k].properties.cumulative < i.values.total/2) {
								medStorage.push(j.values[k+1].properties.PSI);
								median = d3.max(medStorage);								}
						}
					} else {
						firstQuartile = j.values[0].properties.PSI;
						thirdQuartile = j.values[0].properties.PSI;
						median = j.values[0].properties.PSI;
					}

					if (thirdQuartile == 0 || thirdQuartile == undefined) { thirdQuartile = (i.values.avgtotal/i.values.total) * 4/3; }
					if (median == 0 || median == undefined) { median = i.values.avgtotal/i.values.total;}
					if (firstQuartile == 0 || firstQuartile == undefined) { firstQuartile = (i.values.avgtotal/i.values.total)/2;}


					i.values.firstQuartile = firstQuartile; 
					i.values.thirdQuartile = thirdQuartile;
					i.values.median = median;
				}
			})
			i.key = matchTownToId(i.key);

		})

		return nested_array; 

	}

	for (var i = 0; i < 8; i++){
		var averagedarray = nonInterstateTownPSIs(resultsarray[i]); 
		averagedarray.forEach(function(j) {
			pushed.push({
				"year" : i+2007,
				"average" : j.values.avgtotal/j.values.total,
				"firstQuartile" : j.values.firstQuartile,
				"thirdQuartile" : j.values.thirdQuartile,
				"median" : j.values.median,
				"town" : j.key
			})
		})
	}

	function nonInterstateTownPSIsCAPS (yeararray) {
		var nested_quartiles = d3.nest()
		.key(function(d) { return d.properties.CITY;})
		.entries(yeararray.features)

		nested_quartiles.forEach(function(i) { 
			i.values.sort(function(c, d){
				var nameC = c.properties.PSI; 
				var nameD = d.properties.PSI;
				if (nameC < nameD) { return -1 }
				if (nameC > nameD) { return 1 }
				return 0; 
			})
			var cumuLength = 0;
			i.values.forEach(function(j){
				if (isNaN((j.properties.ROUTETO - j.properties.ROUTEFROM) * j.properties.NUMBEROFTRAVELLANES)){
					cumuLength += 0; 
				} else { 
					cumuLength += (j.properties.ROUTETO - j.properties.ROUTEFROM) * j.properties.NUMBEROFTRAVELLANES;
				}
				j.properties.cumulative = cumuLength;
			})
		})

		var nested_array = d3.nest()
		.key(function(d) { return d.properties.CITY;})
		.rollup(function(v) { 
			return {
			    total: d3.sum(v, function(d) { return (d.properties.ROUTETO - d.properties.ROUTEFROM) * d.properties.NUMBEROFTRAVELLANES; }),
			    avgtotal: d3.sum(v, function(d) { return (d.properties.ROUTETO - d.properties.ROUTEFROM) * d.properties.NUMBEROFTRAVELLANES * d.properties.PSI;} )
		 	 }; 
		})
		.entries(yeararray.features)

		nested_array.forEach(function(i){ 
			nested_quartiles.forEach(function(j) { 
				if (i.key == j.key) { //find matching towns
					var firstQuartile = 0; 
					var thirdQuartile = 0; 
					var median = 0; 
					if(j.values.length > 1){
						for (var k = 0; k < j.values.length-1; k++) { //scroll through cumulative lengths
							var roadlength = (j.values[k].properties.ROUTETO - j.values[k].properties.ROUTEFROM) * j.values[k].properties.NUMBEROFTRAVELLANES;
							var nextRoadLength = (j.values[k+1].properties.ROUTETO - j.values[k+1].properties.ROUTEFROM) * j.values[k+1].properties.NUMBEROFTRAVELLANES;
							var firstStorage = [];
							var medStorage = [];
							var thirdStorage = []; 

							if (j.values[k].properties.cumulative < i.values.total/4) {
								firstStorage.push(j.values[k+1].properties.PSI);
								firstQuartile = d3.max(firstStorage);
							} if (j.values[k].properties.cumulative < i.values.total*3/4) {
								thirdStorage.push(j.values[k+1].properties.PSI);
								thirdQuartile = d3.max(thirdStorage);
							} if (j.values[k].properties.cumulative < i.values.total/2) {
								medStorage.push(j.values[k+1].properties.PSI);
								median = d3.max(medStorage);	
							}
						} 
					} else {
						firstQuartile = j.values[0].properties.PSI;
						thirdQuartile = j.values[0].properties.PSI;
						median = j.values[0].properties.PSI;
					}
					var number = j.values.length; 
					if (thirdQuartile == 0 || thirdQuartile == undefined) { thirdQuartile = (i.values.avgtotal/i.values.total) * 4/3; }
					if (median == 0 || median == undefined) { median = i.values.avgtotal/i.values.total;}
					if (firstQuartile == 0 || firstQuartile == undefined) { firstQuartile = (i.values.avgtotal/i.values.total)/2;}

					i.values.firstQuartile = firstQuartile; 
					i.values.thirdQuartile = thirdQuartile;
					i.values.median = median;
				}
			})
			i.key = matchTownToId(i.key);

		})

		return nested_array; 
	}

	var averagedarray = nonInterstateTownPSIsCAPS(yr2015); 

	averagedarray.forEach(function(a) {
		pushed.push({
			"year" : 2015,
			"average" : a.values.avgtotal/a.values.total,
			"town" : a.key,
			"firstQuartile" : a.values.firstQuartile,
			"thirdQuartile" : a.values.thirdQuartile,				
			"median" : a.values.median
		})
	})

	console.log(JSON.stringify(pushed));

	//FOR GENERATING AVEREAGE PSI OF INTERSTATE ROADS
	/*
	yr2007.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2007,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})

	console.log("2007 done");
	yr2008.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2008,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})
		console.log("2008 done");

	yr2009.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2009,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})
		console.log("2009 done");

	yr2010.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2010,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})
		console.log("2010 done");

	yr2011.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2011,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})

		console.log("2011 done");

	yr2012.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2012,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})

		console.log("2012 done");

	yr2012.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2013,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})

		console.log("2013 done");

	yr2014.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.RouteTo - d.properties.RouteFrom))){
			pushed.push({
				"psiyear" : 2014,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.RouteTo - d.properties.RouteFrom),
				"lanes" : d.properties.NumberOfTravelLanes,
				"route" : d.properties.RouteKey,
				"city" : "city" + d.properties.City,
				"segmentid" : "id" + d.properties.RoadSegment_ID
			})
		}
	})
		console.log("2014 done");

	yr2015.features.forEach(function(d){
		if (!isNaN(d.properties.PSI) || !isNaN(Math.abs(d.properties.ROUTETO - d.properties.ROUTEFROM))){
			pushed.push({
				"psiyear" : 2015,
				"psi" : d.properties.PSI,
				"length" : Math.abs(d.properties.ROUTETO - d.properties.ROUTEFROM),
				"lanes" : d.properties.NUMBEROFTRAVELLANES,
				"route" : d.properties.ROUTEKEY,
				"city" : "city" + d.properties.CITY,
				"segmentid" : "id" + d.properties.ROADSEGMENT_ID
			})
		}
	})

	console.log(JSON.stringify(pushed))
} // CTPS.demoApp.generateViz()*/
}

CTPS.demoApp.generateChart = function(interstateRoads, townregion, crashdata) {	


	var newarray = [];

	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2004,
			"bike_inj" : i["2004_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2004_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2004_All_Bicycle_Crashes"],
			"ped_inj" : i["2004_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2004_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2004_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2005,
			"bike_inj" : i["2005_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2005_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2005_All_Bicycle_Crashes"],
			"ped_inj" : i["2005_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2005_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2005_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2006,
			"bike_inj" : i["2006_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2006_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2006_All_Bicycle_Crashes"],
			"ped_inj" : i["2006_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2006_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2006_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2007,
			"bike_inj" : i["2007_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2007_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2007_All_Bicycle_Crashes"],
			"ped_inj" : i["2007_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2007_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2007_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2008,
			"bike_inj" : i["2008_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2008_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2008_All_Bicycle_Crashes"],
			"ped_inj" : i["2008_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2008_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2008_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2009,
			"bike_inj" : i["2009_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2009_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2009_All_Bicycle_Crashes"],
			"ped_inj" : i["2009_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2009_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2009_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2010,
			"bike_inj" : i["2010_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2010_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2010_All_Bicycle_Crashes"],
			"ped_inj" : i["2010_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2010_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2010_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2011,
			"bike_inj" : i["2011_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2011_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2011_All_Bicycle_Crashes"],
			"ped_inj" : i["2011_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2011_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2011_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2012,
			"bike_inj" : i["2012_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2012_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2012_All_Bicycle_Crashes"],
			"ped_inj" : i["2012_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2012_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2012_All_Pedestrian_Crashes"] 
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
			"town" : i.TOWN.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			"year" : 2013,
			"bike_inj" : i["2013_Bicycle_Injury_Crashes"],
			"bike_fat" : i["2013_Bicycle_Fatal_Crashes"],
			"bike_tot" : i["2013_All_Bicycle_Crashes"],
			"ped_inj" : i["2013_Pedestrian_Injury_Crashes"],
			"ped_fat" : i["2013_Pedestrian_Fatal_Crashes"],
			"ped_tot" : i["2013_All_Pedestrian_Crashes"] 
		})
	})

	console.log(JSON.stringify(newarray));
//Create chart comparing interstate roads by coordinates
	//append town names
	interstateRoads.features.forEach(function(i){ 
		var citytomatch = i.properties.CITY;
		townregion.forEach(function(j){ 
			if(j.TOWN_ID == citytomatch) {
				i.properties.TOWN = j.TOWN; 
			}
		})
	})

	var chartContainer = d3.select("#chart").append("svg")
		.attr("width", 1200)
		.attr("height", 700);

	//title lable	
	chartContainer.append("text")
		.style("fill", "black")
		.attr("x", "25px")
		.attr("y", "45px")
		.html("Interstate PSI by Route Coordinates");

	//axis lable	
	chartContainer.append("text")
		.style("fill", "black")
		.style("font-size", "10px")
		.attr("x", "30px")
		.attr("y", "590px")
		.html("(Mile)");

	//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<b>" + d.properties.TOWN + "</b><br>PSI: " + d3.round(d.properties.PSI, 2);
	  })

	chartContainer.call(tip2); 

	//var routekey = ["I90 EB", "I90 WB", "I93 NB", "I93 SB", "I95 NB", "I95 SB", "I495 NB", "I495 SB", "I290 EB", "I290 WB" ];
	var routekey = ["I-90", "I-93", "I-95", "I495", "I290"]
	//Assign scales and axes 
	xScaleRoad = d3.scale.linear().domain([0,62]).range([70, 1130]);
	xScaleSegment = d3.scale.linear().domain([0,62]).range([0, 1060]);
	yScale = d3.scale.ordinal().domain(routekey).rangePoints([150, 650]);

	var xAxis = d3.svg.axis().scale(xScaleRoad).orient("bottom").ticks(15);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);

	chartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 680)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);
	
	chartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(50, 0)")
		.style("font-size", "10px")
		.call(yAxis);

	function findFlipFrom(d) { 
		var tostorage = []; 
		var fromstorage = []; 
		interstateRoads.features.forEach(function(j){ 
			if (j.properties.ROUTEKEY == d.properties.ROUTEKEY) { 
				tostorage.push(j.properties.ROUTETO); 
				fromstorage.push(j.properties.ROUTEFROM); 
			}
		})
		var max = d3.max(tostorage); 
		var min = d3.min(fromstorage);

		var maxmin = [max, min]
		return maxmin; 
	}

			//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.features.forEach(function(i){ 
		if ((i.properties.ROUTEDIRECTION == "EB" || i.properties.ROUTEDIRECTION == "SB")) { 
			i.properties.NORMALIZEDSTART = -(i.properties.ROUTETO - findFlipFrom(i)[0]);
		} else if (i.properties.ROUTEKEY == "I95 NB" || i.properties.ROUTEKEY == "I495 NB") { 
			i.properties.NORMALIZEDSTART = i.properties.ROUTEFROM - findFlipFrom(i)[1];
		} else {
			i.properties.NORMALIZEDSTART = i.properties.ROUTEFROM;
		}
	}); 

	//Create interstate visualization by geographical coordinates
	//Fill in empty data with grey
	chartContainer.selectAll(".greybars")
		.data(interstateRoads.features)
		.enter()
		.append("rect")
			.attr("class", "greybars")
			.attr("height", 15)
			.attr("width", function(d) { 
					if (d.properties.FEDERALAIDROUTENUMBER == "I-90") { return xScaleRoad(25) } 
					if (d.properties.FEDERALAIDROUTENUMBER == "I495") { return xScaleRoad(35)}
				})
			.attr("x", xScaleRoad(0))
			.attr("y", function(d) { 
				return yScale(d.properties.FEDERALAIDROUTENUMBER);
			})
			.style("stroke", "none")
			.style("fill", "#ddd");
	
	//Available data points
	chartContainer.selectAll(".bars")
		.data(interstateRoads.features)
		.enter()
		.append("rect")
			.attr("class", "bars")
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.ROUTETO))) { 
					return 0;
				} else { 
					return xScaleSegment(Math.abs(d.properties.ROUTETO-d.properties.ROUTEFROM)); 
				}})
			.attr("x", function(d) { 
				if (isNaN(parseInt(d.properties.ROUTETO))) { 
					return 0; 
				} else { 
					return xScaleRoad(d.properties.NORMALIZEDSTART)};
				})
			.attr("y", function(d) { 
				if (d.properties.ROUTEDIRECTION == "EB" || d.properties.ROUTEDIRECTION == "NB") { 
					return yScale(d.properties.FEDERALAIDROUTENUMBER) - 2;
				} else {
					return yScale(d.properties.FEDERALAIDROUTENUMBER) - 20;
				}})
			.style("stroke", "none")
			.style("fill", function(d) { 
					if (!isNaN(d.properties.PSI)){
						return colorScale(d.properties.PSI);
					} else { 
						return "none"; 
					}
				})
			.on("mouseenter", tip2.show)
			.on("mouseleave", tip2.hide)	
	
	var townmarker = interstateRoads.features;

	townmarker.sort(function(a,b) { 
		var nameA = a.properties.ROUTEKEY; 
		var nameB = b.properties.ROUTEKEY; 
		var subnameA = a.properties.ROUTETO; 
		var subnameB = b.properties.ROUTETO; 
		if (nameA < nameB ) {return -1; }
		if (nameA > nameB) { return 1;}
		else { 
			if (subnameA < subnameB) { return -1; }
			if (subnameA > subnameB) { return 1; }
			return 0; 
		}
	})

	console.log(townmarker); 

	var townstorage = 0;
	var markers = chartContainer.selectAll(".markers")
		.data(townmarker)
		.enter();

	markers.append("rect")
		.attr("class", "markers")
		.attr("height", 50)
		.attr("width", .5)
		.attr("x", function(d) { 
			if (d.properties.CITY != townstorage && (d.properties.ROUTEDIRECTION == "SB" || d.properties.ROUTEDIRECTION == "WB")) { 
				townstorage = d.properties.CITY; 
				return xScaleRoad(d.properties.NORMALIZEDSTART);
			} else { return -50; }
			})
		.attr("y", function(d) { return yScale(d.properties.FEDERALAIDROUTENUMBER) - 35; })
		.style("stroke", "none")
		.style("fill", "black")
		.on("mouseenter", tip2.show)
		.on("mouseleave", tip2.hide)

	markers.append("text")
		.attr("class", "text")
		.text(function(d){ return d.properties.TOWN; })
		.attr("x", function(d) { 
			if (d.properties.CITY != townstorage && (d.properties.ROUTEDIRECTION == "SB" || d.properties.ROUTEDIRECTION == "WB")) {
				townstorage = d.properties.CITY; 
				return xScaleRoad(d.properties.NORMALIZEDSTART) + 30;
			} else { 
				return -9000; }
			})
		.attr("y", function(d) { 
				return yScale(d.properties.FEDERALAIDROUTENUMBER) - 20; 
			})
		.style("font-size", 10)
		.style("color", "black")
		.attr("transform", function(d) { 
			return "rotate(-45, " + xScaleRoad(d.properties.NORMALIZEDSTART) + ", " + yScale(d.properties.FEDERALAIDROUTENUMBER) + ")" 
		});
		
	

	//Color key
	chartContainer.append("rect")
		.style("fill", "#EE3B3B").style("stroke", "none")
		.attr("x", "620px").attr("y", "63px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "70px")
		.html("0.0-2.5: Dismal");
	chartContainer.append("rect")
		.style("fill", "#FFD53E").style("stroke", "none")
		.attr("x", "620px").attr("y", "78px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "85px")
		.html("2.5-3.0: Minimally Acceptable");
	chartContainer.append("rect")
		.style("fill", "#E3FF30").style("stroke", "none")
		.attr("x", "620px").attr("y", "93px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "100px")
		.html("3.0-3.5: Acceptable");
	chartContainer.append("rect")
		.style("fill", "#76EE00").style("stroke", "none")
		.attr("x", "620px").attr("y", "108px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "115px")
		.html("3.5-4.0: Good");
	chartContainer.append("rect")
		.style("fill", "#00B26F").style("stroke", "none")
		.attr("x", "620px").attr("y", "122px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "130px")
		.html("4.0-5.0: Excellent");
	chartContainer.append("rect")
		.style("fill", "#ddd").style("stroke", "none")
		.attr("x", "620px").attr("y", "137px").attr("height", "7px").attr("width", height/35);
	chartContainer.append("text")
		.style("fill", "black").style("font-size", "10px")
		.attr("x", "640px").attr("y", "145px")
		.html("No data");
}				

