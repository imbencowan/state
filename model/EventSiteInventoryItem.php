<?php
	// i should explain how this is different from the Division class. 
	// i made this so it could fit in the structure of event->eventSites->eventSiteDivisions->orders
		// because orders have schools, and schools have divisions, and /those/ divisions should not have arrays of orders
	
class EventSiteInventoryItem extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'eventsiteinventories'; }
   protected static function getPrimaryKey(): string { return 'eventSiteInventoryID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return [
         'id' => 'eventSiteInventoryID', 
         'eventSiteID' => 'eventSiteID', 
         'itemID' => 'itemID',
         'startQ' => 'startQ',
         'endQ' => 'endQ',
         'addedQ' => 'addedQ',
         'removedQ' => 'removedQ', 
         'price' => 'price'
      ]; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array { 
		// return [ new Relation('item', 'Item', 'itemID', 'itemID') ];
		return [ new Relation('item', 'Item', 'itemID', 'itemID', false, null, ['inventory']) ];
	}
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventSiteID,
		public readonly int $itemID,
      public readonly ?int $startQ,
      public readonly ?int $endQ,
      public readonly ?int $addedQ,
      public readonly ?int $removedQ,
      public readonly float $price,
		public readonly ?Item $item = null
	) {}
	
	
		//////////////////////////////////////////////////////
		// Database functions	
	public static function editItems($db, $eventSiteID, $items) {
		$rows = array_map(fn($row) => [
			'eventSiteID' => $eventSiteID,
			'itemID'      => $row['itemID'],
			'startQ'      => $row['quantity'],
			'price'       => $row['price']
		], $items);

		self::upsertMany($rows, ['startQ'], $db);

			// DELETE records that have been changed to 0
		$stmt = $db->prepare("DELETE FROM eventsiteinventories WHERE eventSiteID = :eventSiteID AND startQ = 0");
		$stmt->execute([':eventSiteID' => $eventSiteID]);
	}
}
?>