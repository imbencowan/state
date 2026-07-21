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
	<base href="/state/">
	<title>State</title>
	<link rel="stylesheet" href="everycss.css">
	<link rel="stylesheet" href="styles.css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script type="module" src="main.js?v=1"></script>
</head>
<body>
	<main>
	<header id="pageHeader">
		<h1 id="pageHeaderText">State Stuff</h1>
		<div id="pageHeaderRight">
			<div id="yearDiv">
				<label>View Year: </label>
				<select id="selectYear"></select>
			</div>
			<div id="addOrdersDiv">
				<label for="fileInput">Upload an order here</label><br />
				<input id="fileInput" type="file" accept=".txt" multiple>
			</div>
		</div>
	</header>
	<div id="navContainer">
		<nav id="stateNav"><ul id="stateNavList"><!-- nav list built in js to attach click listeners --></ul></nav>
		<nav id="nav2"><ul id="nav2List"><!-- nav list built in js to attach click listeners --></ul></nav>
	</div>
	<section id="display"></section>

	<div id="modal" class="modal">
		<div class="modal-window">
			<button class="close">&times;</button>
			<div class="modal-content">This is the modal content!</div>
		</div>
	</div>
	<div id="childModal" class="modal">
		<div class="modal-content">
			<span class="close">&times;</span>
			<p id="childModalContent">This is the modal content!</p>
		</div>
	</div>
	</main>



		<!-- load functional libraries // jspdf and sheetjs -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
	<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
</body>
</html>