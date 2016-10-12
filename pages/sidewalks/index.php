<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Sidewalks in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


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

<style> 
.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;}text {fill: #ddd; font-size: 1.0em;} 
</style> 
</head>

<body>
<div class="accessible" id="accessibleTable">
	<p> The following table is readable only to screen readers. </p>
</div>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	

	<h1>Sidewalks</h1>
	<p> Walking is the basic form of transportation for most people. For those who are able, every trip, even by car, begins and ends with walking. Many people do not have access to cars or even bicycles and rely upon walking to get to school, work, doctor’s appointments, the grocery store, and other important destinations. In areas with public transit, people must walk to, between and from transit stops. Those unable to walk unassisted require pedestrian infrastructure that is suited to their mobility needs. Fortunately, well-designed sidewalks accommodate all types of pedestrians. 
	</p><p>Sidewalks also offer incredible side-benefits: healthier people, less crime, better air quality, vibrant commerce, and more neighborly communities. Simply put, safe and convenient walking infrastrastructure underpins our quality of life. 
	</p><p>The Boston Region MPO recognizes the importance of pedestrian infrastructure in our shared transportation system and regularly quantify and assess its performance. We measure Sidewalk per Centerlane Mile: the fraction of roads that have sidewalks on at least one shoulder. 
	</p>
	<h3> Sidewalk Coverage </h3>
	<p> The graphic below displays Sidewalk per Centerlane Mile for each municipality over decade. The size of the outer circles and inner circles are proportional to the miles of roadway (“centerline miles”) and miles of sidewalk, respectively, within each municipality. Hover over the circles to discover how many miles each circle represents. 
	</p>

		<button class="bigbutton col-md-6" id="alphabetize" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button> 
		<button class="bigbutton col-md-6" id="byAverages" alt="Sort towns by ascending average PSI">Sort by Sidewalk Miles to Centerline Miles Ratio</button>
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
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>