<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The State of Boston Region Transportation</title>

<!-- Font Awesome -->
<script src="libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="libs/d3.v4.min.js"></script>

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

'<nav class="navbar navbar-default">
  <div class="container-fluid">

  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
      <ul class="nav navbar-nav">

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Crashes <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="pages/crashes/index.php">Non-Motorized Crashes</a></li>
            <li><a href="pages/crashes/index2.php">Motorized Crashes</a></li>
          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Pavement <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="pages/pavement/index.php">Interstate Pavement</a></li>
            <li><a href="pages/pavement/index2.php">Non-Interstate Pavement</a></li>
          </ul>
        </li>

		<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Congestion <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="pages/congestion/index.php">Expressway Congestion</a></li>
            <li><a href="pages/congestion/index2.php">Arterial Congestion</a></li>
          </ul>
        </li>

        <li><a href="pages/bridges/index.php">Bridges</a></li>
        <li><a href="pages/sidewalks/index.php">Sidewalks</a></li>
        <li><a href="pages/bike_facilities/index.php">Bike Facilities</a></li>
		<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Demographics <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="pages/demographics/index.php">Population Statistics</a></li>
            <li><a href="pages/demographics/index2.php">Household Statistics</a></li>
          </ul>
        </li>        
        <li><a href="pages/about/index.php">About</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
  </div>
</nav>

<div id="header" class="col-md-4">
	<h3>The State of</h3>
	<h1>Boston </h1>
	<h1>Region</h1>
	<h2>Transportation</h2>
</div>

<!-- Desktop nav --> 
<div class="col-md-5 desktop-nav">
	<div class="col-md-11">
		<div class="page_link"><a href="pages/crashes/index.php" title="Go to crashes page" id="crashes">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Crashes </div>
			<div class="col-md-6">
				<p> Non-motorized injuries/deaths<br><b>1470/36</b></p></div>
			<div class="col-md-6">
				<p> Motorized injuries/deaths <br><b>14888/68</b></p></div></a>
		</div>
		<div class="page_link"><a href="pages/pavement/index.php" title="Go to pavement condition page" id="pavement">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Pavement</div>
			<div class="col-md-6">
				<p>Interstates in good condition</p>
				<p class="meter"> <span style="width: 94%"></span></p></div>
			<div class="col-md-6">
				<p>Non-interstates in good condition</p>
				<p class="meter"> <span style="width: 78%"></span></p></div></a>
		</div>
		<div class="page_link"><a href="pages/congestion/index.php" title="Go to congestion page" id="congestion">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Congestion </div>
			<div class="col-md-6">				
				<p>Congested express highways</p>
				<p class="meter"> <span style="width: 78%"></span></p></div>
			<div class="col-md-6">
				<p>Congested arterial routes</p>
				<p class="meter"> <span style="width: 72%"></span></p></div></a>		
		</div>

		<div class="page_link"><a href="pages/bridges/index.php" title="Go to bridges page" id="bridges">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Bridges</div>
			<div class="col-md-6">
				<p> Bridges not structurally deficient</p><p class="meter"> <span style="width: 91.5%"></span></p></div>
			<div class="col-md-6">
				<p>Change since 2015<br><b>-0.2%</b></p></div></a>
		</div>

		<div class="page_link"><a href="pages/demographics/index.php" title="Go to demographics page" id="demographics">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Demographics </div>
			<div class="col-md-6">
				<p><b class="demo">27.8%</b> minority population<br>
				<b class="demo">$70,829</b> median household income<br></p></div>
			<div class="col-md-6">
				<p><b class="demo">1.49</b> average vehicles per household<br>
				<b class="demo">6.8%</b> unemployment rate</p></div></a>
		</div>

		<div class="page_link"><a href="pages/sidewalks/index.php" title="Go to sidewalks page" id="sidewalks">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Sidewalks</div>
			<div class="col-md-6">
				<p>Centerline miles paved on either side with sidewalk</p>
				<p class="meter"> <span style="width: 42.7%"></span></p></div>
			<div class="col-md-6">
				<p>Sidewalk for every centerline mile<br>
				<b>3694 feet</b></p></div></a>
		</div>
		<div class="page_link"><a href="pages/bike_facilities/index.php" title="Go to bike facilities page" id="bikes">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-circle-o" aria-hidden="true"></i> Bike Facilities</div>
			<div class="col-md-6">
				<p>Centerline miles with on-road bike facilities</p>
				<p class="meter"> <span style="width: 2.88%"></span></p></div>
			<div class="col-md-6">
				<p>Off-road bike facilities for every centerline mile<br>
				<b>34.8 feet</b></p></div> </a>
		</div>
		
		<div class="page_link"><a href="pages/about/index.php" title="Go to about page" id="about">
			<div class="col-md-12 nav_metric">
				<i class="fa fa-info-circle" aria-hidden="true"></i> About
				<p>Purpose, data sources, data development methodology</p>
			</div></a>
		</div>
	</div>
</div>
<div class="footer">
	<?php include 'components/footer.php';?>
</div>
</body>
<script src="js/map.js"></script>
</html>