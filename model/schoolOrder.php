<?php
class SchoolOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'schoolorders'; }
   protected static function getPrimaryKey(): string { return 'schoolOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'schoolOrderID', 
					'eshdID' => 'eventSiteHasDivisionID', 
					'school' => 'schoolID',
					'completeness' => 'completeness',
					'due' => 'due',
					'paid' => 'paid',
					'note' => 'schoolOrderNote',
					'invoiceSent' => 'invoiceSent'];
	}
		// defined as: new Relation($property, $rClass, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [ // new Relation('division', 'Division', 'divisionID', false), 
					new Relation('school', 'School', 'schoolID', false), 
					new Relation('shirts', 'SOrderItem', 'schoolOrderID', true), 
					new Relation('messageOrders', 'MessageOrder', 'schoolOrderID', true)];
   }
	
	public readonly array $shirts;
	
	public function __construct(
      public readonly ?int $id,
		public readonly int $eshdID, 
      public readonly School $school,
      public readonly int $completeness = 0,
      public readonly ?int $due = 0,
      public readonly ?bool $paid = false,
      public readonly ?string $note = '',
      public readonly ?bool $invoiceSent = false,
		private array $messageOrders = [],
		array $shirts = [],
   ) {
		$this->shirts = self::organizeOrderItems($shirts);
	}
	
	public function jsonSerialize(): mixed {
      return [
         'id' => $this->id,
         'eshdID' => $this->eshdID,
         'school' => $this->school,
         'completeness' => $this->completeness,
         'due' => $this->due,
         'paid' => $this->paid,
         'schoolOrderNote' => $this->note,
         'invoiceSent' => $this->invoiceSent,
			'messageOrders' => $this->messageOrders,
			'shirts' => array_values($this->shirts),
      ];
   }
		
		// // Getters and Setters
	public function getMessageOrders() { return $this->messageOrders; }
	// public function setMessageOrders(array $value) { $this->messageOrders[] = $value; }
	public function pushMessageOrders($value) { $this->messageOrders[$value->id] = $value; }
	
		// return shirts without the Dairy Hoods
	public function getAddedShirts() { return array_diff_key($this->shirts, ['Dairy Hoods' => true]); }
	
	
	public function getStyleTotal($style) {
		$total = 0;
		foreach($this->shirts[$style]->getSizes() as $addedSize) {
			$total += $addedSize->getQuantity();
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
				// make an array of unique styles
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
			foreach ($mOrder->teamShirts as $oItem) {
				$styleName = $oItem->item->style->shortName;
				if (!isset($styles[$styleName])) $styles[$styleName] = $oItem->item->style;
				$sizeChars = $oItem->item->size->charName;
				if (!isset($styles[$styleName]->getSizes()[$sizeChars])) {
					$oItem->item->size->setQuantity($oItem->quantity);
					$styles[$styleName]->pushSizes($oItem->item->size);
				} else {
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
			
				// the & in the foreach allows us to pass a reference rather than a copy, and alter each $order
			foreach ($orders as &$order) {
					// we could move the logic in this foreach to a function like processOrder(), and wrap it in withDB() for transaction
				
					// get the whole sport, we need sport->minDiv later
				$sport = Sport::getByName($order['sport']);
					// get the school year. an event in january - may of the 24-25 school year will be represented by 24
				$year = Year::convertDateToSchoolYear(new DateTime());
				$eventID = Event::getIDBySportIDAndYear($sport->id, $year);
				$divisionID = Division::getIDByName($order['division']);	

					// some sports only have competitions for a couple divisions. 
						// schools in lower divisions play in the lowest division that has a competition
				if ($divisionID < $sport->minDiv) $divisionID = $sport->minDiv;

				$eshdID = EventSiteDivision::getIDByEventAndDivision($eventID, $divisionID);
				
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
				
					// to make SOrderItems
				$baseSize = 42;
				$hoods = [];
				$i = 0;
				foreach ($order['sizes'] as $size) {
					if ($size > 0) $hoods[$baseSize + $i] = $size;
					++$i;
				}
				

				$orderedBy = $order['orderedBy'];
				$comment = $order['comment'];
					// comment is handled if it is empty
				$commentHandled = ($comment == '') ? 1 : 0;
				$orderText = $order['orderText'];
				$fileName = $order['fileName'];
				
				
				$order['year'] = $year;
				
				
					// we need to do things uniquely for soccer. each MessageOrder should have it's own SchoolOrder
				if ($sport == 'Soccer') {
						// check if a MessageOrder already exists
						// don't check for a SchoolOrder, because we will add one as long as there is no messageOrder
							// this is soccer, each gender gets a SchoolOrder
					$messageOrderID = MessageOrder::getIDByEventIDAndSchoolIDAndGenderID($eventID, $schoolID, $genderID);
					if (!$messageOrderID) {
							// SchoolOrder::addNewOrder inserts a row in the schoolOrders table
								// and returns the id for that inserted row
						$schoolOrderID = SchoolOrder::addNewOrder($eventID, $divisionID, $schoolID);
							// create a new MessageOrder, and then add it to the db
							// the new id will be returned
						$o = new messageOrder(null, $schoolOrderID, $genderID, $orderedBy, $comment, $commentHandled, $orderText, 
													$fileName, date('Y-m-d H:i:s'));							
						$messageOrderID = $o->addToDB();
						$addedOrders[] = $order;
					} else {
						$preexistingOrders[] = $order;
					}
					
						// if it's not soccer, do it the normal way
				} else {
						// check if a schoolOrder already exists
					$schoolOrderID = self::getIDByEventSiteHasDivisionAndSchool($eshdID, $schoolID);
						// if there is no schoolOrder, add it, and return the id for the new row
					if (!$schoolOrderID) {
						$schoolOrderID = self::addNewOrder($eshdID, $schoolID);
					} else {
							// here we make sure completeness is set correctly
								// if the existing SchoolOrder is already marked complete, and a second MessageOrder comes in,
									// it needs to change to partial complete
										// we could make a general function in BasicTableModel to UPDATE x to y if z 
						self::updateCompletenessIf($schoolOrderID, 1, 2);
					}
						// check if a messageOrder exists using the schoolOrderID and genderID
					$messageOrderID = MessageOrder::getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID);
					
						// if it does not exist, add it, and it's hoods morderitems
					if (!$messageOrderID) {
							// create a new MessageOrder, and then add it to the db
								// the new id will be returned
				
						$o = new MessageOrder(null, $schoolOrderID, $genderID, $orderedBy, $comment, $commentHandled, $orderText, 
													$fileName, date('Y-m-d H:i:s'));	
						$messageOrderID = $o->addToDB();
						
							// add the team items
						SOrderItem::addTeamItems($schoolOrderID, $hoods);

						$addedOrders[] = $order;
					} else {
						$preexistingOrders[] = $order;
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
		
		return [ 'html' => $htmlContent, 'data' => $orders ];
	}
	
	// public static function processOrder($order) {
		
	// }
	
	public static function updateCompletenessIf($orderID, $oldValue, $newValue) {
		$db = Database::getDB();
		$stmt = $db->prepare("UPDATE schoolorders
									SET completeness = :newValue
									WHERE schoolOrderID = :id AND completeness = :oldValue");
		$stmt->bindValue(':id', $orderID);
		$stmt->bindValue(':oldValue', $oldValue);
		$stmt->bindValue(':newValue', $newValue);

		$stmt->execute();
	}
	
	public static function addNewOrder($eshdID, $schoolID) {
	  $db = Database::getDB();
	  $query = "INSERT INTO schoolOrders (eventSiteHasDivisionID, schoolID) 
					VALUES (:eshdID, :schoolID)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':eshdID', $eshdID);
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
	
	static function changeOrderCompleteness($data) {
		$db = Database::getDB();
		
		$statement = $db->prepare('UPDATE schoolOrders SET completeness = :completeness WHERE schoolOrderID = :orderID');
		$statement->bindValue(":orderID", $data['id']);
		$statement->bindValue(":completeness", $data['completeness']);
		$statement->execute();
		$affectedRows = $statement->rowCount();
		$statement->closeCursor();
			
		return ['rowsAffected' => $affectedRows];
	}
	
	public static function editSizes($data) {
		return Database::withDB(function($db) use ($data) {
				// bring in the data
			$items = $data['items'];
			$orderID = $data['schoolOrderID'];
			
				// this will UPDATE records for existing sizes, and create new records for nonexisting
			$stmt = $db->prepare("INSERT INTO sorderitems (schoolOrderID, itemID, sOrderItemsQuantity)
												VALUES (:orderID, :itemID, :quantity)
												ON DUPLICATE KEY UPDATE sOrderItemsQuantity = VALUES(sOrderItemsQuantity)");
			
			foreach ($items as $item) {
				$stmt->execute([
					':orderID' => $orderID,
					':itemID' => $item['itemID'],
					':quantity' => (int) $item['quantity']
				]);
			}
				// DELETE records that have been changed to 0
			$stmt = $db->prepare("DELETE FROM sorderitems WHERE schoolOrderID = :orderID AND sOrderItemsQuantity = 0");
			$stmt->execute([':orderID' => $orderID]);
			
				// UPDATE due
			$due = self::updateDue($db, $orderID);
				// UPDATE completeness IF currently complete
			self::updateCompletenessIf($orderID, 1, 2);
	
			return [ 'newOrder' => self::getByID($orderID) ];
		});
	}
	
	public static function updateDue($db, $orderID) {
		$stmt = $db->prepare("UPDATE schoolorders
					SET due = (
						SELECT SUM(ii.price * si.sOrderItemsQuantity)
						FROM sorderitems si
						JOIN inventoryitems ii ON si.itemID = ii.itemID
						WHERE si.schoolOrderID = schoolorders.schoolOrderID
					)
					WHERE schoolOrderID = :id");
		$stmt->execute([':id' => $orderID]);
		
			// return new due
		$stmt = $db->prepare("SELECT due FROM schoolorders WHERE schoolOrderID = :id");
		$stmt->execute([':id' => $orderID]);
		return $stmt->fetchColumn();
	}
}
?>
