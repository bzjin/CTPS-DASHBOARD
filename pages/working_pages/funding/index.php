<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Funding in the Boston MPO Region</title>
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
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Raleway:400,700" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>


<link rel="stylesheet" href="../../libs/bootstrap.min.css">
<style> 
.axis line, .axis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} .yaxis line, .yaxis path { fill: none; stroke-width: 1; stroke: #ddd; opacity: .1;} 
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

<h1>Funding</h1>
<p> Each year, approximately 150 potential transportation infrastructure projects totaling more than one billion dollars are submitted to the Boston Region MPO for possible funding in the MPO’s rolling, five-year capital funding document. Intersection improvements, Complete Streets redesigns, bicycle and pedestrian connections, highway reconstruction, and transit maintenance and expansion projects all are eligible. The MPO selects which transportation infrastructure projects and strategies to fund during the next five years and publishes them in a Transportation Improvement Plan (TIP). 
</p><p>The MPO strives to facilitate fair and effective decisions through technical analysis, collaborative planning, and community engagement. Constantly evaluating its processes, the MPO keeps close tabs on how it has allocated funding over time and strives to ensure equitable distribution across the region’s population. We pay special attention to those communities have historically received a smaller share of our transportation system’s benefits and those that have fewest transportation options. 
</p>

<h3> Funding Received Over Time</h3>
<p> Census data from 2010 </p>

<div class="col-md-4" id="map"></div>
<div class="col-md-8" id="chartMinority"></div>
<div class="col-md-8" id="chartIncome"></div>
<div class="col-md-8" id="chartLEP"></div>
<div class="col-md-8" id="chartFemale"></div>
<div class="col-md-8" id="tipFunding"></div>

<div class = "col-md-12">
<h3> How much funding is available per capita in each municipality? </h3>
<p> Hover over the map below to explore which cities and towns have received TIP funding for transportation projects between 2008 and 2021. The bar charts on the right present demographic information of the municipalities, relating to their population's ability to access transportation.
</p>
</div>

<div class="col-md-4" id="map2"></div>
<div class="col-md-8" id="perPerson"></div>

	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>