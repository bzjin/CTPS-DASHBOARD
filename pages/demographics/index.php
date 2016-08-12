<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Funding in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip -->
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- TopoJSON -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Bootstrap-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<script src="https://rawgit.com/tpreusse/radar-chart-d3/master/src/radar-chart.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<style> 
.axis line { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
.yaxis line { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 14px;} 
.tick line { stroke-dasharray: 2, 5; }
.axis path, .yaxis path { opacity: 0;} 
}
</style> 
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div>

<h1>Demographics</h1>

<h3> A Closer Look at Boston Households </h3>

	<!-- <button class='allMetrics bigbutton col-md-2' autofocus> All Households </button> -->
	<button class='minority bigbutton col-md-3 I-90' autofocus> Minority </button>
	<button class='lowIncome bigbutton col-md-3 I-93'> Low Income </button>
	<button class='singleFemale bigbutton col-md-3 I-95'> Single Female Headed </button>
	<button class='zeroVehicle bigbutton col-md-3 I290'> Zero Vehicle </button>

	<div class="col-md-5" id="map3"></div>

	<div class="col-md-7" id="chartDemographics"></div>

<h3> A Closer Look at the Boston Population </h3>

	<button class='employed bigbutton col-md-3 I-93'> Unemployment </button>
	<button class='lepPop bigbutton col-md-3 I-95'> Limited English Proficiency </button>
	<button class='over65 bigbutton col-md-3 I290'> Over Age 65 </button>

	<div class="col-md-5" id="map4"></div>

	<div class="col-md-7" id="chartDemographics2"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>

</body>
</html>