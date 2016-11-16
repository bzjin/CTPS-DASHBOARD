<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
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
	
	<p>The ability to move around is crucial to every aspect of our existence. The MPO’s goal is to keep you safe everywhere and every way that you move. <b>That being said, highway crashes claimed the lives of 53 people in the Boston region last year.</b> We are human and make mistakes. For this reason, we must design transportation improvements that keep us moving and protect us at every turn. In situations where a person might fail, the roadway system should not. For this reason, we track injuries and fatalities from crashes throughout the region to monitor the safety of the Boston region’s transportation network.</p>

	<h2> Injuries to People Driving </h2> 
	<h3>Trends Over Time</h3>
		<p> Click on each city or town and see its injury count over time. Hover over each town to see its 2013 statistics on injuries and fatalities.</p> 
		<div id="map" class="col-md-4"></div>
		<div id="motChart" class="col-md-4 key"><h4>All Motorized Injuries</h4></div>
		<div id="truckChart" class = "col-md-4 key"><h4>Truck Injuries</h4></div>

	<h3>One Year of Crashes</h3>
	<p> The Boston Region saw 14,888 total injuries involving motorized vehicles in 2013. Each dot represents one crash. Large solid-filled dots represent 680 fatalities.</p>
		<div class="col-md-12 key">
			<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Vehicle Injuries
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Vehicle Fatalities </p>
		</div>

	<div class="col-md-12"><img src="crashes_screenshot-min.png"></div>
	<h3>Truck Crashes</h3>
	<p> Trucks are among the larger and heavier vehicles using the transportation system and account for a greater proportion of crash severity than other modes. Truck-involved crashes are one of the state’s emphasis areas. Each dot represents one crash. Solid dots represent fatalities involving trucks.</p>
	<div class="col-md-12" id="trucks"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app2.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
</body>
</html>