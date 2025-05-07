<?php
class EventSite extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'eventsites'; }
   protected static function getPrimaryKey(): string { return 'eventSiteID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteID', 
					'eventID' => 'eventID', 
					'site' => 'siteID',
					'managerName' => 'managerName',
					'vehicle' => 'vehicleID'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
      return [new Relation('site', 'Site', 'siteID', 'siteID', false),
					new Relation('vehicle', 'Vehicle', 'vehicleID', 'vehicleID', false), 
					new Relation('divisions', 'EventSiteDivision', 'eventSiteID', 'eventSiteID', true),
					new Relation('employees', 'Employee', 'eventSiteID', 'employeeID', true, 'eventSiteHasEmployee')];
   }
	
	public readonly array $divisions;
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $eventID,
      public readonly ?Site $site,
      public readonly ?string $managerName,
      public readonly ?Vehicle $vehicle,
		array $divisions = [],
		public readonly array $employees = []
   ) {
		$this->divisions = self::organizeDivisions($divisions);
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'eventID' => $this->eventID,
			'site' => $this->site,
			'managerName' => $this->managerName,
			'vehicle' => $this->vehicle,
			'divisions' => array_values($this->divisions),
			'employees' => $this->employees
		];
	}
	
		// returns the sent array keyed and sorted
	private static function organizeDivisions($divisions) {
		$organized = [];
		foreach ($divisions as $division) {
			$organized[$division->name] = $division;
		}
		krsort($organized);
		return $organized;
	}
	
}


	
	// public function getDivisionsDisplay() {
			// // get all the division IDs in an array
		// if (!empty($this->divisions)) {
			// $divIDs = [];
			// foreach ($this->divisions as $div) { $divIDs[] = $div->id; }
				// // if there is only one division return it's name
			// if (count($divIDs) == 1) {
					// // reset() works for this because there is only one id in the array
				// return $this->divisions[reset($divIDs)]->name;
			// } else {
					// // get the min and max
				// $minDiv = min($divIDs);
				// $maxDiv = max($divIDs);
				
					// // i'm like pretty sure this correctly checks that the range of ids is continuous
				// if (($maxDiv - $minDiv) == (count($divIDs) - 1)) {
					// return $this->divisions[$minDiv]->name . '-' . $this->divisions[$maxDiv]->name;
				// } else {
						// // this is for sites like football that might not have a continuous range of divisions
					// $divNames = [];
					// foreach ($divIDs as $id) { $divNames[] = $this->divisions[$id]->name; }
					// sort($divNames);
					// return implode(', ', $divNames);
				// }
			// }
		// } else {
				// // return '' or 'TBD' for no divisions?
			// return '';
		// }
	// }

	// public function getEmployees() { return $this->employees; }
	// // public function setEmployees($value) { $this->employees = $value; }
	// public function pushEmployees($value) { $this->employees[$value->id] = $value; }
	// public function getEmployeesString() {
		// $employeeNames = [];
		// foreach ($this->employees as $employee) { $employeeNames[] = $employee->shortName; }
		// return implode(', ', $employeeNames); 
	// }



	// ////////////////////////////////////////////////
	// // db functions
	

		// // get all EventSites for a given Event
	// static function getEventSitesByEventID($eventID) {
		// $db = Database::getDB();

		// $query = 'SELECT * FROM eventSites
					// INNER JOIN sites ON eventSites.siteID = sites.siteID
					// LEFT JOIN vehicles ON eventSites.vehicleID = vehicles.vehicleID
					// LEFT JOIN sites ON eventSites.siteID = sites.siteID
					// WHERE eventID = :eventID';
		// $statement = $db->prepare($query);
		// $statement->bindValue(":eventID", $eventID);
		// $statement->execute();
		// $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		// $statement->closeCursor();

		// $eventSites = [];
		// foreach ($rows as $row) {
			// $vehicle = new Vehicle($row['vehicleID'], $row['vehicleName'], $row['isUnique']);
			// var_dump($vehicle);
			// $eSite = new EventSite(
				// $row['eventSiteID'], 
				// $row['eventID'], 
				// $row['siteID'], 
				// $row['managerName'], 
				// $vehicle
			// );
			
			// $eventSites[] = $eSite;
		// }
		// return $eventSites;
	// }
?>
