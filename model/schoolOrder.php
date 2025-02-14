<?php
class SchoolOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'schoolorders'; }
   protected static function getPrimaryKey(): string { return 'schoolOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'schoolOrderID', 
					'eventID' => 'eventID', 
					'division' => 'divisionID',
					'school' => 'schoolID',
					'isDone' => 'isDone',
					'due' => 'due',
					'paid' => 'paid',
					'note' => 'schoolOrderNote',
					'invoiceSent' => 'invoiceSent'];
	}
		// defined as: new Relation($property, $rClass, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [new Relation('division', 'Division', 'divisionID', false), 
					new Relation('school', 'School', 'schoolID', false), 
					new Relation('addedShirts', 'SOrderItem', 'schoolOrderID', true), 
					new Relation('messageOrders', 'MessageOrder', 'schoolOrderID', true)];
   }
	
	public readonly array $addedShirts;
	public readonly array $teamShirts;
	
	public function __construct(
      public readonly int $id,
      public readonly int $eventID,
      public readonly Division $division,
      public readonly School $school,
      public readonly bool $isDone = false,
      public readonly ?int $due = 0,
      public readonly ?bool $paid = false,
      public readonly ?string $note,
      public readonly ?bool $invoiceSent = false,
		private array $messageOrders = [],
		array $addedShirts = [],
		array $teamShirts = []
   ) {
			// two different functions
		$this->addedShirts = self::organizeOrderItems($addedShirts);
		$this->teamShirts = self::organizeMOrderItems($this->messageOrders);
	}
	
	public function jsonSerialize(): mixed {
      return [
         'orderID' => $this->id,
         'eventID' => $this->eventID,
         'division' => $this->division,
         'school' => $this->school,
         'isDone' => $this->isDone,
         'due' => $this->due,
         'paid' => $this->paid,
         'schoolOrderNote' => $this->note,
         'invoiceSent' => $this->invoiceSent,
			'messageOrders' => $this->messageOrders,
			'addedShirts' => $this->addedShirts,
			'teamShirts' => $this->teamShirts
      ];
   }
		
		// // Getters and Setters
	public function getMessageOrders() { return $this->messageOrders; }
	// public function setMessageOrders(array $value) { $this->messageOrders[] = $value; }
	public function pushMessageOrders($value) { $this->messageOrders[$value->id] = $value; }
	
	
	public function getAddedHoodsTotal() {
		$total = 0;
		foreach($this->addedShirts['Adult Hoods']->getSizes() as $addedSize) {
			$total += $addedSize->getQuantity();
		}
		return $total;
	}
	
	public function getTeamTotal() {
		$total = 0;
		foreach($this->messageOrders as $mo) {
			foreach($mo->teamShirts as $size) {
				$total += $size->quantity;
			}
		}
		return $total;
	}
	
	public function getMessageFileNames() {
		$fileNames = [];
		foreach ($this->messageOrders as $order) {
			$fileNames[] = $order->fileName;
		}
		return implode(", ", $fileNames);
	}
	
	public function getMessageOrdersText() {
		$orderTexts = [];
		foreach ($this->messageOrders as $order) {
			$orderTexts[] = $order->orderText;
		}
		return implode("\n", $orderTexts);
	}
	
	private static function organizeOrderItems($oItems): array {
		$styles = [];
		foreach ($oItems as $oItem) {
			$styleName = $oItem->item->style->shortName;
			if (!isset($styles[$styleName])) $styles[$styleName] = $oItem->item->style;
			$sizeChars = $oItem->item->size->charName;
			$oItem->item->size->setQuantity($oItem->quantity);
			$styles[$styleName]->pushSizes($oItem->item->size);	
		}
		return $styles;
	}
	
	private static function organizeMOrderItems($mOrders): array {
		$styles = [];
		foreach ($mOrders as $mOrder) {
			// Test::logX($mOrder->schoolOrderID);
			foreach ($mOrder->teamShirts as $oItem) {
				$styleName = $oItem->item->style->shortName;
				if (!isset($styles[$styleName])) $styles[$styleName] = $oItem->item->style;
				$sizeChars = $oItem->item->size->charName;
				// Test::logX(array_keys($styles[$styleName]->getSizes()), $sizeChars);
				if (!isset($styles[$styleName]->getSizes()[$sizeChars])) {
					$oItem->item->size->setQuantity($oItem->quantity);
					$styles[$styleName]->pushSizes($oItem->item->size);
				} else {
					// Test::logX('in the else');
					$addedQ = $oItem->quantity + $styles[$styleName]->getSizes()[$sizeChars]->getQuantity();
					$styles[$styleName]->getSizes()[$sizeChars]->setQuantity($addedQ);
				}
			}
		}
		return $styles;
	}
	

	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
	static function uploadOrders($data) {
			// simplify the naming, bring in the input
		$orders = $data['orders'];
		if (!empty($orders)) {
				// set arrays for new orders, and ones that already exist
			$addedOrders = [];
			$preexistingOrders = [];
			$addedOrdersIDs = [];
			$preexistingOrdersIDs = [];
			
				// the & in the foreach allows us to pass a reference rather than a copy, and alter each $order
			foreach ($orders as &$order) {
					// get the whole sport, we need sport->minDiv later
				$sport = Sport::getByName($order['sport']);
					// get the school year. an event in january - may of the 24-25 school year will be represented by 24
				$year = Year::convertDateToSchoolYear(new DateTime());
				$eventID = Event::getIDBySportIDAndYear($sport->id, $year);
				$divisionID = Division::getIDByName($order['division']);	


				$eventSiteHasDivisionID = EventSiteDivision::getIDByEventAndDivision($eventID, $divisionID);


					// some sports only have competitions for a couple divisions. 
						// schools in lower divisions play in the lowest division that has a competition
				if ($divisionID < $sport->minDiv) $divisionID = $sport->minDiv;
					// need to add logic for if $school is not in the db
				$schoolID = School::getIDByName($order['school']);
				$order['shortSchool'] = School::shortenSchoolName($order['school']);
				
					// gender should come in as the table's id value, because it's easy (just 1, 2, or 3)
				$genderID = $order['gender'];
					// it looks like i'm making gender a pair of properties in the order, rather than a gender object
				$order['genderName'] = '';
				if ($genderID == 1) {
					$order['genderName'] = 'Boys ';
				} elseif ($genderID == 2) {
					$order['genderName'] = 'Girls ';
				}
				
				$s = $order['sizes'][0];
				$m = $order['sizes'][1];
				$l = $order['sizes'][2];
				$xl = $order['sizes'][3];
				$xxl = $order['sizes'][4];
				$xxxl = $order['sizes'][5];
				$orderedBy = $order['orderedBy'];
				$orderText = $order['orderText'];
				$fileName = $order['fileName'];
				
				
				
					//////////////////////////////////
					// why are these here? just for a returned object? where are they used? 
				$order['sportID'] = $sport->id;
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
					$schoolOrderID = SchoolOrder::getIDByEventSiteHasDivisionAndSchool($eventSiteHasDivisionID, $schoolID);

// we've made it to here. need to redefine some methods




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
	
	public static function getIDByEventSiteHasDivisionAndSchool($eshdID, $schoolID) {
		$query = "SELECT schoolOrderID FROM schoolorders 
					WHERE eventSiteHasDivisionID = :eshdID AND schoolID = :schoolID";
		$rows = static::getFromDB($query, [':eshdID' => $eshdID, ':schoolID' => $schoolID]);
		return !empty($rows) ? $rows : null;
	}
}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	// public static function addOrder($schoolOrder) {
	  // $db = Database::getDB();
	  // $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID, isDone, addedS, addedM, addedL, addedXL, 
														 // addedXXL, addedXXXL, due, paid, schoolOrderNote, invoiceSent) 
					// VALUES (:eventID, :divisionID, :schoolID, :isDone, :addedS, :addedM, :addedL, :addedXL, 
							  // :addedXXL, :addedXXXL, :due, :paid, :schoolOrderNote, :invoiceSent)";

	  // $stmt = $db->prepare($query);
	  // $stmt->bindValue(':eventID', $schoolOrder->getEventID());
	  // $stmt->bindValue(':divisionID', $schoolOrder->getDivisionID());
	  // $stmt->bindValue(':schoolID', $schoolOrder->getSchoolID());
	  // $stmt->bindValue(':isDone', $schoolOrder->getIsDone());
	  // $stmt->bindValue(':addedS', $schoolOrder->getAddedS());
	  // $stmt->bindValue(':addedM', $schoolOrder->getAddedM());
	  // $stmt->bindValue(':addedL', $schoolOrder->getAddedL());
	  // $stmt->bindValue(':addedXL', $schoolOrder->getAddedXL());
	  // $stmt->bindValue(':addedXXL', $schoolOrder->getAddedXXL());
	  // $stmt->bindValue(':addedXXXL', $schoolOrder->getAddedXXXL());
	  // $stmt->bindValue(':due', $schoolOrder->getDue());
	  // $stmt->bindValue(':paid', $schoolOrder->getPaid());
	  // $stmt->bindValue(':schoolOrderNote', $schoolOrder->getSchoolOrderNote());
	  // $stmt->bindValue(':invoiceSent', $schoolOrder->getInvoiceSent());

	  // $stmt->execute();
	  // $schoolOrder->setSchoolOrderID($db->lastInsertId());
	// }
	
	
	
	
	
		// // add a new order, with null default values
	// public static function addNewOrder($eventID, $divisionID, $schoolID) {
	  // $db = Database::getDB();
	  // $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID) 
					// VALUES (:eventID, :divisionID, :schoolID)";

	  // $stmt = $db->prepare($query);
	  // $stmt->bindValue(':eventID', $eventID);
	  // $stmt->bindValue(':divisionID', $divisionID);
	  // $stmt->bindValue(':schoolID', $schoolID);

	  // $stmt->execute();
	  // return $db->lastInsertId();
	// }
	
	
	
	
	// public static function updateSizes($schoolOrderID, $teamSizes, $addOnSizes) {
		// $db = Database::getDB();
			// // we can update the addOns immediately
		// $query = "UPDATE schoolOrders 
					// SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					// WHERE schoolOrderID = :schoolOrderID";
	
		// $stmt = $db->prepare($query);
		// $stmt->bindValue(':s', $addOnSizes[0]);
		// $stmt->bindValue(':m', $addOnSizes[1]);
		// $stmt->bindValue(':l', $addOnSizes[2]);
		// $stmt->bindValue(':xl', $addOnSizes[3]);
		// $stmt->bindValue(':xxl', $addOnSizes[4]);
		// $stmt->bindValue(':xxxl', $addOnSizes[5]);
		// $stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		// $stmt->execute();
		
			// // make a SizeList from the array argument. name it $new to differentiate it later. clarity
		// $newTeamSizes = new SizeList($teamSizes[0], $teamSizes[1], $teamSizes[2], $teamSizes[3], 
												// $teamSizes[4], $teamSizes[5]);
			// // teamSizes are held in one or two messageOrders, so we have to check where to update them
		// $sOrder = SchoolOrder::getOrderByID($schoolOrderID);
		// $mOrders = $sOrder->getMessageOrders();
			// // if there is only one mOrder, no problem, update it.
		// if (count($mOrders) == 1) {
			// MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newTeamSizes);
				// // if there are 2 mOrders, we don't want any negative values, so we have to do some checking
		// } elseif (count($mOrders) == 2) {
				// // get both original message sizes, and their total
			// $m1Sizes = $mOrders[0]->getSizes();
			// $m2Sizes = $mOrders[1]->getSizes();
			// $oldTeamSizes = $sOrder->getTeamSizesTotals();
				// // get the difference between what we will have and what we had
			// $differenceOldNew = SizeList::calculateSizeListDifference($newTeamSizes, $oldTeamSizes);
				// // combine that with the first mOrder sizes
					// // if any of them become negative, we will set them to zero and subtract the remainder from mOrder2
			// $newM1Sizes = SizeList::combineSizeLists($m1Sizes, $differenceOldNew);
				// // if 
			// $stillNegativeSizes = new SizeList(0, 0, 0, 0, 0, 0); // Start with all sizes as 0
			// foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
				// $value = $newM1Sizes->getSize($size); // Get the current size value
				// if ($value < 0) {
					// $stillNegativeSizes->setSize($size, $value); // Store the negative value
					// $newM1Sizes->setSize($size, 0); // Set the original size to 0
				// }
			// }
				// // Combine the negative sizes with $m2Sizes
			// $newM2Sizes = SizeList::combineSizeLists($m2Sizes, $stillNegativeSizes);
				// // Now we have $newM1Sizes with no negatives, and $newM2Sizes with the adjusted values.
				// // we can update
			// MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newM1Sizes);
			// MessageOrder::updateSizes($mOrders[1]->getMessageOrderID(), $newM2Sizes);

		// }
		
		
		// // return $db->lastInsertId();
	// }
	
	
	
	// public static function updateAddOns($schoolOrderID, $sizes) {
		// $db = Database::getDB();
		// $query = "UPDATE schoolOrders 
					// SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					// WHERE schoolOrderID = :schoolOrderID";
	
		// $stmt = $db->prepare($query);
		// $stmt->bindValue(':s', $sizes[0]);
		// $stmt->bindValue(':m', $sizes[1]);
		// $stmt->bindValue(':l', $sizes[2]);
		// $stmt->bindValue(':xl', $sizes[3]);
		// $stmt->bindValue(':xxl', $sizes[4]);
		// $stmt->bindValue(':xxxl', $sizes[5]);
		// $stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		// $stmt->execute();
		// // return $db->lastInsertId();
	// }


	
	// //////////////////////////////////////////////////
   // // user actions
	
	// static function changeOrderDone($data) {
		// $id = $data['id'];
		// $isDone = $data['isDone'];
		
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
		
			// // i think this is working with out this. it was part of the db function that was reworked here.
		// // if (!empty($id)) {
			// // return $id;
		// // } else {
			// // return false;
		// // }
			// // this isn't returning any thing meaningful, but may be some day i'll want to
				// // some thing is expected back, even if it isn't used
		// echo json_encode(['result' => 1]);
	// }
// }
?>
