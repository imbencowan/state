<?php
class Event extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'events'; }
   protected static function getPrimaryKey(): string { return 'eventID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventID',
					'sport' => 'sportID',
					'startDate' => 'startDate',
					'endDate' => 'endDate',
					'year' => 'eventYear'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
      return [new Relation('eventSites', 'EventSite', 'eventID', 'eventID', true), 
					new Relation('sport', 'Sport', 'sportID', 'sportID', false)];
   }
	
	public readonly DateTime $startDate;
	public readonly DateTime $endDate;
	public readonly array $eventSites;
	
	public function __construct(
      public readonly ?int $id,
		public readonly Sport $sport,
      string|DateTime $startDate, 
      string|DateTime $endDate, 
      public readonly int $year,
		array $eventSites
   ) {
		$this->startDate = is_string($startDate) ? new DateTime($startDate) : $startDate;
		$this->endDate = is_string($endDate) ? new DateTime($endDate) : $endDate;
		$this->eventSites = self::organizeEventSites($eventSites);
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'sport' => $this->sport,
			'startDate' => $this->startDate,
			'endDate' => $this->endDate,
			'year' => $this->year,
			'eventSites' => array_values($this->eventSites)
		];
	}
	
		// returns the sent array keyed and sorted
	private static function organizeEventSites($eventSites) {
		$organized = [];
		foreach ($eventSites as $eSite) {
			$organized[$eSite->site->name] = $eSite;
		}
		ksort($organized);
		return $organized;
	}
	
	public function getUnhandledComments() {
		$unhandled = [];
		foreach($this->eventSites as $eventSite) {
			foreach ($eventSite->divisions as $division) {
				foreach ($division->schoolOrders as $schoolOrder) {
					foreach ($schoolOrder->getMessageOrders() as $order) {
						if ($order->commentHandled == 0) {
							$o = new stdClass();
							$o->id = $order->id;
							$o->school = $schoolOrder->school->shortName;
							$o->division = $division->name;
							$o->comment = $order->comment;
							$unhandled[] = $o;
						}
					}
				}
			}
		}
		return $unhandled;
	}
	
	
		//////////////////////////////////////////////////
		// Database functions	
	public static function getOrdersBySportAndYear(int $sportID, int $year): ?static {
		$query = static::buildSelect() . " WHERE events.sportID = :id AND events.eventYear = :year";
		$rows = static::getFromDB($query, [':id' => $sportID, ':year' => $year]);
			// returns an array of events, but we only want one
// try changing these last two lines like Sport::getByName() to just return one instance
		$events = static::groupAndBuild($rows);
		if (empty($events)) {
			return null;
		}
		
			// this if logic is specifically to handle golf, which has two events in the year
				// it sets $event to which ever is closer by date
		if (count($events) > 0) {
			usort($events, function($a, $b) {
				$now = new DateTime();
				$diffA = abs($now->getTimestamp() - $a->startDate->getTimestamp());
				$diffB = abs($now->getTimestamp() - $b->startDate->getTimestamp());
				return $diffA <=> $diffB;
			});

			$event = $events[0];
		} else {
			$event = reset($events);
		}
			// send back the *first* element
		return !empty($events) ? $event : null;
	}
	
	public static function getIDBySportIDAndYear($sportID, $year) {
		$db = Database::getDB();
		$query = 'SELECT eventID, startDate FROM events 
					WHERE sportID = :sportID AND eventYear = :year';
		$statement = $db->prepare($query);
		$statement->execute([':sportID' => $sportID, ':year' => $year]);
		$events = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		if (empty($events)) {
			return null;
		}
		
		$closest = self::getCloserEvent($events);
			
			// return the id or null
		return $closest['eventID'] ?? null;
	}
	
	
	
		
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, displaying all items
	static function showEvent($year, $sportID) {
			// output has to be placed between ob_start() and ob_get_clean() as below
		ob_start(); 
			// we might be able to take the $year assignment out, but i can't test that right now
		
		$event = Event::getOrdersBySportAndYear($sportID, $year);
		
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/event.php';
			// Get the buffered content as a string
		$htmlContent = ob_get_clean(); 
		
		return [ 'html' => $htmlContent, 'data' => $event ];
	}
	
	
	///////////////////////////////////////
	// helper
	static function getCloserEvent($events) {
		$now = new DateTime();
		usort($events, function ($a, $b) use ($now) {
			$aDate = new DateTime($a['startDate']);
			$bDate = new DateTime($b['startDate']);
			return abs($now->getTimestamp() - $aDate->getTimestamp()) 
				  - abs($now->getTimestamp() - $bDate->getTimestamp());
		});
		
		return $events[0] ?? null;
	}
		
}


	
	// public function getDateRangeString() {
		// $start = $this->startDate->format('F j');
			// // check if it is a one day event
		// if ($this->startDate == $this->endDate) {
			// return $start;
		// } else {
				// // check if the event starts and ends within the same month to format correctly
			// if ($this->startDate->format('Y-m') === $this->endDate->format('Y-m')) {
				// $end = $this->endDate->format('j');
				// $conjunction = '-';
			// } else {
				// $end = $this->endDate->format('F j');
				// $conjunction = ' - ';
			// }
			// return $start . $conjunction . $end;	
		// }
	// }
	
	

	// /////////////////////////////////////////////////////////////////////////////////
	// // db functions


	
	// static function getEventsByYear($year) {
		// $db = Database::getDB();

		// $query = 'SELECT * FROM events
				  // INNER JOIN sports ON events.sportID = sports.sportID
				  // LEFT JOIN eventSites ON events.eventID = eventSites.eventID
				  // LEFT JOIN vehicles ON eventSites.vehicleID = vehicles.vehicleID
				  // LEFT JOIN sites ON eventSites.siteID = sites.siteID
				  // LEFT JOIN eventSiteHasEmployee ON eventSites.eventSiteID = eventSiteHasEmployee.eventSiteID
				  // LEFT JOIN employees ON eventSiteHasEmployee.employeeID = employees.employeeID
				  // WHERE events.eventYear = :eventYear';

		// $statement = $db->prepare($query);
		// $statement->bindValue(":eventYear", $year);
		// $statement->execute();
		// $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		// $statement->closeCursor();

		// $events = [];
		// foreach ($rows as $row) {
		  // $eventID = $row['eventID'];

			// // add event to the events array, if it is not already there
		  // if (!isset($events[$eventID])) {
					// // Create a Sport object
				// $sport = new Sport(
					 // $row['sportID'],
					 // $row['sportName'],
					 // $row['isGendered'],
					 // $row['isIndividualed'],
					 // $row['maxTeamSize']
				// );
					// // Initialize the Event object
				// $events[$eventID] = new Event(
					// $eventID,
					// $sport,
					// $row['eventYear'],
					// $row['startDate'],
					// $row['endDate']
				// );
		  // }

// // we have a problem here i think, if a site has multiple employees, will that site currently be pushed multiple times
		  
				// // Add each event site to the event's eventSites array if site data exists
		  // if ($row['siteID'] !== null) {
					
					// // we should check if vehicleID is null, and not create a vehicle in that case
					
				// $vehicle = new Vehicle($row['vehicleID'], $row['vehicleName'], $row['isUnique']);
				// $site = new Site($row['siteID'], $row['siteName'], $row['city']);
				// $eventSite = new EventSite(
					 // $row['eventSiteID'],
					 // $eventID,
					 // $site,
					 // $row['managerName'],
					 // $vehicle
				// );
				// if ($row['employeeID'] !== null) {
					// $eventSite->pushEmployees(new Employee(
						// $row['employeeID'], 
						// $row['employeeName'], 
						// $row['employeeShortName'], 
						// $row['phone'],
						// $row['email']
					// ));
				// }
				// $events[$eventID]->pushEventSites($eventSite);
				
		  // }
		// }

		// // Return an indexed array of Event objects
		// return array_values($events);
	// }

// }
?>