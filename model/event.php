<?php
class Event implements JsonSerializable {
	private $eventID, $sports, $eventYear, $startDate, $endDate, $eventSites;
		// eventSites is not included in construction; an Event *can* have EventSites, but is not required to
			// eventSites will be an array of EventSites that belong to the Event

	public function __construct($eventID, $sport, $eventYear, $startDate, $endDate) {
		$this->eventID = $eventID;
		$this->sports[] = $sport;
		$this->eventYear = $eventYear;
		$this->startDate = new DateTime($startDate);
		$this->endDate = new DateTime($endDate);
		$this->eventSites = []; // Initialize as an empty array, can be populated later
	}

	public function jsonSerialize() {
		return [
			'eventID' => $this->eventID,
			'sports' => $this->sports,
			'eventYear' => $this->eventYear,
			'startDate' => $this->startDate,
			'endDate' => $this->endDate,
			'eventSites' => $this->eventSites
		];
	}

	public function getEventID() { return $this->eventID; }
	public function setEventID($value) { $this->eventID = $value; }

	public function getSports() { return $this->sports; }
	public function setSports($value) { $this->sports = $value; }
	public function pushSports($value) { $this->sports[] = $value; }

	public function getEventYear() { return $this->eventYear; }
	public function setEventYear($value) { $this->eventYear = $value; }

	public function getStartDate() { return $this->startDate; }
	public function setStartDate($value) { $this->startDate = $value; }

	public function getEndDate() { return $this->endDate; }
		// we should force this to be a DateTime
	public function setEndDate($value) { $this->endDate = $value; }
	
	public function getDateRangeString() {
		$start = $this->startDate->format('F j');
			// check if it is a one day event
		if ($this->startDate == $this->endDate) {
			return $start;
		} else {
				// check if the event starts and ends within the same month to format correctly
			if ($this->startDate->format('Y-m') === $this->endDate->format('Y-m')) {
				$end = $this->endDate->format('j');
				$conjunction = '-';
			} else {
				$end = $this->endDate->format('F j');
				$conjunction = ' - ';
			}
			return $start . $conjunction . $end;	
		}
	}
	
		// this only handles events with 2 or fewer sports. hopefully that's all we ever need
	public function getEventName() {
		if (count($this->sports) == 1) {
			return $this->sports[0]->name;
			//this only handles two sports. it's only purpose is to handle Dance & Cheer
		} else {
			return $this->sports[0]->name . ' & ' . $this->sports[1]->name;
		}
	}

	public function getEventSites() { return $this->eventSites; }
	// public function setEventSites(array $value) { $this->eventSites[] = $value; }
		// key the array for ease of access
	public function pushEventSites($value) { $this->eventSites[$value->getEventSiteID()] = $value; }
	
	public function getSeason() {
		if ($this->startDate->format('m') < 5) return 1;
		elseif ($this->startDate->format('m') == 5) return 2;
		elseif ($this->startDate->format('m') > 5) return 3;
	}
	
	

	/////////////////////////////////////////////////////////////////////////////////
	// db functions
	static function getEventByID($id) {
		$db = Database::getDB();

		$query = 'SELECT events.*, sports.sportName
					FROM events
					INNER JOIN sports ON events.sportID = sports.sportID	
					WHERE eventID = :eventID';				  
		$statement = $db->prepare($query);
		$statement->bindValue(":eventID", $id);
		$statement->execute();
		$rows = $statement->fetchAll();
		$statement->closeCursor();

		$row = $rows[0];
		$event = new Event($row[0], $row[1], $row[2], $row[3], $row[4], $row[5]);
		return $event;
	}
	
	public static function getIDBySportIDAndYear($sportID, $year) {
		$db = Database::getDB();
		$query = 'SELECT events.eventID FROM events 
					INNER JOIN eventHasSport ON events.eventID = eventHasSport.eventID
					WHERE sportID = :sportID AND eventYear = :year';
		$statement = $db->prepare($query);
		$statement->execute([':sportID' => $sportID, ':year' => $year]);
			// return the id or null
		return $statement->fetchColumn() ?: null;
	}
	
	public static function getEventOrdersBySportIDAndYear($sportID, $year) {
		$db = Database::getDB();
			// inner joins for the first two only, since events like football don't have sites until the week of.
		$query = "SELECT events.*, sports.*, eventSites.eventSiteID, eventSites.managerName, 
						eventSiteHasGender.genderID AS siteGenderID, sites.*, divisions.*,
						schoolOrders.isDone, schoolOrders.addedS, schoolOrders.addedM, schoolOrders.addedL, 
						schoolOrders.addedXL, schoolOrders.addedXXL, schoolOrders.addedXXXL, schoolOrders.due, 
						schoolOrders.paid, schoolOrders.schoolOrderNote, schoolOrders.invoiceSent, 
						schools.*, messageOrders.*, genders.genderName
					FROM events
					INNER JOIN eventHasSport ON events.eventID = eventHasSport.eventID
					INNER JOIN sports ON eventHasSport.sportID = sports.sportID
					LEFT JOIN eventSites ON events.eventID = eventSites.eventID
					LEFT JOIN sites ON eventSites.siteID = sites.siteID
					LEFT JOIN eventSiteHasDivision ON eventSites.eventSiteID = eventSiteHasDivision.eventSiteID 
					LEFT JOIN eventSiteHasGender ON eventSites.eventSiteID = eventSiteHasGender.eventSiteID 
					LEFT JOIN divisions ON eventSiteHasDivision.divisionID = divisions.divisionID
					LEFT JOIN schoolOrders ON events.eventID = schoolOrders.eventID
						AND divisions.divisionID = schoolOrders.divisionID
					LEFT JOIN schools ON schoolOrders.schoolID = schools.schoolID
					LEFT JOIN messageOrders ON schoolOrders.schoolOrderID = messageOrders.schoolOrderID
                    	AND (eventSiteHasGender.genderID = messageOrders.genderID
                        OR eventSiteHasGender.genderID IS NULL)
					LEFT JOIN genders ON MessageOrders.genderID = genders.genderID 
					WHERE eventHasSport.sportID = :sportID AND events.eventYear = :eventYear";
		$stmt = $db->prepare($query);
		$stmt->bindValue(':sportID', $sportID);
		$stmt->bindValue(':eventYear', $year);
		$stmt->execute();
		$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if ($rows) {
			$sports[$rows[0]['sportName']] = new Sport(
				$rows[0]['sportID'],
				$rows[0]['sportName'],
				$rows[0]['isGendered'],
				$rows[0]['isIndividualed'],
				$rows[0]['maxTeamSize'],
				$rows[0]['minDiv']
			);
				// if the sport is dance or cheer, add the other
			// if ($rows[0]['sportID'] == 10) {
				// $sports['Cheer'] = new Sport(11, 'Cheer', 0, 0, null);
			// } elseif ($rows[0]['sportID'] == 11) {
				// $sports['Dance'] = new Sport(10, 'Dance', 0, 0, null);
			// }
			
			foreach ($rows as $row) {
					// only add sites if there are sites to add
				if ($row['siteName']) {
						// make an easy reference
					$sport = &$sports[$row['sportName']];
						// add the eventSite if it has not been
					if (!array_key_exists($row['siteName'], $sport->getEventSites())) {
						$sport->pushEventSites(new EventSite(
							$row['eventSiteID'],
							$row['eventID'],
							new Site($row['siteID'], $row['siteName'], $row['siteCity']),
							$row['managerName'],
							null	// leave the vehicle as null, we don't want it for this.
						), $row['siteName']);
					}
					if ($row['divisionName']) {
							// an other easy reference, after eventSite additions
						$eventSite = &$sport->getEventSites()[$row['siteName']];
						$divisionName = $row['divisionName'];
						$divisionID = $row['divisionID'];
						$minDiv = $row['minDiv'];
						if ($divisionID < $minDiv) $divisionID = $minDiv;
						
							// we need to handle things a little differently for soccer, where teams will be 
								// separated by gender
						if ($row['sportName'] == 'Soccer' && $row['siteGenderID']) {
							if ($row['siteGenderID'] == 1) { $genderName = ' Boys';
							} else { $genderName = ' Girls'; }
							$divisionName = $row['divisionName'] . $genderName;
							if (!array_key_exists($divisionID, $eventSite->getDivisions())) {
								$eventSite->pushDivisions(new Division(
									$divisionID,
									$divisionName,
									$row['minPop'],
									$row['pre24Name']
								), $divisionID);
							}
						} else {
								// if not soccer, do it normal
							if (!array_key_exists($divisionID, $eventSite->getDivisions())) {
								$eventSite->pushDivisions(new Division(
									$divisionID,
									$divisionName,
									$row['minPop'],
									$row['pre24Name']
								), $divisionID);
							}
						}
	
						if ($row['schoolName'] && $row['messageOrderID']) {
							$mOrder = new MessageOrder(
								$row['messageOrderID'],
								$row['schoolOrderID'],
								$row['genderID'],
								$row['genderName'],
								new SizeList($row['s'], $row['m'], $row['l'], $row['xl'], $row['xxl'], $row['xxxl']),
								$row['orderedBy'],
								$row['orderText'],
								$row['fileName'],
								$row['orderDate']
							);					
							
								// easy reference
							$division = &$eventSite->getDivisions()[$divisionID];
							
		// if ($row['schoolID'] == 154) 
			// Test::logX([$row['divisionID'], $row['schoolID']]);
		
		
							if (!array_key_exists($row['schoolName'], $division->getSchoolOrders())) {
								$division->pushSchoolOrders(new SchoolOrder(
									$row['eventID'],
									null,		// null the division, no circular references
									new School($row['schoolID'], $row['schoolName'], null, null),	// no division or district
									$mOrder,
									$row['isDone'],
									$row['addedS'],
									$row['addedM'],
									$row['addedL'],
									$row['addedXL'],
									$row['addedXXL'],
									$row['addedXXXL'],
									$row['due'],
									$row['paid'],
									$row['schoolOrderID'],
									$row['schoolOrderNote'],
									$row['invoiceSent'],
								), $row['schoolName']);
							} else {
								$division->getSchoolOrders()[$row['schoolName']]->pushMessageOrders($mOrder);
							}
						}
					}
				}
				
			}
			
			$event = new Event(
				$rows[0]['eventID'], 
				null,
				$rows[0]['eventYear'],
				$rows[0]['startDate'],
				$rows[0]['endDate']
			);
			$event->setSports($sports);
			return $event;
		}
	}
	
	static function getEventsByYear($year) {
		$db = Database::getDB();

		$query = 'SELECT * FROM events
				  INNER JOIN sports ON events.sportID = sports.sportID
				  LEFT JOIN eventSites ON events.eventID = eventSites.eventID
				  LEFT JOIN vehicles ON eventSites.vehicleID = vehicles.vehicleID
				  LEFT JOIN sites ON eventSites.siteID = sites.siteID
				  LEFT JOIN eventSiteHasEmployee ON eventSites.eventSiteID = eventSiteHasEmployee.eventSiteID
				  LEFT JOIN employees ON eventSiteHasEmployee.employeeID = employees.employeeID
				  WHERE events.eventYear = :eventYear';

		$statement = $db->prepare($query);
		$statement->bindValue(":eventYear", $year);
		$statement->execute();
		$rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		$events = [];
		foreach ($rows as $row) {
		  $eventID = $row['eventID'];

			// add event to the events array, if it is not already there
		  if (!isset($events[$eventID])) {
					// Create a Sport object
				$sport = new Sport(
					 $row['sportID'],
					 $row['sportName'],
					 $row['isGendered'],
					 $row['isIndividualed'],
					 $row['maxTeamSize']
				);
					// Initialize the Event object
				$events[$eventID] = new Event(
					$eventID,
					$sport,
					$row['eventYear'],
					$row['startDate'],
					$row['endDate']
				);
		  }

// we have a problem here i think, if a site has multiple employees, will that site currently be pushed multiple times
		  
				// Add each event site to the event's eventSites array if site data exists
		  if ($row['siteID'] !== null) {
					
					// we should check if vehicleID is null, and not create a vehicle in that case
					
				$vehicle = new Vehicle($row['vehicleID'], $row['vehicleName'], $row['isUnique']);
				$site = new Site($row['siteID'], $row['siteName'], $row['city']);
				$eventSite = new EventSite(
					 $row['eventSiteID'],
					 $eventID,
					 $site,
					 $row['managerName'],
					 $vehicle
				);
				if ($row['employeeID'] !== null) {
					$eventSite->pushEmployees(new Employee(
						$row['employeeID'], 
						$row['employeeName'], 
						$row['employeeShortName'], 
						$row['phone'],
						$row['email']
					));
				}
				$events[$eventID]->pushEventSites($eventSite);
				
		  }
		}

		// Return an indexed array of Event objects
		return array_values($events);
	}

}
?>