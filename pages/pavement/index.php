<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Interstate Pavement in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip -->
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
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
	<h1 class="col-md-12">Pavement Condition</h1>

	<h3 class="inner-nav col-md-12"><a href="#"><i class="fa fa-dot-circle-o" aria-hidden="true"></i>
	Interstate Roads</a><a href="index2.php"><i class="fa fa-circle-o" aria-hidden="true"></i>Non-Interstate Roads</a></h3>	

	<p class="col-md-12">[Attention Getter] Blurb on pavement condition. Why is it important? Why do we care?</p>

	<h3 class="col-md-12">Interstate Pavement Conditions by Route Coordinates</h3>
	<p class="col-md-12">This mapping reflects the interstate pavement conditions in 2013. Interstate exits are marked by their number. </p>

	<div id="chart" class="col-md-10"></div>

	<div class = "col-md-10">
		<h3>Interstate Pavement Condition in the Past Decade</h3>
		<p> Interstate roads are measured by individual, smaller road segments. Each line in the chart below represents the pavement condition of each of these road segments.</p>
		<p> Click to see only one interstate at a time. </p>
	</div>
	<div class="col-md-10">
		<button class = "all timeline">All</button>
		<button class = "I-90 timeline">I-90</button>
		<button class = "I-93 timeline">I-93</button>
		<button class = "I-95 timeline">I-95</button>
		<button class = "I290 timeline">I-290</button>
		<button class = "I495 timeline">I-495</button>
	</div>
	<div id="timeline" class="col-md-10"></div>

	<div class = "col-md-10">
		<h3>Pavement Condition vs Average Daily Traffic</h3>
		<p> Average Daily Traffic, or ADT, is the average number of vehicles two-way passing a specific point in a 24-hour period. </p>
	</div>
	<div id="adtgraph" class="col-md-10"></div>
<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>

</div>

<script src="app.js"></script>

</body>
</html>