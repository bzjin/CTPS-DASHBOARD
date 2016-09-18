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
	//.defer(d3.json, "nonmotorized_crashes.JSON")
	/*.defer(d3.csv, "bridge_condition_2007.csv")
	.defer(d3.csv, "bridge_condition_2010.csv")
	.defer(d3.csv, "bridge_condition_2012.csv")
	.defer(d3.csv, "bridge_condition_2013.csv")
	.defer(d3.csv, "bridge_condition_2014.csv")
	.defer(d3.csv, "bridge_condition_2015.csv")
	.defer(d3.csv, "bridge_condition_2016.csv")*/
	.defer(d3.json, "mpo_nhs_noninterstate_2007.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2008.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2009.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2010.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2011.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2012.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2013.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2014.geojson")
	.defer(d3.json, "mpo_nhs_noninterstate_2015.geojson")
	//.defer(d3.json, "nonmotorized_crashes.json")
	//.defer(d3.csv, "crashes_injuries_by_year.csv")
	/*.defer(d3.csv, "sidewalk_data_2006.csv")
	.defer(d3.csv, "sidewalk_data_2007.csv")
	.defer(d3.csv, "sidewalk_data_2008.csv")
	.defer(d3.csv, "sidewalk_data_2009.csv")
	.defer(d3.csv, "sidewalk_data_2010.csv")
	.defer(d3.csv, "sidewalk_data_2011.csv")
	.defer(d3.csv, "sidewalk_data_2012.csv")
	.defer(d3.csv, "sidewalk_data_2013.csv")
	.defer(d3.csv, "sidewalk_data_2014.csv")
	.defer(d3.csv, "sidewalk_data_2015.csv")*/

	.defer(d3.json, "boston_region_mpo_towns.topo.json")
	//.defer(d3.json, "JSON/average_psi_by_city.JSON")
	.awaitAll(function(error, results){ 
		//CTPS.demoApp.generateCrashTable(results[0]);
		//CTPS.demoApp.generateBridgeAverages(results[0], results[1], results[2], results[3], results[4], results[5], results[6]);
		CTPS.demoApp.generateNonInterstateYears(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9]);
		//CTPS.demoApp.generateNonInterstateYears(results[0], results[1]);

		//CTPS.demoApp.generatePSIQuartiles(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9]);
		//CTPS.demoApp.generateCrashTotals(results[0], results[1]);
		//CTPS.demoApp.generateCities(results[2]);
		//CTPS.demoApp.generateSidewalks(results[0], results[1], results[2], results[3],results[4], results[5],results[6], results[7], results[8], results[9]);
	}); 


CTPS.demoApp.generateNonInterstateYears = function(yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015, townids){
//CTPS.demoApp.generateNonInterstateYears = function(yr2015, townids){

	var pushed = [];
	var resultsarray = [yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014]

	var mpoTowns = topojson.feature(townids, townids.objects.collection).features;
	console.log(mpoTowns)

	function matchTownToId (idno){
		for (var i = 0; i < mpoTowns.length; i++){ 
			if(mpoTowns[i].properties.TOWN_ID == idno) {
				var townname = mpoTowns[i].properties.TOWN; 
			}
		}
		return townname; 
	}

	var cleanedArray2015 = [];
	//Clean out undefined garbage (PSI and Routeto and Routefrom)
	resultsarray.forEach(function(thisarray){
		var cleanedArray = [];
		thisarray.features.forEach(function(element){
			if (isNaN(element.properties.PSI) || isNaN(element.properties.RouteTo) || isNaN(element.properties.RouteFrom) || isNaN(element.properties.NumberOfTravelLanes) || element.properties.RouteTo == undefined || element.properties.RouteFrom == undefined || element.properties.PSI == undefined || element.properties.NumberOfTravelLanes == undefined) {
			} else {
				cleanedArray.push(element)
			}
		})
		thisarray.features = cleanedArray;
	})

	yr2015.features.forEach(function(element){
		if (isNaN(element.properties.PSI) || isNaN(element.properties.ROUTETO) || isNaN(element.properties.ROUTEFROM) || isNaN(element.properties.NUMBEROFTRAVELLANES) || element.properties.ROUTETO == undefined || element.properties.ROUTEFROM == undefined || element.properties.PSI == undefined || element.properties.NUMBEROFTRAVELLANES == undefined) {
		} else {
			cleanedArray2015.push(element);
		}
		yr2015.features = cleanedArray2015;
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
				cumuLength += Math.abs(j.properties.RouteTo - j.properties.RouteFrom) * j.properties.NumberOfTravelLanes;
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

					for (var k = 0; k < j.values.length; k++) { //scroll through cumulative lengths
						var firstStorage = [];
						var medStorage = [];
						var thirdStorage = []; 

						if (j.values[k].properties.cumulative <= i.values.total/4) {
							firstStorage.push(j.values[k].properties.PSI);
							firstQuartile = d3.max(firstStorage);
						} if (j.values[k].properties.cumulative <= i.values.total*3/4) {
							thirdStorage.push(j.values[k].properties.PSI);
							thirdQuartile = d3.max(thirdStorage);
						} if (j.values[k].properties.cumulative <= i.values.total/2) {
							medStorage.push(j.values[k].properties.PSI);
							median = d3.max(medStorage);	
						}
						
					}

						if (firstQuartile == 0 || isNaN(firstQuartile)) { firstQuartile = j.values[0].properties.PSI}
						if (median == 0 || isNaN(median)) { median = firstQuartile }
						if (thirdQuartile == 0 || isNaN(thirdQuartile)) { thirdQuartile = median}

					i.values.firstQuartile = firstQuartile; 
					i.values.thirdQuartile = thirdQuartile;
					i.values.median = median;
					i.values.minimum = j.values[0].properties.PSI;
					i.values.maximum = j.values[j.values.length - 1].properties.PSI;
				}
			})
			i.key = matchTownToId(i.key);

		})

		return nested_array; 

	}

	for (var i = 0; i < 8; i++){
		var averagedarray = nonInterstateTownPSIs(resultsarray[i]); 
		averagedarray.forEach(function(j) {
			if (j.key != undefined){
				pushed.push({
					"year" : i+2007,
					"average" : j.values.avgtotal/j.values.total,
					"firstQuartile" : j.values.firstQuartile,
					"thirdQuartile" : j.values.thirdQuartile,
					"median" : j.values.median,
					"minimum" : j.values.minimum,
					"maximum" : j.values.maximum,
					"town" : j.key
				})
			}
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
					if (matchTownToId(i.key) == "ESSEX") { 
						console.log(j);
						var foo = 0; 
					}
					var firstQuartile = 0; 
					var thirdQuartile = 0; 
					var median = 0; 
					for (var k = 0; k < j.values.length; k++) { //scroll through cumulative lengths
						var roadlength = (j.values[k].properties.ROUTETO - j.values[k].properties.ROUTEFROM) * j.values[k].properties.NUMBEROFTRAVELLANES;
						var nextRoadLength = (j.values[k].properties.ROUTETO - j.values[k].properties.ROUTEFROM) * j.values[k].properties.NUMBEROFTRAVELLANES;
						var firstStorage = [];
						var medStorage = [];
						var thirdStorage = []; 

						if (j.values[k].properties.cumulative < i.values.total/4) {
							firstStorage.push(j.values[k].properties.PSI);
							firstQuartile = d3.max(firstStorage);
						} if (j.values[k].properties.cumulative < i.values.total*3/4) {
							thirdStorage.push(j.values[k].properties.PSI);
							thirdQuartile = d3.max(thirdStorage);
						} if (j.values[k].properties.cumulative < i.values.total/2) {
							medStorage.push(j.values[k].properties.PSI);
							median = d3.max(medStorage);	
						}
					} 
					
					if (firstQuartile == 0 || isNaN(firstQuartile)) { firstQuartile = j.values[0].properties.PSI}
					if (median == 0 || isNaN(median)) { median = firstQuartile }
					if (thirdQuartile == 0 || isNaN(thirdQuartile)) { thirdQuartile = median}
				
					i.values.minimum = j.values[0].properties.PSI;
					i.values.maximum = j.values[j.values.length - 1].properties.PSI;
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
		if (a.key != undefined) {
			pushed.push({
				"year" : 2015,
				"average" : a.values.avgtotal/a.values.total,
				"town" : a.key,
				"firstQuartile" : a.values.firstQuartile,
				"thirdQuartile" : a.values.thirdQuartile,	
				"minimum" : a.values.minimum,
				"maximum" : a.values.maximum,			
				"median" : a.values.median
			})
		}
	})

	console.log(JSON.stringify(pushed));

}

