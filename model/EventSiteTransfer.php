<?php
class EventSiteTransfer extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'eventsitetransfers'; }
   protected static function getPrimaryKey(): string { return 'eventSiteTransferID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return [
         'id' => 'eventSiteTransferID', 
         'eventSiteID' => 'eventSiteID', 
         'transferID' => 'transferID',
         'startQ' => 'startQ',
			'soldQ' => 'soldQ',
         'price' => 'price',
			'cost' => 'mcuCost'
      ]; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array { 
		return [ new Relation('transfer', 'Transfer', 'transferID', 'transferID', false, null, ['inventory']) ];
	}
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventSiteID,
		public readonly int $transferID,
      public readonly ?int $startQ,
		public readonly ?int $soldQ,
      public readonly float $price,
		public readonly float $cost,
		public readonly ?Transfer $transfer = null
	) {}


		//////////////////////////////////////////////////////
		// Database functions	
	public static function editTransfers($db, $eventSiteID, $transfers) {
			// match values to column names and upsert
		$rows = array_map(fn($row) => [
			'eventSiteID' => $eventSiteID,
			'transferID'  => $row['transferID'],
			'startQ'      => $row['quantity'],
			'price'       => $row['price']
		], $transfers);

		self::upsertMany($rows, ['startQ'], $db);

			// DELETE records that have been changed to 0
		$stmt = $db->prepare("DELETE FROM eventsitetransfers WHERE eventSiteID = :eventSiteID AND startQ = 0");
		$stmt->execute([':eventSiteID' => $eventSiteID]);
	}
}
?>