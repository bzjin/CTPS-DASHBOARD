<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Motorized Crashes in the Boston MPO Region</title>
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

	<h1>Crashes</h1>

	<h3 class="inner-nav col-md-12"><a href="index.php" alt="Go to motorized crashes"><i class="fa fa-circle-o" aria-hidden="true"></i>
	Non-Motorized Crashes</a><a href="#" alt="Go to non-motorized crashes"><i class="fa fa-dot-circle-o" aria-hidden="true"></i>Motorized Crashes</a></h3>	
	
	<p>The ability to move is crucial to every aspect of our existence. And yet, people face substantial risk getting from place to place in the Boston region. Roads claimed the lives of 53 people in the Boston region last year. 
	We are human and make mistakes. For this reason, we must design transportation that keeps us moving and protects us at every turn. In situations where a person might fail, the road system should not. 
	The MPO aims to keep you safe everywhere and every way that you move. For this reason, we track injuries and fatalities from crashes throughout the region.
	</p>

	<h2> Injuries to People Driving </h2> 
	<h3>Trends Over Time</h3>
		<p> Click on each city or town to see its injury counts over time. </p> 

		<div id="map" class="col-md-5"></div>
		<div id="chart" class="col-md-7 key"></div>

	<h3>One Year of Crashes</h3>
	<p> Boston Region saw <b>14888</b> total vehicle crash injuries in 2013. Each dot represents one crash. <b>68</b> solid, filled dots represent fatalities.</p>
		<div class="col-md-12 key">
			<p><i class="fa fa-circle-o bicycle" aria-hidden="true"></i>  Vehicle Injuries
			<i class="fa fa-circle bicycle" aria-hidden="true"></i> Vehicle Fatalities </p>
		</div>

	<div class="col-md-12" id="plot"></div>

	<h3>Truck Crashes</h3>
	<p> Truck crash description. Why do we count trucks specifically? </p>
	<div class="col-md-12" id="trucks"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app2.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>
</body>
</html>