var fs = require("fs");
var d3 = require("./d3.v4.min.js"); // d3.js version 4
 
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
// -- Beatrice Jin (primary author) && Ben Krepp (conversion to run under node.js)
//
// Modified  01/23/2017 to include 'Field_104', i.e., indication that bridge is/isn't on the NHS.
//
// Usage:
// 1. cd into directory containing the CSV files to process
// 2. Launch node.js console command window
// 3. In node.js command window:
// 4. var p = require("./process_bridge_data_node.js");
// 5. p.generate_bridge_timeline("output_file_name.json");
// 6. Convert output JSON file to CSV format, using an on-line tool,
//    e.g., http://www.convert.com/json-to-csv.htm
 
 exports.generate_bridge_timeline = function(outputFileName) {
	 
    // Variable used to accumulate the JSON to be written out.
    var pushed = [];
     
    // Secondary helper function: calculate bridge deck area.
    // The algorithm for the calculation of bridge deck area was supplied by:
    //     Costas Manousakis
    //     MassDOT Highway Division, Bridge Section
    //     Phone: 857-368-9402
    //     Email: costas.manousakis@state.ma.us
    function calcDeckArea(bin, approachWidth, bridgeSkew, item43, structureLength, deckWidth) {
        var retval = 0.0;
        var constructionType = '';
        if (deckWidth > 0) {
            // Normal bridge.
            retval = structureLength * deckWidth;
        } else {
            // Culvert.
            // By convention, culverts are coded with a deckWidth of 0.
            // Culverts are also coded with a value of 19 in the last 2 digits of the 3-digit Item_43 field.
            // So, it should be possible to do an internal consistency-check on the data here.
            // However, we learned on 9/30/2016 that we cannot rely on these two values always being
            // in sync. The data delivered to us is a "snapshot" in time, and data entry for any given
            // record may not be complete - there are cases in which a consistency-check here will
            // flag an error incorrectly.
            // The following consistency-check code has consequently been commented out.
            //
            /*
            // The following pice of skullduggery plucks off the last 2 digits of the Item_43 field.
            constructionType = String("000" + item43).slice(-2);
            if (constructionType !== "19") {
                console.log("ASSERT: BIN " + bin + " deck witdh = 0, but construction type = " + constructionType);
            }
            */
            if (bridgeSkew < 90) {
                // bridgeSkew is coded in degrees: must convert to radians when passing it to Math.cos().
                retval = approachWidth * (structureLength * Math.cos((bridgeSkew*Math.PI)/180)); 
            } else {
                // Large variation in skew - assume no skew.
                retval = approachWidth * structureLength;
            }
        }
        return retval;
    } // calcDeckArea()
     
    // Main helper function.
    function generateBridgeAverages(yr2007, yr2008, yr2009, yr2010, yr2011, yr2012, yr2013, yr2014, yr2015, yr2016){
         
        console.log("Starting to process 2007 data.");
        yr2007.forEach(function(i){
            var deckArea = calcDeckArea(i.Allbridges_2007Aug_BIN,
                                          i.Allbridges_2007Aug_Item__32,
                                          i.Allbridges_2007Aug_Item__34,
                                          i.Allbridges_2007Aug_Item__43,
                                          i.Allbridges_2007Aug_Item__49,
                                          i.Allbridges_2007Aug_Item__52);           
            pushed.push({
                "bridgeId" : i.Allbridges_2007Aug_BIN,
                "healthIndex" : i.Allbridges_2007Aug_Health_Index,
                "overFeature" : i.Allbridges_2007Aug_Item_7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.Allbridges_2007Aug_Item_6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.Allbridges_2007Aug_Item_29,
                "year" : 2007,
                "structDef" : i.Allbridges_2007Aug_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.Allbridges_2007Aug_Item_104,
                "town": i.Allbridges_2007Aug_Town_Name
            });
        });
 
        console.log("Starting to process 2008 data.");
        yr2008.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2008April_BIN,
                                          i.AllBridges_2008April_Item__32,
                                          i.AllBridges_2008April_Item__34,
                                          i.AllBridges_2008April_Item__43,
                                          i.AllBridges_2008April_Item__49,
                                          i.AllBridges_2008April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2008April_BIN,
                "healthIndex" : i.AllBridges_2008April_Health_Index,
                "overFeature" : i.AllBridges_2008April_Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2008April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2008April_Item_29,
                "year" : 2008,
                "structDef" : i.AllBridges_2008April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2008April_Item_104,
                "town": i.AllBridges_2008April_Town_Name
            });
        });
 
        console.log("Starting to process 2009 data.");  
        yr2009.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2009April_BIN,
                                          i.AllBridges_2009April_Item__32,
                                          i.AllBridges_2009April_Item__34,
                                          i.AllBridges_2009April_Item__43,
                                          i.AllBridges_2009April_Item__49,
                                          i.AllBridges_2009April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2009April_BIN,
                "healthIndex" : i.AllBridges_2009April_Health_Index,
                "overFeature" : i.AllBridges_2009April_Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2009April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2009April_Item_29,
                "year" : 2009,
                "structDef" : i.AllBridges_2009April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2009April_Item_104,
                "town": i.AllBridges_2009April_Town_Name
            });
        });
 
        console.log("Starting to process 2010 data.");  
        yr2010.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2010May_BIN,
                                          i.AllBridges_2010May_Item__32,
                                          i.AllBridges_2010May_Item__34,
                                          i.AllBridges_2010May_Item__43,
                                          i.AllBridges_2010May_Item__49,
                                          i.AllBridges_2010May_Item__52);           
            pushed.push({
                "bridgeId" : i.AllBridges_2010May_BIN,
                "healthIndex" : i.AllBridges_2010May_Health_Index,
                "overFeature" : i.AllBridges_2010May_Item_7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2010May_Item_6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2010May_Item_29,
                "year" : 2010,
                "structDef" : i.AllBridges_2010May_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2010May_Item_104,
                "town": i.AllBridges_2010May_Town_Name
            });
        });
 
        console.log("Starting to process 2011 data.");  
        yr2011.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2011April_BIN,
                                          i.AllBridges_2011April_Item__32,
                                          i.AllBridges_2011April_Item__34,
                                          i.AllBridges_2011April_Item__43,
                                          i.AllBridges_2011April_Item__49,
                                          i.AllBridges_2011April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2011April_BIN,
                "healthIndex" : i.AllBridges_2011April_Health_Index,
                "overFeature" : i.AllBridges_2011April_Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2011April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2011April_Item_29,
                "year" : 2011,
                "structDef" : i.AllBridges_2011April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2011April_Item_104,
                "town": i.AllBridges_2011April_Town_Name
            });
        });
         
        console.log("Starting to process 2012 data.");  
        yr2012.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2012April_BIN,
                                          i.AllBridges_2012April_Item__32,
                                          i.AllBridges_2012April_Item__34,
                                          i.AllBridges_2012April_Item__43,
                                          i.AllBridges_2012April_Item__49,
                                          i.AllBridges_2012April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2012April_BIN,
                "healthIndex" : i.AllBridges_2012April_Health_Index,
                "overFeature" : i.AllBridges_2012April_Item_7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2012April_Item_6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2012April_Item_29,
                "year" : 2012,
                "structDef" : i.AllBridges_2012April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2012April_Item_104,
                "town": i.AllBridges_2012April_Town_Name
            });
        });
         
        console.log("Starting to process 2013 data.");      
        yr2013.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2013April_BIN,
                                          i.AllBridges_2013April_Item__32,
                                          i.AllBridges_2013April_Item__34,
                                          i.AllBridges_2013April_Item__43,
                                          i.AllBridges_2013April_Item__49,
                                          i.AllBridges_2013April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2013April_BIN,
                "healthIndex" : i.AllBridges_2013April_Health_Index,
                "overFeature" : i.AllBridges_2013April_Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2013April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2013April_Item_29,
                "year" : 2013,
                "structDef" : i.AllBridges_2013April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2013April_Item_104,
                "town": i.AllBridges_2013April_Town_Name
            });
        });
         
        console.log("Starting to process 2014 data.");
        yr2014.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2014April_BIN,
                                          i.AllBridges_2014April_Item__32,
                                          i.AllBridges_2014April_Item__34,
                                          i.AllBridges_2014April_Item__43,
                                          i.AllBridges_2014April_Item__49,
                                          i.AllBridges_2014April_Item__52);         
            pushed.push({
                "bridgeId" : i.AllBridges_2014April_BIN,
                "healthIndex" : i.AllBridges_2014April_Health_Index,
                "overFeature" : i.AllBridges_2014April_Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.AllBridges_2014April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2014April_Item_29,
                "year" : 2014,
                "structDef" : i.AllBridges_2014April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2014April_Item_104,
                "town": i.AllBridges_2014April_Town_Name
            });
        });
         
        console.log("Starting to process 2015 data.");
        yr2015.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2015April_BIN,
                                          i.AllBridges_2015April_Item__32,
                                          i.AllBridges_2015April_Item__34,
                                          i.AllBridges_2015April_Item__43,
                                          i.AllBridges_2015April_Item__49,
                                          i.AllBridges_2015April_Item__52);
            pushed.push({
                "bridgeId" : i.BIN,
                "healthIndex" : i.AllBridges_2015April_Health_Index,
                "overFeature" : i.Item___7.replace(/ +(?= )/g, ' '), 
                "underFeature" : i.Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2015April_Item_29,
                "year" : 2015,
                "structDef" : i.AllBridges_2015April_Struct_Def,
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2015April_Item_104,
                "town": i.AllBridges_2015April_Town_Name
            });
        }); 
         
        console.log("Starting to process 2016 data.");
        yr2016.forEach(function(i){
            var deckArea = calcDeckArea(i.AllBridges_2016April_BIN,
                                          i.AllBridges_2016April_Item__32,
                                          i.AllBridges_2016April_Item__34,
                                          i.AllBridges_2016April_Item__43,
                                          i.AllBridges_2016April_Item__49,
                                          i.AllBridges_2016April_Item__52);
            pushed.push({
                "bridgeId" : i.AllBridges_2016April_BIN,
                "healthIndex" : i.AllBridges_2016April_Health_Index,            
                "overFeature" : i.AllBridges_2016April_Item___7.replace(/ +(?= )/g, ' '),
                "underFeature" : i.AllBridges_2016April_Item___6A.replace(/ +(?= )/g, ' '),
                // "adt" : i.AllBridges_2016April_Item__29,
                "year" : 2016,
                "structDef" : i.AllBridges_2016April_Struct_Def,    
                "deckArea" : deckArea,
				"nhs" : i.AllBridges_2016April_Item_104,
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
        var fileContents = fs.readFileSync(csvFileName);
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