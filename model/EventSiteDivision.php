<?php
class EventSiteDivision extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'eventsitehasdivision'; }
   protected static function getPrimaryKey(): string { return 'eventSiteHasDivisionID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteHasDivisionID', 'eventSiteID' => 'eventSiteID', 'division' => 'divisionID']; 
	}
		// defined as: new Relation($property, $class, $matchKey, $isMany, $interTable)
	protected static function getRelations(): array { 
		return [new Relation('division', 'Division', 'divisionID'), 
					new Relation('schoolOrders', 'SchoolOrder', 'eventSiteHasDivisionID', true)
		];}
		
	public readonly ?string $name;
	public readonly array $schoolOrders;
	
	public function __construct(
      public readonly int $id,
      public readonly int $eventSiteID,
      public readonly Division $division,
			// default empty array
		array $schoolOrders = []
   ) {
		$this->name = $division->name;
		$this->schoolOrders = self::organizeSchoolOrders($schoolOrders);
	}
		
		// // over ride base class method to include private properties
   // public function jsonSerialize(): array {
      // return [
         // 'id' => $this->id,
         // 'eventSiteID' => $this->eventSiteID,
         // 'division' => $this->division,
         // 'schoolOrders' => $this->schoolOrders
      // ];
   // }

	// 	// returns the sent array keyed and sorted
	private static function organizeSchoolOrders($orders) {
		$organized = [];
		foreach ($orders as $order) {
			$organized[$order->school->shortName] = $order;
		}
		ksort($organized);
		return $organized;
	}
	
	
	//////////////////////////////////////////////////////
	// Database functions	
	public static function getIDByEventAndDivision($eventID, $divisionID) {
		$query = "SELECT eventSiteHasDivisionID FROM eventSiteHasDivision 
					INNER JOIN eventSites ON eventSites.eventSiteID = eventSiteHasDivision.eventSiteID 
					WHERE eventID = :eventID AND divisionID = :divisionID";
		$rows = static::getFromDB($query, [':eventID' => $eventID, ':divisionID' => $divisionID]);
		return !empty($rows) ? $rows[0]['eventSiteHasDivisionID'] : null;
	}
}
?>