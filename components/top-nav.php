<?php echo
	'<ul>
		<li><i class="fa fa-home" aria-hidden="true"></i> <a href="../../index.php" alt="Go to home page">The State of Boston Region Transportation</a></li>
	</ul>
	 <ul id="nav_pages">
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../crashes/index.php" alt="Go to crashes page">Crashes</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../pavement/index.php" alt="Go to pavement page">Pavement</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../congestion/index.php" alt="Go to congestion page">Congestion</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../bridges/index.php" alt="Go to bridges page">Bridges</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../sidewalks/index.php" alt="Go to sidewalks page">Sidewalks</a></li>		
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../bike_facilities/index.php" alt="Go to bike_facilities page">Bike Facilities</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../demographics/index.php" alt="Go to demographics page">Demographics</a></li>
		<li><i class="fa fa-circle-o" aria-hidden="true"></i> <a href="../about/index.php" alt="Go to about page">About</a></li>

	</ul>

	<script>(function() {
    var nav = document.getElementById("nav_pages"),
        anchor = nav.getElementsByTagName("a"),
        current = window.location.pathname.split("pages/")[1];
        for (var i = 0; i < anchor.length; i++) {
        	var match = anchor[i].href.split("pages/")[1];
	        if(match == current) {
	            anchor[i].className = "active";
	        }
    	}
	})()</script>'
?>