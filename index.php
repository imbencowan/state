<?php	
////////////////////////////////////// WHAT THIS PAGE DOES /////////////////////////////////////////////
// this page acts as the display for the controller. javascript events make xhr calls to controller.php, 
// which controls appropriate views being inserted in to the "display". it does not, and should not, do 
// any thing else. it does start with a tiny amount of initial content displayed that will be overwritten
////////////////////////////////////////////////////////////////////////////////////////////////////////
?>

<?php require 'controller.php'; ?>

<!DOCTYPE html>
<html>
<head>
	<title>State</title>
	<link rel="stylesheet" href="../everycss.css">
	<link rel="stylesheet" href="styles.css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script src="scripts.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

</head>
<body onload="init()">
<main>
<header>State Stuff</header>
<nav id="stateNav"><ul id="stateNavList">
	<!-- nav list built in js to attach click listeners -->

</ul></nav>
<nav id="nav2"><ul id="nav2List">
		<!-- nav list built in js to attach click listeners -->
</ul></nav>
<section id="display">
<span class="material-icons">more_horiz</span>
<span class="material-icons">add</span>
<span class="material-icons">edit</span>
<span class="material-icons">check</span>
<span class="material-icons">print</span>
<span class="material-icons">preview</span>
<span class="material-icons">article</span>
<br />
<button onclick="testFetch()">Test DB</button>
<button onclick="testBoxLabelPDF()">Test Box Label</button>
<button onclick="testInvoicePDF()">Test Invoice</button>
		<?php
			include 'view/addOrdersDiv.php';
			include 'view/yearDiv.php';
		?>
	<div class="clear"></div>
</section>
<div id="myModal" class="modal">
	<div class="modal-content">
		<span class="close">&times;</span>
		<p id="modalText">This is the modal content!</p>
	</div>
</div>
</main>
</body>
</html>