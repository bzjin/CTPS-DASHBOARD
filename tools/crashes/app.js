var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1");

d3.queue()
	.defer(d3.csv, "appended_crashes.csv")

	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateNonmotorized(results[0]); //generates nonmotorized data
	}); 

/* 
AN EXPLANATION: The data used is a csv that contains all of the motorized and nonmotorized crash data.
*/
CTPS.demoApp.generateNonmotorized = function(crashdata) {	
	var newarray = [];
	console.log(crashdata)

	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})
	crashdata.forEach(function(i){
		newarray.push({
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
		})
	})

	console.log(JSON.stringify(newarray));
}

//Now that the crashdata is generated, append new set of "All" data to each year
CTPS.demoApp.generateCrashTotals = function(crashdata, all_data) {	
	crashdata.forEach(function(i){ 
		all_data.forEach(function(j){
			if (i.town == j.Town_Name){
				if (i.year == 2004) { 
					i.tot_inj = j.All_Injuries_2004;
					i.tot_fat = j.All_Fatalities_2004;
					i.mot_inj = j.All_Injuries_2004 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2004 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2005) { 
					i.tot_inj = j.All_Injuries_2005;
					i.tot_fat = j.All_Fatalities_2005;
					i.mot_inj = j.All_Injuries_2005 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2005 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2006) { 
					i.tot_inj = j.All_Injuries_2006;
					i.tot_fat = j.All_Fatalities_2006;
					i.mot_inj = j.All_Injuries_2006 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2006 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2007) { 
					i.tot_inj = j.All_Injuries_2007;
					i.tot_fat = j.All_Fatalities_2007;
					i.mot_inj = j.All_Injuries_2007 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2007 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2008) { 
					i.tot_inj = j.All_Injuries_2008;
					i.tot_fat = j.All_Fatalities_2008;
					i.mot_inj = j.All_Injuries_2008 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2008 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2009) { 
					i.tot_inj = j.All_Injuries_2009;
					i.tot_fat = j.All_Fatalities_2009;
					i.mot_inj = j.All_Injuries_2009 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2009 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2010) { 
					i.tot_inj = j.All_Injuries_2010;
					i.tot_fat = j.All_Fatalities_2010;
					i.mot_inj = j.All_Injuries_2010 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2010 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2011) { 
					i.tot_inj = j.All_Injuries_2011;
					i.tot_fat = j.All_Fatalities_2011;
					i.mot_inj = j.All_Injuries_2011 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2011 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2012) { 
					i.tot_inj = j.All_Injuries_2012;
					i.tot_fat = j.All_Fatalities_2012;
					i.mot_inj = j.All_Injuries_2012 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2012 - i.bike_fat - i.ped_fat;
				}
				if (i.year == 2013) { 
					i.tot_inj = j.All_Injuries_2013;
					i.tot_fat = j.All_Fatalities_2013;
					i.mot_inj = j.All_Injuries_2013 - i.bike_inj - i.ped_inj;
					i.mot_fat = j.All_Fatalities_2013 - i.bike_fat - i.ped_fat;
				}
			}
		})
	})
console.log(JSON.stringify(crashdata));
}

CTPS.demoApp.generateTruck = function(motorized, trucks){
console.log(motorized, trucks)
	motorized.forEach(function(i){ 
		trucks.forEach(function(j){
			if (i.Town_Name.toUpperCase() == j.TOWN || i.Town_Name.toUpperCase() == "TOTAL"){
				if (i.year == 2004) { 
					i.trk_inj = j['2004_Truck_Number_Injuries']
					i.trk_fat = j['2004_Truck_Number_Fatalities']
				}
				if (i.year == 2005) { 
					i.trk_inj = j['2005_Truck_Number_Injuries']
					i.trk_fat = j['2005_Truck_Number_Fatalities']
				}if (i.year == 2006) { 
					i.trk_inj = j['2006_Truck_Number_Injuries']
					i.trk_fat = j['2006_Truck_Number_Fatalities']
				}if (i.year == 2007) { 
					i.trk_inj = j['2007_Truck_Number_Injuries']
					i.trk_fat = j['2007_Truck_Number_Fatalities']
				}if (i.year == 2008) { 
					i.trk_inj = j['2008_Truck_Number_Injuries']
					i.trk_fat = j['2008_Truck_Number_Fatalities']
				}if (i.year == 2009) { 
					i.trk_inj = j['2009_Truck_Number_Injuries']
					i.trk_fat = j['2009_Truck_Number_Fatalities']
				}if (i.year == 2010) { 
					i.trk_inj = j['2010_Truck_Number_Injuries']
					i.trk_fat = j['2010_Truck_Number_Fatalities']
				}if (i.year == 2011) { 
					i.trk_inj = j['2011_Truck_Number_Injuries']
					i.trk_fat = j['2011_Truck_Number_Fatalities']
				}if (i.year == 2012) { 
					i.trk_inj = j['2012_Truck_Number_Injuries']
					i.trk_fat = j['2012_Truck_Number_Fatalities']
				}if (i.year == 2013) { 
					i.trk_inj = j['2013_Truck_Number_Injuries']
					i.trk_fat = j['2013_Truck_Number_Fatalities']
				}
			}
		})
	})

	console.log(JSON.stringify(motorized));

}

