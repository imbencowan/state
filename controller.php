<?php

////////////////////////////////////// WHAT THIS PAGE DOES /////////////////////////////////////////////
// this controller takes in input, and selects what to send back to the "display" <section> in index.php
// this page displays no thing it's self, and every thing it generates is returned directly to "display"
// allowing index.php to display dynamically with out reloading the entire page.
// i don't know if this is a good or bad set up, but this is what it does
////////////////////////////////////////////////////////////////////////////////////////////////////////

		// magically loads required files
	require 'autoloader.php';
	
		// name the actions that can be called 
	$allowedActions = [
      'showSport', 'addOrders', 'changeOrderDone', 'updateAddOns', 'updateSizes'
   ];
	
		// set the time zone
	date_default_timezone_set('America/Boise');
	
	///////////////////////////////////////////////////////////
	// GET THE INPUT
	$input = json_decode(file_get_contents('php://input'), true);
	// if (empty($input)) $year = date("y");
	
	//////////////////////////////////////////////////////////
	// THE ACTUAL CONTROLLER	
		// if there is an $input and an $action, call the function named by $action, and pass $input
		// if there is no action, no thing should happen
	if (!empty($input)) {
		// Test::logX($input);
			// don't do it if they don't exist
		$action = isset($input['action']) ? $input['action'] : null;
		$class = isset($input['actionClass']) ? $input['actionClass'] : null;
		$data = isset($input['data']) ? $input['data'] : null;
		if (!empty($action)) {
			if (!empty($class) && method_exists($class, $action)) {
				call_user_func([$class, $action], $data);
			} elseif (in_array($action, $allowedActions)) {
				$action($input);
			} else {
				echo "Invalid action: $action";
			}
		}
	}
		// file was 370 lines before refactoring
	
	
	
	/////////////////////////////////////////////////////////////////////////////
	// action functions 
	
	function updateAddOns($input) {
		SchoolOrder::updateAddOns($input['schoolOrderID'], $input['sizes']);
		echo json_encode(['result' => 1]);
	}
	
	function updateSizes($input) {
		SchoolOrder::updateSizes($input['schoolOrderID'], $input['teamSizes'], $input['addOnSizes']);
		echo json_encode(['result' => 1]);
	}
?>