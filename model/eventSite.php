<?php
class EventSite extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'eventsites'; }
   protected static function getPrimaryKey(): string { return 'eventSiteID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteID', 
					'eventID' => 'eventID', 
					'siteID' => 'siteID',
					'managerName' => 'managerName',
					'startDate' => 'startDate',
					'endDate' => 'endDate',
					'cost2X' => 'cost2X',
					'price2X' => 'price2X',
					'cost3X' => 'cost3X',
					'price3X' => 'price3X',
					'cost4X' => 'cost4X',
					'price4X' => 'price4X'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [], $loadSeparate = false)
	protected static function getRelations(): array {
      return [new Relation('site', 'Site', 'siteID', 'siteID', false, null, ['employees']),
				new Relation('esDivisions', 'EventSiteDivision', 'eventSiteID', 'eventSiteID', true, null, ['employees']),
				new Relation('gender', 'Gender', 'eventSiteID', 'genderID', false, 'eventsitehasgender'),
				new Relation('vehicles', 'Vehicle', 'eventSiteID', 'vehicleID', true, 'eventsitehasvehicle'), 
				new Relation('employees', 'EventSiteEmployee', 'eventSiteID', 'eventSiteID', true), 
				new Relation('inventory', 'EventSiteInventoryItem', 'eventSiteID', 'eventSiteID', true, null, 
								['year', 'orders', 'employees'], true),
				new Relation('transfers', 'EventSiteTransfer', 'eventSiteID', 'eventSiteID', true, null, 
								['year', 'orders', 'employees']),
				new Relation('costs', 'EventSitecost', 'eventSiteID', 'eventSiteID', true, null, 
								['year', 'employees'])
				];
   }
	
	public readonly array $esDivisions;
	
	public function __construct(
		public readonly ?int $id,
		public readonly int $eventID,
		public readonly int $siteID,
		public readonly ?Site $site,
		public readonly ?string $managerName,
		string|DateTime|null $startDate, 
		string|DateTime|null $endDate, 
		public readonly ?Gender $gender, 
		public readonly ?float $price2X,
		public readonly ?float $cost2X,
		public readonly ?float $price3X,
		public readonly ?float $cost3X,
		public readonly ?float $price4X,
		public readonly ?float $cost4X,
    	public readonly array $vehicles = [],
		array $esDivisions = [],
		public readonly array $employees = [],
		public readonly array $inventory = [],
		public readonly array $transfers = [],
		public readonly array $costs = []
   ) {
		$this->esDivisions = self::organizeDivisions($esDivisions);
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'eventID' => $this->eventID,
			'site' => $this->site,
			'siteID' => $this->siteID,
			'gender' => $this->gender,
			'managerName' => $this->managerName,
			'vehicles' => $this->vehicles,
			'esDivisions' => array_values($this->esDivisions),
			'employees' => $this->employees,
			'inventory' => $this->inventory,
			'transfers' => $this->transfers,
			'costs' => $this->costs,
			'plusSizePricing' => $this->getPlusSizePricing()
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
		return array_map(fn($e) => $e->employee->shortName, $this->employees);
	}

	public function getVehicleNames(): array {
		return array_map(fn($v) => $v->name, $this->vehicles);
	}

	public function getPlusSizePricing(): mixed {
		return [
			'2X' => [
				'price' => $this->price2X,
				'cost' => $this->cost2X
			],
			'3X' => [
				'price' => $this->price3X,
				'cost' => $this->cost3X
			],
			'4X' => [
				'price' => $this->price4X,
				'cost' => $this->cost4X
			]
		];
	}

	public static function getCosts($esID): array {
			// where conditions. // see Where.php and Condition.php for explanation
		$whr = new Where([ new Condition(['eventsitecosts'], 'eventSiteID', $esID) ]);

		return ['costs' => EventSiteCost::getAllFromDB(where: $whr)];
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
						// editing the division is currently disabled, probably for ever.
						// self::updateInterTable(['eventSiteID' => $eventSiteID], []);
						break;

					case 'manager':
						self::updateByID($eventSiteID, ['managerName' => $value]);
						break;

					case 'employees':
						$rows = array_map(fn($employeeID) => ['employeeID' => $employeeID], $value);
							// (array $parent, array $rows, array $keyColumns, array $path, ?string $context = null)
						EventSiteEmployee::syncByParent(['eventSiteID' => $eventSiteID], $rows, ['employeeID'], 
																	['eventsitehasemployee'], 'employees');
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

	public static function showInventories($year) {
		$idQuery = "SELECT eventID FROM events WHERE eventYear = :year";
		$rows =  Event::getFromDB($idQuery, ['year' => $year]);

		$events = [];
		foreach ($rows as $row) {
			$events[] = Event::getByID($row['eventID'], 'inventory');
		}
		return $events;
	}

	public static function editEventSiteInventory($eventSiteID, $updateItems = [], $updateTransfers = []) {
			// use withDB to avoid some thing like a partial update
		return Database::withDB(function($db) use ($eventSiteID, $updateItems, $updateTransfers) {
			EventSiteInventoryItem::editItems($db, $eventSiteID, $updateItems);
			EventSiteTransfer::editTransfers($db, $eventSiteID, $updateTransfers);
		});
	}

	public static function genBaseInventory($esID) {
			// where conditions. // see Where.php and Condition.php for explanation
		$where = new Where([ new Condition(['apparel'], 'inventoryMinimum', 0, '>') ]);
		$minInvItems = Item::getAllFromDB(null, null, $where);

		$inventoryItems = array_map(fn(Item $item) => 
								EventSiteInventoryItem::fromItem($item, $esID), $minInvItems);

		$rows = array_map(fn($obj) => $obj->toRow(), $inventoryItems);
		EventSiteInventoryItem::insertMany($rows);

		return [ 'items' => $inventoryItems ];
	}

		// update an eventSite's inventory and transfers cost/price
	public static function syncInventoryPricing($esID) {
		$db = Database::getDB();

		$q1 = "UPDATE eventsiteinventories esi
				JOIN apparel a ON esi.itemID = a.itemID
				SET esi.price = a.price, esi.mcuCost = a.mcuCost
				WHERE esi.eventSiteID = :esID";

		$statement = $db->prepare($q1);
		$statement->execute([ ':esID' => $esID ]);

		$q2 = "UPDATE eventsitetransfers est
				JOIN transfers t ON est.transferID = t.transferID
				SET est.price = t.price, est.mcuCost = t.mcuCost
				WHERE est.eventSiteID = :esID";

		$statement = $db->prepare($q2);
		$statement->execute([ ':esID' => $esID ]);
	}

	public static function editCostAndPrice($updates) {
		// Test::logX('here', $updates);
			// use withDB to avoid some thing like a partial update
		return Database::withDB(function($db) use ($updates) {
			EventSiteInventoryItem::updateRowsByIDs($updates['garments'], $db);
			EventSiteInventoryItem::updateRowsByIDs($updates['accessories'], $db);
			EventSiteTransfer::updateRowsByIDs($updates['transfers'], $db);
			EventSite::updateRowsByIDs($updates['plusSize'], $db);
		});
	}
}
?>
