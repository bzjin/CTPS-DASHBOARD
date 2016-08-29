<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Interstate Pavement in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v4.min.js"></script>


<!-- Tooltip -->
<script src="../../js/d3-tip.js"></script>
<!-- TopoJSON -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Bootstrap-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<style> text {fill: #ddd;} .axis {fill: none; stroke-width: .1; stroke: #ddd;} .xaxis {fill: none; stroke-width: .5; stroke: #ddd;} </style>

</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>

	<h1>Pavement Condition</h1>

	<h3 class="inner-nav col-md-12">
		<a href="#" title="Go to interstate pavement condition"><i class="fa fa-dot-circle-o" aria-hidden="true"></i>
	Interstate Roads</a>
		<a href="index2.php" title="go to noninterstate pavement condition"><i class="fa fa-circle-o" aria-hidden="true"></i> Non-Interstate Roads</a>
	</h3>	

	<p>Freshly paved roads feel great under any set of wheels: automobile, motorcycle, bus, bicycle, scooter, or skateboard. Unfortunately, our roads steadily deteriorate with time, use, and New England weather. The MPO invests in regular roadway maintenance to extend pavement life, keeping rides smooth and users safe while saving public tax dollars. 
		We measure pavement condition using the Present Serviceability Index (PSI), a measure of an road segment’s roughness, including patch work, rutting, and cracking. PSI scores range from 0 (impassable) to 5 (perfectly smooth). Engineers consider a score of 2 or 3 as the minimum acceptable PSI. 
	</p>

	<h2>Interstate Pavement</h2>
	<h3>Conditions in 2013</h3>
	<p>Hover over the bars below to see how the pavement condition of our region’s five interstate highways changes as they cross the region from North to South or East to West. 
	 </p>

	<div id="chart" class="col-md-12"></div>

	<h3>Trends Over Time</h3>
	<p> Select an interstate below to learn how its pavement condition has changed. Each line charts the PSI value of a segment of that interstate over the past decade.</p>
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

</html>