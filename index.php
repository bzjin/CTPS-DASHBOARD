<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The State of Boston Region Transportation</title>
<!-- Font Awesome -->
<script src="https://use.fontawesome.com/3b0ffee8ad.js"></script>
<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip -->
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:400,700" rel="stylesheet">
<!-- TopoJSON -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Bootstrap-->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<!-- CSS Custom Styling -->
<link rel="stylesheet" href="css/style.css"/>
</head>

<body>
<div id="map"></div>

<div id="header" class="col-md-4">
	<h3>The State of</h3>
	<h1>Boston </h1>
	<h1>Region</h1>
	<h2>Transportation</h2>
</div>

<nav class="navbar navbar-custom">
	<div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> 
			<span class="sr-only">Toggle navigation</span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
		</button>
	</div>
<!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li><a href="pages/crashes/index.php" title="Go to crashes page">Crashes</a></li>
		<li><a href="pages/pavement/index.php" title="Go to pavement condition page">Pavement</a></li>
		<li><a href="pages/bridges/index.php" title="Go to bridge condition page">Bridges</a></li>
		<li><a href="pages/congestion/index.php" title="Go to congestion page">Congestion</a></li>
		<li><a href="pages/sidewalks/index.php" title="Go to sidewalk coverage page">Sidewalks</a></li>
		<li><a href="pages/bike_facilities/index.php" title="Go to bike facilities page">Bike Facilities</a></li>
		<li><a href="pages/funding/index.php" title="Go to funding page">Funding</a></li>
		<li><a href="pages/demographics/index.php" title="Go to demographics page">Demographics</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
      </div> <!-- /.container-fluid -->
</nav>

<!-- Desktop nav --> 
<div class="col-md-5 desktop-nav">
	<div class="col-md-5 col-md-offset-1">
	<a href="pages/crashes/index.php" title="Go to crashes page" id="crashes">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Crashes </a> 
		<p> <b>1470/36</b> <br> non-motorized injuries/deaths<br>
			<b>14888/68</b> <br> motorized injuries/deaths</p>
	<a href="pages/pavement/index.php" title="Go to pavement condition page" id="pavement">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Pavement</a>
		<p> <b class="good">94%</b><br>interstates in good condition<br>
			<b class="good">78%</b><br>non-interstates in good condition</p>
	<a href="pages/congestion/index.php" title="Go to congestion page" id="congestion">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Congestion </a>
		<p> <b class="good">0.78</b> <br>express highways avg. speed index<br>
			<b>0.72</b> <br>arterial routes avg. speed index</p>
	<a href="pages/bridges/index.php" title="Go to bridges page" id="bridges">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Bridges</a>
		<p> <b class="good">91.5%</b><br>not structurally deficient<br>
			 <b>-0.2%</b> <br>since 2015</p>
	</div>

	<div class="col-md-5">
	<a href="pages/sidewalks/index.php" title="Go to sidewalks page" id="sidewalks">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Sidewalks</a>
		<p><b class="good">42.7%</b><br>centerline miles paved with sidewalk on at least one side</p>
	<a href="pages/bike_facilities/index.php" title="Go to bike facilities page" id="bikes">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Bike Facilities </a>
		<p><b>2.88%</b></br>centerline miles with on-road bike facilities<br>
			<b>34.8 feet</b></br>off-road bike facilities for every centerline mile</p>
	<a href="pages/funding/index.php" title="Go to funding page" id="funding">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Funding </a>
		<p><b class="good">$785M</b><br>TIP funding 2014-2021<br>
			<b class="good">+$421M</b> <br>since 2008-2013</p>
	<a href="pages/demographics/index.php" title="Go to demographics page" id="demographics">
		<i class="fa fa-circle-o" aria-hidden="true"></i> Demographics </a>
		<p><b class="good">27.8%</b><br>minority population<br>
		<b>6.8%</b><br>unemployment rate<br>
		<b class="good">1.49</b><br>avg. vehicles per household<br>
		<b class="good">$70,829</b><br>median household income<br></p>
	</div>
</div>
<div class="footer col-md-6">
	<?php include 'components/footer.php';?>
</div>
</body>
<script src="js/map.js"></script>
</html>