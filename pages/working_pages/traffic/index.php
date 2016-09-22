<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Traffic in the Boston MPO Region</title>
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
<link rel="stylesheet" href=libs/bootstrap.min.css>

<style> 
.axis line, .axis path { fill: none; stroke-width: 0; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 1.0em;} 
form {
  position: absolute;
  right: 10px;
  top: 10px;
}
.node {
  border: none;
  font: 10px sans-serif;
  line-height: 12px;
  overflow: hidden;
  position: absolute;
  text-indent: 2px;
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
		<h1>Traffic Signals</h1>
	</div>

	<div class="col-md-12">
		<h3> This is not a drill.</h3>
	</div>

	<div class="col-md-4" id="map"></div>
	<div class="col-md-8" id="chart"></div>
	

</div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>