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
.xaxis {fill: none; stroke-width: .5; stroke: #ddd;} 

</style> 
</head>

<body>
<div class="accessible" id="accessibleTable">
	<p> The following information is readable only to screen readers: Data for expressway congestion is available on the CTPS Data 
	Catalogue. You can download the spreadsheet after following this link: <a href="http://www.ctps.org/datacatalog_share/content/express-highway-performance-data-2012"> Expressway Congestion Spreadsheet </a> </p>
</div>

<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	
	<h1>Congestion</h1>	

	<p>No one likes driving during rush-hour, waiting for a late bus, or getting stuck in a traffic jam. Individual incidents are frustrating. When congestion occurs regularly—at bottlenecks, work zones, crash sites, and during weather events—it can profoundly impact mobility, safety, air quality, and health. The Boston Region MPO’s Congestion Management Process (CMP) is used to monitor traffic congestion on approximately 970 expressway miles and 1,200 arterial miles in eastern Massachusetts. </p>

	<p>The Boston Region MPO monitors, analyzes, and develops strategies to manage congestion. One way to quantify congestion is to calculate the speed index, which is the ratio of observed speed to the posted speed limit on a roadway segment. The speed index is a better indication of congestion than average vehicle speeds because the speed index compares ideal conditions with actual conditions. The roadway speeds are provided by INRIX, a company that collects vehicle probe data (GPS data collected in real-time from vehicles traveling on roadways). The congestion data that is on display on this dashboard was collected in 2012. </p>

	<h3> Congestion During Peak Travel Periods on Express Highways </h3>
	<p> The speed index of express highways in the Boston region is displayed in the graphic below. Conditions are displayed going northbound and southbound, or eastbound and westbound, as appropriate for each express highway. Hover over the bars to explore the degree to which congestion slows travel on our region’s express highways during morning and evening rush hours. The AM peak period is between 6:00 AM and 10:00 AM, and the PM peak period is between 3:00 PM and 7:00 PM on expressways. A value of 0.7 or lower is considered congested. </p>

	<div class="col-md-6 col-md-offset-6" id="map"></div>

	<div class="row col-md-12" id="speedindex"> </div>
	
<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>