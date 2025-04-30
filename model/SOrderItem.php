<?php 
class SOrderItem extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'sorderitems'; }
   protected static function getPrimaryKey(): string { return 'sOrderItemsID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sOrderItemsID', 
					'schoolOrderID' => 'schoolOrderID', 
					'item' => 'itemID', 
					'quantity' => 'sOrderItemsQuantity']; 
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
			// Item only, no circular reference
	protected static function getRelations(): array {
      return [new Relation('item', 'Item', 'itemID', false)];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $schoolOrderID,
      public readonly ?Item $item,
      public readonly int $quantity
   ) {}
	

	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
	public static function addAddOns($data) {
		$orderID = $data['schoolOrderID'];
		$addItems = $data['addItems'];
		$query = "SELECT itemID FROM sorderitems WHERE schoolOrderID = :schoolOrderID";
			// use the parent method to get existing itemIDs for the order
		$priorItems = SOrderItem::getFromDB($query, [':schoolOrderID' => $orderID]);
			// make arrays of itemIDs
		$priorItemIDs = array_column($priorItems, 'itemID');
		$addItemIDs = array_column($addItems, 'itemID');
			// check for duplicates between the arrays
		$duplicates = array_intersect($priorItemIDs, $addItemIDs);
		
		if ($duplicates) {
				// bad request
					// might be nice to check and return what conflicted here
			http_response_code(400); 
			echo json_encode(['error' => "There is already an add on for at least one of the submitted items. 
									Check the order. No items were added"]);
			exit;
		} 
		
			// INSERT now
		try {
			$db = Database::getDB();
				// using a transaction
			$db->beginTransaction();

			$stmt = $db->prepare("INSERT INTO sorderitems (schoolOrderID, itemID, sOrderItemsQuantity) 
										VALUES (:orderID, :itemID, :quantity)");

			foreach ($addItems as $item) {
				$stmt->execute([
					':orderID' => $orderID,
					':itemID' => $item['itemID'],
					':quantity' => $item['quantity']
				]);
			}

			$db->commit();

			echo json_encode(['success' => true, 'message' => 'Add-ons successfully added.']);
		} catch (PDOException $e) {
			if ($db->inTransaction()) {
				$db->rollBack();
			}
			http_response_code(500);
			echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
			exit;
		}
	}
	
		// submit team sizes. insert, or update if there are prior entries from another MessageOrder
	public static function addTeamItems($orderID, $items) {
		try {
			$db = Database::getDB();
			$db->beginTransaction();
					
				// ON DUPLICATE KEY makes use of a UNIQUE constraint the table has on schoolOrderID+itemID
			$stmt = $db->prepare(
				"INSERT INTO sorderitems (schoolOrderID, itemID, sOrderItemsQuantity)
				 VALUES (:orderID, :itemID, :quantity)
				 ON DUPLICATE KEY UPDATE sOrderItemsQuantity = sOrderItemsQuantity + VALUES(sOrderItemsQuantity)"
			);

			foreach ($items as $itemID => $quantity) {
				$stmt->execute([
					':orderID' => $orderID,
					':itemID' => $itemID,
					':quantity' => $quantity
				]);
			}

			$db->commit();
		} catch (PDOException $e) {
			if ($db->inTransaction()) {
				$db->rollBack();
			}
			http_response_code(500);
			echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
			exit;
		}
	}

	// public static function addTeamItems($orderID, $items) {
		// $query = "SELECT itemID FROM sorderitems WHERE schoolOrderID = :schoolOrderID";
			// // use the parent method to get existing itemIDs for the order
		// $priorItems = SOrderItem::getFromDB($query, [':schoolOrderID' => $orderID]);
			// // make arrays of itemIDs
		// $priorItemIDs = array_column($priorItems, 'itemID');
		// $incomingItemIDs = array_column($items, 'itemID');
			// // check for duplicates between the arrays
		// $duplicates = array_intersect($priorItemIDs, $incomingItemIDs);
			// // make a useful array, so we don't have to run foreach every time we want a q by id from $priorItems
		// $priorQuantityMap = [];
		// foreach ($priorItems as $item) {
			// $priorQuantityMap[$item['itemID']] = $item['sOrderItemsQuantity'];
		// }

			// // INSERT and UPDATE
		// try {
			// $db = Database::getDB();
				// // using a transaction
			// $db->beginTransaction();
				
				// // prepare statements for INSERT and UPDATE
			// $insertStmt = $db->prepare("INSERT INTO sorderitems (schoolOrderID, itemID, sOrderItemsQuantity) 
												// VALUES (:orderID, :itemID, :quantity)");
			// $updateStmt = $db->prepare("UPDATE sorderitems SET sOrderItemsQuantity = :quantity
												// WHERE schoolOrderID = :orderID AND itemID = :itemID");

			// foreach ($items as $item) {
					// // update existing records
				// if (in_array($item['itemID'], $duplicates)) {
					// $updateStmt->execute([
						// ':orderID' => $orderID,
						// ':itemID' => $item['itemID'],
						// ':quantity' => $item['quantity'] + $priorQuantityMap[$item['itemID']]
					// ]);
				// } else {
						// // insert new records
					// $insertStmt->execute([
						// ':orderID' => $orderID,
						// ':itemID' => $item['itemID'],
						// ':quantity' => $item['quantity']
					// ]);
				// }
			// }

			// $db->commit();

		// } catch (PDOException $e) {
			// if ($db->inTransaction()) {
				// $db->rollBack();
			// }
			// http_response_code(500);
			// echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
			// exit;
		// }
	// }
}
?>