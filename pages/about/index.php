<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
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

		<p> Every MPO in the US is being required by the Federal Government to define performance metrics and goals for their transportation system, and track progress with respect to those goals over time. This dashboard was developed not only to satisfy those federal requirements, but also share these metrics and goals with the public. Through data visualization, the Boston MPO hopes to show an accurate, navigable, and interactive picture of the region.</p>

		<p> Hordes of raw and processed data collected over the past decades have been curated to fit the visual displays in this dashboard. The following text describes the data collection process, raw data structure, and offline processing/calculations that were done to parse through hundreds of megabytes of features and attributes. </p>

		<h2> Crashes </h2>
		<p> Crash data was obtained from the Massachusetts Registry of Motor Vehicles (RMV) Crash Data System.
		The RMV collects crash data from the Massachusetts State Police, the police departments of individual cities and towns, and from motor vehicle operators.
		The data submitted by operators has not been entered into the RMV CDS for several years because of a shortage of staff.
		The completeness of crash data submitted by the police departments of individual cities and towns varies from municipality to municipality.
		</p>

		<h2> Pavement </h2>
		<p> Data was extracted from the Massachusetts Road Inventory produced by the Massachusetts Department of Transportation (MassDOT), formerly the Massachusetts
		    Executive Office of Transporation, for the years 2007 through 2015.
		    The following processing was performed on each year's Road Inventory:
			<ol>
				<li> Clip Road Inventory to the MPO boundary.</li>
				<li> Select either records with NHSStatus = 1 (for interstate NHS pavement condition) or NHSStatus > 1 (for non-interstate NHS pavement condition.)</li>
				<li> For Interstate routes:
					<ol>
						<li> The data was exported in GeoJSON format, from which the visualization was generated directly.</li>
						<li> Pavement condition for interstate roads is classified as follows:
							<ul>
								<li> Excellent: PSI between 3.5 and 5.0 </li>
								<li> Good: PSI between 3.0 and 3.5 </li>
								<li> Fair: PSI between 2.5 and 3.0 </li>
								<li> Poor: PSI between 0.0 and 2.5 </li>
							</ul>
						</li>
					</ol>
				</li>
				<li> For non-Interstate routes:
					<ol>
						<li> Select records with PSI field value of NULL, and calculate number of lane-miles.</li>
						<li> Pavement condition for non-interstate roads is classified as follows:
							<ul>
								<li> Excellent: PSI between 3.5 and 5.0 </li>
								<li> Good: PSI between 2.8 and 3.5 </li>
								<li> Fair: PSI between 2.3 and 2.5 </li>
								<li> Poor: PSI between 0.0 and 2.3 </li>
							</ul>						
						</li>
						<li> For each PSI classification, select records with PSI specified range of PSI values, and calculate number of lane-miles. </li>
						<li> Use ArcMap "Summary Statistics" tool to generate total number of lane-miles with a NULL PSI value and with a PSI value in each
   						     of the four categories, grouped by TOWN and TOWN_ID. </li>
					</ol>
				</li>
			</ol>
		</p>

		<h2> Bridges </h2>
		<p> Bridge data was obtained from the Bridge Division of the Massachusetts Department of Transportation's Highway Division Bridge Section
		    for the years 2007 through 2016. The data record for each bridge indicates if the bridge is structurally deficient, is functionally
			obsolete, and includes a &#34;health index&#34; calcuated by MassDOT.
			<br/>
			Bridge deck area is calculated as follows:
			<ul>
				<li>If the bridge is not a culvert, the area is equal to the structure length multiplied by the bridge deck width out-to-out.</li>
				<li>If the bridge is a culvert, the area is equal to the approach roadway width multiplied by the structure length multiplied
				    by the cosine of the bridge skew, in degrees.</li>
			</ul>
		</p>

		<h2> Congestion </h2>
		<p> Congestion data was extracted  directly from the 2012 Congestion Management Program (CMP) project, which can be found at the CTPS data catalogue. The data was clipped to the MPO region and exported to GeoJSON. </p>
		<a href="http://www.ctps.org/datacatalog_share/content/express-highway-performance-data-2012"> Express Highway Performance Data 2012 </a><br>
		<a href="http://www.ctps.org/datacatalog_share/content/arterial-highway-performance-data-2012"> Arterial Highway Performance Data 2012 </a>

		<h2> Sidewalks </h2>
		<p> Data was extracted from the Massachusetts Road Inventory produced by the Massachusetts Department of Transportation (MassDOT), formerly the Massachusetts
		    Executive Office of Transporation, for the years 2007 through 2015.
		    The following processing was performed on each year's Road Inventory:		
			<ol>
				<li> Clip the Road Inventory to the MPO boundary. </li>
				<li> Calculate the number of centerline miles for each segment: the value of the Shape_LENGTH field divided by 1609.344 (number of meters per mile.) </li>
				<li> Select records where FUNCTIONALCLASSIFICATION != 0 OR MILEAGECOUNTED = 0. This excludes records for interstates and the "secondary direction" of other roads. </li>
				<li> Select records where (RIGHTSIDEWALKWIDTH IS NOT NULL AND RIGHTSIDEWALKWIDTH > 0) OR (LEFTSIDEWALKWIDTH IS NOT NULL AND LEFTSIDEWALKWIDTH > 0) </li>
				<li> Calculate the number of miles in these selected records, again dividing the value of the Shape_LENGTH field by 1609.344. </li>
				<li> Use ArcMap "Summary Statistics" tool to generate total number of centerline miles and number of miles with a sidewalk on either or both side of the road,
				     grouped by TOWN and TOWN_ID.</li>
			</ol>
		</p>

		<h2> Bicycle Facilities </h2>
		<p> Data for on-road bicycle facilities was taken directly from 
		    <a href="http://www.ctps.org/datacatalog_share/content/bicycle-facilities-municipality"> Bike Facilities data set </a> in the CTPS Data Catalogue. 
			<!-- NOTE: This data needs to be re-generated directly from the road inventory.
			           Relevant attributes: marked-shared-lane miles, sign-posted-on-road miles, minimum-four-feet wide shoulders.
					   -- BK 11/11/2016
			-->
		    Data for off-road bicycle facilities was obtained from MAPC.
			<br/>
			MORE DETAIL NEEDED HERE.
		</p>

		<h2> Demographics</h2>
		<p> All demographic data was taken from the 2010 Census and then sorted geographically by muncipality and tract. Demographic data specific to the MPO region can be found in the CTPS data catalogue and is linked below.</p>
		<a href="http://www.ctps.org/datacatalog_share/content/boston-region-mpo-2010-census-demographic-profile">Boston Region MPO 2010 Census Demographic Profile</a>

		<h3> A Quick Note on Geometries </h3>
		<p> For the most part, mapping on this dashboard was done by exporting data in GeoJSON format from ArcMap. This allows various data structures and properties to be encoded into geographies and to be represented and displayed on this dashboard. For the purposes of this dashboard, most <a href="http://geojson.org/">GeoJSONs</a> were then turned into <a href="https://github.com/mbostock/topojson">TopoJSONs</a>, a topology-preserving data format that allows for simplification and faster loading speeds.</p>
		
	</div>
		
	<div class="footer col-md-12">
			<?php include '../../components/footer.php';?>
	</div>
</div>

</body>
</html>