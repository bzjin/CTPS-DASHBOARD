<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

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
<p>From industry in the north down to the beaches in the south, from the picturesque rural farmlands in the west to the cultural hub of Boston in the east—the Boston region is a diverse place, its residents representing a wide range of ages, races, ethnicities, abilities, and languages. The Boston Region MPO has identified several demographics that inform MPO staff about the differing transportation needs of residents and that impact the MPO’s transportation decision-making process. 
</p>

<h3> A Closer Look at the Boston Population </h3>
<p>Click on the tab to show the percent of the demographic in each census tract.
</p>
	<div class="col-md-12">
	<button class='minority bigbutton col-md-4 I-93' autofocus> Minority </button>
	<button class='employed bigbutton col-md-4 I-93'> Unemployment </button>
	<button class='lep bigbutton col-md-4 I-95'> Limited English Proficiency </button>
	<button class='over75 bigbutton col-md-4 I290'> Over Age 75 </button>
	<button class='disabled bigbutton col-md-4 I290'> With Disability </button>

	<div class="col-md-12">
	<div class="col-md-5" id="map_pop"></div>
	<div class="col-md-7" id="demographics_pop"></div></div></div>

<h3> Races in the Boston Region </h3>
<p>The map and chart below show the percent of the population who are of each race in each census tract as identified by the U.S. Census Bureau, including those who are two or more races. They may be of Hispanic or non-Hispanic ethnicity. 
</p>
	<div class="col-md-12">
	<button class='white bigbutton col-md-3' autofocus> White </button>
	<button class='black bigbutton col-md-3'> Black or African American </button>
	<button class='native bigbutton col-md-3'> American Indian / Alaska native </button>
	<button class='asian bigbutton col-md-3'> Asian </button>
	<button class='pacific bigbutton col-md-3'> Native Hawaiian / Pacific islander </button>
	<button class='other bigbutton col-md-3'> Other race </button>
	<button class='multiple bigbutton col-md-3'> Two or more races </button></div>

	<div class="col-md-12">
	<div class="col-md-5" id="map_race"></div>
	<div class="col-md-7" id="demographics_race"></div></div>

<h3> Ethnicity in the Boston Region </h3>
<p>The map and chart below show the percent of the population who are of Hispanic ethnicity, regardless of race, in each census tract. Note that at the Boston Region MPO, the term “minority” includes all persons who are Hispanic (of any race) or non-White, as required by federal law. </p>
	<div class="col-md-12">
	<div class="col-md-5" id="map_hisp"></div>
	<div class="col-md-7" id="demographics_hisp"></div></div>

<h3> The Five Non-English Languages Most Commonly Spoken at Home </h3>
<p>Click on the tabs to show the percent of the five non-English languages most commonly spoken at home in each census tract. Limited English Proficiency (LEP) includes those residents 5 years or older who report speaking English “less than very well.”</p>
	<div class="col-md-12">
	<button class='spanish bigbutton col-md-2' autofocus> Spanish </button>
	<button class='chinese bigbutton col-md-2'> Chinese </button>
	<button class='portuguese bigbutton col-md-2'> Portuguese</button>
	<button class='french bigbutton col-md-2'> French </button>
	<button class='vietnamese bigbutton col-md-2'>Vietnamese </button></div>

	<div class="col-md-12">
	<div class="col-md-5" id="map_lep"></div>
	<div class="col-md-7" id="demographics_lep"></div></div>

<h3> Disabilities Breakdown </h3>
<p>Click on the tabs to show the percent of persons who have each disability in each census tract. Persons with disabilities include those residents who report having one or more physical or cognitive disability.</p>
	<div class="col-md-12">
	<button class='hearing bigbutton col-md-2' autofocus> Hearing Disability </button>
	<button class='vision bigbutton col-md-2'> Vision Disability </button>
	<button class='cognitive bigbutton col-md-2'> Cognitive Disability</button>
	<button class='ambulatory bigbutton col-md-2'> Ambulatory Disability </button>
	<button class='selfcare bigbutton col-md-2'>Self Care Disability</button>
	<button class='independent bigbutton col-md-2'>Independent Living Disability</button></div>

	<div class="col-md-12">
	<div class="col-md-5" id="map_disabilities"></div>
	<div class="col-md-7" id="demographics_disabilities"></div></div>

</div>

<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>