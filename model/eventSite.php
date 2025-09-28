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
					'startDate' => 'startDate',
					'endDate' => 'endDate'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
      return [new Relation('site', 'Site', 'siteID', 'siteID', false),
				new Relation('esDivisions', 'EventSiteDivision', 'eventSiteID', 'eventSiteID', true),
				new Relation('gender', 'Gender', 'eventSiteID', 'genderID', false, 'eventsitehasgender'),
				new Relation('vehicles', 'Vehicle', 'eventSiteID', 'vehicleID', true, 'eventsitehasvehicle'), 
				new Relation('employees', 'Employee', 'eventSiteID', 'employeeID', true, 'eventsitehasemployee')];
   }
	
	public readonly array $esDivisions;
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventID,
		public readonly ?Site $site,
		public readonly ?string $managerName,
		string|DateTime|null $startDate, 
		string|DateTime|null $endDate, 
		public readonly ?Gender $gender, 
    	public readonly array $vehicles = [],
		array $esDivisions = [],
		public readonly array $employees = []
   ) {
		$this->esDivisions = self::organizeDivisions($esDivisions);
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'eventID' => $this->eventID,
			'site' => $this->site,
			'gender' => $this->gender,
			'managerName' => $this->managerName,
			'vehicles' => $this->vehicles,
			'esDivisions' => array_values($this->esDivisions),
			'employees' => $this->employees
		];
	}
	
		// returns the sent array keyed and sorted
	private static function organizeDivisions($esDivisions) {
		$organized = [];
		foreach ($esDivisions as $division) {
			$organized[$division->name] = $division;
		}
		krsort($organized);
		return $organized;
	}


	
	public function getDivisionsDisplay() {
		$divStr = '';
			// get all the division IDs in an array
		if (!empty($this->esDivisions)) {
			$divs = [];
			foreach ($this->esDivisions as $esDiv) { 
				$divs[$esDiv->division->id] = $esDiv->division->name; 
			}
				// if there is only one division return it's name
			if (count($divs) == 1) {
					// access value without key name
				$divStr = array_values($divs)[0];
			} else {
					// for multiple divisions
				$ids = array_keys($divs);
				sort($ids);
				$minId = $ids[0];
				$maxId = end($ids);

					// use a - for a range if there are > 2 divisions, and they are continuous
				if ((($maxId - $minId + 1) === count($ids)) && (count($ids) > 2)) {
					$divStr = $divs[$minId] . ' - ' . $divs[$maxId];
				} else {
						// otherwise separate with a /
					$names = array_values($divs);
					sort($names);
					$divStr = implode(' / ', $names);
				}
			}
		} 
		if($this->gender) $divStr .= ' ' . $this->gender->name;
			// return '' or 'TBD' for no esDivisions?
		return $divStr;
	}

		// return a numerical array, using array_values(), so client side receives an array, not an object
	public function getDivisionsIDs(): array {
		return array_map(fn($esd) => $esd->division->id, array_values($this->esDivisions));
	}

	public function getEmployeeShortNames(): array {
		return array_map(fn($e) => $e->shortName, $this->employees);
	}

	public function getVehicleNames(): array {
		return array_map(fn($v) => $v->name, $this->vehicles);
	}


		///////////////////////////////////////////////////////////////////////////////////////////
		// user actions
	public static function editEventSiteFromRow($eventSiteID, $updateValues) {
		foreach ($updateValues as $key => $value) {
			switch ($key) {
					case 'site':
						self::updateByID($eventSiteID, ['siteID' => $value]);
						break;

					case 'divisions':
						// self::updateInterTable(['eventSiteID' => $eventSiteID], []);
						break;

					case 'manager':
						self::updateByID($eventSiteID, ['managerName' => $value]);
						break;

					case 'employees':
						self::updateInterTable(['eventSiteID' => $eventSiteID], ['employeeID' => $value]);
						break;

					case 'vehicles':
						self::updateInterTable(['eventSiteID' => $eventSiteID], ['vehicleID' => $value]);
						break;

					default:
						// optional: handle unknown keys
						throw new InvalidArgumentException("Invalid column: $key");
			}
		}
		return 'made it to the server function';
	}

}
?>
