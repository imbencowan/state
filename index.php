<?php	
////////////////////////////////////// WHAT THIS PAGE DOES /////////////////////////////////////////////
// this page acts as the display for views provided by the controller. javascript events make fetch calls 
// to controller.php, which controls appropriate views being inserted in to the "display". it does not, 
// and should not, do any thing else. it does include initial controls to handle user actions
////////////////////////////////////////////////////////////////////////////////////////////////////////
?>

<?php require 'controller.php'; ?>

<!DOCTYPE html>
<html>
<head>
	<title>State</title>
	<link rel="stylesheet" href="everycss.css">
	<link rel="stylesheet" href="styles.css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script type="module" src="main.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
	<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.mini.min.js"></script>
</head>
<body>
	<main>
	<header id="pageHeader">
		<h1 id="pageHeaderText">State Stuff</h1>
		<div id="pageHeaderRight">
			<?php
				include 'view/yearDiv.php';
				include 'view/addOrdersDiv.php';
			?>
		</div>
	</header>
	<nav id="stateNav"><ul id="stateNavList">
		<!-- nav list built in js to attach click listeners -->

	</ul></nav>
	<nav id="nav2"><ul id="nav2List">
			<!-- nav list built in js to attach click listeners -->
	</ul></nav>
	<section id="display">
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