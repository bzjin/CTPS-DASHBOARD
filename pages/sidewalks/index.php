<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Sidewalks in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip -->
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- TopoJSON -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Raleway:400,700" rel="stylesheet">
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

	<h1>Sidewalks</h1>
	<p> Walking is the basic form of transportation for most people. For those who are able, every trip, even by car, begins and ends with walking. Many people do not have access to cars or even bicycles and rely upon walking to get to school, work, doctor’s appointments, the grocery store, and other important destinations. In areas with public transit, people must walk to, between and from transit stops. Those unable to walk unassisted require pedestrian infrastructure that is suited to their mobility needs. Fortunately, well-designed sidewalks accommodate all types of pedestrians. 
	</p><p>Sidewalks also offer incredible side-benefits: healthier people, less crime, better air quality, vibrant commerce, and more neighborly communities. Simply put, safe and convenient walking infrastrastructure underpins our quality of life. 
	</p><p>The Boston Region MPO recognizes the importance of pedestrian infrastructure in our shared transportation system and regularly quantify and assess its performance. We measure Sidewalk per Centerlane Mile: the fraction of roads that have sidewalks on at least one shoulder. 
	</p>
	<h3> Sidewalk Coverage </h3>
	<p> The graphic below displays Sidewalk per Centerlane Mile for each municipality over decade. The size of the outer circles and inner circles are proportional to the miles of roadway (“centerline miles”) and miles of sidewalk, respectively, within each municipality. Hover over the circles to discover how many miles each circle represents. 
	</p>

		<button class="bigbutton col-md-6" id="alphabetize" alt="Sort towns by alphabetical order">Sort by Alphabetical Order</button> 
		<button class="bigbutton col-md-6" id="byAverages" alt="Sort towns by ascending average PSI" autofocus>Sort by Sidewalk Miles to Centerline Miles Ratio</button>
		<button class='allyrs yrpicker col-md-1' autofocus> All</button>
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

		<!--<div class="col-md-3" id="mapRoute1"></div>-->
	<div class="col-md-12" id="sidewalks"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>

</body>
</html>