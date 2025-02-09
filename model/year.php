<?php
class Year implements JsonSerializable {
		// we're defaulting to the state year running from june 16 to june 15.
			// this way when we look at the current year in late may and early june, we will be looking at
				// the past events that just finished.
			// when we look at the current year after mid june, we will be looking at the upcoming year.
	private $defaultMonth = 6;
	private $defaultStartDay = 16;
	private $defaultEndDay = 15;
		// $year represents the school year. 23 would represent the 23-24 school year. 
			// an integer representation of a date range
   private int $year;
   private $startDate;
   private $endDate;
   public $events; // Initialized as an empty array

		// both parameters can be null. this allows calling the function with either or neither.
			// if both are used, $year will be prioritized. if neither, the current date will be used
   public function __construct(?int $year = null, DateTime $date = null) {
			// if no $year was given, we'll use the date
		if (is_null($year)) {
				// if no date was given use now
			if (is_null($date)) $date = new DateTime();
			$year = $date->format('y');
				// if the $date is in the first 'half' of the year, -1 from the '$year'.
			if ($date->format('m') < $this->defaultMonth || 
					($date->format('m') == $this->defaultMonth && $date->format('d') <= $this->defaultEndDay)) {
				$year -= 1;
			}
		}
			// now we can set every thing with a correct $year
		$this->year = $year;
			// the endDate will be in the following year
		$endYear = $year + 1;
		$this->startDate = new DateTime("$year-$this->defaultMonth-$this->defaultStartDay");
		$this->endDate = new DateTime("$endYear-$this->defaultMonth-$this->defaultEndDay");
      $this->events = []; // Initialize as an empty array
		$this->events = $this->getEventsForYear($year);
   }

   public function jsonSerialize() {
      return [
         'year' => $this->year,
         'startDate' => $this->startDate->format('Y-m-d'),
         'endDate' => $this->endDate->format('Y-m-d'),
         'events' => $this->events
      ];
   }
	

		// Getters and setters
   public function getYear() { return $this->year; }
   public function setYear($value) { $this->year = $value; }

   public function getStartDate() { return $this->startDate; }
   public function setStartDate($value) { $this->startDate = new DateTime($value); }

   public function getEndDate() { return $this->endDate; }
   public function setEndDate($value) { $this->endDate = new DateTime($value); }

   public function getEvents() { return $this->events; }
   // public function setEvent($value) { $this->events = $value; }
	public function pushEvent($value) { $this->events[$value->getEventID()] = $value; }
	
	//////////////////////////////////////////////////
   // DB Functions
	
	static function getEventsForYear($year) {
		$db = Database::getDB();

		$query = 'SELECT events.*, sports.*, eventSites.eventSiteID, eventSites.managerName, divisions.*,
								sites.*, vehicles.*, employees.*
					FROM events
					INNER JOIN eventhassport ON events.eventID = eventhassport.eventID
					INNER JOIN sports ON eventhassport.sportID = sports.sportID
					LEFT JOIN eventSites ON events.eventID = eventSites.eventID
					LEFT JOIN eventSiteHasDivision ON eventSites.eventSiteID = eventSiteHasDivision.eventSiteID
					LEFT JOIN divisions ON eventSiteHasDivision.divisionID = divisions.divisionID
					LEFT JOIN sites ON eventSites.siteID = sites.siteID
					LEFT JOIN vehicles ON eventSites.vehicleID = vehicles.vehicleID
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
					// also make sure every event has all it's sports
			if (!isset($events[$eventID])) {
					// Create a Sport object
				$sport = Sport::buildFromRow($row);
					// Initialize the Event object
				$events[$eventID] = new Event(
					$eventID,
					$sport,
					$row['eventYear'],
					$row['startDate'],
					$row['endDate']
				);
					// check if the event already has the sport specific to this row. necessary for Dance & Cheer
			} elseif ($events[$eventID]->getSports()[0]->id != $row['sportID']) {
					// Create and push a Sport object
				$sport = Sport::buildFromRow($row);
				$events[$eventID]->pushSports($sport);
			}
				
			$event = $events[$eventID];
			$eventSites = $event->getEventSites();	  
			
				// Add each event site to the event's eventSites array if site data exists
			if ($row['eventSiteID'] !== null) {
					// don't add the same site multiple times. check if the site has already been added
				if (!array_key_exists($row['eventSiteID'], $eventSites)) {
						// vehicle and site are handled here, because each eventSite has only one of each
							// divisions and employees are handled after, as there can be multiple
					$vehicle = isset($row['vehicleID']) ? Vehicle::buildFromRow($row) : null;
					$site = Site::buildFromRow($row);
					//////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////
					// take a look at making a buildFromRow() for EventSite also.
					// probably have it check if there is a vehicleID and siteID before calling their respective 
					// buildFromRow()s
					// this file was previously at 191 lines
					$eventSite = new EventSite(
						 $row['eventSiteID'],
						 $eventID,
						 $site,
						 $row['managerName'],
						 $vehicle
					);
					$events[$eventID]->pushEventSites($eventSite);
				}
			}
			
				//look at the right eventSite for this $row
			$eventSite = $event->getEventSites()[$row['eventSiteID']];
			$eventSiteDivs = $eventSite->getDivisions();
			$eventSiteEmps = $eventSite->getEmployees();
			
				// if a new division, add to a site
			if ($row['divisionID'] !== null && !array_key_exists($row['divisionID'], $eventSiteDivs)) {
				$eventSite->pushDivisions(Division::buildFromRow($row));
			}
				// add employees to a site
			if ($row['employeeID'] !== null && !array_key_exists($row['employeeID'], $eventSiteEmps)) {
				$eventSite->pushEmployees(Employee::buildFromRow($row));
			}
		}

		return $events;
		// return $rows;
	}
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, displaying all items
	static function showYear($input) {
			// we already have a variable called $year
		$yearsEvents = new Year(null, new DateTime());
		ob_start();
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/year.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => [	'year' => $yearsEvents ]
		]);
	}
}