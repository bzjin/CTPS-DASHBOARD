<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

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

	<p>People who bike are vulnerable users of the transportation system, accounting for a growing share of crashes and a disproportionate share of injuries in the region. The majority of the Boston region still lacks adequate bicycle infrastructure, limiting the likelihood that people choose cycling as a transportation option.</p>

	<p>The Boston Region MPO monitors the bicycle network available throughout the region. Bicycle facilities include off-road trails that are often shared with pedestrians, as well as on-road lanes and cycle tracks where people ride alongside motorized vehicles. The MPO measures the total miles of facilities available to cyclists. The on- and off-road bicycle facilities in the region combine to create the Boston Region Bicycle Network. Understanding this network and where it needs to grow is an important part of planning for bicycle transportation in and around Boston today and in the future.</p>

	</div>
	<div class=" col-md-12">

	<h3> Off-Road Bicycle Facilities </h3>
	<h3> Change in Existing Bicycle Facilities Over Time</h3>
	<p> The map below illustrates the change in total shared-use path mileage between 2011 and 2016 for each municipality. The bar graph compares the two years’ total shared-use path mileage.
	</p>
	<div class="col-md-12">
	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="facilities"></div></div>

	<h3> Current State of Off-Road Bicycle Facilities </h3>
	<p>The map documents the status of off-road bicycle facilities (shared-use paths) in each municipality. Facility mileage is broken down into three categories: 1) existing, 2) under construction or in design, or 3) envisioned or planned. The bar graph illustrates the total miles of each bicycle facility status in each municipality.</p>
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