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

<div id="header" class="row container-fluid col-md-4">
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
        <li><a href="pages/crashes/index.php" alt="Go to crashes page">Crashes</a></li>
		<li><a href="pages/pavement/index.php" alt="Go to pavement condition page">Pavement</a></li>
		<li><a href="pages/bridges/index.php" alt="Go to bridge condition page">Bridges</a></li>
		<li><a href="pages/congestion/index.php" alt="Go to congestion page">Congestion</a></li>
		<li><a href="pages/sidewalks/index.php" alt="Go to sidewalk coverage page">Sidewalks</a></li>
		<li><a href="pages/bike_facilities/index.php" alt="Go to bike facilities page">Bike Facilities</a></li>
		<li><a href="pages/equity/index.php" alt="Go to equity page">Equity</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
      </div> <!-- /.container-fluid -->
</nav>

<!-- Desktop nav --> 
<div class="col-md-3 col-md-offset-9 desktop-nav">
	<a href="pages/crashes/index.php" alt="Go to crashes page"><i class="fa fa-circle-o" aria-hidden="true"></i> Crashes</a> <p><b>760/53</b><br>Injuries/Deaths<br></p>
	<a href="pages/pavement/index.php" alt="Go to pavement condition page"><i class="fa fa-circle-o" aria-hidden="true"></i> Pavement</a><p><b class="good">78%</b><br>in good condition</p>
	<a href="pages/congestion/index.php" alt="Go to congestion page"><i class="fa fa-circle-o" aria-hidden="true"></i> Congestion </a><p><b>12 sec.</b> <br>average delay per mile</p>
	<a href="pages/bridges/index.php" alt="Go to bridges page"><i class="fa fa-circle-o" aria-hidden="true"></i> Bridges</a><p><b class="good">88%</b><br>in good condition</p>
	<a href="pages/sidewalks/index.php" alt="Go to sidewalks page"><i class="fa fa-circle-o" aria-hidden="true"></i> Sidewalks</a><p><b class="good">A LOT</b><br>more sidewalks</p>
	<a href="pages/bike_facilities/index.php" alt="Go to bike facilities page"><i class="fa fa-circle-o" aria-hidden="true"></i> Bike Facilities </a><p><b>.45</b></br>bike lanes per centerline mile</p>
	<a href="pages/equity/index.php" alt="Go to equity page"><i class="fa fa-circle-o" aria-hidden="true"></i> Equity </a><p><b class="good">+$35m</b><br>TIP funding FFY 2017</p>
</div>

<script src="js/map.js"></script>


<div class="footer col-md-6">
	<?php include 'components/footer.php';?>
</div>



</body>
</html>