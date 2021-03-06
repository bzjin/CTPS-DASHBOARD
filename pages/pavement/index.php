<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Interstate Pavement in the Boston MPO Region</title>
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
	text {fill: #ddd;} 
	.axis {fill: none; stroke-width: .1; stroke: #ddd;}
	.yaxis {fill: none; stroke-width: 0; stroke: none;}  
	.xaxis {fill: none; stroke-width: .5; stroke: #ddd;} </style>
</head>

<body>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">

	<h1>Pavement Conditions</h1>

	<p>Freshly paved roads feel great under any set of wheels: automobile, motorcycle, bus, bicycle, scooter, or skateboard. Unfortunately, our roads steadily deteriorate with time, use, and New England weather. Investments are made in roadway maintenance to extend pavement life and keep rides smooth. Pavement condition is measured using the present serviceability index (PSI), a measure of a road’s roughness that accounts for patch work, rutting, and cracking. PSI scores range from zero (impassable) to five (perfectly smooth). Engineers consider a score of two or three as the minimum acceptable PSI.</p>

	<h2>Interstate Pavement</h2>
	<h3>Pavement Conditions in 2014</h3>
	<p>Hover over the bars below to see the pavement condition of the five interstate highways in the Boston region, as of 2014. Conditions are displayed going northbound and southbound, or eastbound and westbound, as appropriate for each highway.  </p>

	<div id="chart" class="col-md-12"></div>

	<h3>Trends</h3>
	<p> Select an interstate highway below to learn how its pavement condition has changed over time. Each vertical line charts the PSI value of a segment of that interstate highway over the past decade.</p>
	<p> Click to see only one interstate at a time. </p>
	<div class="col-md-12">
		<button class = "all bigbutton timeline col-md-2" autofocus>All</button>
		<button class = "I-90 bigbutton timeline col-md-2">I-90</button>
		<button class = "I-93 bigbutton timeline col-md-2">I-93</button>
		<button class = "I-95 bigbutton timeline col-md-2">I-95</button>
		<button class = "I290 bigbutton timeline col-md-2">I-290</button>
		<button class = "I495 bigbutton timeline col-md-2">I-495</button>
	</div>
	<div id="timeline" class="col-md-12"></div>
	<!--
	<div class = "col-md-12">
		<h3>Does average daily traffic affect pavement condition?</h3>
		<p> Average Daily Traffic, or ADT, is the average number of vehicles two-way passing a specific point in a 24-hour period. </p>
	</div>
	
	<div id="adtgraph" class="col-md-12"></div>-->
	
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>

</div>


</body>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</html>