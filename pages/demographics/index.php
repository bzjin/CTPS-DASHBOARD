<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Demographics in the Boston MPO Region</title>
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
.axis line { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
.yaxis line { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
text {fill: #ddd; font-size: 1.0em;} 
.tick line { stroke-dasharray: 2, 5; }
.axis path, .yaxis path { opacity: 0;} 
}
</style> 
</head>

<body>

<div class="top-nav col-md-12">
<?php include '../../components/top-nav.php';?>
</div> 

<div id="header" class="col-md-10 col-md-offset-1">

<h1>Demographics</h1>
<div class="accessible" id="accessibleTable">
	<p> The following information is readable only to screen readers: Data for demographics is available on the CTPS Data 
	Catalogue. You can download the spreadsheet after following this link: <a href="http://www.ctps.org/datacatalog_share/content/boston-region-mpo-2010-census-demographic-profile"> Demographics Spreadsheet </a> </p>
</div>

<h3> A Closer Look at the Boston Population </h3>
	<button class='allMetrics2 bigbutton col-md-4 I-93'> All </button>
	<button class='minority_pop bigbutton col-md-4 I-93' autofocus> Minority </button>
	<button class='employed bigbutton col-md-4 I-93'> Unemployment </button>
	<button class='lepPop bigbutton col-md-4 I-95'> Limited English Proficiency </button>
	<button class='over75 bigbutton col-md-4 I290'> Over Age 75 </button>
	<button class='disabled bigbutton col-md-4 I290'> With Disability </button>

	<div class="col-md-12">
	<div class="col-md-5" id="map4"></div>
	<div class="col-md-7" id="chartDemographics2"></div>
	</div>

<h3> A Closer Look at Boston Households </h3>

	<button class='allMetrics bigbutton col-md-3' autofocus> All Households </button>
	<button class='lowIncome bigbutton col-md-3 I-93'> Low Income </button>
	<button class='singleFemale bigbutton col-md-3 I-95'> Single Female Headed </button>
	<button class='zeroVehicle bigbutton col-md-3 I290'> Zero Vehicle </button>

	<div class="col-md-12">
	<div class="col-md-5" id="map3"></div>
	<div class="col-md-7" id="chartDemographics"></div>
	</div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>