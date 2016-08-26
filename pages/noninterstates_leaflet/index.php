<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Non-Interstate Pavement</title>
<link rel="stylesheet" href="app.css"/>
<link rel="stylesheet" href="../../css/master.css"/>


<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v4.min.js"></script>

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
<!-- Leaflet --> 
 <link rel="stylesheet" href="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
 <script src="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>


<style> #mapid { height: 800px; } </style>

</head>

<body>

<div id="header" class="col-md-10 col-md-offset-1">

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div>

	<h1>Non-Interstates</h1>

	<p>Freshly paved roads feel great under any set of wheels: automobile, motorcycle, bus, bicycle, scooter, or skateboard. Unfortunately, our roads steadily deteriorate with time, use, and New England weather. The MPO invests in regular roadway maintenance to extend pavement life, keeping rides smooth and users safe while saving public tax dollars. 
		We measure pavement condition using the Present Serviceability Index (PSI), a measure of an road segment’s roughness, including patch work, rutting, and cracking. PSI scores range from 0 (impassable) to 5 (perfectly smooth). Engineers consider a score of 2 or 3 as the minimum acceptable PSI. 
	</p>

	<div id="mapid"></div>

	<div class="footer">
		<?php include '../../components/footer.php';?>
	</div>

</div>


</body>
<script src="app.js"></script>

</html>