<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>The State of Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip -->
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- TopoJSON -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Bootstrap-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>
	
	<div id="about" class="col-md-12">
		<h1>About</h1>

		<p> Every MPO in the US is being required by the Federal Government to define performance metrics and goals for their transportation system, and track progress with respect to those goals over time. This dashboard was developed not only to satisfy those federal requirements, but also share these metrics and goals with the public. Through data visualization, the Boston MPO hopes to show an accurate, navigable, and interactive picture of the region.</p>

		<p> Hordes of raw and processed data collected over the past decades have been curated to fit the visual displays in this dashboard. The following text describes the data collection process, raw data structure, and offline processing/calculations that were done to parse through hundreds of megabytes of features and attributes. </p>

		<h2> Crashes </h2>
		<p> Data not yet available to the public. Offline preprocessing can be found in the "tools" folder of the dashboard repo.</p>

		<h2> Pavement </h2>
		<p> Data extracted from the Road Inventory clipped to the MPO region and exported to GeoJSON. Some basic database-level processing [documentation inserted here] of this stuff before exporting it to GeoJSON But the source of the raw data is 100% off-the-shelf. Road Inventories (2007 - 2015) </p>

		<h2> Bridges </h2>
		<p> Data not yet available to the public. Offline preprocessing can be found in the "tools" folder of the dashboard repo.</p>

		<h2> Congestion </h2>
		<p> Congestion data was extracted  directly from the 2012 Congestion Management Program (CMP) project, which can be found at the CTPS data catalogue. The data was simply clipped to the MPO region and exported to GeoJSON. </p>
		<a href="http://www.ctps.org/datacatalog_share/content/express-highway-performance-data-2012"> Express Highway Performance Data 2012 </a><br>
		<a href="http://www.ctps.org/datacatalog_share/content/arterial-highway-performance-data-2012"> Arterial Highway Performance Data 2012 </a>

		<h2> Sidewalks </h2>
		<p> Data extracted from the Road Inventory clipped to the MPO region and exported to GeoJSON. Some basic database-level processing [documentation inserted here] of this stuff before exporting it to GeoJSON But the source of the raw data is 100% off-the-shelf. Road Inventories (2007 - 2015) </p>

		<h2> Bike Facilities </h2>
		<p> Bike facility data was taken directly from the CTPS Data Catalogue. In coding, two choices of "binning" were made - one to group off-road miles (bicycle-lane miles, cycle-track miles, shared-used path miles) together and one to group on-road miles (marked-shared-lane miles, sign-posted-on-road miles, minimum-four-feet wide shoulders) together.</p>
		<a href="http://www.ctps.org/datacatalog_share/content/bicycle-facilities-municipality"> Bike Facilities Original Data Set </a>

		<h2> Demographics</h2>
		<p> All demographic data was taken from the 2010 Census and then sorted geographically by muncipality and tract. Demographic data specific to the MPO region can be found in the CTPS data catalogue and is linked below.</p>
		<a href="http://www.ctps.org/datacatalog_share/content/boston-region-mpo-2010-census-demographic-profile">Boston Region MPO 2010 Census Demographic Profile</a>

		<h3> A Quick Note on Geometries </h3>
		<p> For the most part, mapping on this dashboard was done by exporting data in GeoJSON format from ArcMap. This allows various data structures and properties to be encoded into geographies and to be represented and displayed on this dashboard. For the purposes of this dashboard, most GeoJSONs were then turned into <a href="https://github.com/mbostock/topojson">TopoJSONs</a>, a topology-preserving data format that allows for simplification and faster loading speeds.</p>
		
	</div>
		
	<div class="footer col-md-12">
			<?php include '../../components/footer.php';?>
	</div>
</div>

</body>
</html>