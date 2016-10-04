<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Bike Facilities in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="../../libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v4.min.js"></script>

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
<div class="accessible" id="accessibleTable">
	<p> The following table is readable only to screen readers. </p>
</div>

<div id="header" class="col-md-10 col-md-offset-1">
	<?php include '../../components/responsive-nav.php';?>
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>

	<div class=" col-md-12">

	<h1>Bike Facilities</h1>
	<p> People bike for fun, exercise, and transportation. They include children on their way to school, commuters in work clothes, athletes training, and seniors out for a relaxing ride. Most people who bike also use cars, transit, and sidewalks as alternate means of transportation. At the same time, when people bike more, they are healthier, have more expendable income, more free time, and more choice in how they move about their lives. 
	</p><p>People who bike are also vulnerable users of the transportation system and account for a growing share of crashes and a disproportionate share of injuries in the region. The majority of the region still lacks adequate bicycle infrastructure, limiting the likelihood that people choose cycling as transportation option. 
	</p><p>The Boston Region MPO monitors the bicycle network available throughout the region. Bicycle facilities include off-road trails that are often shared with pedestrians, as well as on-road lanes and cycle tracks on which people ride alongside motorized vehicles. We measure the total miles of facilities available to people biking and also calculate Bike Facility per Centerline Mile: the percent of road miles that provide designated bike lanes or cycle tracks. 
	</p>
	</div>
	<div class=" col-md-12">

	<h2> Roadway Coverage </h2>
	<h3> On-Road Bike Facilities </h3>
	<p> This map of Boston Region cities and towns below depicts the percent of road miles that provide bicycle facilities. The circles to the right represent the total number of on-road and off-road miles of available to people biking in each municipality. 
	</p>
	<button class="bigbutton col-md-4" id="alphabetize" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button>
	<button class="bigbutton col-md-4" id="byAverages" alt="Sort towns by ascending ratio on-road miles to centerline miles">Sort by On-Road Miles to Centerline Miles Ratio</button>
	<button class="bigbutton col-md-4" id="byNumber" alt="Sort towns by ascending on-road miles">Sort by On-Road Miles</button>
	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="facilities"></div>

	<h3> Off-Road Bike Facilities </h3>
	<button class="bigbutton col-md-4" id="alphabetize2" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button>
	<button class="bigbutton col-md-4" id="byPercent" alt="Sort towns by ascending ratio off-road miles to sqaure miles">Sort by Percent Existing Off-Road Miles </button>
	<button class="bigbutton col-md-4" id="byCount" alt="Sort towns by ascending ratio off-road miles to sqaure miles">Sort by Number Existing Off-Road Miles </button>
	<div class="col-md-4" id="map2"></div>
	<div class="col-md-8" id="facilities2"></div>
	</div>
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>