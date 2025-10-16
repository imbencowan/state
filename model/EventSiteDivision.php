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
		return ['id' => 'eventSiteHasDivisionID', 'eventSiteID' => 'eventSiteID', 'division' => 'divisionID']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array { 
		return [
			new Relation('division', 'Division', 'divisionID', 'divisionID'), 
			new Relation('schoolOrders', 'SchoolOrder', 'eventSiteHasDivisionID', 'eventSiteHasDivisionID', 
						true, null, ['year', 'inventory'])
		];
	}
		
	public readonly ?string $name;
	public readonly array $schoolOrders;
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventSiteID,
		public readonly Division $division,
			// default empty array
		array $schoolOrders = []
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
			'division' => $this->division,
			'schoolOrders' => array_values($this->schoolOrders)
		];
	}
	
	
	//////////////////////////////////////////////////////
	// Database functions	
	public static function getIDByEventAndDivisionAndGender($eventID, $divisionID, $genderID = null) {
    if ($genderID && $genderID < 3) {
        // Query including gender join
        $query = 
		  		"SELECT esd.eventSiteHasDivisionID
            FROM eventSiteHasDivision AS esd
            INNER JOIN eventSites AS es ON es.eventSiteID = esd.eventSiteID
            INNER JOIN eventSiteHasGender AS esg ON esg.eventSiteID = es.eventSiteID
            WHERE es.eventID = :eventID
              AND esd.divisionID = :divisionID
              AND esg.genderID = :genderID
            LIMIT 1";
        $params = [
            ':eventID' => $eventID,
            ':divisionID' => $divisionID,
            ':genderID' => $genderID
        ];
    } else {
        // Query without gender filter
        $query = 
		  		"SELECT esd.eventSiteHasDivisionID
            FROM eventSiteHasDivision AS esd
            INNER JOIN eventSites AS es ON es.eventSiteID = esd.eventSiteID
            WHERE es.eventID = :eventID
              AND esd.divisionID = :divisionID
            LIMIT 1";
        $params = [
            ':eventID' => $eventID,
            ':divisionID' => $divisionID
        ];
    }

    $rows = static::getFromDB($query, $params);
    return !empty($rows) ? $rows[0]['eventSiteHasDivisionID'] : null;
}

}
?>