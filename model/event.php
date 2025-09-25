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
		$neededSizes = ['S' => 0, 'M' => 0, 'L' => 0, 'XL' => 0, '2XL' => 0, '3XL' => 0, '4XL' => 0];
		foreach ($incompleteOrders as $order) {
			foreach ($order->shirtsByStyle as $style) {
				if ($style->shortName == "Dairy Hoods") {
					foreach ($style->getSizes() as $size) {
						$neededSizes[$size->charName] += $size->getQuantity();
					}
				}
			}
		}
		return $neededSizes;
	}
	
	
		//////////////////////////////////////////////////
		// Database functions	
	public static function getOrdersBySportAndYear(int $sportID, int $year): ?static {
		$eventID = static::getIDBySportIDAndYear($sportID, $year);
		if (!$eventID) return null;
		// Test::logX($eventID);
		$event = self::getByID($eventID);
		return $event ?? null;
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


		// returns the ID of the next event by $date, OR the most recent event if there are none beyond $date
	public static function getNextIDByDate($date) {
		$db = Database::getDB();
		$query = 'SELECT eventID FROM events 
					WHERE startDate >= :date 
					ORDER BY startDate ASC
					LIMIT 1';

		$statement = $db->prepare($query);
		$statement->execute([':date' => $date]);
		$row = $statement->fetch(PDO::FETCH_ASSOC);
			
			// if an id was found, return it
		if ($row) return $row['eventID'];


			// if no events exist beyond $date, get the last event
		$query = 'SELECT eventID FROM events 
					ORDER BY startDate DESC, eventID DESC
					LIMIT 1';

		$statement = $db->prepare($query);
		$statement->execute();
		$row = $statement->fetch(PDO::FETCH_ASSOC);
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
	
	
	
		
	//////////////////////////////////////////////////
   // user actions
		// takes us to the specified Event page
	static function showEvent($event, $year = null, $sportID = null) {
		ob_start(); 
		
		if($event) {
			include 'view/event.php';
		} else {
			include 'view/noevent.php';
		}
			// Get the buffered content as a string
		$html = ob_get_clean(); 

		return [ 'html' => $html, 'data' => $event ];
	}


	static function showEventBySportAndYear($year, $sportID) {
		$event = self::getOrdersBySportAndYear($sportID, $year);
		return self::showEvent($event, $year, $sportID);
	}


	static function showEventByDate(?string $date = null) {
		if ($date == null) $date = date('Y-m-d');
		$id = self::getNextIDByDate($date);
		$event = self::getByID($id);

		return self::showEvent($event);
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