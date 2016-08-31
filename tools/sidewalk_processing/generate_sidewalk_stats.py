# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# script: generate_sidewalk_stats.py
#  
# Usage:
#   Parameter 1: INPUT Road Inventory clipped to Boston MPO boundary
#   Parameter 2: OUTPUT name of statistics (database) table
#   Parameter 3: Output name of statistics CSV file
#
# Description:
#   Given a copy of the Road Inventory for a given year clipped to the Boston
#   Region MPO area, generate a table with the number of centerline miles
#   and the number of "sidewalk miles" for each of the 101 towns in the MPO
#   region, and also save the table as a CSV file.
#   We define "sidewalk miles" as the number of miles on non-interstate 
#   roadway on which a sidewalk exists on either or both sides of the road.
#
# -- Ben Krepp 08/08/2016, 08/31/2016
# ---------------------------------------------------------------------------

# Import arcpy module
import arcpy
import csv

# Script arguments
ri_name = arcpy.GetParameterAsText(0)
output_table_name = arcpy.GetParameterAsText(1)
output_csv_file = arcpy.GetParameterAsText(2)

ri_table_name = ri_name[ri_name.rindex("\\")+1:len(ri_name)]
ri_layer_name = ri_table_name + "_layer"
towns_layer_name = "TOWNSSURVEY_POLYM_layer"

# Debug/trace
arcpy.AddMessage("Processing: Input = " + ri_name + " Output: " + output_table_name + " and " + output_csv_file)
arcpy.AddMessage("Input layer name = " + ri_layer_name)

# Make feature layer for road inventory clipped to MPO region:
arcpy.MakeFeatureLayer_management(in_features=ri_name,out_layer=ri_layer_name,where_clause="#",workspace="#",field_info="OBJECTID OBJECTID VISIBLE NONE;ROADINVENTORY_ID ROADINVENTORY_ID VISIBLE NONE;CRN CRN VISIBLE NONE;ROADSEGMENT_ID ROADSEGMENT_ID VISIBLE NONE;FROMMEASURE FROMMEASURE VISIBLE NONE;TOMEASURE TOMEASURE VISIBLE NONE;ASSIGNEDLENGTH ASSIGNEDLENGTH VISIBLE NONE;ASSIGNEDLENGTHSOURCE ASSIGNEDLENGTHSOURCE VISIBLE NONE;STREETLIST_ID STREETLIST_ID VISIBLE NONE;STREETNAME STREETNAME VISIBLE NONE;STREETNAMEALIAS STREETNAMEALIAS VISIBLE NONE;CITY CITY VISIBLE NONE;COUNTY COUNTY VISIBLE NONE;MUNICIPALSTATUS MUNICIPALSTATUS VISIBLE NONE;FROMENDTYPE FROMENDTYPE VISIBLE NONE;FROMSTREETNAME FROMSTREETNAME VISIBLE NONE;FROMCITY FROMCITY VISIBLE NONE;FROMSTATE FROMSTATE VISIBLE NONE;TOENDTYPE TOENDTYPE VISIBLE NONE;TOSTREETNAME TOSTREETNAME VISIBLE NONE;TOCITY TOCITY VISIBLE NONE;TOSTATE TOSTATE VISIBLE NONE;MILEAGECOUNTED MILEAGECOUNTED VISIBLE NONE;ROUTEKEY ROUTEKEY VISIBLE NONE;ROUTEFROM ROUTEFROM VISIBLE NONE;ROUTETO ROUTETO VISIBLE NONE;EQUATIONROUTEFROM EQUATIONROUTEFROM VISIBLE NONE;EQUATIONROUTETO EQUATIONROUTETO VISIBLE NONE;ROUTESYSTEM ROUTESYSTEM VISIBLE NONE;ROUTENUMBER ROUTENUMBER VISIBLE NONE;SUBROUTE SUBROUTE VISIBLE NONE;ROUTEDIRECTION ROUTEDIRECTION VISIBLE NONE;ROUTETYPE ROUTETYPE VISIBLE NONE;ROUTEQUALIFIER ROUTEQUALIFIER VISIBLE NONE;RPA RPA VISIBLE NONE;MPO MPO VISIBLE NONE;MASSDOTHIGHWAYDISTRICT MASSDOTHIGHWAYDISTRICT VISIBLE NONE;URBANTYPE URBANTYPE VISIBLE NONE;URBANIZEDAREA URBANIZEDAREA VISIBLE NONE;FUNCTIONALCLASSIFICATION FUNCTIONALCLASSIFICATION VISIBLE NONE;FEDERALFUNCTIONALCLASS FEDERALFUNCTIONALCLASS VISIBLE NONE;JURISDICTION JURISDICTION VISIBLE NONE;TRUCKROUTE TRUCKROUTE VISIBLE NONE;TRUCKNETWORK TRUCKNETWORK VISIBLE NONE;NHSSTATUS NHSSTATUS VISIBLE NONE;MHS MHS VISIBLE NONE;FEDERALAIDROUTENUMBER FEDERALAIDROUTENUMBER VISIBLE NONE;FACILITYTYPE FACILITYTYPE VISIBLE NONE;STREETOPERATION STREETOPERATION VISIBLE NONE;ACCESSCONTROL ACCESSCONTROL VISIBLE NONE;TOLLROAD TOLLROAD VISIBLE NONE;NUMBEROFPEAKHOURLANES NUMBEROFPEAKHOURLANES VISIBLE NONE;FUTUREFACILITY FUTUREFACILITY VISIBLE NONE;RIGHTSIDEWALKWIDTH RIGHTSIDEWALKWIDTH VISIBLE NONE;RIGHTSHOULDERTYPE RIGHTSHOULDERTYPE VISIBLE NONE;RIGHTSHOULDERWIDTH RIGHTSHOULDERWIDTH VISIBLE NONE;MEDIANTYPE MEDIANTYPE VISIBLE NONE;MEDIANWIDTH MEDIANWIDTH VISIBLE NONE;LEFTSIDEWALKWIDTH LEFTSIDEWALKWIDTH VISIBLE NONE;LEFTSHOULDERTYPE LEFTSHOULDERTYPE VISIBLE NONE;UNDIVIDEDLEFTSHOULDERWIDTH UNDIVIDEDLEFTSHOULDERWIDTH VISIBLE NONE;UNDIVIDEDLEFTSHOULDERTYPE UNDIVIDEDLEFTSHOULDERTYPE VISIBLE NONE;LEFTSHOULDERWIDTH LEFTSHOULDERWIDTH VISIBLE NONE;SURFACETYPE SURFACETYPE VISIBLE NONE;SURFACEWIDTH SURFACEWIDTH VISIBLE NONE;RIGHTOFWAYWIDTH RIGHTOFWAYWIDTH VISIBLE NONE;NUMBEROFTRAVELLANES NUMBEROFTRAVELLANES VISIBLE NONE;OPPOSITENUMBEROFTRAVELLANES OPPOSITENUMBEROFTRAVELLANES VISIBLE NONE;CURBS CURBS VISIBLE NONE;TERRAIN TERRAIN VISIBLE NONE;SPEEDLIMIT SPEEDLIMIT VISIBLE NONE;OPPOSINGDIRECTIONSPEEDLIMIT OPPOSINGDIRECTIONSPEEDLIMIT VISIBLE NONE;STRUCTURALCONDITION STRUCTURALCONDITION VISIBLE NONE;ADT ADT VISIBLE NONE;ADTSTATIONNUMBER ADTSTATIONNUMBER VISIBLE NONE;ADTDERIVATION ADTDERIVATION VISIBLE NONE;ADTYEAR ADTYEAR VISIBLE NONE;IRI IRI VISIBLE NONE;IRIYEAR IRIYEAR VISIBLE NONE;IRISTATUS IRISTATUS VISIBLE NONE;PSI PSI VISIBLE NONE;PSIYEAR PSIYEAR VISIBLE NONE;HPMSCODE HPMSCODE VISIBLE NONE;HPMSSAMPLE_ID HPMSSAMPLE_ID VISIBLE NONE;ADDEDROADTYPE ADDEDROADTYPE VISIBLE NONE;DATEACTIVE DATEACTIVE VISIBLE NONE;LIFECYCLESTATUS LIFECYCLESTATUS VISIBLE NONE;ITEM_ID ITEM_ID VISIBLE NONE;SHAPE SHAPE VISIBLE NONE;SHAPE_Length SHAPE_Length VISIBLE NONE")
# Make feature layer for MassGIS TOWNSSURVEY_POLYM layer:
arcpy.MakeFeatureLayer_management(in_features="MPODATA.MGIS_TOWNSSURVEY_POLYM",out_layer="TOWNSSURVEY_POLYM_Layer",where_clause="#",workspace="#",field_info="OBJECTID OBJECTID VISIBLE NONE;TOWN TOWN VISIBLE NONE;TOWN_ID TOWN_ID VISIBLE NONE;POP1980 POP1980 VISIBLE NONE;POP1990 POP1990 VISIBLE NONE;POP2000 POP2000 VISIBLE NONE;POPCH80_90 POPCH80_90 VISIBLE NONE;POPCH90_00 POPCH90_00 VISIBLE NONE;TYPE TYPE VISIBLE NONE;FOURCOLOR FOURCOLOR VISIBLE NONE;FIPS_STCO FIPS_STCO VISIBLE NONE;SUM_ACRES SUM_ACRES VISIBLE NONE;SUM_SQUARE SUM_SQUARE VISIBLE NONE;POP2010 POP2010 VISIBLE NONE;POPCH00_10 POPCH00_10 VISIBLE NONE;SHAPE SHAPE VISIBLE NONE;SHAPE.AREA SHAPE.AREA VISIBLE NONE;SHAPE.LEN SHAPE.LEN VISIBLE NONE")

# STEP 1: add field "SIDEWALK_EITHER"
arcpy.AddField_management(in_table=ri_layer_name,field_name="SIDEWALK_EITHER",field_type="SHORT",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 1.")

# STEP 2: calc SIDEWALK_EITHER to 0
arcpy.CalculateField_management(in_table=ri_layer_name,field="SIDEWALK_EITHER",expression="0",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 2.")

# STEP 3: add field "CENTERLINE_MILES"
arcpy.AddField_management(in_table=ri_layer_name,field_name="CENTERLINE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 3.")

# STEP 4: calc CENTERLINE_MILES to SHAPE_Length / 1609.344
arcpy.CalculateField_management(in_table=ri_layer_name,field="CENTERLINE_MILES",expression="[SHAPE_Length] / 1609.344",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 4.")

# STEP 5: add field "SIDEWALK_EITHER_MILES"
arcpy.AddField_management(in_table=ri_layer_name,field_name="SIDEWALK_EITHER_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 5.")

# STEP 6: calc SIDEWALK_EITHER_MILES to 0
arcpy.CalculateField_management(in_table=ri_layer_name,field="SIDEWALK_EITHER_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 6.")

# STEP 7: add field "TOWN_ID"
arcpy.AddField_management(in_table=ri_layer_name,field_name="TOWN_ID",field_type="SHORT",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 7.")

# STEP 8: calc TOWN_ID to CITY 
arcpy.CalculateField_management(in_table=ri_layer_name,field="TOWN_ID",expression="[CITY]",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 8.")

# STEP 9: add field "TOWN"
arcpy.AddField_management(in_table=ri_layer_name,field_name="TOWN",field_type="TEXT",field_precision="#",field_scale="#",field_length="40",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 9.")

# STEP 10: join road inventory layer to TOWNSURVEY_POLYM on TOWN_ID fields
arcpy.AddJoin_management(in_layer_or_view=ri_layer_name,in_field="TOWN_ID",join_table="MPODATA.MGIS_TOWNSSURVEY_POLYM",join_field="TOWN_ID",join_type="KEEP_ALL")
arcpy.AddMessage("Completed step 10.")

# STEP 11: calc road_inventory.TOWN to TOWNSURVEY_POLYM.TOWN
arcpy.CalculateField_management(in_table=ri_layer_name,field=ri_table_name + ".TOWN",expression="[MPODATA.MGIS_TOWNSSURVEY_POLYM.TOWN]",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 11.")

# STEP 12: remove join between road inventory and TOWNSURVEY_POLYM
arcpy.RemoveJoin_management(in_layer_or_view=ri_layer_name,join_name="MPODATA.MGIS_TOWNSSURVEY_POLYM")
arcpy.AddMessage("Completed step 12.")

# STEP 13: select by attributes on road inventory layer: FUNCTIONALCLASSIFICATION != 1 OR MILEAGECOUNTED = 0
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_layer_name,selection_type="NEW_SELECTION",where_clause="FUNCTIONALCLASSIFICATION <> 1 OR MILEAGECOUNTED = 0")
arcpy.AddMessage("Completed step 13.")

# STEP 14: subset selection: (RIGHTSIDEWALKWIDTH IS NOT NULL AND RIGHTSIDEWALKWIDTH > 0) OR
#                            (LEFTSIDEWALKWIDTH IS NOT NULL AND LEFTSIDEWALKWIDTH > 0)
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_layer_name,selection_type="SUBSET_SELECTION",where_clause="( RIGHTSIDEWALKWIDTH IS NOT NULL AND RIGHTSIDEWALKWIDTH > 0) OR ( LEFTSIDEWALKWIDTH IS NOT NULL AND LEFTSIDEWALKWIDTH > 0)")
arcpy.AddMessage("Completed step 14.")

# STEP 15: calc SIDEWALK_EITHER (in selection) to 10
arcpy.CalculateField_management(in_table=ri_layer_name,field="SIDEWALK_EITHER",expression="1",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 15.")

# STEP 16: clear selection
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_layer_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 16.")

# STEP 17: calc SIDEWALK_EITHER_MILES to SIDEWALK_EITHER * SHAPE_Length
arcpy.CalculateField_management(in_table=ri_layer_name,field="SIDEWALK_EITHER_MILES",expression="[CENTERLINE_MILES] * [SIDEWALK_EITHER]",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 17.")

# STEP 18: summary statistics: sum of CENTERLINE_MILES, sum of SIDEWALK_EITHER_MILES;
#                              case fields: TOWN_ID, TOWN
arcpy.Statistics_analysis(in_table=ri_name,out_table=output_table_name,statistics_fields="CENTERLINE_MILES SUM;SIDEWALK_EITHER_MILES SUM",case_field="TOWN_ID;TOWN")
arcpy.AddMessage("Completed step 18.")

# Step 19: Export output file GDB table to CSV file.
# Source: http://gis.stackexchange.com/questions/109008/python-script-to-export-csv-tables-from-gdb
fields = arcpy.ListFields(output_table_name)
field_names = [field.name for field in fields]

with open(output_csv_file,'wb') as f:
    w = csv.writer(f)
    w.writerow(field_names)
    for row in arcpy.SearchCursor(output_table_name):
        field_vals = [row.getValue(field.name) for field in fields]
        w.writerow(field_vals)
    del row
arcpy.AddMessage("Completed step 19.")
arcpy.AddMessage("Tool completed execution.")