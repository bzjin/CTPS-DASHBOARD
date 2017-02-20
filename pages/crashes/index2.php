<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Motorized Crashes in the Boston MPO Region</title>
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
<style> .axis line, .axis path { fill: none; stroke-width: 1px; stroke: #ddd;} 
.taxis line, .taxis path { fill: none; stroke-width: 1px; stroke: none; shape-rendering: crispEdges;} 
.yaxis line, .yaxis path { fill: none; stroke-width: 1px; stroke: #ddd; shape-rendering: crispEdges;}  .tick line, .tick path { opacity: .3; stroke-width: 1; }
text {fill: #ddd; font-family: "Raleway";}</style> 
</style> 
</head>

<body>
<div class="accessible" id="crashTable">
	<p> The following table is readable only to screen readers. </p>
</div>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	

	<h1>Crashes</h1>
	
	<p>One of the MPO’s goals is to improve safety on the highway system.  <b>That being said, highway crashes claimed the lives of 124 people in the Boston region in 2014.</b> For this reason, we track <b>injuries</b> and <b>fatalities</b> from crashes throughout the region to monitor the safety of the Boston region’s transportation network and use this information to prioritize future investments in the system.</p>

	<h2> Injuries Involving Motorized Vehicles </h2> 
	<h3>Trends</h3>
		<p> Click in the map on a city or town and the injury and fatality count over the last ten years will appear in the charts to the right. Hover over a city or town to see 2014 statistics on injuries and fatalities from crashes involving motorized vehicles. Total motorized crashes (including trucks, bicycle, and pedestrian-involved crashes) in 2014 in each city or town are also included as a reference. </p> 
		<div class="col-md-12">
		<div id="map" class="col-md-4"></div>
		<div id="motChart" class="col-md-4 key">
		<h4>Injuries Involving Motorized Vehicles</h4>
		</div>
		<div id="truckChart" class = "col-md-4 key">
		<h4>Injuries Involving Trucks</h4>
		</div>
		</div>

	<h3>One Year of Crashes</h3>
	<p> Crashes involving motorized vehicles caused a total of 16,869 injuries and 124 fatalities in the Boston region in 2014. Each dot below represents one injury and each solid dot represents one fatality as a result of a motorized crash. </p>
		<div class="col-md-12 key">
			<p class="col-md-6"><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Injuries resulting from a crash involving a motorized vehicle</p><p class="col-md-6">
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Fatalities resulting from a crash involving a motorized vehicle </p>
		</div>
	<div class="col-md-12 screenshot"><img src="screenshot.png"></div>

	<h3>Truck Crashes</h3>
	<p> Crashes involving trucks are proportionally more severe than crashes involving smaller and lighter vehicles. Reducing crashes that involve trucks is a state priority. Each dot below represents one injury and each solid dot represents a one fatality as a result of a crash involving a truck.</p>
	<div class="col-md-12 key">
			<p class="col-md-6"><i class="fa fa-circle-o yellow" aria-hidden="true"></i>  Injuries resulting from a crash involving a truck </p><p class="col-md-6">
			<i class="fa fa-circle yellow" aria-hidden="true"></i> Fatalities resulting from a crash involving a truck  </p>
	</div>
	<div class="col-md-12" id="trucks"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app2.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
</body>
</html>