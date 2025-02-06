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
      'showSport', 'addOrders', 'changeOrderDone', 'updateAddOns', 'updateSizes', 'showTable', 
		'showSchools', 'showYear', 'showItems', 'showTests', 'test'
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
		
		// i don't know if all or some of this should be a function of a model class (ie going through
			// the SchoolOrder class), or just left here. 
	function addOrders($input) {
			// simplify the naming, bring in the input
		$orders = $input['orders'];
		if (!empty($orders)) {
				// set arrays for new orders, and ones that already exist
			$addedOrders = [];
			$preexistingOrders = [];
			$addedOrdersIDs = [];
			$preexistingOrdersIDs = [];
			
				// the & in the foreach allows us to pass a reference rather than a copy, and alter each $order
			foreach ($orders as &$order) {
					// i just put these here to make things a little clearer
				$sport = $order['sport'];
					// gender should come in as the table's id value, because it's easy (just 1, 2, or 3)
				$genderID = $order['gender'];
				$order['genderName'] = '';
				if ($genderID == 1) {
					$order['genderName'] = 'Boys ';
				} elseif ($genderID == 2) {
					$order['genderName'] = 'Girls ';
				}
				$division = $order['division'];
				$school = $order['school'];
				$order['shortSchool'] = School::shortenSchoolName($order['school']);
				$s = $order['sizes'][0];
				$m = $order['sizes'][1];
				$l = $order['sizes'][2];
				$xl = $order['sizes'][3];
				$xxl = $order['sizes'][4];
				$xxxl = $order['sizes'][5];
				$orderedBy = $order['orderedBy'];
				$orderText = $order['orderText'];
				$fileName = $order['fileName'];
				
					// add a year. this part is a little goofy. we store the database year of the event as the year that the school year started, 
						//so events in months before june have the year decremented. this year we can easily select an entire school year.
				$year = date('y');
				$month = date('n');
				if (date('n') < 6) $year -= 1;
				$year = (int)$year;
				$order['year'] = $year;
				
				$sportID = Sport::getIDByName($sport);
				$eventID = Event::getIDBySportIDAndYear($sportID, $year);
				$minDiv = Sport::getMinDivByID($sportID);
					// need to add logic for if $school is not in the db
				$schoolID = School::getIDByName($school);
				$divisionID = Division::getIDByName($division);
					// some sports only have competitions for a couple divisions. schools in lower divisions play in
						//the lowest division that has a competition
				if ($divisionID < $minDiv) $divisionID = $minDiv;
				$order['sportID'] = $sportID;
				$order['eventID'] = $eventID;
				$order['schoolID'] = $schoolID;
				$order['divisionID'] = $divisionID;
				
				
					// we need to do things uniquely for soccer. each mOrder should have it's own sOrder
				if ($sport == 'Soccer') {
						// don't check for a SchoolOrder, because we will add one as long as there is no messageOrder
						// check if a MessageOrder already exists
					$messageOrderID = MessageOrder::getIDByEventIDAndSchoolIDAndGenderID($eventID, $schoolID, $genderID);
					if (!$messageOrderID) {
							// SchoolOrder::addNewOrder inserts a row in the schoolOrders table
								// and returns the id for that inserted row
						$schoolOrderID = SchoolOrder::addNewOrder($eventID, $divisionID, $schoolID);
							// create a new MessageOrder, and then add it to the db
							// the new id will be returned
						$o = new messageOrder(null, $schoolOrderID, $genderID, '', $order['sizes'], 
							$orderedBy, $orderText, $fileName, date('Y-m-d H:i:s'));					
						$messageOrderID = MessageOrder::addOrder($o);
						$addedOrders[] = $order;
					} else {
						$preexistingOrders[] = $order;
					}
						// if it's not soccer, do it the normal way
				} else {
						// check if a schoolOrder already exists
					$schoolOrderID = SchoolOrder::getIDByEventIDAndSchoolID($eventID, $schoolID);
						// if there is no schoolOrder, add it.
					if (!$schoolOrderID) {
							// SchoolOrder::addNewOrder inserts a row in the schoolOrders table
								// and returns the id for that inserted row
						$schoolOrderID = SchoolOrder::addNewOrder($eventID, $divisionID, $schoolID);
					} 
						// check if a messageOrder exists using the schoolOrderID and genderID
					$messageOrderID = MessageOrder::getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID);
						// if it does not exist, add it
					if (!$messageOrderID) {
							// create a new MessageOrder, and then add it to the db
								// the new id will be returned
						$o = new messageOrder(null, $schoolOrderID, $genderID, '', $order['sizes'], 
							$orderedBy, $orderText, $fileName, date('Y-m-d H:i:s'));					
						$messageOrderID = MessageOrder::addOrder($o);
							// take this line out
						$addedOrdersIDs[] = $messageOrderID;
						$addedOrders[] = $order;
					} else {
						$preexistingOrders[] = $order;
							// take this line out
						$preexistingOrdersIDs[] = $messageOrderID;
					}
				}

				$order['schoolOrderID'] = $schoolOrderID;
			}
			unset($order);
		} else {
			echo "no orders were submitted";
		}
			// make the html, with the weird output buffer stuff
		ob_start();
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/ordersAdded.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $orders
		]);
	}
	
	function updateAddOns($input) {
		SchoolOrder::updateAddOns($input['schoolOrderID'], $input['sizes']);
		echo json_encode(['result' => 1]);
	}
	
	function updateSizes($input) {
		SchoolOrder::updateSizes($input['schoolOrderID'], $input['teamSizes'], $input['addOnSizes']);
		echo json_encode(['result' => 1]);
	}
?>