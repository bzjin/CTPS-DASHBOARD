<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Bicycle Facilities in the Boston MPO Region</title>
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

	<h1>Bicycle Facilities</h1>
	<p>People bike for fun, exercise, and transportation. Cyclists include children on their way to school, commuters heading to work, athletes training, and seniors out for a relaxing ride. Bicycling is an active travel mode that can factor into a healthy lifestyle and it is an economical transportation option because bicycles burn calories instead of pricey fossil fuels. Bicycling as a travel mode is easily combined with walking and transit, providing more choices for getting around.</p>

	<p>People who bike are vulnerable users of the transportation system, accounting for a growing share of crashes and a disproportionate share of injuries in the region. The majority of the Boston region still lacks adequate bicycle infrastructure, reducing the likelihood that people will choose cycling as a transportation option. </p>

	<p>Understanding the existing network and how it can be expanded is an important part of planning for bicycle transportation in and around Boston. For this reason, the Boston Region MPO monitors the bicycle network in the region by measuring the total miles of bicycle facilities on this network. Bicycle facilities include off-road trails that are often shared with pedestrians, as well as on-road lanes and cycle tracks where people ride alongside motorized vehicles. Combined, these on- and off-road bicycle facilities are referred to as the Boston Region Bicycle Network. </p>

	</div>
	<div class=" col-md-12">

	<h3> Off-Road Bicycle Facilities</h3>
	<h3> Existing Bicycle Facilities in 2016</h3>
	<p> The map of Boston region municipalities below illustrates the miles of existing off-road bicycle facilities (shared-use paths) in each municipality as of 2016. Hover over a city or town on the map to view the total miles of off-road bicycle facilities that were in the municipality in 2011 and 2016. The bar graph also depicts the miles of off-road bicycle facilities in each municipality and a comparison of the 2011 and 2016 data.</p>
	<div class="col-md-12">
	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="facilities"></div></div>

	<h3> Current and Future State of Off-Road Bicycle Facilities </h3>
	<p>The map of the Boston region municipalities below documents the status of off-road bicycle facilities (shared-use paths) in each municipality as of 2016. Mileage is given for three bicycle facility categories: 1) existing, 2) under construction or in design, and 3) envisioned or planned. To the right of this map, the middle bar graph illustrates the percentage of off-road bicycle facilities in every Boston region municipality that is made up of each bicycle facility category. The bar graph to the far right depicts the total off-road mileage of each bicycle facility category in every municipality.</p>
	
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