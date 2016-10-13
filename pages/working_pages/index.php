<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Working Pages</title>
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
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>


<link rel="stylesheet" href="../../libs/bootstrap.min.css">
<style> 

.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 1.0em;} 

</style> 
</head>

<body>

<?php include '../../components/responsive-nav.php';?>
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	

	<h1>Working Pages</h1>
	<p> The following pages are undergoing content and web development. They will not be published on the first iteration of the Boston MPO dashboard. </p>

	<ul> 
	<li> <a href="funding/index.php">Funding</a>: Most functionality finished, unpublished probably for political reasons</li>
	<li> <a href="rapid_transit/index.php">Rapid Transit</a>: Undergoing design revamp, unpublished also probably for political reasons</li>
	<li> <a href="connectedness/index.php">Travel Flow</a>: Needs some serious Sankey help. </li>
	<li> <a href="traffic/index.php">Traffic</a>: Just a lot of traffic lights</li>
	<li> <a href="noninterstates_leaflet/index.php">A Leaflet Exercise</a>: Exploring new worlds ~~~</li>
	</ul>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>