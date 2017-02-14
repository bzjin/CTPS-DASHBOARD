<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Nonmotorized Crashes in the Boston MPO Region</title>
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
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Raleway:400,700" rel="stylesheet">
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

	<p>One of the MPO’s goals is to improve safety on the highway system.  <b>That being said, highway crashes claimed the lives of 124 people in the Boston region in 2014.</b> For this reason, we track <b>injuries</b> and <b>fatalities</b> from crashes throughout the region to monitor the safety of the Boston region’s transportation network and use this information to prioritize future investments in the system. </p>

	<h2> Injuries to Bicyclists and Pedestrians</h2>
	<h3>Trends</h3>
		<p> Click in the map on a city or town and the number of crashes involving injuries to bicyclists and pedestrians over the last ten years will appear in the charts to the right. Hover over a city or town to see 2014 statistics on total crashes, injuries, and fatalities.</p> 
		<div id="map" class="col-md-4"></div>
		<div id="bikeChart" class="col-md-4 key"><h4>Bicyclist Injuries </h4></div>
		<div id="pedChart" class = "col-md-4 key"><h4>Pedestrian Injuries</h4></div>

	<h3> One Year of Crashes</h3>
	<p> During 2014, five people died and 604 were injured while riding bicycles in the Boston region, and 30 pedestrians died and 1,046 pedestrians were injured while walking on roads in the region. Each dot below represents one bicyclist or pedestrian who died or suffered an injury as a result of a motorized crash. </p>
		<div class="col-md-12 key">
			<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i> Bicycle Injuries
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Bicycle Fatalities
			<i class="fa fa-circle-o pedes" aria-hidden="true"></i>  Pedestrian Injuries
			<i class="fa fa-circle pedes" aria-hidden="true"></i> Pedestrian Fatalities</p>
		</div>

	<div class="col-md-12" id="plot"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
</body>
</html>