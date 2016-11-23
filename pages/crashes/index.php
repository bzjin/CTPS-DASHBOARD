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

	<p>The ability to move around is crucial to every aspect of our existence. The MPO’s goal is to keep you safe everywhere and every way that you move. <b>That being said, highway crashes claimed the lives of 53 people in the Boston region in 2013.</b> We are human and make mistakes. For this reason, we must design transportation improvements that keep us moving <em>and</em> protect us at every turn. In situations where a person might fail, the roadway system should not. For this reason, we track <b>injuries</b> and <b>fatalities</b> from crashes throughout the region to monitor the safety of the Boston region’s transportation network.</p>

	<h2> Injuries to People Riding Bicycles and Walking </h2>
	<h3>Trends Over Time</h3>
		<p> Click on the map to discover the number of injuries involving bicycles and pedestrians in each city or town over the last ten years. Hover over each town to see its 2013 statistics on total crashes, injuries, and fatalities. </p> 
		<div id="map" class="col-md-4"></div>
		<div id="bikeChart" class="col-md-4 key"><h4>Bicycle Injuries</h4></div>
		<div id="pedChart" class = "col-md-4 key"><h4>Pedestrian Injuries</h4></div>

	<h3> One Year of Crashes</h3>
	<p> During 2013, 36 people died and 576 were injured riding bicycles and 892 pedestrians were injured while walking on the Boston Region’s roads. Each dot represents an individual who died or suffered an injury. </p>
		<div class="col-md-12 key">
			<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Bicycle Injuries
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