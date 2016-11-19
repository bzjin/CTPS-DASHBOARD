<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Bike Facilities in the Boston MPO Region</title>
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
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div> 

<div class="accessible" id="accessibleTable">
	<p> The following table is readable only to screen readers. </p>
</div>

<div id="header" class="col-md-10 col-md-offset-1">
	<div class=" col-md-12">

	<h1>Bike Facilities</h1>
	<p>People bike for fun, exercise, and transportation. Cyclists include children on their way to school, commuters heading to work, athletes training, and seniors out for a relaxing ride. Bicycling is an active travel mode that can factor into a healthy lifestyle and it is an economical transportation option because bicycles burn calories instead of pricey fossil fuels. Bicycling as a travel mode is easily combined with walking and transit, which provides cyclists with more choice in how they move about their lives.</p>

	<p>People who bike are vulnerable users of the transportation system, accounting for a growing share of crashes and a disproportionate share of injuries in the region. The majority of the Boston region still lacks adequate bicycle infrastructure, limiting the likelihood that people choose cycling as transportation option.</p>

	<p>The Boston Region MPO monitors the bicycle network available throughout the region. Bicycle facilities include off-road trails that are often shared with pedestrians, as well as on-road lanes and cycle tracks where people ride alongside motorized vehicles. The MPO measures the total miles of facilities available to cyclists. The off- and on-road bicycle facilities in the region combine to create the Boston Region Bike Network. Understanding the Boston Region Bike Network and where it needs to grow is an important part of planning for bicycle transportation in and around Boston today and in the future.</p>

	</div>
	<div class=" col-md-12">

	<h3> Off-Road Bike Facilities </h3>
	<h3> Existing Facilities in 2011 and 2016</h3>
	<p> The map of Boston Region municipalities below depicts “Bike Facility per Centerline Mile” of roadway, which is the percent of road miles that include bicycle facilities.
	</p>
	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="facilities"></div>

	<h3> Current State of Off-Road Bike Facilities </h3>
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
<script src="app2.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>