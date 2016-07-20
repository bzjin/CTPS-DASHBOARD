<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Sidewalks in the Boston MPO Region</title>
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
<script src="https://rawgit.com/tpreusse/radar-chart-d3/master/src/radar-chart.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<style> 

.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 14px;} 

</style> 
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div>
	<div class="col-md-12">
		<h1>Sidewalk Coverage</h1>
	</div>

	<div class="col-md-12">
		<h3> How much sidewalk do Boston region municipalities have on their roadways?</h3>
		<p> Can we walk to all the places to which we can drive? The visualization below shows the number of road miles that have sidewalks on either side of the road.
			A ratio of 0.0  means that none of that municipality's roads have sidewalks on either side. A ratio of 1.0 means that all of its roads have sidewalks on either side. </p>
		<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Centerline Miles
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Sidewalk Miles </p>
	</div>
	<div class="col-md-12">
		<button class="bigbutton col-md-5" id="alphabetize" alt="Sort towns by alphabetical order">Sort by Alphabetical Order</button> 
		<button class="bigbutton col-md-5" id="byAverages" alt="Sort towns by ascending average PSI">Sort by Average Sidewalk Miles to Centerline Miles Ratio</button>
	</div>
	<div class="col-md-12">
		<button class='allyrs yrpicker col-md-1'> All</button>
		<button class='yr2006 yrpicker col-md-1'> 2006</button>
		<button class='yr2007 yrpicker col-md-1'> 2007</button>
		<button class='yr2008 yrpicker col-md-1'> 2008</button>
		<button class='yr2009 yrpicker col-md-1'> 2009</button>
		<button class='yr2010 yrpicker col-md-1'> 2010</button>
		<button class='yr2011 yrpicker col-md-1'> 2011</button>
		<button class='yr2012 yrpicker col-md-1'> 2012</button>
		<button class='yr2013 yrpicker col-md-1'> 2013</button>
		<button class='yr2014 yrpicker col-md-1'> 2014</button>
		<button class='yr2015 yrpicker col-md-1'> 2015</button>
	</div>

		<!--<div class="col-md-3" id="mapRoute1"></div>-->
	<div class="col-md-12" id="sidewalks"></div>
</div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>

</body>
</html>