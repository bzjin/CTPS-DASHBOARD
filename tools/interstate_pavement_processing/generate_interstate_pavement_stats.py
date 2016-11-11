# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# script: generate_interstate_pavement_stats.py
#  
# Usage:
#   Parameter 1: INPUT Road Inventory clipped to Boston MPO boundary,
#                filterd to contain only records with NHSSTATUS = 1
#                i.e., only interstate NHS roads.
#   Parameter 2: OUTPUT name of statistics table
#   Parameter 3: OUTPUT name of CSV file
#
# Description:
#   Given a copy of the Road Inventory for a given year that been:
#       1. clipped to the Boston Region MPO area
#       2. filtered to contain only records for non-interstate NHS roads
#       3. had fields named TOWN and TOWN_ID added and "calc'ed" appropriately
#   Does the following:
#       1. generates a table with the number of lane-miles of road with 
#          NULL PSI values and PSI values in each of the 4 PSI "buckets,
#          for non-interstate roads as defined by MassDOT for each of the 
#          101 towns in the MPO
#       2. also saves this table as a CSV file
#
# The PSI buckets for interstate roads are defined as follows:
#       1. Poor:      PSI 0.0 to 2.5
#       2. Fair:      PSI 2.5 to 3.0
#       3. Good:      PSI 3.0 to 3.5
#       4. Excellent: PSI 3.5 to 5.0
#
# -- Ben Krepp 08/08/2016, 08/31/2016, 11/11/2016
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

# Debug/trace
arcpy.AddMessage("Processing: Input = " + ri_name + " Output: " + output_table_name + " and " + output_csv_file)
arcpy.AddMessage("Input layer name = " + ri_layer_name)

# Make feature layer for road inventory clipped to MPO region:
arcpy.MakeFeatureLayer_management(in_features=ri_name,out_layer=ri_layer_name,where_clause="#",workspace="#",field_info="OBJECTID OBJECTID VISIBLE NONE;ROADINVENTORY_ID ROADINVENTORY_ID VISIBLE NONE;CRN CRN VISIBLE NONE;ROADSEGMENT_ID ROADSEGMENT_ID VISIBLE NONE;FROMMEASURE FROMMEASURE VISIBLE NONE;TOMEASURE TOMEASURE VISIBLE NONE;ASSIGNEDLENGTH ASSIGNEDLENGTH VISIBLE NONE;ASSIGNEDLENGTHSOURCE ASSIGNEDLENGTHSOURCE VISIBLE NONE;STREETLIST_ID STREETLIST_ID VISIBLE NONE;STREETNAME STREETNAME VISIBLE NONE;STREETNAMEALIAS STREETNAMEALIAS VISIBLE NONE;CITY CITY VISIBLE NONE;COUNTY COUNTY VISIBLE NONE;MUNICIPALSTATUS MUNICIPALSTATUS VISIBLE NONE;FROMENDTYPE FROMENDTYPE VISIBLE NONE;FROMSTREETNAME FROMSTREETNAME VISIBLE NONE;FROMCITY FROMCITY VISIBLE NONE;FROMSTATE FROMSTATE VISIBLE NONE;TOENDTYPE TOENDTYPE VISIBLE NONE;TOSTREETNAME TOSTREETNAME VISIBLE NONE;TOCITY TOCITY VISIBLE NONE;TOSTATE TOSTATE VISIBLE NONE;MILEAGECOUNTED MILEAGECOUNTED VISIBLE NONE;ROUTEKEY ROUTEKEY VISIBLE NONE;ROUTEFROM ROUTEFROM VISIBLE NONE;ROUTETO ROUTETO VISIBLE NONE;EQUATIONROUTEFROM EQUATIONROUTEFROM VISIBLE NONE;EQUATIONROUTETO EQUATIONROUTETO VISIBLE NONE;ROUTESYSTEM ROUTESYSTEM VISIBLE NONE;ROUTENUMBER ROUTENUMBER VISIBLE NONE;SUBROUTE SUBROUTE VISIBLE NONE;ROUTEDIRECTION ROUTEDIRECTION VISIBLE NONE;ROUTETYPE ROUTETYPE VISIBLE NONE;ROUTEQUALIFIER ROUTEQUALIFIER VISIBLE NONE;RPA RPA VISIBLE NONE;MPO MPO VISIBLE NONE;MASSDOTHIGHWAYDISTRICT MASSDOTHIGHWAYDISTRICT VISIBLE NONE;URBANTYPE URBANTYPE VISIBLE NONE;URBANIZEDAREA URBANIZEDAREA VISIBLE NONE;FUNCTIONALCLASSIFICATION FUNCTIONALCLASSIFICATION VISIBLE NONE;FEDERALFUNCTIONALCLASS FEDERALFUNCTIONALCLASS VISIBLE NONE;JURISDICTION JURISDICTION VISIBLE NONE;TRUCKROUTE TRUCKROUTE VISIBLE NONE;TRUCKNETWORK TRUCKNETWORK VISIBLE NONE;NHSSTATUS NHSSTATUS VISIBLE NONE;MHS MHS VISIBLE NONE;FEDERALAIDROUTENUMBER FEDERALAIDROUTENUMBER VISIBLE NONE;FACILITYTYPE FACILITYTYPE VISIBLE NONE;STREETOPERATION STREETOPERATION VISIBLE NONE;ACCESSCONTROL ACCESSCONTROL VISIBLE NONE;TOLLROAD TOLLROAD VISIBLE NONE;NUMBEROFPEAKHOURLANES NUMBEROFPEAKHOURLANES VISIBLE NONE;FUTUREFACILITY FUTUREFACILITY VISIBLE NONE;RIGHTSIDEWALKWIDTH RIGHTSIDEWALKWIDTH VISIBLE NONE;RIGHTSHOULDERTYPE RIGHTSHOULDERTYPE VISIBLE NONE;RIGHTSHOULDERWIDTH RIGHTSHOULDERWIDTH VISIBLE NONE;MEDIANTYPE MEDIANTYPE VISIBLE NONE;MEDIANWIDTH MEDIANWIDTH VISIBLE NONE;LEFTSIDEWALKWIDTH LEFTSIDEWALKWIDTH VISIBLE NONE;LEFTSHOULDERTYPE LEFTSHOULDERTYPE VISIBLE NONE;UNDIVIDEDLEFTSHOULDERWIDTH UNDIVIDEDLEFTSHOULDERWIDTH VISIBLE NONE;UNDIVIDEDLEFTSHOULDERTYPE UNDIVIDEDLEFTSHOULDERTYPE VISIBLE NONE;LEFTSHOULDERWIDTH LEFTSHOULDERWIDTH VISIBLE NONE;SURFACETYPE SURFACETYPE VISIBLE NONE;SURFACEWIDTH SURFACEWIDTH VISIBLE NONE;RIGHTOFWAYWIDTH RIGHTOFWAYWIDTH VISIBLE NONE;NUMBEROFTRAVELLANES NUMBEROFTRAVELLANES VISIBLE NONE;OPPOSITENUMBEROFTRAVELLANES OPPOSITENUMBEROFTRAVELLANES VISIBLE NONE;CURBS CURBS VISIBLE NONE;TERRAIN TERRAIN VISIBLE NONE;SPEEDLIMIT SPEEDLIMIT VISIBLE NONE;OPPOSINGDIRECTIONSPEEDLIMIT OPPOSINGDIRECTIONSPEEDLIMIT VISIBLE NONE;STRUCTURALCONDITION STRUCTURALCONDITION VISIBLE NONE;ADT ADT VISIBLE NONE;ADTSTATIONNUMBER ADTSTATIONNUMBER VISIBLE NONE;ADTDERIVATION ADTDERIVATION VISIBLE NONE;ADTYEAR ADTYEAR VISIBLE NONE;IRI IRI VISIBLE NONE;IRIYEAR IRIYEAR VISIBLE NONE;IRISTATUS IRISTATUS VISIBLE NONE;PSI PSI VISIBLE NONE;PSIYEAR PSIYEAR VISIBLE NONE;HPMSCODE HPMSCODE VISIBLE NONE;HPMSSAMPLE_ID HPMSSAMPLE_ID VISIBLE NONE;ADDEDROADTYPE ADDEDROADTYPE VISIBLE NONE;DATEACTIVE DATEACTIVE VISIBLE NONE;LIFECYCLESTATUS LIFECYCLESTATUS VISIBLE NONE;ITEM_ID ITEM_ID VISIBLE NONE;SHAPE SHAPE VISIBLE NONE;SHAPE_Length SHAPE_Length VISIBLE NONE")

# Step 1 - add fields for lane-miles with a NULL PSI value and for each of the 4 PSI "bins"
arcpy.AddField_management(in_table=ri_table_name,field_name="NULL_PSI_LANE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddField_management(in_table=ri_table_name,field_name="PSI_BIN_1_LANE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddField_management(in_table=ri_table_name,field_name="PSI_BIN_2_LANE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddField_management(in_table=ri_table_name,field_name="PSI_BIN_3_LANE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddField_management(in_table=ri_table_name,field_name="PSI_BIN_4_LANE_MILES",field_type="DOUBLE",field_precision="#",field_scale="#",field_length="#",field_alias="#",field_is_nullable="NULLABLE",field_is_required="NON_REQUIRED",field_domain="#")
arcpy.AddMessage("Completed step 1.")

# Step 2 - initialize these fields to 0.
arcpy.CalculateField_management(in_table=ri_table_name,field="NULL_PSI_LANE_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_1_LANE_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_2_LANE_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_3_LANE_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_4_LANE_MILES",expression="0",expression_type="VB",code_block="#")
arcpy.AddMessage("Completed step 2.")

# Step 3 - select records with NULL PSI value, calc number of lane miles, and clear selection.
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="NEW_SELECTION",where_clause="PSI IS NULL")
arcpy.CalculateField_management(in_table=ri_table_name,field="NULL_PSI_LANE_MILES",expression="[SHAPE_Length] * ( [NUMBEROFTRAVELLANES] / 1609.344 )",expression_type="VB",code_block="#")
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 3.")

# Step 4 - select records with PSI < 2.5, calc number of lane miles, and clear selection.
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="NEW_SELECTION",where_clause="PSI IS NOT NULL AND PSI < 2.5")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_1_LANE_MILES",expression="[SHAPE_Length] * ( [NUMBEROFTRAVELLANES] / 1609.344 )",expression_type="VB",code_block="#")
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 4.")

# Step 5 - select records with PSI >= 2.5 AND PSI < 3.0, calc number of lane miles, and clear selection.
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="NEW_SELECTION",where_clause="PSI IS NOT NULL AND PSI >= 2.5 AND PSI < 3.0")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_2_LANE_MILES",expression="[SHAPE_Length] * ( [NUMBEROFTRAVELLANES] / 1609.344 )",expression_type="VB",code_block="#")
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 5.")

# Step 6 - select records with PSI >= 3.0 AND PSI < 3.5, calc number of lane miles, and clear selection.
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="NEW_SELECTION",where_clause="PSI IS NOT NULL AND PSI >= 3.0 AND PSI < 3.5")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_3_LANE_MILES",expression="[SHAPE_Length] * ( [NUMBEROFTRAVELLANES] / 1609.344 )",expression_type="VB",code_block="#")
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 6.")

# Step 7 - select records with PSI >= 3.5 AND PSI <= 5.0, calc number of lane miles, and clear selection.
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="NEW_SELECTION",where_clause="PSI IS NOT NULL AND PSI >= 3.5 AND PSI <= 5.0")
arcpy.CalculateField_management(in_table=ri_table_name,field="PSI_BIN_4_LANE_MILES",expression="[SHAPE_Length] * ( [NUMBEROFTRAVELLANES] / 1609.344 )",expression_type="VB",code_block="#")
arcpy.SelectLayerByAttribute_management(in_layer_or_view=ri_table_name,selection_type="CLEAR_SELECTION",where_clause="#")
arcpy.AddMessage("Completed step 7.")

# Step 9 - generate statistics table: sum of NULL_PSI_LANE_MILES, PSI_BIN[1234]_LANE_MILES grouped by TOWN_ID and TOWN.
arcpy.Statistics_analysis(in_table=ri_table_name,out_table=output_table_name,statistics_fields="NULL_PSI_LANE_MILES SUM;PSI_BIN_1_LANE_MILES SUM;PSI_BIN_2_LANE_MILES SUM;PSI_BIN_3_LANE_MILES SUM;PSI_BIN_4_LANE_MILES SUM",case_field="TOWN_ID;TOWN")
arcpy.AddMessage("Completed step 8.")

# Step 9 - export table to CSV file.
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
arcpy.AddMessage("Completed step 9.")
arcpy.AddMessage("Tool completed execution.")
