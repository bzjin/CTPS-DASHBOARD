<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Trip Flows in the Boston MPO Region</title>
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

.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 1.0em;} 

.node rect {
  cursor: move;
  fill-opacity: .9;
  shape-rendering: crispEdges;
}
 
.node text {
  pointer-events: none;
  text-shadow: 0 1px 0 #fff;
}
 
.link {
  fill: none;
  stroke: #000;
  stroke-opacity: .2;
}
 
.link:hover {
  stroke-opacity: .5;
}

</style> 
</head>

<body>

<?php include '../../components/responsive-nav.php';?>
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	
	<div class="col-md-12">
		<h1>Trip Flows</h1>
	</div>

	<div class="col-md-12">
		<h3>Where do people travel within the Boston region?</h3>
		<p> The map below shows which the DIFFERENCE of inbound and outbound trips to a particular district.
	</div>
		<button class='highwayFlow col-md-2'> Highway</button>
		<button class='bikeFlow col-md-2'> Bike</button>
		<button class='pedFlow col-md-2'> Pedestrian</button>
		<button class='truckFlow yrpicker col-md-2'> Trucks</button>
		<button class='transitFlow yrpicker col-md-2'> Transit</button>
	<div class="col-md-6" id="map"></div>
	<div class="col-md-6" id="sankeyChart"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
<script src="../../js/sankey.js"></script>

</body>
</html>