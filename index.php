<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The State of Boston Region Transportation</title>

<!-- Font Awesome -->
<script src="libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="../../libs/d3.v4.min.js"></script>

<!-- Tooltip -->
<script src="libs/d3-tip.js"></script>
<!-- Google Fonts -->
<link href="libs/google-fonts.css" rel="stylesheet">
<!-- TopoJSON -->
<script src="libs/topojson.min.js"></script>

<!-- Jquery -->
<script src="libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="libs/bootstrap.min.js"></script>
<link rel="stylesheet" href="libs/bootstrap.min.css">
<!-- CSS Custom Styling -->
<link rel="stylesheet" href="css/style.css"/>

</head>

<body>
<div id="map"></div>

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
      	<li><a href="#">Home</a></li>
        <li><a href="pages/crashes/index.php" title="Go to crashes page">Crashes</a></li>
		<li><a href="pages/pavement/index.php" title="Go to pavement condition page">Pavement</a></li>
		<li><a href="pages/bridges/index.php" title="Go to bridge condition page">Bridges</a></li>
		<li><a href="pages/congestion/index.php" title="Go to congestion page">Congestion</a></li>
		<li><a href="pages/sidewalks/index.php" title="Go to sidewalk coverage page">Sidewalks</a></li>
		<li><a href="pages/bike_facilities/index.php" title="Go to bike facilities page">Bike Facilities</a></li>
		<li><a href="pages/demographics/index.php" title="Go to demographics page">Demographics</a></li>
		<li><a href="pages/about/index.php" title="Go to about page">About</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
      </div> <!-- /.container-fluid -->
</nav>

<div id="header" class="col-md-4">
	<h3>The State of</h3>
	<h1>Boston </h1>
	<h1>Region</h1>
	<h2>Transportation</h2>
</div>

<!-- Desktop nav --> 
<div class="col-md-5 desktop-nav">
	<div class="col-md-5 col-md-offset-1">
		<div class="page_link"><a href="pages/crashes/index.php" title="Go to crashes page" id="crashes">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Crashes </a> 
			<p> Non-motorized injuries/deaths<br><b>1470/36</b> <br> 
				Motorized injuries/deaths <br><b>14888/68</b> </p>
		</div>
		<div class="page_link"><a href="pages/pavement/index.php" title="Go to pavement condition page" id="pavement">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Pavement</a>
				<p>Interstates in good condition</p>
				<p class="meter"> <span style="width: 94%"></span></p>
				<p>Non-interstates in good condition</p>
				<p class="meter"> <span style="width: 78%"></span></p>
		</div>
		<div class="page_link"><a href="pages/congestion/index.php" title="Go to congestion page" id="congestion">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Congestion </a>
				<p>Congested express highways</p>
				<p class="meter"> <span style="width: 78%"></span></p>
				<p>Congested arterial routes</p>
				<p class="meter"> <span style="width: 72%"></span></p>			
		</div>
		<div class="page_link"><a href="pages/demographics/index.php" title="Go to demographics page" id="equity">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Demographics </a>
			<p><b class="demo">27.8%</b> minority population<br>
			<b class="demo">6.8%</b> unemployment rate<br>
			<b class="demo">1.49</b> average vehicles per household<br>
			<b class="demo">$70,829</b> median household income<br></p>
		</div>
	</div>

	<div class="col-md-5">
		<div class="page_link"><a href="pages/sidewalks/index.php" title="Go to sidewalks page" id="sidewalks">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Sidewalks</a>
			<p>Centerline miles paved on either side with sidewalk</p>
			<p class="meter"> <span style="width: 42.7%"></span></p>
			<p>Sidewalk for every centerline mile<br>
				<b>3694 feet</b></p>
		</div>
		<div class="page_link"><a href="pages/bike_facilities/index.php" title="Go to bike facilities page" id="bikes">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Bike Facilities </a>
			<p>Centerline miles with on-road bike facilities</p>
			<p class="meter"> <span style="width: 2.88%"></span></p>
			<p>Off-road bike facilities for every centerline mile<br>
			<b>34.8 feet</b></p>
		</div>
		<div class="page_link"><a href="pages/bridges/index.php" title="Go to bridges page" id="bridges">
			<i class="fa fa-circle-o" aria-hidden="true"></i> Bridges</a>
				<p> Bridges not structurally deficient</p>
				<p class="meter"> <span style="width: 91.5%"></span></p>
				<p>Change since 2015<br><b>-0.2%</b></p>
		</div>
		<div class="page_link"><a href="pages/about/index.php" title="Go to about page" id="about">
			<i class="fa fa-info-circle" aria-hidden="true"></i> About</a>
			<p>Purpose, data sources, data development methodology</p>
		</div>
	</div>
</div>
<div class="footer">
	<?php include 'components/footer.php';?>
</div>
</body>
<script src="js/map.js"></script>
</html>