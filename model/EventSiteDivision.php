<?php
	// i should explain how this is different from the Division class. 
	// i made this so it could fit in the structure of event->eventSites->eventSiteDivisions->orders
		// because orders have schools, and schools have divisions, and /those/ divisions should not have arrays of orders
	
class EventSiteDivision extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'eventsitehasdivision'; }
   protected static function getPrimaryKey(): string { return 'eventSiteHasDivisionID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteHasDivisionID', 'eventSiteID' => 'eventSiteID', 'divisionID' => 'divisionID']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [], $loadSeparate = false)
	protected static function getRelations(): array { 
		return [
			new Relation('division', 'Division', 'divisionID', 'divisionID'), 
			new Relation('schoolOrders', 'SchoolOrder', 'eventSiteHasDivisionID', 'eventSiteHasDivisionID', 
						true, null, [ 'year', 'inventory', 'reports' ], true)
		];
	}
		
	public readonly ?string $name;
	// public readonly array $schoolOrders;
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventSiteID,
		public readonly int $divisionID,
		public readonly Division $division,
			// default empty array
		// array $schoolOrders = []
		public array $schoolOrders = []
	) {
		$this->name = $division->name;
		usort($schoolOrders, fn($a, $b) => strcmp($a->school->shortName, $b->school->shortName));
		$this->schoolOrders = $schoolOrders;
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'eventSiteID' => $this->eventSiteID,
			'divisionID' => $this->divisionID,
			'division' => $this->division,
			'schoolOrders' => array_values($this->schoolOrders)
		];
	}
	
	
	//////////////////////////////////////////////////////
	// Database functions	
	public static function getIDByEventAndDivisionAndGender($eventID, $divisionID, $genderID = null) {
			// checks if there is a matching record in eventSiteHasGender to get the correct esd
		$query = "
			SELECT esd.eventSiteHasDivisionID
			FROM eventSiteHasDivision AS esd
			INNER JOIN eventSites AS es ON es.eventSiteID = esd.eventSiteID
			LEFT JOIN eventSiteHasGender AS esg
				ON esg.eventSiteID = es.eventSiteID
				AND esg.genderID = :genderID
			WHERE es.eventID = :eventID
				AND esd.divisionID = :divisionID
				AND ( :genderID IS NULL
						OR esg.eventSiteID IS NOT NULL
						OR NOT EXISTS (SELECT 1 FROM eventSiteHasGender gchk WHERE gchk.eventSiteID = es.eventSiteID)
					)
			ORDER BY (esg.eventSiteID IS NOT NULL) DESC
			LIMIT 1
		";

		$params = [
			':eventID'    => $eventID,
			':divisionID' => $divisionID,
			':genderID'   => $genderID
		];

		$rows = static::getFromDB($query, $params);
		return !empty($rows) ? $rows[0]['eventSiteHasDivisionID'] : null;
	}


}
?>