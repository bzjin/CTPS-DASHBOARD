<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Rapid Transit in the Boston MPO Region</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="../../libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v4.min.js"></script>
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

.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd;} 
text {fill: #ddd; font-size: 1.0em;} .radar-chart .area {
  fill-opacity: 0.7;
}

</style> 
</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">
	<?php include '../../components/responsive-nav.php';?>
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div>
	<div class="col-md-12">
		<h1>Bus Routes</h1>
	</div>

	<div class="col-md-12">
		<h3>How early/late are our busses? </h3>
		<p> The visualization below shows the average bus arrival times in May 2016.</p>
		<!--<div class="col-md-3" id="mapRoute1"></div>-->
		<div class="col-md-12" id="busses"></div>
		<h3>How long does it take to get from stop to stop? </h3>
		<p> The visualization below shows how much more or less time than the scheduled running time it takes for the Route 1 bus to travel from stop to stop. Actual running time is calculated from the average of each run throughout May 2016. </p>
		<div class="col-md-6" id="inboundStops">Inbound (Holyoke to Dudley)</div>
		<div class="col-md-6" id="outboundStops">Outbound (Dudley to Holyoke)</div>
	</div>
<!--
	<div class="col-md-12">
		<h3> MBTA Boarding loads </h3>
		<p> Down with the Big Dig!!! </p>
		<div class="col-md-6" id="mapMBTA"></div>
		<div class="col-md-6" id="graphMBTA"></div>
	</div>-->

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>