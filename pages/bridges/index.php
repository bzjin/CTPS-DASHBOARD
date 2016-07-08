<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Bridges in the Boston MPO Region</title>
<link rel="stylesheet" href="../../css/master.css"/>
<link rel="stylesheet" href="app.css"/>


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
<style> .axis line, .axis path { fill: none; stroke-width: 1px; stroke: #ddd; shape-rendering: crispEdges;} 
 text {fill: white;} .tick line, .tick path {stroke-width: 1px; opacity: .3;}
</style> 
</style> 
</head>

<body>
<div id="header" class="col-md-10 col-md-offset-1">
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>

<div class="col-md-12">
	<h1>Bridge Condition</h1>
	<p>We love bridges</p>
</div>

<div class="col-md-12"> 
	<h3>Bridge Conditions Over Time</h3>
	<p> Mouse over to see distribution of individual bridge health indices and structural deficiencies. </p>
		<div class="col-md-12" id="key">
			<i class="fa fa-circle badCond" aria-hidden="true"></i>  Structurally deficient bridge
			<i class="fa fa-circle goodCond" aria-hidden="true"></i> Bridge in good condition
			<i class="fa fa-circle-thin weeny" aria-hidden="true"></i>  1 bridge
			<i class="fa fa-circle-thin fa-lg" aria-hidden="true"></i> 10 bridges
			<i class="fa fa-circle-thin fa-2x" aria-hidden="true"></i> 20 bridges
			<i class="fa fa-circle-thin fa-3x" aria-hidden="true"></i> 40 bridges
		</div>
</div>

<div class="row col-md-12">
	<div id="timeline" class="col-md-5"></div>
	<div id="timeline2" class="col-md-7"></div>
</div>

<div id="chart" class="col-md-12"></div>
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>

</body>
</html>