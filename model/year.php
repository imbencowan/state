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
	static function showYear(int $year) {
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


	static function setInventories(int $year) {
		$upsertRows = [];
			// get base inventory items. // Condition($path, $column, $value, $operator = '=')
		$baseItemWhere = new Where([ new Condition(['apparel'], 'inventoryMinimum', 0, '>') ]);
		$baseItems = Item::getAllFromDB(null, null, $baseItemWhere);
			// assemble the new and old year's events
		$newWhere = new Where([new Condition(['events'], 'eventYear', $year)]);
		$oldWhere = new Where([new Condition(['events'], 'eventYear', $year - 1)]);
			// ($context, $columns, $where)
		$newEvents = Event::getAllFromDB('inventory', null, $newWhere);
		$oldEvents = Event::getAllFromDB('inventory', null, $oldWhere);

			// based off some light research, values to split inventories that had multiple divs at the same site
		$divRatios = [ 1 => 2.35, 2 => 2.46, 3 => 2.84, 4 => 2.15, 5 => 1.77, 6 => 1.00 ];


			// the big loop. foreach event, foreach es, check the old inventories and build a new one
		foreach ($newEvents as $newEvent) {
				// first, find the previous event
			$oldEvent = null;
			$matches = [];

				// check for series matches
			foreach ($oldEvents as $oldEvent) {
				if ($oldEvent->seriesID === $newEvent->seriesID) $matches[] = $oldEvent;
			}

				// if there's only one series match, that's it
			if (count($matches) === 1) {
				$oldEvent = $matches[0];
					// else, compare dates
			} else {
				$closest = null;
				$closestDistance = PHP_INT_MAX;

				foreach ($matches as $match) {
						// use the helper to measure calendar distance
					$distance = self::annualDateDistance($newEvent->startDate, $match->startDate);

					if ($distance < $closestDistance) {
						$closest = $match;
						$closestDistance = $distance;
					}
				}

				$oldEvent = $closest;
			}


				// if some thing went wrong finding a previous event, throw
			if ($oldEvent === null) throw new Exception('No previous event found.');

				// make an array of the old ESDs for searching
			$oldESDs = [];
			foreach ($oldEvent->eventSites as $oldES) {
				$ratioBase = 0;
					
					// we need to loop once first for this so we can use it when we loop over esds for the actual data
				foreach ($oldES->esDivisions as $oldESD) {
					$ratioBase += $divRatios[$oldESD->divisionID];
				}

				foreach ($oldES->esDivisions as $oldESD) {
					$oldESDs[$oldESD->divisionID] = [
						'esd' => $oldESD,
						'es' => $oldES,
						'portion' => $divRatios[$oldESD->divisionID] / $ratioBase
					];
				}
			}

		
				// now match the old ESDs to the new, and get how many were sold previously
			foreach ($newEvent->eventSites as $newES) {
					// make an array to hold item quantities
				$newInventory = [];
					// an element for each base item
				foreach ($baseItems as $bi) {
					$newInventory[$bi->id] = 0;
				}


				foreach ($newES->esDivisions as $newESD) {
					$oldESD = $oldESDs[$newESD->divisionID] ?? null;
					if ($oldESD === null) throw new Exception("No previous ESD found for division {$newESD->divisionID}.");

						// make a look up for the old inventory
					$oldInventory = [];
					foreach ($oldESD['es']->inventory as $ii) {
						$oldInventory[$ii->itemID] = $ii;
					}

						// sum the sold portions of previous inventories to the new inventory
					foreach($baseItems as $bi) {
							// check the look up made earlier
						$esii = $oldInventory[$bi->id] ?? null;

						if ($esii !== null) {
							$soldQ = $esii->getSoldQ();
							$newInventory[$bi->id] += $soldQ * $oldESD['portion'];
						}
					}	
				}

					// now that we've got all the eSite's esds accounted for we can normalize the quantities
				foreach($baseItems as $bi) {
					$id = $bi->id;
						//first pad the numbers 20%
					$newInventory[$id] *= 1.2;

						// if they are below minimum bring them to that
					if ($newInventory[$id] < $bi->inventoryMin) {
						$newInventory[$id] = $bi->inventoryMin;
							// else round to inventory step
					} else {
							// first make them integers
						$newInventory[$id] = round($newInventory[$id]);
						if ($bi->inventoryStep > 0) {
								// round up to the inventoryStep
							$newInventory[$id] = ceil($newInventory[$id] / $bi->inventoryStep) * $bi->inventoryStep;
						}
							// if there's a lot of some thing, round it to cases
						if ($newInventory[$id] > (1.75 * $bi->caseQ)) {
							if ($bi->caseQ > 0) {
									// using -0.4 and ceil() here let's us round up at x.4 rather than x.5 to be a little conservative
								$newInventory[$id] = ceil(($newInventory[$id] / $bi->caseQ) - 0.4) * $bi->caseQ;
							}
						}
					}

						// push the data, in the form the db wants it. array indices here are column names
					$upsertRows[] = [
						'eventSiteID' => $newES->id,
						'itemID' => $bi->id,
						'startQ' => $newInventory[$id],
						'price' => $bi->price,
						'mcuCost' => $bi->cost
					];
				}
			}	
		}

			// the db access
		Database::withDB(function($db) use ($upsertRows) {
				// the columns to update if a record already exists for this eventSiteID/itemID combo
			$updateCols = [ 'startQ', 'price', 'mcuCost' ];
			EventSiteInventoryItem::upsertMany($upsertRows, $updateCols, $db);
		});

			// this is useful because it gets logged in the js console
		return [
			'upsertRows' => $upsertRows,
			'baseItems' => $baseItems,
			'newEvents' => $newEvents, 
			'oldEvents' => $oldEvents
		];
	}

		// measures how many days are between two year agnostic dates
	private static function annualDateDistance(DateTimeInterface $date1, DateTimeInterface $date2): int {
			// format('z') gives an integer day of the year
		$day1 = (int) $date1->format('z');
		$day2 = (int) $date2->format('z');

		$distance = abs($day1 - $day2);

			// the '365 - $distance' handles wrapping around the start/end of year, so december/january are close
		return min($distance, 365 - $distance);
	}
}