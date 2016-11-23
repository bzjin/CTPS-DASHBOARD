<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Congestion in the Boston MPO Region</title>
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

.axis line, .axis path, .axis text { fill: none; stroke-width: 0; stroke: #ddd; shape-rendering: crispEdges;} 
.yaxis line, .yaxis path { fill: none; stroke-width: 0px; shape-rendering: crispEdges;} text {fill: #ddd; font-size: 1.0em;} 
.xaxis {fill: none; stroke-width: .5; stroke: #ddd;} path { shape-rendering: optimizeQuality;}

</style> 
</head>

<body>
<div class="accessible" id="accessibleTable">
	<p> The following information is readable only to screen readers: Data for arterial congestion is available on the CTPS Data 
	Catalogue. You can download the spreadsheet after following this link: <a href="http://www.ctps.org/datacatalog_share/content/arterial-highway-performance-data-2012"> Expressway Congestion Spreadsheet </a> </p>
</div>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">

	<h1>Congestion</h1>

	<p> No one likes driving during rush-hour, waiting for a late bus, or getting stuck in a traffic jam. Individual incidents are frustrating. When congestion occurs regularly—at bottlenecks, work zones, crash sites, and during weather events—it can profoundly impact mobility, safety, air quality, and health. The Congestion Management Process (CMP) is used to monitor traffic congestion on approximately 970 expressway miles and 1200 arterial miles in eastern Massachusetts.</p>

	<p>The Boston Region MPO monitors, analyzes, and develops strategies to manage congestion. One way to quantify congestion is to calculate the Speed Index, which is the ratio of observed speed to the posted speed limit on a roadway segment. Speed index is a better indication of congestion than average vehicle speeds, because speed index compares ideal conditions with actual conditions. The roadway speeds are provided by INRIX, a third party company who provides vehicle probe data. The congestion data that is on display on this dashboard was collected in 2012. </p>

	<h3> Congestion across Boston Region Arterial Routes </h3>
	<p> Speed Index is displayed for each route, by direction. Speed index indicates congestion more accurately than travel speed alone because low travel speed may be a result of low speed limits on certain arterial facilities. The AM peak period is between 6:30 and 9:30 AM and the PM peak period is between 3:30 and 6:30 PM on arterial roadways. Click on individual routes to explore the degree that congestion slows travel on the Boston Region’s many arterials. A value of 0.7 or lower is considered congested.  </p>

	<div class="col-md-9" id="mapNonInterstate"></div>
	<div class="col-md-3" id="crossSection"></div>

	<!--
	<div class="col-md-12">
		<h3> Free Flow v. Congested Travel Time </h3> 
		<button id="congAnim2"> Start Animation </button>
		<div class="col-md-12">
			<div class="col-md-4" id="freeFlow2"> Driving at Speed Limit </div>
			<div class="col-md-4" id="amCong2"> Driving in AM Congestion</div>
			<div class="col-md-4" id="pmCong2"> Driving in PM Congestion </div>
		</div>
	</div>-->
<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app2.js"></script>

</body>
</html>