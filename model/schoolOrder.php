<?php
class SchoolOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'schoolorders'; }
   protected static function getPrimaryKey(): string { return 'schoolOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'schoolOrderID', 
					'eventSiteHasDivisionID' => 'eventSiteHasDivisionID', 
					'school' => 'schoolID',
					'isDone' => 'isDone',
					'due' => 'due',
					'paid' => 'paid',
					'note' => 'schoolOrderNote',
					'invoiceSent' => 'invoiceSent'];
	}
		// defined as: new Relation($property, $rClass, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [ // new Relation('division', 'Division', 'divisionID', false), 
					new Relation('school', 'School', 'schoolID', false), 
					new Relation('addedShirts', 'SOrderItem', 'schoolOrderID', true), 
					new Relation('messageOrders', 'MessageOrder', 'schoolOrderID', true)];
   }
	
	public readonly array $addedShirts;
	public readonly array $teamShirts;
	
	public function __construct(
      public readonly ?int $id,
		public readonly int $eventSiteHasDivisionID, 
      public readonly School $school,
      public readonly bool $isDone = false,
      public readonly ?int $due = 0,
      public readonly ?bool $paid = false,
      public readonly ?string $note = '',
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
         'eventSiteHasDivisionID' => $this->eventSiteHasDivisionID,
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
		
		ob_start();
		
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

					// some sports only have competitions for a couple divisions. 
						// schools in lower divisions play in the lowest division that has a competition
				if ($divisionID < $sport->minDiv) $divisionID = $sport->minDiv;

				$eventSiteHasDivisionID = EventSiteDivision::getIDByEventAndDivision($eventID, $divisionID);
				
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
				
					// to make MOrderItems
				$baseSize = 35;
				$hoods = [];
				$i = 0;
				foreach ($order['sizes'] as $size) {
					if ($size > 0) $hoods[$baseSize + $i] = $size;
					++$i;
				}
				

				$orderedBy = $order['orderedBy'];
				$orderText = $order['orderText'];
				$fileName = $order['fileName'];
				

					//////////////////////////////////
					// why are these here? just for a returned object? where are they used? 
				$order['sportID'] = $sport->id;
				$order['eventID'] = $eventID;
				$order['schoolID'] = $schoolID;
				$order['divisionID'] = $divisionID;
				$order['year'] = $year;
				
				
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
						// if there is no schoolOrder, add it, and return the id for the new row
					if (!$schoolOrderID) {
						$schoolOrderID = SchoolOrder::addNewOrder($eventSiteHasDivisionID, $schoolID);
					} 
						// check if a messageOrder exists using the schoolOrderID and genderID
					$messageOrderID = MessageOrder::getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID);
					
						// if it does not exist, add it, and it's hoods morderitems
					if (!$messageOrderID) {
							// create a new MessageOrder, and then add it to the db
								// the new id will be returned
	
								
						$o = new MessageOrder(null, $schoolOrderID, $genderID, $orderedBy, $orderText, $fileName, date('Y-m-d H:i:s'));	
						$messageOrderID = $o->addToDB();
						
						foreach ($hoods as $itemID => $quantity) {
							MOrderItem::addNewMOrderItem($messageOrderID, $itemID, $quantity);
						}
						
						
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
		
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/ordersAdded.php';
		$htmlContent = ob_get_clean();
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $orders
		]);
	}
	
	public static function addNewOrder($eventSiteHasDivisionID, $schoolID) {
	  $db = Database::getDB();
	  $query = "INSERT INTO schoolOrders (eventSiteHasDivisionID, schoolID) 
					VALUES (:eventSiteHasDivisionID, :schoolID)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':eventSiteHasDivisionID', $eventSiteHasDivisionID);
	  $stmt->bindValue(':schoolID', $schoolID);

	  $stmt->execute();
	  return $db->lastInsertId();
	}
	
	
	public static function getIDByEventSiteHasDivisionAndSchool($eshdID, $schoolID) {
		$query = "SELECT schoolOrderID FROM schoolorders 
					WHERE eventSiteHasDivisionID = :eshdID AND schoolID = :schoolID";
		$rows = static::getFromDB($query, [':eshdID' => $eshdID, ':schoolID' => $schoolID]);
		return !empty($rows) ? $rows[0]['schoolOrderID'] : null;
	}



	
	//////////////////////////////////////////////////
   // user actions
	
	static function changeOrderDone($data) {
		$db = Database::getDB();
		
		$query = 'UPDATE schoolOrders SET isDone = :isDone WHERE schoolOrderID = :orderID';
		$statement = $db->prepare($query);
		$statement->bindValue(":orderID", $data['id']);
		$statement->bindValue(":isDone", $data['isDone']);
		$statement->execute();
		$affectedRows = $statement->rowCount();
		$statement->closeCursor();
			// this isn't returning any thing meaningful, but may be some day i'll want to
				// some thing is expected back, even if it isn't used
		echo json_encode(['rowsAffected' => $affectedRows]);
	}
}
?>
