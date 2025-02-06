<?php
class EventSite implements JsonSerializable {
	private $eventSiteID, $eventID, $site, $managerName, $vehicle, $divisions, $employees;
		// employees is not included in construction; an EventSite *can* have employees, but is not required to
			// employees will be an array of employees associated with the EventSite

		// site can be empty. 
	public function __construct($eventSiteID, $eventID, ?Site $site, $managerName, $vehicle) {
		$this->eventSiteID = $eventSiteID;
		$this->eventID = $eventID;
		$this->site = $site;
		$this->managerName = $managerName;
		$this->vehicle = $vehicle;
		$this->divisions = []; // initialize empty
		$this->employees = []; // Initialize as an empty array that can be populated later
	}

	public function jsonSerialize() {
		return [
			'eventSiteID' => $this->eventSiteID,
			'eventID' => $this->eventID,
			'site' => $this->site,
			'managerName' => $this->managerName,
			'vehicle' => $this->vehicle,
			'divisions' => $this->divisions,
			'employees' => $this->employees
		];
	}

	public function getEventSiteID() { return $this->eventSiteID; }
	public function setEventSiteID($value) { $this->eventSiteID = $value; }

	public function getEventID() { return $this->eventID; }
	public function setEventID($value) { $this->eventID = $value; }

	public function getSite() { return $this->site; }
	public function setSite($value) { $this->site = $value; }

	public function getmanagerName() { return $this->managerName; }
	public function setmanagerName($value) { $this->managerName = $value; }

	public function getVehicle() { return $this->vehicle; }
	public function setVehicle($value) { $this->vehicle = $value; }

	public function getDivisions() { return $this->divisions; }
	// public function setDivisions($value) { $this->divisions = $value; }
		// i gave this a key to make an associative array, since ids match names for the 6 divisions
	public function pushDivisions($value) { $this->divisions[$value->getDivisionID()] = $value; }
	
	public function getDivisionsDisplay() {
			// get all the division IDs in an array
		if (!empty($this->divisions)) {
			$divIDs = [];
			foreach ($this->divisions as $div) { $divIDs[] = $div->getDivisionID(); }
				// if there is only one division return it's name
			if (count($divIDs) == 1) {
					// reset() works for this because there is only one id in the array
				return $this->divisions[reset($divIDs)]->getDivisionName();
			} else {
					// get the min and max
				$minDiv = min($divIDs);
				$maxDiv = max($divIDs);
				
					// i'm like pretty sure this correctly checks that the range of ids is continuous
				if (($maxDiv - $minDiv) == (count($divIDs) - 1)) {
					return $this->divisions[$minDiv]->getDivisionName() . '-' . $this->divisions[$maxDiv]->getDivisionName();
				} else {
						// this is for sites like football that might not have a continuous range of divisions
					$divNames = [];
					foreach ($divIDs as $id) { $divNames[] = $this->divisions[$id]->getDivisionName(); }
					sort($divNames);
					return implode(', ', $divNames);
				}
			}
		} else {
				// return '' or 'TBD' for no divisions?
			return '';
		}
	}

	public function getEmployees() { return $this->employees; }
	// public function setEmployees($value) { $this->employees = $value; }
	public function pushEmployees($value) { $this->employees[$value->getEmployeeID()] = $value; }
	public function getEmployeesString() {
		$employeeNames = [];
		foreach ($this->employees as $employee) { $employeeNames[] = $employee->getEmployeeShortName(); }
		return implode(', ', $employeeNames); 
	}

	public function getEvent() { return $this->event; }
	public function setEvent($value) { $this->event = $value; }


	////////////////////////////////////////////////
	// db functions
		// get one EventSite by a given ID
	static function getEventSiteByID($id) {
		$db = Database::getDB();

		$query = 'SELECT * FROM event_sites
					WHERE eventSiteID = :eventSiteID';
		$statement = $db->prepare($query);
		$statement->bindValue(":eventSiteID", $id);
		$statement->execute();
		$rows = $statement->fetchAll();
		$statement->closeCursor();

		$row = $rows[0];
		$eventSite = new EventSite($row[0], $row[1], $row[2], $row[3], $row[4]);
		return $eventSite;
	}

		// get all EventSites for a given Event
	static function getEventSitesByEventID($eventID) {
		$db = Database::getDB();

		$query = 'SELECT * FROM eventSites
					INNER JOIN sites ON eventSites.siteID = sites.siteID
					LEFT JOIN vehicles ON eventSites.vehicleID = vehicles.vehicleID
					LEFT JOIN sites ON eventSites.siteID = sites.siteID
					WHERE eventID = :eventID';
		$statement = $db->prepare($query);
		$statement->bindValue(":eventID", $eventID);
		$statement->execute();
		$rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		$eventSites = [];
		foreach ($rows as $row) {
			$vehicle = new Vehicle($row['vehicleID'], $row['vehicleName'], $row['isUnique']);
			var_dump($vehicle);
			$eSite = new EventSite(
				$row['eventSiteID'], 
				$row['eventID'], 
				$row['siteID'], 
				$row['managerName'], 
				$vehicle
			);
			
			$eventSites[] = $eSite;
		}
		return $eventSites;
	}

	static function getEventSitesBySiteID($siteID) {
		$db = Database::getDB();

		$query = 'SELECT * FROM eventSites
					WHERE siteID = :siteID';
		$statement = $db->prepare($query);
		$statement->bindValue(":siteID", $siteID);
		$statement->execute();
		$rows = $statement->fetchAll();
		$statement->closeCursor();

		$eventSites = [];
		foreach ($rows as $row) {
			$eventSites[] = new EventSite($row[0], $row[1], $row[2], $row[3], $row[4]);
		}
		return $eventSites;
	}
}
?>
