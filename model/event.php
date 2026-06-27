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
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
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
			// First, build an array with max division IDs as sort keys
		$organized = [];
		foreach ($eventSites as $eSite) {
			$maxDivisionId = 0;
			foreach ($eSite->esDivisions as $esd) {
				if ($esd->division->id > $maxDivisionId) {
					$maxDivisionId = $esd->division->id;
				}
			}
			$organized[$eSite->site->name] = ['eSite' => $eSite, 'maxId' => $maxDivisionId];
		}
			// Sort by max division ID descending
		uasort($organized, function ($a, $b) {
			return $b['maxId'] <=> $a['maxId'];
		});
			// Strip back down to just the eventSites
		return array_map(fn($entry) => $entry['eSite'], $organized);
	}

	
	public function getUnhandledComments() {
		$unhandled = [];
		foreach ($this->eventSites as $eventSite) {
			foreach ($eventSite->esDivisions as $esd) {
				foreach ($esd->schoolOrders as $schoolOrder) {
					foreach ($schoolOrder->getMessageOrders() as $order) {
						if ($order->commentHandled == 0) {
							$o = new stdClass();
							$o->id = $order->id;
							$o->school = $schoolOrder->school->shortName;
							$o->esd = $esd->name;
							$o->comment = $order->comment;
							$unhandled[] = $o;
						}
					}
				}
			}
		}
		return $unhandled;
	}
	
	public function getIncompleteOrders() {
		$incompleteOrders = [];
		foreach ($this->eventSites as $eventSite) {
			foreach ($eventSite->esDivisions as $esd) {
				foreach ($esd->schoolOrders as $order) {
					if ($order->completeness == 0) {
						$incompleteOrders[] = $order;
					}
				}
			}
		}
		return $incompleteOrders;
	}
	
	public function getNeededSizes($incompleteOrders) {
		$neededSizes = ['S' => 0, 'M' => 0, 'L' => 0, 'XL' => 0, '2X' => 0, '3X' => 0, '4X' => 0];
		foreach ($incompleteOrders as $order) {
			foreach ($order->shirtsByStyle as $style) {
				if ($style->shortName == "Dairy Hoods") {
					foreach ($style->getSizes() as $size) {
						$neededSizes[$size->displayChar] += $size->getQuantity();
					}
				}
			}
		}
		return $neededSizes;
	}
	
	


		//////////////////////////////////////////////////
		// Database functions	
	public static function getBySportAndYear(int $sportID, int $year, string $context = 'orders'): ?static {
		$eventID = static::getIDBySportIDAndYear($sportID, $year);
		if (!$eventID) return null;

			// ($id, $context)
		$event = self::getByID($eventID, $context);
		return $event ?? null;
	}
	

	public static function getIDBySportIDAndYear(int $sportID, int $year) {
		$db = Database::getDB();
		$query = 'SELECT eventID, startDate FROM events 
					WHERE sportID = :sportID AND eventYear = :year';
		$statement = $db->prepare($query);
		$statement->execute([':sportID' => $sportID, ':year' => $year]);
		$events = $statement->fetchAll();
		
		if (empty($events)) {
			return null;
		}
		
		$closest = self::getCloserEvent($events);
			
			// return the id or null
		return $closest['eventID'] ?? null;
	}


		// returns the ID of the next event by $date, OR the most recent event if there are none beyond $date
	public static function getNextIDByDate($date) {
		$db = Database::getDB();
		$query = 'SELECT eventID FROM events 
					WHERE startDate >= :date 
					ORDER BY startDate ASC
					LIMIT 1';

		$statement = $db->prepare($query);
		$statement->execute([':date' => $date]);
		$row = $statement->fetch();
			
			// if an id was found, return it
		if ($row) return $row['eventID'];


			// if no events exist beyond $date, get the last event
		$query = 'SELECT eventID FROM events 
					ORDER BY startDate DESC, eventID DESC
					LIMIT 1';

		$statement = $db->prepare($query);
		$statement->execute();
		$row = $statement->fetch();
			// will return null if there are no events at all
		return $row['eventID'] ?? null;
	}

	
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
			$rangeStr = $start . $conjunction . $end;
			$rangeStr = preg_replace('/ (\S+)$/', '&nbsp;$1', $rangeStr);
			return $rangeStr;
		}
	}


	public function getSeason() {
		if ($this->startDate->format('m') < 5) return 1;
		elseif ($this->startDate->format('m') == 5) return 2;
		elseif ($this->startDate->format('m') > 5) return 3;
	}

	public static function getInventoryItems($eSiteIDs) {
			// a where condition. // see Where.php for explanation
		$whereInvntry = new Where('eventSiteID', $eSiteIDs, 'IN', ['eventsiteinventories']);
		$whereTrnsfr = new Where('eventSiteID', $eSiteIDs, 'IN', ['eventsitetransfers']);

		$invItems = EventSiteInventoryItem::getAllFromDB(context: 'inventory', where: $whereInvntry);
		$transfers = EventSiteTransfer::getAllFromDB(context: 'inventory', where: $whereTrnsfr);

		return [ 'invItems' => $invItems, 'transfers' => $transfers ];
	}

		// should return SchoolOrders for an Event
	public static function getOrders($esdIDs) {
			// a where condition. // see Where.php for explanation
		$whr = new Where('eventSiteHasDivisionID', $esdIDs, 'IN', ['schoolorders']);

		return ['orders' => SchoolOrder::getAllFromDB(where: $whr)];
	}

	public static function fetchDateRange(string $start, string $end): array {
		$where = new Where('startDate', [$start, $end], 'BETWEEN', ['events']);
		$events = self::getAllFromDB(context: 'orders', where: $where);
		usort($events, function($a, $b) { return $a->startDate <=> $b->startDate; });

		return array_values($events);
	}

		// this function is to calculate what stock we need for a given season
	public static function getStockByDateRange(string $start, string $end): array {
			// build a WHERE to SELECT events between dates passed in.
		$where = new Where('startDate', [$start, $end], 'BETWEEN', ['events']);
			// build a query to get the sum of eventsiteinventories for those events
		$query = "SELECT eventsiteinventories.itemID,
							SUM(eventsiteinventories.startQ) AS totalQ
					FROM events
					JOIN eventsites
						ON events.eventID = eventsites.eventID
					JOIN eventsiteinventories
						ON eventsites.eventSiteID = eventsiteinventories.eventSiteID"
					. $where->getWhereString() .
					" GROUP BY eventsiteinventories.itemID
					  ORDER BY eventsiteinventories.itemID";

		$stockRows = self::getFromDB($query);

			// get the sum of sorderitems we did for this date range in the previous year
		$priorStart = (new DateTime($start))->modify('-1 year')->format('Y-m-d');
		$priorEnd = (new DateTime($end))->modify('-1 year')->format('Y-m-d');
		$priorWhere = new Where('startDate', [$priorStart, $priorEnd], 'BETWEEN', ['events']);
		$priorQuery = "SELECT sorderitems.itemID,
								SUM(sorderitems.sOrderItemsQuantity) AS totalQ
						FROM events
						JOIN eventsites
							ON events.eventID = eventsites.eventID
						JOIN eventsitehasdivision
							ON eventsites.eventSiteID = eventsitehasdivision.eventSiteID
						JOIN schoolorders
							ON eventsitehasdivision.eventSiteHasDivisionID = schoolorders.eventSiteHasDivisionID
						JOIN sorderitems
							ON schoolorders.schoolOrderID = sorderitems.schoolOrderID"
						. $priorWhere->getWhereString() .
						" GROUP BY sorderitems.itemID
						  ORDER BY sorderitems.itemID";

		$priorRows = self::getFromDB($priorQuery);

			// merge the results of the two queries. sorderitems can include retail items as part of a schoolorder
		$merged = [];
		foreach ($stockRows as $row) {
			$itemID = $row['itemID'];
			$merged[$itemID] = [
				'itemID' => $itemID,
				'totalQ' => (int) $row['totalQ']
			];
		}

		foreach ($priorRows as $row) {
			$itemID = $row['itemID'];
			if (!isset($merged[$itemID])) {
				$merged[$itemID] = [
					'itemID' => $itemID,
					'totalQ' => 0
				];
			}

			$merged[$itemID]['totalQ'] += (int) $row['totalQ'];
		}

			// sort and return
		ksort($merged);
		return array_values($merged);
	}


		// get all years that there are events for
	public static function getAllYears() {
		$db = Database::getDB();
		$stmt = $db->prepare("SELECT DISTINCT eventYear FROM events	ORDER BY eventYear");
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_COLUMN);
	}
	
	
	
		
	//////////////////////////////////////////////////
   // user actions
	static function getEventBySportAndYear(int $year, int $sportID, string $context = 'orders') {
		return [ 'data' => self::getBySportAndYear($sportID, $year, $context) ];
	}


	static function getEventByDate(?string $date = null) {
		if ($date == null) $date = date('Y-m-d');
		$id = self::getNextIDByDate($date);

		return [ 'data' => self::getByID($id, 'orders') ];
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
?>
