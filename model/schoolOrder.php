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
					'genderID' => 'genderID',
					'qualifiers' => 'qualifiers',
					'completeness' => 'completeness',
					'due' => 'due',
					'paid' => 'paid',
					'note' => 'schoolOrderNote',
					'invoiceDate' => 'invoiceDate',
					'invoiceVersion' => 'invoiceVersion'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
    	return [ // new Relation('division', 'Division', 'divisionID', false), 
					new Relation('school', 'School', 'schoolID', 'schoolID', false), 
					new Relation('shirtsByStyle', 'SOrderItem', 'schoolOrderID', 'schoolOrderID', true), 
					new Relation('oTransfers', 'SOrderTransfer', 'schoolOrderID', 'schoolOrderID', true),
					new Relation('messageOrders', 'MessageOrder', 'schoolOrderID', 'schoolOrderID', true)];
   }
	
	public readonly array $shirtsByStyle;
	public readonly string|DateTime|null $invoiceDate;
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eshdID, 
		public readonly School $school,
		public readonly ?int $genderID = null,
		public readonly ?int $qualifiers = null,
		public readonly int $completeness = 0,
		public readonly ?int $due = 0,
		public readonly ?bool $paid = false,
		public readonly ?string $note = '',
		string|DateTime|null $invoiceDate = null,
		public readonly ?int $invoiceVersion = null,
		private array $messageOrders = [],
		array $shirtsByStyle = [],
		public readonly array $oTransfers = []
   ) {
		$this->shirtsByStyle = self::organizeOrderItems($shirtsByStyle);
		$this->invoiceDate = is_string($invoiceDate) ? new DateTime($invoiceDate) : $invoiceDate;
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'eshdID' => $this->eshdID,
			'school' => $this->school,
			'genderID' => $this->genderID,
			'qualifiers' => $this->qualifiers,
			'completeness' => $this->completeness,
			'due' => $this->due,
			'paid' => $this->paid,
			'schoolOrderNote' => $this->note,
			'invoiceDate' => $this->invoiceDate,
			'invoiceVersion' => $this->invoiceVersion,
			'messageOrders' => $this->messageOrders,
			'shirtsByStyle' => array_values($this->shirtsByStyle),
			'oTransfers' => array_values($this->oTransfers)
		];
   }
		
		// // Getters and Setters
	public function getMessageOrders() { return $this->messageOrders; }
	// public function setMessageOrders(array $value) { $this->messageOrders[] = $value; }
	public function pushMessageOrders($value) { $this->messageOrders[$value->id] = $value; }
	
		// return shirts without the Dairy Hoods
	public function getAddedShirts() { return array_diff_key($this->shirtsByStyle, ['Dairy Hoods' => true]); }
	
	
	public function getStyleTotal($style) {
		$total = 0;
		foreach($this->shirtsByStyle[$style]->getSizes() as $addedSize) {
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
	
	

	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
			// this will set due programatically by the sOrderItems currently in the db
	public static function addAddOns($orderID, $addItems, $addTransfers) {

		return Database::withDB(function($db) use ($orderID, $addItems, $addTransfers) {
			SOrderItem::addItems($db, $orderID, $addItems);
			SOrderTransfer::addTransfers($db, $orderID, $addTransfers);

			SchoolOrder::updateDue($db, $orderID);
			SchoolOrder::updateCompletenessIf($orderID, 1, 2);
			SchoolOrder::updateByID($orderID, ['invoiceDate' => date('Y-m-d')]);
			SchoolOrder::updateInvoiceVersion($orderID);

			// return SchoolOrder::getByID($orderID);
			return [ 'newOrder' => SchoolOrder::getByID($orderID), 'message' => 'Add-ons successfully added.' ];
		});
		


		
		// // $query = "SELECT itemID FROM sorderitems WHERE schoolOrderID = :schoolOrderID";
		// // 	// use the parent method to get existing itemIDs for the order
		// // $priorItems = SOrderItem::getFromDB($query, [':schoolOrderID' => $orderID]);
		// // 	// make arrays of itemIDs
		// // $priorItemIDs = array_column($priorItems, 'itemID');
		// // $addItemIDs = array_column($addItems, 'itemID');
		// // 	// check for duplicates between the arrays. don't *add* some thing that already exists
		// // $duplicates = array_intersect($priorItemIDs, $addItemIDs);
		
		// // if ($duplicates) {
		// // 		// bad request
		// // 			// might be nice to check and return what conflicted here
		// // 	http_response_code(400); 
		// // 	return ['error' => "There is already an add on for at least one of the submitted items. 
		// // 							Check the order. No items were added"];
		// // 	exit;
		// // } 
		
		// 	// INSERT now
		// try {
		// 	$db = Database::getDB();
		// 		// using a transaction
		// 	$db->beginTransaction();

		// 	SOrderItem::addItems($orderID, $addItems);
		// // SOrderTransfer::addTransfers($orderID, $addTransfers);

		// 	// 	// add the items
		// 	// foreach ($addItems as $item) {
		// 	// 	$data = ['schoolOrderID' => $orderID, 
		// 	// 				'itemID' => $item['itemID'], 
		// 	// 				'sOrderItemsQuantity' => $item['quantity']
		// 	// 				];
		// 	// 	self::insert($data);
		// 	// }
			
		// 		// UPDATE due
		// 	SchoolOrder::updateDue($db, $orderID);
		// 		// UPDATE completeness IF currently complete
		// 	SchoolOrder::updateCompletenessIf($orderID, 1, 2);
		// 		// UPDATE invoiceDate ($id, ['column': $value])
		// 	SchoolOrder::updateByID($orderID, ['invoiceDate' => date('Y-m-d')]);
		// 		// UPDATE invoiceVersion
		// 	SchoolOrder::updateInvoiceVersion($orderID);

		// 	$db->commit();

		// 	return [ 'newOrder' => SchoolOrder::getByID($orderID), 'message' => 'Add-ons successfully added.' ];
		// } catch (PDOException $e) {
		// 	if ($db->inTransaction()) {
		// 		$db->rollBack();
		// 	}
		// 	http_response_code(500);
		// 	return ['error' => 'Database error: ' . $e->getMessage() ];
		// 	exit;
		// }
	}

	public static function updateDue($db, $orderID) {
		$stmt = $db->prepare("UPDATE schoolorders
					SET due = (
						SELECT SUM(a.price * si.sOrderItemsQuantity)
						FROM sorderitems si
						JOIN apparel a ON si.itemID = a.itemID
						WHERE si.schoolOrderID = schoolorders.schoolOrderID
					)
					WHERE schoolOrderID = :id");
		$stmt->execute([':id' => $orderID]);
		
			// return new due
		return self::getColForID('due', $orderID);
	}
	
	public static function updateCompletenessIf($orderID, $oldValue, $newValue) {
		$db = Database::getDB();
			// $oldValue should be 1 for complete, and $newValue should be 2 for partial, though other options are possible
				// so calling this can change an order previously marked complete to marked partial
		$stmt = $db->prepare("UPDATE " . self::getTableName()
									 . " SET completeness = :newValue
									WHERE schoolOrderID = :id AND completeness = :oldValue");
		$stmt->bindValue(':id', $orderID);
		$stmt->bindValue(':oldValue', $oldValue);
		$stmt->bindValue(':newValue', $newValue);

		$stmt->execute();
	}

	public static function updateInvoiceVersion($orderID) {
		$db = Database::getDB();
		$stmt = $db->prepare(
			"UPDATE " . self::getTableName()
			 . " SET invoiceVersion = CASE 
					WHEN invoiceVersion IS NULL THEN 0
					ELSE invoiceVersion + 1
				END
				WHERE schoolOrderID = :id"
		);
		$stmt->bindValue(':id', $orderID);
		$stmt->execute();
	}


		// utilizes base class method
	public static function addNewOrder($eshdID, $schoolID, $genderID = 0) {
		$data = ['eventSiteHasDivisionID' => $eshdID, 'schoolID' => $schoolID, 'genderID' => $genderID];
		return self::insert($data);
	}
	
	
	public static function getIDByEventSiteHasDivisionAndSchool($eshdID, $schoolID) {
		$query = "SELECT schoolOrderID FROM schoolorders 
					WHERE eventSiteHasDivisionID = :eshdID AND schoolID = :schoolID";
		$rows = static::getFromDB($query, [':eshdID' => $eshdID, ':schoolID' => $schoolID]);
		return !empty($rows) ? $rows[0]['schoolOrderID'] : null;
	}



	
	//////////////////////////////////////////////////
   // user actions
	
	static function uploadOrders($orders) {
		
		ob_start();
		
			// simplify the naming, bring in the input
		// $orders = $data['orders'];
		if (!empty($orders)) {
				// set arrays for new orders, and ones that already exist
			$addedOrders = [];
			$preexistingOrders = [];
			
				// the & in the foreach allows us to pass a reference rather than a copy, and alter each $order
			foreach ($orders as &$order) {
					// we could move the logic in this foreach to a function like processOrder(), and wrap it in withDB() for transaction
				
					// gender should come in as the table's id value, because it's easy (just 1, 2, or 3)
				$genderID = $order['gender'];
					// it looks like i'm making gender a pair of properties in the order, rather than a gender object
				$order['genderName'] = '';
				if ($genderID == 1) {
					$order['genderName'] = 'Boys ';
				} elseif ($genderID == 2) {
					$order['genderName'] = 'Girls ';
				}
				
					// get the whole sport, we need sport->minDiv later
				$sport = Sport::getByName($order['sport']);
					// get the school year. an event in january - may of the 24-25 school year will be represented by 24
				$year = Year::convertDateToSchoolYear(new DateTime());
				$eventID = Event::getIDBySportIDAndYear($sport->id, $year);
				$divisionID = Division::getIDByName($order['division']);	

					// some sports only have competitions for a couple divisions. 
						// schools in lower divisions play in the lowest division that has a competition
				if ($divisionID < $sport->minDiv) $divisionID = $sport->minDiv;

				$eshdID = EventSiteDivision::getIDByEventAndDivisionAndGender($eventID, $divisionID, $sport->id, $genderID);
			// Test::logX('eshdID is ' . $eshdID, 'eventID is ' . $eventID, 'divisionID is ' . $divisionID, 'genderID is ' . $genderID);
				
					// need to add logic for if $school is not in the db
				$schoolID = School::getIDByName($order['school']);
				$order['shortSchool'] = School::shortenSchoolName($order['school']);
				
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
						$schoolOrderID = SchoolOrder::addNewOrder($eventID, $divisionID, $schoolID, $genderID);
							// create a new MessageOrder, and then add it to the db
							// the new id will be returned
						$o = new messageOrder(null, $schoolOrderID, $genderID, $orderedBy, $comment, $commentHandled, $orderText, 
													$fileName, date('Y-m-d H:i:s'));							
						$messageOrderID = $o->addInstanceToDB();
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
					}
						// check if a messageOrder exists using the schoolOrderID and genderID
					$messageOrderID = MessageOrder::getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID);
					
						// if it does not exist, add it, and it's hoods morderitems
					if (!$messageOrderID) {
							// create a new MessageOrder, and then add it to the db
								// the new id will be returned
				
						$o = new MessageOrder(null, $schoolOrderID, $genderID, $orderedBy, $comment, $commentHandled, $orderText, 
													$fileName, date('Y-m-d H:i:s'));	
						$messageOrderID = $o->addInstanceToDB();
						
							// add the team items
						SOrderItem::addTeamItems($schoolOrderID, $hoods);
						
							// here we make sure completeness is set correctly
								// if the existing SchoolOrder is already marked complete, and a second MessageOrder is added,
									// it needs to change to partial complete
								// if it is a blank order, make it unDone
								// we could make a general function in BasicTableModel to UPDATE x to y if z
						self::updateCompletenessIf($schoolOrderID, 1, 2);
						self::updateCompletenessIf($schoolOrderID, 4, 0);

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
		
		include 'view/ordersAdded.php';
			// make the html, with the weird output buffer stuff
		$htmlContent = ob_get_clean();
		
		return [ 'html' => $htmlContent, 'data' => $orders ];
	}
	

	static function changeOrderCompleteness($id, $completeness) {
		$rowsAffected = self::updateByID($id, ['completeness' => $completeness]);
		return ['rowsAffected' => $rowsAffected];
	}
	
	public static function editSizes($items, $orderID) {
			// use withDB to avoid some thing like a partial update
		return Database::withDB(function($db) use ($items, $orderID) {
			
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
				// UPDATE completeness IF currently complete to partial
			self::updateCompletenessIf($orderID, 1, 2);
				// UPDATE invoiceVersion
			self::updateInvoiceVersion($orderID);
	
			return [ 'newOrder' => self::getByID($orderID) ];
		});
	}

	public static function uploadQualifiers($upSchools, $esdIDs) {
			// some times people put other things in the same column. ignore these
		$ignoreRow = [ '6A', '5A', '4A', '3A', '2A', '1A' ];
			// remove rows where 'school' column contains a division name.
				// this has happened in secondary headers
		$upSchools = array_filter($upSchools, function ($s) use ($ignoreRow) {
			$name = strtoupper(trim($s['name']));
			// if (in_array($name,$ignoreRow, true)) Test::logX($name);
			return !in_array($name, $ignoreRow, true);
		});

			// get the lowest division sent
		$minDivID = min(array_keys($esdIDs));
			// a container for making sure we don't have problems
		$unmatchedSchools = [];
			// from db for comparison
		$allSchools = School::getAllFromDB();

			// aliases for school names
				// as 'upload name' => 'db shortName'
		$aliasMap = [
			'coeur d alene' => "coeur d'alene",
			'community school (sun valley)' => 'sun valley community',
			'community school' => 'sun valley community',
			'mt view' => "mountain view",
			'rocky mt' => "rocky mountain",
			'mt home' => "mountain home",
			'cda charter academy' => "coeur d'alene charter",
			'highland - p' => "highland",
			'highland - c' => "highland - craigmont",
			'priest river lamanna' => 'priest river',
			'sho-ban' => 'shoshone-bannock',
			'timberline (boise)' => "timberline",
			'timberline (weippe)' => 'timberline - weippe'
		];

			// find the uploaded school's data from the db list of schools
		foreach ($upSchools as &$sUp) {
				// move every thing to lower case
			$sUpName = strtolower(trim($sUp['name']));

				// first check if there is an alias pointing to a correct name
			if (isset($aliasMap[$sUpName])) $sUpName = $aliasMap[$sUpName];

				// next special cases for timberline/highland/shoshone
					// these should all be mutually exclusive
					// and should all match on the first exact match pass
			if (str_contains($sUpName, 'weippe')) $sUpName = 'timberline - weippe';
			if (str_contains($sUpName, 'craigmont')) $sUpName = 'highland - craigmont';
			if (str_contains($sUpName, 'timberline') && str_contains($sUpName, 'boise')) $sUpName = 'timberline';
			if (str_contains($sUpName, 'highland') && str_contains($sUpName, 'pocatello')) $sUpName = 'highland';
			if (str_contains($sUpName, 'bannock')) $sUpName = 'shoshone-bannock';
			if (str_contains($sUpName, 'shoshone') && !str_contains($sUpName, 'bannock')) $sUpName = 'shoshone';

			

				// reset each pass
			$matchedSchool = null;

				// match by comparing names. exact matches first
			foreach ($allSchools as $sDB) {
				if ($sUpName === strtolower($sDB->shortName)) {
					$matchedSchool = $sDB;
					break;
				}
			}

				// check partial matches if no match was found previously
			if (!$matchedSchool) {
				foreach ($allSchools as $sDB) {
					if (str_starts_with($sUpName, strtolower($sDB->shortName)) || 
							str_starts_with(strtolower($sDB->shortName), $sUpName)) {
						$matchedSchool = $sDB;
						break;
					}
				}
			}

				// get the match's data, or push to unmatched
			if ($matchedSchool) {
				$sUp['id'] = $matchedSchool->id;

				$sUp['dbName'] = $matchedSchool->shortName;

					// account for schools smaller than minDiv.i
				$divID = max($matchedSchool->division->id, $minDivID);
				$sUp['esdID'] = $esdIDs[$divID];
			} else {
					// if no match was found put it in the container 
				$unmatchedSchools[] = $sUp;
			}
		}

			// if any schools didn't match, don't upload. return the offenders so we can fix things
		if (count($unmatchedSchools) > 0) {
			return ['unmatchedSchools' => $unmatchedSchools];
				// else, upsert
					/////////// a note. this upsert relies on a unique constraint on the schoolorders table
						// an (esdID, schoolId, genderID) combination must be unique. genderID is necessary to 
						// handle soccer sites allowing separate orders for girls and boys. this should never be 
						// relevant since soccer doesn't send a list of qualifiers, they are team limited
		} else {
				// use withDB to avoid some thing like a partial update
			return Database::withDB(function($db) use ($upSchools) {
				// 	// get the total already ordered
				// $totalStmt = $db->prepare("SELECT so.schoolOrderID, COALESCE(SUM(si.sOrderItemsQuantity), 0) AS ordered
				// 						FROM schoolorders so
				// 						LEFT JOIN sorderitems si ON si.schoolOrderID = so.schoolOrderID
				// 						WHERE so.schoolID = :schoolID 
				// 							AND so.eventSiteHasDivisionID = :esdID
				// 							AND so.genderID = :genderID
				// 						GROUP BY so.schoolOrderID
				// 					");
				
					// this will UPDATE records for existing sizes, and create new records for nonexisting
				$upsrtStmt = $db->prepare("INSERT INTO schoolorders (eventSiteHasDivisionID, 
										schoolID, qualifiers)
										VALUES (:esdID, :schoolID, :qlfrs)
										ON DUPLICATE KEY UPDATE 
											qualifiers = VALUES(qualifiers)
									");
				
				foreach ($upSchools as &$s) {
					// 	// get the total already ordered
					// $totalStmt->execute([
					// 	':schoolID' => $s['id'], 
					// 	':esdID' => $s['esdID'], 
					// 	':genderID' => 0
					// ]);
					// $result = $totalStmt->fetch();
					// $ordered = (int) ($result['ordered'] ?? 0);
					// $s['ordered'] = $ordered;

					// 	// set completeness based on $ordered
					// $completeness = null;
					// if ($ordered === 0) {
					// 	$completeness = 4;
					// } elseif ($ordered > $s['qualifiers']) {
					// 	$completeness = 3;
					// }
					// $s['completeness'] = $completeness;

					$upsrtStmt->execute([
						':esdID' => $s['esdID'],
						':schoolID' => $s['id'],
						':qlfrs' => (int) $s['qualifiers']
					]);
				}
				
				return ['upSchools' => $upSchools];
			});
		}
	}
}
?>
