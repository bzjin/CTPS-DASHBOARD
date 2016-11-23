<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Non-Interstate Pavement</title>
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
<link href="../../libs/google-fonts.css" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>
<link rel="stylesheet" href="../../libs/bootstrap.min.css">
<!-- Leaflet --> 
 <link rel="stylesheet" href="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
 <script src="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>


<style> #mapid { height: 800px; } </style>

</head>

<body>

<?php include '../../components/responsive-nav.php';?>
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	<?php include '../../components/responsive-nav.php';?>

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
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</html>