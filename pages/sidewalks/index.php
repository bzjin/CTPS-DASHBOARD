<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Sidewalks in the Boston MPO Region</title>
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
	<p>Walking is the most basic form of transportation, and pedestrian infrastructure benefits everyone. Many people walk to get to school, work, doctor’s appointments, the grocery store, and other important destinations because they do not have access to a car or even a bicycle. In areas with public transit, people walk to access transit stops. Even trips taken by car usually begin and end with a short walk.  People who need mobility assistance also require pedestrian infrastructure that facilitates safe travel. Fortunately, well-designed sidewalks accommodate everyone.</p>

	<p>Sidewalks offer a wide variety of benefits. The presence and accessibility of sidewalks allows people to incorporate walking into everyday life, which makes people more active and healthy. Sidewalks make it possible for people to swap car trips for walking excursions, which improves air quality by reducing vehicle emissions. Sidewalks draw more people to the street, which leads to vibrant commerce, crime reduction, and the creation of more neighborly communities. Simply put, safe and convenient pedestrian infrastructure underpins our quality of life. The Boston Region MPO recognizes the importance of pedestrian infrastructure in our shared transportation system and regularly quantifies and assesses this infrastructure in the Boston region. </p>

	<h3> Sidewalk Coverage </h3>
	<p> The graphic below displays the miles of roadways that have a sidewalk on at least one shoulder, identified as “sidewalk per centerline mile” of roadway. This measure is the ratio of a municipality’s roadways that include a sidewalk on at least one side, divided by the total length of roadways within the boundaries of the municipality. The “sidewalk per centerline mile” measure is provided for every municipality over the past decade. The size of the outer circles and inner circles are proportional to each municipality’s miles of roadway (“centerline miles”) and miles of sidewalk, respectively. Hover over a circle to discover how many miles it represents.</p>

		<button class="bigbutton col-md-6" id="alphabetize" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button> 
		<button class="bigbutton col-md-6" id="byAverages" alt="Sort towns by ascending average PSI">Sort by Sidewalk Miles to Centerline Miles Ratio</button>
		<button class='allyrs yrpicker col-md-1' autofocus> All</button>
		<button class='yr2007 yrpicker col-md-1'> 2007</button>
		<button class='yr2008 yrpicker col-md-1'> 2008</button>
		<button class='yr2009 yrpicker col-md-1'> 2009</button>
		<button class='yr2010 yrpicker col-md-1'> 2010</button>
		<button class='yr2011 yrpicker col-md-1'> 2011</button>
		<button class='yr2012 yrpicker col-md-1'> 2012</button>
		<button class='yr2013 yrpicker col-md-1'> 2013</button>
		<button class='yr2014 yrpicker col-md-1'> 2014</button>

	<div class="col-md-12" id="key"></div>
	<div class="col-md-12" id="sidewalks"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>