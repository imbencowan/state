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
	public static function addTransfers($db, $orderID, $addTransfers) {
		$data = [];

			// match values to columns and insert
		foreach ($addTransfers as $trnsfr) {
			$data[] = ['schoolOrderID' => $orderID, 
						'transferID' => $trnsfr['transferID'], 
						'sOrderTransfersQuantity' => $trnsfr['quantity']
						];
		}
		
		self::insertMany($data, $db);
	}


	public static function editTransfers($db, $orderID, $transfers) {
		$data = [];

			// match values to column names and upsert
		foreach ($transfers as $t) {
			$data[] = ['schoolOrderID' => $orderID,
						'transferID' => $t['transferID'],
						'sOrderTransfersQuantity' => $t['quantity']
						];
		}

		self::upsertMany($data, ['sOrderTransfersQuantity'], $db);

			// DELETE records that have been changed to 0
		$stmt = $db->prepare("DELETE FROM sordertransfers WHERE schoolOrderID = :orderID AND sOrderTransfersQuantity = 0");
		$stmt->execute([':orderID' => $orderID]);
	}
}
?>