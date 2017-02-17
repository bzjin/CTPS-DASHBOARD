<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Bridges in the Boston MPO Region</title>
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

<style> .axis line, .axis path { fill: none; stroke-width: 1px; stroke: #ddd; shape-rendering: crispEdges;} 
 text {fill: white;} .tick line, .tick path {stroke-width: 1px; opacity: .3;} .overlay { fill: none; pointer-events: all;}

</style> 
</head>

<body>

<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div> 
<div id="header" class="col-md-10 col-md-offset-1">
<h1>Bridge Condition</h1>
<p>The 2,866 bridges located in the Boston region connect places and carry people traveling by automobile, bus, train, bicycle, and foot. MassDOT and the MBTA monitor and classify the condition of all bridges on a regular basis, whether or not they are owned by the Commonwealth. The Boston Region MPO is required to monitor and report on the bridges in the region that are listed in the National Bridge Inventory (NBI), which includes records of all bridges that are more than 20 feet long. In 2016, there were 1,622 bridges located in the Boston region that were listed in the NBI; of those bridges, 164 (10%) were classified as structurally deficient, meaning that one or more major bridge component (deck, substructure, or superstructure) require attention.</p>

<p>For a full understanding of bridge conditions, consideration must be given to all bridge parts, not only the structurally deficient components. The Bridge Health Index (BHI), a weighted average of the health indices of a bridge’s elements (e.g. trusses, decks, bridge rails), provides a comprehensive overview of bridge conditions. The BHI is measured on a scale of zero to 100; a value of zero indicates that all of the bridge elements are in the worst condition, and a score of 85 or greater indicates that the bridge elements are in good condition. </p>

<h3>Trends</h3>
<p>Select a city or town from the list below to see how the health and structural integrity of the bridges located within its borders have changed over the past decade. The chart on the right shows the <b><em>number of structurally deficient and non-structurally deficient bridges</em></b> within each municipality’s borders. (Only bridges listed in the NBI are included.) The chart on the left shows the <b><em>percentage of structurally deficient bridge deck area</em></b>for bridges located on the National Highway System.</p>

<div class="col-md-12">
<button class='ALL townpicker' autofocus><i class="fa fa-map-marker" aria-hidden="true"></i> All </button>
<button class='ACTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Acton</button>
 <button class='ARLINGTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Arlington</button>
 <button class='ASHLAND townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Ashland</button>
 <button class='BEDFORD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Bedford</button>
 <button class='BELLINGHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Bellingham</button>
 <button class='BELMONT townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Belmont</button>
 <button class='BEVERLY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Beverly</button>
 <button class='BOLTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Bolton</button>
 <button class='BOSTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Boston</button>
 <button class='BOXBOROUGH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Boxborough</button>
 <button class='BRAINTREE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Braintree</button>
 <button class='BROOKLINE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Brookline</button>
 <button class='BURLINGTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Burlington</button>
 <button class='CAMBRIDGE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Cambridge</button>
 <button class='CANTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Canton</button>
 <button class='CHELSEA townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Chelsea</button>
 <button class='CONCORD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Concord</button>
 <button class='DANVERS townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Danvers</button>
 <button class='DEDHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Dedham</button>
 <button class='DUXBURY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Duxbury</button>
 <button class='EVERETT townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Everett</button>
 <button class='FOXBOROUGH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Foxborough</button>
 <button class='FRAMINGHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Framingham</button>
 <button class='FRANKLIN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Franklin</button>
 <button class='GLOUCESTER townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Gloucester</button>
 <button class='HANOVER townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Hanover</button>
 <button class='HINGHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Hingham</button>
 <button class='HOPKINTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Hopkinton</button>
 <button class='HUDSON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Hudson</button>
 <button class='IPSWICH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Ipswich</button>
 <button class='LEXINGTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Lexington</button>
 <button class='LINCOLN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Lincoln</button>
 <button class='LITTLETON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Littleton</button>
 <button class='LYNN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Lynn</button>
 <button class='LYNNFIELD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Lynnfield</button>
 <button class='MALDEN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Malden</button>
 <button class='MANCHESTER townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Manchester</button>
 <button class='MARLBOROUGH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Marlborough</button>
 <button class='MARSHFIELD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Marshfield</button>
 <button class='MAYNARD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Maynard</button>
 <button class='MEDFIELD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Medfield</button>
 <button class='MEDFORD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Medford</button>
 <button class='MIDDLETON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Middleton</button>
 <button class='MILFORD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Milford</button>
 <button class='MILTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Milton</button>
 <button class='NATICK townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Natick</button>
 <button class='NEEDHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Needham</button>
 <button class='NEWTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Newton</button>
 <button class='NORTH READING townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> North Reading</button>
 <button class='NORWELL townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Norwell</button>
 <button class='NORWOOD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Norwood</button>
 <button class='PEABODY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Peabody</button>
 <button class='PEMBROKE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Pembroke</button>
 <button class='QUINCY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Quincy</button>
 <button class='RANDOLPH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Randolph</button>
 <button class='READING townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Reading</button>
 <button class='REVERE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Revere</button>
 <button class='ROCKLAND townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Rockland</button>
 <button class='SALEM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Salem</button>
 <button class='SAUGUS townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Saugus</button>
 <button class='SHARON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Sharon</button>
 <button class='SOMERVILLE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Somerville</button>
 <button class='SOUTHBOROUGH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Southborough</button>
 <button class='STONEHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Stoneham</button>
 <button class='STOUGHTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Stoughton</button>
 <button class='STOW townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Stow</button>
 <button class='SUDBURY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Sudbury</button>
 <button class='TOPSFIELD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Topsfield</button>
 <button class='WAKEFIELD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Wakefield</button>
 <button class='WALPOLE townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Walpole</button>
 <button class='WALTHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Waltham</button>
 <button class='WATERTOWN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Watertown</button>
 <button class='WAYLAND townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Wayland</button>
 <button class='WELLESLEY townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Wellesley</button>
 <button class='WESTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Weston</button>
 <button class='WESTWOOD townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Westwood</button>
 <button class='WEYMOUTH townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Weymouth</button>
 <button class='WILMINGTON townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Wilmington</button>
 <button class='WINCHESTER townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Winchester</button>
 <button class='WOBURN townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Woburn</button>
 <button class='WRENTHAM townpicker'><i class='fa fa-map-marker' aria-hidden='true'></i> Wrentham</button>
</div>
<!--<div id="timeline" class="col-md-5"></div>
<div id="timeline2" class="col-md-7"></div>-->
<div id="deck_timeline" class="col-md-5 col-sm-12"></div>
<div id="timeline2_area" class="col-md-7 col-sm-12"></div>

<!--<div id="chart" class="col-md-12"></div>-->
<div class="footer col-md-12">
	<?php include '../../components/footer.php';?>
</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>