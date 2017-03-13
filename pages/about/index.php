<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>The State of Boston MPO Region</title>
<link rel="stylesheet" href="../../css/master.css"/>
<link rel="stylesheet" href="app.css"/>


<!-- Font Awesome -->
<script src="../../libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="../../libs/d3.v4.min.js"></script>

<!-- Tooltip -->
<script src="../../libs/d3-tip.js"></script>
<!-- TopoJSON -->
<script src="../../libs/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="../../libs/google-fonts.css" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>
<link rel="stylesheet" href="../../libs/bootstrap.min.css">
</head>

<body>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	
	
	<div id="about" class="col-md-12">
		<h1>About</h1>

		<h2> Introduction </h2>
		<p>The federal government is requiring all metropolitan planning organizations (MPOs) in the United States to define performance metrics and goals for their transportation systems, and to track progress with respect to those goals over time. This dashboard was developed to meet those requirements, and to share the information used for performance measurement with the general public. Through data visualization, the Boston Region MPO hopes to show an accurate, navigable, and interactive picture of the state of the Boston region’s transportation system.</p>

		<p> The raw data on the region’s transportation system, collected over more than a decade, has been curated into forms suitable for visual display in this dashboard. The following text describes the sources of data displayed on this dashboard, and the processing used to convert the raw data for visualization.</p>

		<h2> Crashes </h2>
		<p> Crash data was obtained from the Crash Data System (CDS) of the Massachusetts Registry of Motor Vehicles (RMV). The RMV collects crash data from the Massachusetts State Police, the police departments of individual cities and towns, and motor vehicle operators. The completeness and accuracy of crash data submitted by the police departments of individual cities and towns varies. Crash data shown in this dashboard is from the years 2005 through 2014.</p>

		<h2> Pavement </h2>
		<p> Pavement condition data for the years 2007 through 2014 was extracted from the Massachusetts Road Inventory, a dataset produced by the Massachusetts Department of Transportation (MassDOT). The following processing was performed on each year's Road Inventory file:</p>
			<ol>
				<li> Select information from the Road Inventory within the Boston Region MPO boundary.</li>
				<li> For Interstate routes:
					<ol>
						<li>Select records with NHSStatus = 1</li>
						<li>Export the data in GeoJSON format, from which the visualization was generated directly.</li>
						<li>Pavement condition for interstate roads is classified as follows by MassDOT:</li>
							<ol>
								<li> Excellent: PSI between 3.5 and 5.0</li>
								<li> Good: PSI between 3.0 and 3.5</li>
								<li> Fair: PSI between 2.5 and 3.0</li>
								<li> Poor: PSI between 0.0 and 2.5</li>
							</ol>
					</ol>
				</li>
				<li> For non-Interstate routes:
					<ol>
						<li>Select records with NHSStatus > 1</li>
						<li>Pavement condition for non-interstate roads is classified as follows by MassDOT:</li>
							<ol>
								<li> Excellent: PSI between 3.5 and 5.0</li>
								<li> Good: PSI between 2.8 and 3.5</li>
								<li> Fair: PSI between 2.3 and 2.5</li>
								<li> Poor: PSI between 0.0 and 2.3</li>
							</ol>
						<li>For each PSI classification, select records with a PSI value in specified range, and calculate the number of lane-miles.</li>
						<li>Use ArcMap "Summary Statistics" tool to generate total number of lane-miles with a NULL PSI value and with a PSI value
   						    in each of the four categories, grouped by municipality.</li>
					</ol>
				</li>
			</ol>


		<h2> Bridges </h2>
		<p> Bridge data was obtained from the Bridge Section of the MassDOT's Highway Division for the years 2007 through 2016. The data record for each bridge indicates if the bridge is structurally deficient (one major bridge component or more requires attention and deterioration has reduced the load-carrying capacity of the bridge) and/or functionally obsolete (the bridge does not meet current traffic demands or highway standards).The record also includes a "health index" (the ratio of each bridge element to perfect condition), which is calculated by MassDOT. </p>
		<p>Bridge deck area is calculated by MassDOT as follows:</p>
			<ol>
				<li>If the bridge is not a culvert, the deck area is equal to the structure length multiplied by the bridge deck width out-to-out.</li>
				<li>If the bridge is a culvert, the deck area is equal to the approach roadway width multiplied by the structure length multiplied
				    by the cosine of the bridge skew, in degrees.</li>
			</ol>
		</p>

		<h2> Congestion </h2>
		<p> Congestion data was extracted directly from the 2012 Congestion Management Program (CMP) project, which can be found in the Central Transportation Planning Staff’s data catalogue on the Boston Region MPO’s website, www.bostonmpo.org/datacatalog. The data from the Boston Region MPO area was selected and exported in GeoJSON format.</p>

		<h2> Sidewalks </h2>
		<p>Sidewalk coverage data for the years 2007 through 2014 was extracted from the Massachusetts Road Inventory. The following processing was performed on each year's Road Inventory:	
			<ol>
				<li> Clip the Road Inventory to the MPO boundary. </li>
				<li> Calculate the number of centerline miles for each segment: the value of the Shape_LENGTH field divided by 1609.344 (number of meters per mile.) </li>
				<li> Select records where FUNCTIONALCLASSIFICATION != 0 OR MILEAGECOUNTED = 0. This excludes records for interstates and the "secondary direction" of other roads. </li>
				<li> Select records where (RIGHTSIDEWALKWIDTH IS NOT NULL AND RIGHTSIDEWALKWIDTH > 0) OR (LEFTSIDEWALKWIDTH IS NOT NULL AND LEFTSIDEWALKWIDTH > 0) </li>
				<li> Calculate the number of miles in these selected records, again dividing the value of the Shape_LENGTH field by 1609.344. </li>
				<li> Use ArcMap "Summary Statistics" tool to generate total number of centerline miles and number of miles with a sidewalk on either or both side of the road,
				     grouped by municipality.</li>
			</ol>
		</p>

		<h2> Bicycle Facilities </h2>
		<p>The 2011 bicycle facility data is from the 2011 MassDOT Road Inventory and 2011 MassDOT Bicycle Accommodation Inventory. The 2016 bicycle facility data is from the Metropolitan Area Planning Council's Bicycle and Pedestrian Mapping Index, which is current as of October 2016. This data was processed as follows:</p>
		<p>
			The 2016 bicycle facility data was taken from the Metropolitan Area Planning Council's Bicycle and Pedestrian Mapping Index, as of October 2016.
			This data was processed as follows:
			<ol>
				<li>Select information within the Boston Region MPO boundary.</li>
				<li>Select records for existing on-road facilities, 
				    i.e., those with fac_stat = 1 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for on-road facilities under contruction, 
				    i.e., those with fac_stat = 2 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for planned/envisioned on-road facilities, 
				    i.e., those with fac_stat = 3 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for existing off-road facilities, i.e., those with fac_stat = 1 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
				<li>Select records for off-road facilities under construction, i.e., those with fac_stat = 2 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
				<li>Select records for planned/envisioned off-road facilities, i.e., those with fac_stat = 3 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
			</ol>
		</p>

		<h2> Demographics</h2>
		<p>All demographic data are reported at the US Census Bureau tract level. Data used in the dashboard were obtained from the 2010 decennial census when available. Data that were not available from that source were gathered from the 2010-14 American Community Survey. Data sources for each demographic are as follows:</p>
			<ul><li>Over age 75: 2010 Decennial Census</li>
			<li>Unemployment: 2010-2014 American Community Survey</li>
			<li>Race/ethnicity: 2010 Decennial Census</li>
			<li>Limited English Proficiency (LEP): 2010-2014 American Community Survey</li>
			<li>Disability: 2010-2014 American Community Survey</li>
			<li>Low-income: 2010-2014 American Community Survey</li>
			<li>Female headed household with children: 2010 Decennial Census</li>
			<li>Zero vehicle household: 2010-2014 American Community Survey</li></ul>
		<p>Note that data from the American Community Survey are population estimates only, while data from the U.S. Census are actual population counts.</p>

		<h3> A Note on Spatial Data </h3>
		<p> 
		The spatial data used in this dashboard was exported from ESRI ArcSDE, file geodatabase, or personal geodatabase
		feature classes to <a href="http://geojson.org/">GeoJSON</a> format. 
		Most GeoJSON data was then converted to <a href="https://github.com/mbostock/topojson">TopoJSON</a> format, 
		a compressed, topology-preserving spatial data format, to improve performance.
		</p>

	</div>
		
	<div class="footer col-md-12">
			<?php include '../../components/footer.php';?>
	</div>
</div>

</body>
</html>