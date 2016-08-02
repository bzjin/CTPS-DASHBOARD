<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Nonmotorized Crashes in the Boston MPO Region</title>
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
<link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Bootstrap-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
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

<div id="header" class="col-md-10 col-md-offset-1">
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>
	<div class="col-md-12">
	
	<h3 class="inner-nav col-md-12"><a href="#" alt="Go to non-motorized crashes"><i class="fa fa-dot-circle-o" aria-hidden="true"></i>
	Non-Motorized Crashes</a><a href="index2.php" alt="Go to motorized crashes"><i class="fa fa-circle-o" aria-hidden="true"></i>Motorized Crashes</a></h3>	
	<h1>Crashes</h1>

		<p>The ability to move is crucial to every aspect of our existence. And yet, people face substantial risk getting from place to place in the Boston region. Roads claimed the lives of 53 people in the Boston region last year. 
		We are human and make mistakes. For this reason, we must design transportation that keeps us moving and protects us at every turn. In situations where a person might fail, the road system should not. 
		The MPO aims to keep you safe everywhere and every way that you move. For this reason, we track injuries and fatalities from crashes throughout the region.
		</p>

	</div>

	<div class="col-md-12"> 
	<h3>Trends Over Time: Bicycle and Pedestrian Injuries</h3>
		<div id="map" class="col-md-4">
			<p> Click on the map below to see how the number of injuries incurred in each city or town has changed over a decade. </p> 
		</div>
		<div id="bikeChart" class="col-md-4 key"><h4>Bicycle Injuries</h4></div>
		<div id="pedChart" class = "col-md-4 key"><h4>Pedestrian Injuries</h4></div>
	</div>

	<div class="col-md-12" >
	<h3> A Closer Look: One Year of Crashes</h3>
	<p> Boston Region saw <b>576</b> total bicycle crash injuries and <b>892</b> pedestrian crash injuries in 2013. Each dot represents one crash. <b>36</b> faded dots represent fatalities.</p>
		<div class="col-md-12 key">
			<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Bicycle Injuries
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Bicycle Fatalities
			<i class="fa fa-circle-o pedes" aria-hidden="true"></i>  Pedestrian Injuries
			<i class="fa fa-circle pedes" aria-hidden="true"></i> Pedestrian Fatalities</p>
		</div>
	</div>

	<div class="col-md-12" id="plot"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
</body>
</html>