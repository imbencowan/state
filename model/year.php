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
			//make sure we have a year
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

			// construct( string $column, mixed $value = null, string $operator = '=', array $path = [] )
            // $path specifies the table JOIN path the query takes to the target table 
					// ex: ['events', 'eventsites', 'sites']
		$where = new Where([ new Condition(['events'], 'eventYear', $year, '=') ]);

		// $this->events = $this->getEventsForYear($year);
			// "year" context stops JOINing of the schoolorders table via the Relation class
				// this prevents the db call returning an unnecessarily huge result
		$this->events = Event::getAllFromDB(context: "year", where: $where);
			// sort the events by date
		usort($this->events, function($a, $b) { return $a->startDate <=> $b->startDate; });
   }

   public function jsonSerialize(): mixed {
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
	
	public static function convertDateToSchoolYear(DateTime $date) {
		$defaultMonth = 6;
		$defaultStartDay = 16;
		$defaultEndDay = 15;
		
		$year = $date->format('y');
			// if the $date is in the first 'half' of the year, -1 from the '$year'.
		if ($date->format('m') < $defaultMonth || 
				($date->format('m') == $defaultMonth && $date->format('d') <= $defaultEndDay)) {
			$year -= 1;
		}
		return $year;
	}

			

	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Year page, displaying all events for a given year
	static function showYear($year) {
		$yearsEvents = new Year($year, new DateTime());
		
		return $yearsEvents;
	}

	static function submitYear($events) {
		Database::withDB(function($db) use ($events,) {
			foreach ($events as $event) {
					// EventColumns: 'eventID', 'seriesID', 'startDate', 'endDate', 'eventYear'
				$eventInsert = [
					'seriesID'   => $event['series']['id'] ?? null,
					'startDate' => $event['startDate'],
					'endDate'   => $event['endDate'],
					'eventYear' => $event['year']
				];
				$eventID = Event::insert($eventInsert, $db);

				foreach ($event['eSites'] as $eSite) {
						// get the siteID	
					if (!empty($eSite['site']['id'])) {
						$siteID = $eSite['site']['id'];
					} else {
						throw new Exception("Site not found: " . $eSite['site']['name']);
					}
					// else if (empty($eSite['duplicate'])) {
					// 	$siteID = Site::insert([ 'siteName' => $eSite['site']['name'] ]);
					// } else {
					// 		// pull the previously inserted id
					// 	$siteID = Site::getIDByName($eSite['site']['name']);
					// }

						// 'eventID', 'siteID', 'managerName', 'startDate', 'endDate'
					$esInsert = [
						'eventID'     => $eventID,
						'siteID'      => $siteID,
						'managerName' => $eSite['managerName'] ?? null
					];
					$eSiteID = EventSite::insert($esInsert, $db);

					$genderID = null;

						// if the site has a gender, interTable it
					if ((int)($eSite['gender'] ?? 0) === 1 || (int)($eSite['gender'] ?? 0) === 2) {
						$genderID = $eSite['gender'];
						// $values = [
						// 	'eventSiteID' => $eSiteID,
						// 	'genderID'    => $genderID
						// ];
						// EventSite::insertInterTable('gender', [$values]);
					}

					foreach ($eSite['divs'] ?? [] as $div) {
							// 'eventSiteID', 'divisionID'
						$esdInsert = [ 'eventSiteID' => $eSiteID, 'divisionID'  => $div['id'], 
										'activityID' => $div['activityID'] ];
						if ($genderID !== null) $esdInsert['genderID'] = $genderID;

							// special handling for Dance & Cheer
						if($event['series']['id'] === 21) {
								// an extra insert for Dance
							$esdInsert['activityID'] = 10;
							EventSiteDivision::insert($esdInsert, $db);
								// then reset the property for Cheer to insert via the regular path
							$esdInsert['activityID'] = 11;
						}

						EventSiteDivision::insert($esdInsert, $db);
					}
				}
			}

			return [ 'data' => $events ];
		});
	}
}