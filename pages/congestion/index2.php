<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Congestion in the Boston MPO Region</title>
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
<style> 

.axis line, .axis path, .axis text { fill: none; stroke-width: 0; stroke: #ddd; shape-rendering: crispEdges;} 
.yaxis line, .yaxis path { fill: none; stroke-width: 0px; shape-rendering: crispEdges;} text {fill: #ddd; font-size: 14px;} 
.xaxis {fill: none; stroke-width: .5; stroke: #ddd;} path { shape-rendering: optimizeQuality;}

</style> 
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div>
	<h1>Congestion</h1>

	<h3 class="inner-nav col-md-12">
		<a href="index.php" title="Go to express highways congestion"><i class="fa fa-circle-o" aria-hidden="true"></i> Express Highways</a>
		<a href="#" title="Go to arterial routes congestion"><i class="fa fa-dot-circle-o" aria-hidden="true"></i> Arterial Routes</a>
	</h3>

	<p> One of the main ways congestion is measured is by speed index, which is a ratio giving the average, observed speed of travel during congestion hours to the posted speed limit.</p>
	<p> Speed Index = (Observed speed during AM/PM congested hours) / (Posted speed limit) </p>

	<h3> Congestion across Boston Region Arterial Routes </h3>
	<p> Click on individual routes to explore the degree that congestion slows travel on the Boston Region’s many arterials.  </p>
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