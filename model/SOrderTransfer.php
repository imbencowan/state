<?php 
class SOrderTransfer extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'sordertransfers'; }
   protected static function getPrimaryKey(): string { return 'sOrderTransfersID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sOrderTransfersID', 
					'schoolOrderID' => 'schoolOrderID', 
					'transferID' => 'transferID', 
					'quantity' => 'sOrderTransfersQuantity',
					'price' => 'orderPrice'
					]; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
			// Item only, no circular reference
	protected static function getRelations(): array {
      return [new Relation('transfer', 'Transfer', 'transferID', 'transferID')];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $schoolOrderID,
		public readonly int $transferID,
      public readonly ?Transfer $transfer,
      public readonly int $quantity,
		public readonly float $price
   ) {}
	

	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
	public static function addAddOns($orderID, $addItems) {
		$query = "SELECT transferID FROM sordertransfers WHERE schoolOrderID = :schoolOrderID";
			// use the parent method to get existing itemIDs for the order
		$priorItems = SOrderTransfer::getFromDB($query, [':schoolOrderID' => $orderID]);
			// make arrays of itemIDs
		$priorItemIDs = array_column($priorItems, 'transferID');
		$addItemIDs = array_column($addItems, 'transferID');
			// check for duplicates between the arrays. don't *add* some thing that already exists
		$duplicates = array_intersect($priorItemIDs, $addItemIDs);
		
		if ($duplicates) {
				// bad request
					// might be nice to check and return what conflicted here
			http_response_code(400); 
			return ['error' => "There is already an add on for at least one of the submitted items. 
									Check the order. No items were added"];
			exit;
		} 
		
			// INSERT now
		try {
			$db = Database::getDB();
				// using a transaction
			$db->beginTransaction();

				// add the items
			foreach ($addItems as $item) {
				$data = ['schoolOrderID' => $orderID, 
							'transferID' => $item['transferID'], 
							'sOrderItemsQuantity' => $item['quantity']
							];
				self::insert($data);
			}
			
				// UPDATE due
			$due = SchoolOrder::updateDue($db, $orderID);
				// UPDATE completeness IF currently complete
			SchoolOrder::updateCompletenessIf($orderID, 1, 2);
				// UPDATE invoiceDate ($id, ['column': $value])
			SchoolOrder::updateByID($orderID, ['invoiceDate' => date('Y-m-d')]);
				// UPDATE invoiceVersion
			SchoolOrder::updateInvoiceVersion($orderID);

			$db->commit();

			return [ 'newOrder' => SchoolOrder::getByID($orderID), 'message' => 'Add-ons successfully added.' ];
		} catch (PDOException $e) {
			if ($db->inTransaction()) {
				$db->rollBack();
			}
			http_response_code(500);
			return ['error' => 'Database error: ' . $e->getMessage() ];
			exit;
		}
	}
}
?>