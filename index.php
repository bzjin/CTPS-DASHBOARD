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
        <li><a href="pages/crashes/index.php">Crashes</a></li>
		<li><a href="pages/pavement/index.php">Pavement</a></li>
		<li><a href="pages/bridges/index.php">Bridges</a></li>
		<li><a href="pages/congestion/index.php">Congestion</a></li>
		<li><a href="pages/rapid_transit/index.php">Bus Routes</a></li>
		<li><a href="pages/sidewalks/index.php">Sidewalks</a></li>
		<li><a href="#">Air Quality</a></li>
		<li><a href="#">Inequity</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
      </div> <!-- /.container-fluid -->
</nav>

<!-- Desktop nav --> 
<div class="col-md-3 col-md-offset-9">
	<div class="navi right">
		<button><a href="pages/crashes/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Crashes</a> <p><b>760/53</b><br>Injuries/Deaths<br>  </button>
		<button><a href="pages/pavement/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Pavement</a><p><b class="good">78%</b><br>in good condition</p></button>
		<button><a href="pages/congestion/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Congestion </a><p><b>12 sec.</b> <br>average delay per mile</p></button>
		<button><a href="pages/bridges/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Bridges</a><p><b class="good">88%</b><br>in good condition</p></button>
		<button><a href="pages/rapid_transit/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Bus Routes</a><p><b>78</b> <br>average seconds late</p></button>
		<button><a href="pages/sidewalks/index.php"><i class="fa fa-circle-o" aria-hidden="true"></i> Sidewalks</a><p><b class="good">A LOT</b><br>more sidewalks</p></button>
		<button><a href="#"><i class="fa fa-circle-o" aria-hidden="true"></i> Air Quality </a><p class="unavailable"><b>N/A</b></br>Data coming soon!</p></button>
		<button><a href="#"><i class="fa fa-circle-o" aria-hidden="true"></i> Equity </a><p class="unavailable"><b>N/A</b><br>Data coming soon!</p></button>
		
	</div>
</div>

<script src="js/map.js"></script>


<div class="footer col-md-6">
	<?php include 'components/footer.php';?>
</div>



</body>
</html>