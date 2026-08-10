<?php 
class SOrderItem extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'sorderitems'; }
   protected static function getPrimaryKey(): string { return 'sOrderItemsID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sOrderItemsID', 
					'schoolOrderID' => 'schoolOrderID', 
					'itemID' => 'itemID', 
					'quantity' => 'sOrderItemsQuantity',
					'price' => 'orderPrice'
					]; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
			// Item only, no circular reference
	protected static function getRelations(): array {
      // return [new Relation('item', 'Item', 'itemID', 'itemID', false, null, [''])];
      return [new Relation('item', 'Item', 'itemID', 'itemID', false, null, ['orders', 'results', 'inventory', 'year'])];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $schoolOrderID,
		public readonly int $itemID,
      public readonly int $quantity,
		public readonly float $price,
      public readonly ?Item $item = null
   ) {}
	

	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
	public static function addItems($db, $orderID, $addItems) {
		if (empty($addItems)) return;
			// first we need to get the prices

			// collect itemIDs
		$itemIDs = array_column($addItems, 'itemID');

		$inPlaceholders = implode(',', array_fill(0, count($itemIDs), '?'));
			// fetch current prices
		$stmt = $db->prepare("SELECT itemID, price FROM apparel WHERE itemID IN ($inPlaceholders)");
		$stmt->execute($itemIDs);

			// [itemID => price]
		$prices = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
		

		$data = [];
			// now match values to column names and insert
		foreach ($addItems as $item) {
			$data[] = ['schoolOrderID' => $orderID, 
						'itemID' => $item['itemID'], 
						'sOrderItemsQuantity' => $item['quantity'],
           			'orderPrice' => $prices[$item['itemID']] ?? 0
						];
		}
		
		self::insertMany($data, $db);
	}


	public static function editItems($db, $orderID, $items) {
		$data = [];

			// match values to column names and upsert
		foreach ($items as $item) {
			$data[] = ['schoolOrderID' => $orderID,
						'itemID' => $item['itemID'],
						'sOrderItemsQuantity' => $item['quantity']
						];
		}

		self::upsertMany($data, ['sOrderItemsQuantity'], $db);

			// DELETE records that have been changed to 0
		$stmt = $db->prepare("DELETE FROM sorderitems WHERE schoolOrderID = :orderID AND sOrderItemsQuantity = 0");
		$stmt->execute([':orderID' => $orderID]);
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
			return [ 'error' => 'Database error: ' . $e->getMessage() ];
			exit;
		}
	}
}
?>