<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Non-Interstate Pavement in the Boston MPO Region</title>

<link rel="stylesheet" href="../../css/master.css"/>
<link rel="stylesheet" href="app.css"/>
<!-- Font Awesome -->
<script src="../../libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="../../libs/d3.v4.min.js"></script>
<!-- Tooltip -->
<script src="../../libs/d3-tip.js"></script>
<!-- Google Fonts -->
<link href="../../libs/google-fonts.css" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>
<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>
<link rel="stylesheet" href="../../libs/bootstrap.min.css">

<style> text {fill: #ddd;} .axis path, .axis line, .yaxis path, .yaxis line {fill: none; stroke-width: 0.5; stroke: #ddd; opacity: .1; } </style>

</head>

<body>
	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">

	<div class="accessible" id="accessibleTable">
		<p> The following table is readable only to screen readers. </p>
	</div>
	
		

	<h1>Pavement Condition</h1>

	<p>Freshly paved roads feel great under any set of wheels: automobile, motorcycle, bus, bicycle, scooter, or skateboard. Unfortunately, our roads steadily deteriorate with time, use, and New England weather. Investments are made in roadway maintenance to extend pavement life, keeping rides smooth and users safe. Pavement condition is measured using the Present Serviceability Index (PSI), a measure of a road segment’s roughness, including patch work, rutting, and cracking. PSI scores range from 0 (impassable) to 5 (perfectly smooth). Engineers consider a score of 2 or 3 as the minimum acceptable PSI. 
	</p>

	<h2> Non-Interstate Pavement </h2>

	<h3>Pavement Conditions in 2014</h3>
	<p> Scroll down to compare pavement conditions between municipalities. The first column presents the overall distribution of pavement segments by their PSI score, with the average value highlighted. The second and third columns display the percent of pavement and the total lane miles of pavement with acceptable PSI scores, respectively.</p>

		<button class="bigbutton col-md-5" id="alphabetize" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button>
		<button class="bigbutton col-md-5" id="byAverages" alt="Sort towns by ascending average PSI">Sort by Average PSI</button>

	<div id="citygradients" class="col-md-12"></div>

	<h3> Trends Over Time </h3>
	<p> Select a city or town from the map to see how the pavement conditions within the municipality have changed over time. Each line charts the PSI value of a segment of a non-interstate road over the past decade.</p>
	
	<div class="col-md-12">
	<button class='ALL townpicker' autofocus><i class="fa fa-map-marker" aria-hidden="true"></i> All</button>
	<button class='ACTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Acton</button>
	<button class='ARLINGTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Arlington</button>
	<button class='ASHLAND townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Ashland</button>
	<button class='BEDFORD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Bedford</button>
	<button class='BELLINGHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Bellingham</button>
	<button class='BELMONT townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Belmont</button>
	<button class='BEVERLY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Beverly</button>
	<button class='BOLTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Bolton</button>
	<button class='BOSTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Boston</button>
	<button class='BOXBOROUGH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Boxborough</button>
	<button class='BRAINTREE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Braintree</button>
	<button class='BROOKLINE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Brookline</button>
	<button class='BURLINGTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Burlington</button>
	<button class='CAMBRIDGE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Cambridge</button>
	<button class='CANTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Canton</button>
	<button class='CARLISLE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Carlisle</button>
	<button class='CHELSEA townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Chelsea</button>
	<button class='COHASSET townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Cohasset</button>
	<button class='CONCORD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Concord</button>
	<button class='DANVERS townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Danvers</button>
	<button class='DEDHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Dedham</button>
	<button class='DOVER townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Dover</button>
	<button class='DUXBURY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Duxbury</button>
	<button class='ESSEX townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Essex</button>
	<button class='EVERETT townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Everett</button>
	<button class='FOXBOROUGH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Foxborough</button>
	<button class='FRAMINGHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Framingham</button>
	<button class='FRANKLIN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Franklin</button>
	<button class='GLOUCESTER townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Gloucester</button>
	<button class='HAMILTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hamilton</button>
	<button class='HANOVER townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hanover</button>
	<button class='HINGHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hingham</button>
	<button class='HOLBROOK townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Holbrook</button>
	<button class='HOLLISTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Holliston</button>
	<button class='HOPKINTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hopkinton</button>
	<button class='HUDSON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hudson</button>
	<button class='HULL townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Hull</button>
	<button class='IPSWICH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Ipswich</button>
	<button class='LEXINGTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Lexington</button>
	<button class='LINCOLN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Lincoln</button>
	<button class='LITTLETON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Littleton</button>
	<button class='LYNN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Lynn</button>
	<button class='LYNNFIELD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Lynnfield</button>
	<button class='MALDEN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Malden</button>
	<button class='MANCHESTER townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Manchester</button>
	<button class='MARBLEHEAD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Marblehead</button>
	<button class='MARLBOROUGH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Marlborough</button>
	<button class='MARSHFIELD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Marshfield</button>
	<button class='MAYNARD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Maynard</button>
	<button class='MEDFIELD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Medfield</button>
	<button class='MEDFORD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Medford</button>
	<button class='MEDWAY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Medway</button>
	<button class='MELROSE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Melrose</button>
	<button class='MIDDLETON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Middleton</button>
	<button class='MILFORD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Milford</button>
	<button class='MILLIS townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Millis</button>
	<button class='MILTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Milton</button>
	<button class='NAHANT townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Nahant</button>
	<button class='NATICK townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Natick</button>
	<button class='NEEDHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Needham</button>
	<button class='NEWTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Newton</button>
	<button class='NORFOLK townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Norfolk</button>
	<button class='NORTHREADING townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> N. Reading</button>
	<button class='NORWELL townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Norwell</button>
	<button class='NORWOOD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Norwood</button>
	<button class='PEABODY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Peabody</button>
	<button class='PEMBROKE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Pembroke</button>
	<button class='QUINCY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Quincy</button>
	<button class='RANDOLPH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Randolph</button>
	<button class='READING townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Reading</button>
	<button class='REVERE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Revere</button>
	<button class='ROCKLAND townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Rockland</button>
	<button class='ROCKPORT townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Rockport</button>
	<button class='SALEM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Salem</button>
	<button class='SAUGUS townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Saugus</button>
	<button class='SCITUATE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Scituate</button>
	<button class='SHARON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Sharon</button>
	<button class='SHERBORN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Sherborn</button>
	<button class='SOMERVILLE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Somerville</button>
	<button class='SOUTHBOROUGH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Southborough</button>
	<button class='STONEHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Stoneham</button>
	<button class='STOUGHTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Stoughton</button>
	<button class='STOW townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Stow</button>
	<button class='SUDBURY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Sudbury</button>
	<button class='SWAMPSCOTT townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Swampscott</button>
	<button class='TOPSFIELD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Topsfield</button>
	<button class='WAKEFIELD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wakefield</button>
	<button class='WALPOLE townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Walpole</button>
	<button class='WALTHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Waltham</button>
	<button class='WATERTOWN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Watertown</button>
	<button class='WAYLAND townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wayland</button>
	<button class='WELLESLEY townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wellesley</button>
	<button class='WENHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wenham</button>
	<button class='WESTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Weston</button>
	<button class='WESTWOOD townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Westwood</button>
	<button class='WEYMOUTH townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Weymouth</button>
	<button class='WILMINGTON townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wilmington</button>
	<button class='WINCHESTER townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Winchester</button>
	<button class='WINTHROP townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Winthrop</button>
	<button class='WOBURN townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Woburn</button>
	<button class='WRENTHAM townpicker'><i class="fa fa-map-marker" aria-hidden="true"></i> Wrentham</button>
	</div>

	<div id="timeline" class="col-md-12"></div> 

	

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>

<script src="app2.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>