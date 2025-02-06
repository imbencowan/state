<?php
class SchoolOrder implements JsonSerializable {
   private ?int $schoolOrderID, $eventID, $isDone, $due;
	private ?string $schoolOrderNote;
	private ?bool $paid, $invoiceSent;
	private ?Division $division;
	private ?School $school; 
	private $messageOrders, $addedS, $addedM, $addedL, $addedXL, $addedXXL, $addedXXXL;

    public function __construct($eventID, $division, $school, $messageOrders, $isDone = false, $addedS = 0, 
										$addedM = 0, $addedL = 0, $addedXL = 0, $addedXXL = 0, $addedXXXL = 0, $due = 0, 
										$paid = false, $schoolOrderID = null, $schoolOrderNote = null, $invoiceSent = null) {
        $this->schoolOrderID = $schoolOrderID;
        $this->eventID = $eventID;
        $this->division = $division;
        $this->school = $school;
		  $this->messageOrders[] = $messageOrders;
        $this->isDone = $isDone;
        $this->addedS = $addedS;
        $this->addedM = $addedM;
        $this->addedL = $addedL;
        $this->addedXL = $addedXL;
        $this->addedXXL = $addedXXL;
        $this->addedXXXL = $addedXXXL;
        $this->due = $due;
        $this->paid = $paid;
        $this->schoolOrderNote = $schoolOrderNote;
        $this->invoiceSent = $invoiceSent;
    }

    public function jsonSerialize() {
        return [
            'schoolOrderID' => $this->schoolOrderID,
            'eventID' => $this->eventID,
            'division' => $this->division,
            'school' => $this->school,
				'messageOrders' => $this->messageOrders,
            'isDone' => $this->isDone,
            'addedSizes' => [
                'addedS' => $this->addedS,
                'addedM' => $this->addedM,
                'addedL' => $this->addedL,
                'addedXL' => $this->addedXL,
                'addedXXL' => $this->addedXXL,
                'addedXXXL' => $this->addedXXXL,
            ],
            'due' => $this->due,
            'paid' => $this->paid,
            'schoolOrderNote' => $this->schoolOrderNote,
            'invoiceSent' => $this->invoiceSent
        ];
    }

	// Getters and Setters

	public function getSchoolOrderID() { return $this->schoolOrderID; }
	public function setSchoolOrderID($value) { $this->schoolOrderID = $value; }

	public function getEventID() { return $this->eventID; }
	public function setEventID($value) { $this->eventID = $value; }

	public function getDivision() { return $this->division; }
	public function setDivision($value) { $this->division = $value; }

	public function getSchool() { return $this->school; }
	public function setSchool($value) { $this->school = $value; }

	public function getIsDone() { return $this->isDone; }
	public function setIsDone($value) { $this->isDone = $value; }
	
	public function getTeamSize($size) {
		$total = 0;
		foreach ($this->messageOrders as $order) {
			$total += $order->getSizes()->getSize($size);
		}
		return $total;
	}
			// a display getter that returns dashes in place of zeros
	public function getTeamDisplaySize(string $size) {
		$total = 0;
		foreach ($this->messageOrders as $order) {
			$total += $order->getSizes()->getSize($size);
		}
		return ($total == 0) ? '-' : $total;
	}
	public function getTeamTotal() { 
		$total = 0;
		foreach ($this->messageOrders as $order) {
			$total += $order->getSizes()->getTotal();
		}
		return $total; 
	}
	public function getTeamDisplayTotal() { 
		$total = 0;
		foreach ($this->messageOrders as $order) {
			$total += $order->getSizes()->getTotal();
		}
		return ($total == 0) ? '-' : $total;
	}
	
		// returns a SizeList, totalling the messageOrder SizeLists
	public function getTeamSizesTotals() {
		$teamSizesTotals = new SizeList(0, 0, 0, 0, 0, 0);
		foreach ($this->messageOrders as $messageOrder) {
			$teamSizesTotals = SizeList::combineSizeLists($teamSizesTotals, $messageOrder->getSizes());
			// $messageSizes = $messageOrder->getSizes();
			// foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
				// $teamSizesTotals->getSize($size) += $messageSizes->getSize($size);
			// }
		}
		return $teamSizesTotals;
	}

	public function getAddedS() { return $this->addedS; }
	public function setAddedS($value) { $this->addedS = $value; }

	public function getAddedM() { return $this->addedM; }
	public function setAddedM($value) { $this->addedM = $value; }

	public function getAddedL() { return $this->addedL; }
	public function setAddedL($value) { $this->addedL = $value; }

	public function getAddedXL() { return $this->addedXL; }
	public function setAddedXL($value) { $this->addedXL = $value; }

	public function getAddedXXL() { return $this->addedXXL; }
	public function setAddedXXL($value) { $this->addedXXL = $value; }

	public function getAddedXXXL() { return $this->addedXXXL; }
	public function setAddedXXXL($value) { $this->addedXXXL = $value; }
	
			// we could potentially use array_sum() if we changed sizes to an array...
	public function getAddedTotal() {
		return $this->getAddedS() + $this->getAddedM() + $this->getAddedL() + 
			$this->getAddedXL() + $this->getAddedXXL() + $this->getAddedXXXL();
	}

	public function getDue() { return $this->due; }
	public function setDue($value) { $this->due = $value; }

	public function getPaid() { return $this->paid; }
	public function setPaid($value) { $this->paid = $value; }

	public function getSchoolOrderNote() { return $this->schoolOrderNote; }
	public function setSchoolOrderNote($value) { $this->schoolOrderNote = $value; }

	public function getInvoiceSent() { return $this->invoiceSent; }
	public function setInvoiceSent($value) { $this->invoiceSent = $value; }

	public function getMessageOrders() { return $this->messageOrders; }
	// public function setMessageOrders(array $value) { $this->messageOrders[] = $value; }
	public function pushMessageOrders($value) { $this->messageOrders[] = $value; }
	
	public function getMessageFileNames() {
		$fileNames = [];
		foreach ($this->messageOrders as $order) {
			$fileNames[] = $order->getFileName();
		}
		return implode(", ", $fileNames);
	}
	
	public function getMessageOrderText() {
		$orderTexts = [];
		foreach ($this->messageOrders as $order) {
			$orderTexts[] = $order->getOrderText();
		}
		return implode("\n", $orderTexts);
	}
	 

		//////////////////////////////////////////////////////////////////////////////////////////
		// Database Functions
	public static function addOrder($schoolOrder) {
	  $db = Database::getDB();
	  $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID, isDone, addedS, addedM, addedL, addedXL, 
														 addedXXL, addedXXXL, due, paid, schoolOrderNote, invoiceSent) 
					VALUES (:eventID, :divisionID, :schoolID, :isDone, :addedS, :addedM, :addedL, :addedXL, 
							  :addedXXL, :addedXXXL, :due, :paid, :schoolOrderNote, :invoiceSent)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':eventID', $schoolOrder->getEventID());
	  $stmt->bindValue(':divisionID', $schoolOrder->getDivisionID());
	  $stmt->bindValue(':schoolID', $schoolOrder->getSchoolID());
	  $stmt->bindValue(':isDone', $schoolOrder->getIsDone());
	  $stmt->bindValue(':addedS', $schoolOrder->getAddedS());
	  $stmt->bindValue(':addedM', $schoolOrder->getAddedM());
	  $stmt->bindValue(':addedL', $schoolOrder->getAddedL());
	  $stmt->bindValue(':addedXL', $schoolOrder->getAddedXL());
	  $stmt->bindValue(':addedXXL', $schoolOrder->getAddedXXL());
	  $stmt->bindValue(':addedXXXL', $schoolOrder->getAddedXXXL());
	  $stmt->bindValue(':due', $schoolOrder->getDue());
	  $stmt->bindValue(':paid', $schoolOrder->getPaid());
	  $stmt->bindValue(':schoolOrderNote', $schoolOrder->getSchoolOrderNote());
	  $stmt->bindValue(':invoiceSent', $schoolOrder->getInvoiceSent());

	  $stmt->execute();
	  $schoolOrder->setSchoolOrderID($db->lastInsertId());
	}
	
		// add a new order, with null default values
	public static function addNewOrder($eventID, $divisionID, $schoolID) {
	  $db = Database::getDB();
	  $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID) 
					VALUES (:eventID, :divisionID, :schoolID)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':eventID', $eventID);
	  $stmt->bindValue(':divisionID', $divisionID);
	  $stmt->bindValue(':schoolID', $schoolID);

	  $stmt->execute();
	  return $db->lastInsertId();
	}
	
	public static function updateSizes($schoolOrderID, $teamSizes, $addOnSizes) {
		$db = Database::getDB();
			// we can update the addOns immediately
		$query = "UPDATE schoolOrders 
					SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					WHERE schoolOrderID = :schoolOrderID";
	
		$stmt = $db->prepare($query);
		$stmt->bindValue(':s', $addOnSizes[0]);
		$stmt->bindValue(':m', $addOnSizes[1]);
		$stmt->bindValue(':l', $addOnSizes[2]);
		$stmt->bindValue(':xl', $addOnSizes[3]);
		$stmt->bindValue(':xxl', $addOnSizes[4]);
		$stmt->bindValue(':xxxl', $addOnSizes[5]);
		$stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		$stmt->execute();
		
			// make a SizeList from the array argument. name it $new to differentiate it later. clarity
		$newTeamSizes = new SizeList($teamSizes[0], $teamSizes[1], $teamSizes[2], $teamSizes[3], 
												$teamSizes[4], $teamSizes[5]);
			// teamSizes are held in one or two messageOrders, so we have to check where to update them
		$sOrder = SchoolOrder::getOrderByID($schoolOrderID);
		$mOrders = $sOrder->getMessageOrders();
			// if there is only one mOrder, no problem, update it.
		if (count($mOrders) == 1) {
			MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newTeamSizes);
				// if there are 2 mOrders, we don't want any negative values, so we have to do some checking
		} elseif (count($mOrders) == 2) {
				// get both original message sizes, and their total
			$m1Sizes = $mOrders[0]->getSizes();
			$m2Sizes = $mOrders[1]->getSizes();
			$oldTeamSizes = $sOrder->getTeamSizesTotals();
				// get the difference between what we will have and what we had
			$differenceOldNew = SizeList::calculateSizeListDifference($newTeamSizes, $oldTeamSizes);
				// combine that with the first mOrder sizes
					// if any of them become negative, we will set them to zero and subtract the remainder from mOrder2
			$newM1Sizes = SizeList::combineSizeLists($m1Sizes, $differenceOldNew);
				// if 
			$stillNegativeSizes = new SizeList(0, 0, 0, 0, 0, 0); // Start with all sizes as 0
			foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
				$value = $newM1Sizes->getSize($size); // Get the current size value
				if ($value < 0) {
					$stillNegativeSizes->setSize($size, $value); // Store the negative value
					$newM1Sizes->setSize($size, 0); // Set the original size to 0
				}
			}
				// Combine the negative sizes with $m2Sizes
			$newM2Sizes = SizeList::combineSizeLists($m2Sizes, $stillNegativeSizes);
				// Now we have $newM1Sizes with no negatives, and $newM2Sizes with the adjusted values.
				// we can update
			MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newM1Sizes);
			MessageOrder::updateSizes($mOrders[1]->getMessageOrderID(), $newM2Sizes);

		}
		
		
		// return $db->lastInsertId();
	}
	
	public static function updateAddOns($schoolOrderID, $sizes) {
		$db = Database::getDB();
		$query = "UPDATE schoolOrders 
					SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					WHERE schoolOrderID = :schoolOrderID";
	
		$stmt = $db->prepare($query);
		$stmt->bindValue(':s', $sizes[0]);
		$stmt->bindValue(':m', $sizes[1]);
		$stmt->bindValue(':l', $sizes[2]);
		$stmt->bindValue(':xl', $sizes[3]);
		$stmt->bindValue(':xxl', $sizes[4]);
		$stmt->bindValue(':xxxl', $sizes[5]);
		$stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		$stmt->execute();
		// return $db->lastInsertId();
	}


	public static function getIDByEventIDAndSchoolID($eventID, $schoolID) {
		$db = Database::getDB();
		$query = 'SELECT schoolOrderID FROM schoolOrders WHERE eventID = :eventID AND schoolID = :schoolID';
		$statement = $db->prepare($query);
		$statement->execute([':eventID' => $eventID, ':schoolID' => $schoolID]);
			// return id or null
		return $statement->fetchColumn() ?: null;
	}

		// some day we'll want to update this to be like getAllOrders() with JOINs and all
	public static function getOrderByID($id) {
		$db = Database::getDB();
		$query = "SELECT * FROM schoolOrders 
					INNER JOIN schools ON schoolOrders.schoolID = schools.schoolID	
					INNER JOIN messageOrders ON schoolOrders.schoolOrderID = messageOrders.schoolOrderID
					INNER JOIN genders ON messageOrders.genderID = genders.genderID
					INNER JOIN divisions ON schoolOrders.divisionID = divisions.divisionID
					INNER JOIN districts ON schools.districtID = districts.districtID
					INNER JOIN events ON schoolOrders.eventID = events.eventID
					INNER JOIN eventHasSport ON events.eventID = eventHasSport.eventID
					INNER JOIN sports ON eventHasSport.sportID = sports.sportID
					WHERE schoolOrders.schoolOrderID = :schoolOrderID";
		$stmt = $db->prepare($query);
		$stmt->bindValue(':schoolOrderID', $id);
		$stmt->execute();
		
		$sOrder = false;

		while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$schoolOrderID = $data['schoolOrderID'];
			
			$division = new Division(
				$data['divisionID'], 
				$data['divisionName'], 
				$data['minPop'], 
				$data['pre24DivisionName']
			);
			$district = new District(
				$data['districtID'], 
				$data['districtName'], 
				$data['districtDescription'], 
				$data['primaryCity']
			);
			$school = new School(
				$data['schoolID'], 
				$data['schoolName'], 
				$division, 
				$district
			);
			$mOrder = new MessageOrder(
				$data['messageOrderID'],
				$data['schoolOrderID'],
				$data['genderID'],
				$data['genderName'],
				new SizeList($data['s'], $data['m'], $data['l'], $data['xl'], $data['xxl'], $data['xxxl']),
				$data['orderedBy'],
				$data['orderText'],
				$data['fileName'],
				$data['orderDate']
			);
				// check if the school order already exists			
				// if the sOrder is not set, create it. else push the mOrder to the existing sOrder
			if (!$sOrder) {
				$sOrder = new SchoolOrder(
					$data['eventID'],
					$division,
					$school,
					$mOrder,
					$data['isDone'],
					$data['addedS'],
					$data['addedM'],
					$data['addedL'],
					$data['addedXL'],
					$data['addedXXL'],
					$data['addedXXXL'],
					$data['due'],
					$data['paid'],
					$data['schoolOrderID'],
					$data['schoolOrderNote'],
					$data['invoiceSent']
				);
			} else {
				$sOrder->pushMessageOrders($mOrder);
			}
		}
		return $sOrder;
	}

	public static function getAllOrders() {
		$db = Database::getDB();
		$query = "SELECT * FROM schoolOrders
					INNER JOIN schools ON schoolOrders.schoolID = schools.schoolID	
					INNER JOIN messageOrders ON schoolOrders.schoolOrderID = messageOrders.schoolOrderID
					INNER JOIN genders ON messageOrders.genderID = genders.genderID
					INNER JOIN divisions ON schoolOrders.divisionID = divisions.divisionID
					INNER JOIN districts ON schools.districtID = districts.districtID
					INNER JOIN events ON schoolOrders.eventID = events.eventID
					INNER JOIN sports ON events.sportID = sports.sportID";
		$stmt = $db->query($query);
		$results = [];

		while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$schoolOrderID = $data['schoolOrderID'];
			
			$division = new Division(
				$data['divisionID'], 
				$data['divisionName'], 
				$data['minPop'], 
				$data['pre24DivisionName']
			);
			$district = new District(
				$data['districtID'], 
				$data['districtName'], 
				$data['districtDescription'], 
				$data['primaryCity']
			);
			$school = new School(
				$data['schoolID'], 
				$data['schoolName'], 
				$division, 
				$district
			);
			$mOrder = new MessageOrder(
				$data['messageOrderID'],
				$data['schoolOrderID'],
				$data['genderID'],
				$data['genderName'],
				new SizeList($data['s'], $data['m'], $data['l'], $data['xl'], $data['xxl'], $data['xxxl']),
				$data['orderedBy'],
				$data['orderText'],
				$data['fileName'],
				$data['orderDate']
			);
				// check if a school order already exists
			$filtered = array_filter($results, function($obj) use ($schoolOrderID) {
				return $obj->getSchoolOrderID() === $schoolOrderID;
			});
			$preSchoolOrder = array_values($filtered)[0] ?? null; // Get the first item or null if none found
			
				// if the SchoolOrder exists, push the MessageOrder. else make the SchoolOrder first
			if ($preSchoolOrder) {
				$preSchoolOrder->pushMessageOrders($mOrder);
				
			} else {
				$results[] = new SchoolOrder(
					$data['eventID'],
					$division,
					$school,
					$mOrder,
					$data['isDone'],
					$data['addedS'],
					$data['addedM'],
					$data['addedL'],
					$data['addedXL'],
					$data['addedXXL'],
					$data['addedXXXL'],
					$data['due'],
					$data['paid'],
					$data['schoolOrderID'],
					$data['schoolOrderNote'],
					$data['invoiceSent']
				);
			}
		}
		return $results;
	}
	
		// we moved this to a user action function
	// public static function changeOrderDone($id, $isDone) {
		// $db = Database::getDB();
		
		// $query = 'UPDATE schoolOrders
					// SET isDone = :isDone
					// WHERE schoolOrderID = :orderID';
		// $statement = $db->prepare($query);
		// $statement->bindValue(":orderID", $id);
		// $statement->bindValue(":isDone", $isDone);
		// $statement->execute();
		// $id = $statement->fetchColumn();
		// $statement->closeCursor();
		
		// if (!empty($id)) {
			// return $id;
		// } else {
			// return false;
		// }
	// }
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, displaying all items
	static function changeOrderDone($data) {
		$id = $data['id'];
		$isDone = $data['isDone'];
		
		$db = Database::getDB();
		
		$query = 'UPDATE schoolOrders
					SET isDone = :isDone
					WHERE schoolOrderID = :orderID';
		$statement = $db->prepare($query);
		$statement->bindValue(":orderID", $id);
		$statement->bindValue(":isDone", $isDone);
		$statement->execute();
		$id = $statement->fetchColumn();
		$statement->closeCursor();
		
			// i think this is working with out this. it was part of the db function that was reworked here.
		// if (!empty($id)) {
			// return $id;
		// } else {
			// return false;
		// }
			// this isn't returning any thing meaningful, but may be some day i'll want to
				// some thing is expected back, even if it isn't used
		echo json_encode(['result' => 1]);
	}
}
?>
