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
		<p></p>

		<h2> Pavement </h2>
		<p> Data extracted from the Road Inventory clipped to the MPO region and exported to GeoJSON. Some basic database-level processing [documentation inserted here] of this stuff before exporting it to GeoJSON But the source of the raw data is 100% off-the-shelf. Road Inventories (2007 - 2015) </p>

		<h2> Bridges </h2>
		<p> Incoming. </p>

		<h2> Congestion </h2>
		<p> Data extracted from the 2012 CMP project, clipped to the MPO region and exported to GeoJSON. </p>

		<h2> Sidewalks </h2>
		<p> </p>

		<h2> Bike Facilities </h2>
		<p> From Anne. </p>

		<h2> Demographics</h2>
		<p> 2010 Census by muncipality and tract</p>

		
	</div>
		
	<div class="footer col-md-12">
			<?php include '../../components/footer.php';?>
	</div>
</div>

</body>
</html>