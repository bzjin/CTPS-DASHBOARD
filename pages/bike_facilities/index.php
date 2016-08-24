<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Bike Facilities in the Boston MPO Region</title>
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

.axis path,
.axis line {
  fill: none;
  stroke: #ddd;
  shape-rendering: crispEdges;
}

text { 
	fill: #ddd;
}

</style> 
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div>
	<h1>Bike Facilities</h1>
	<p> People bike for fun, exercise, and transportation. They include children on their way to school, commuters in work clothes, athletes training, and seniors out for a relaxing ride. Most people who bike also use cars, transit, and sidewalks as alternate means of transportation. At the same time, when people bike more, they are healthier, have more expendable income, more free time, and more choice in how they move about their lives. 
	</p><p>People who bike are also vulnerable users of the transportation system and account for a growing share of crashes and a disproportionate share of injuries in the region. The majority of the region still lacks adequate bicycle infrastructure, limiting the likelihood that people choose cycling as transportation option. 
	</p><p>The Boston Region MPO monitors the bicycle network available throughout the region. Bicycle facilities include off-road trails that are often shared with pedestrians, as well as on-road lanes and cycle tracks on which people ride alongside motorized vehicles. We measure the total miles of facilities available to people biking and also calculate Bike Facility per Centerline Mile: the percent of road miles that provide designated bike lanes or cycle tracks. 
	</p>

	<h2> Roadway Coverage </h2>
	<h3> On-Road Bike Facilities </h3>
	<p> This map of Boston Region cities and towns below depicts the percent of road miles that provide bicycle facilities. The circles to the right represent the total number of on-road and off-road miles of available to people biking in each municipality. 
	</p>
	
	<div class="col-md-12">
		<button class="bigbutton col-md-4" id="alphabetize" alt="Sort towns by alphabetical order">Sort by Alphabetical Order</button>
		<button class="bigbutton col-md-4" id="byAverages" alt="Sort towns by ascending percent bike facilities to centerline miles" autofocus>Sort by Bike Facility Miles to Centerline Miles Ratio</button>
		<button class="bigbutton col-md-4" id="byNumber" alt="Sort towns by ascending miles of bike facilities">Sort by Bike Facility Miles</button>
	</div>

	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="facilities"></div>
	<h3> Off-Road Bike Facilities </h3>
		<div class="col-md-4" id="map2"></div>
		<div class="col-md-8" id="facilities2"></div>
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>

</body>
</html>