<?php echo
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
      <a class="navbar-brand" href="../../index.php">The State of Boston Region Transportation</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
      <ul class="nav navbar-nav">

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Crashes <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="../crashes/index2.php">Motorized Crashes</a></li>
            <li><a href="../crashes/index.php">Non-Motorized Crashes</a></li>
          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Pavement <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="../pavement/index.php">Interstate Pavement</a></li>
            <li><a href="../pavement/index2.php">Non-Interstate Pavement</a></li>
          </ul>
        </li>

		<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Congestion <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="../congestion/index.php">Expressway Congestion</a></li>
            <li><a href="../congestion/index2.php">Arterial Congestion</a></li>
          </ul>
        </li>

        <li><a href="../bridges/index.php">Bridges</a></li>
        <li><a href="../sidewalks/index.php">Sidewalks</a></li>
        <li><a href="../bike_facilities/index.php">Bike Facilities</a></li>
		<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Demographics <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="../demographics/index.php">Population Statistics</a></li>
            <li><a href="../demographics/index2.php">Household Statistics</a></li>
          </ul>
        </li>        
        <li><a href="../about/index.php">About</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
  </div>
</nav>
'
?>