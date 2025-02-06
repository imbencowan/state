<?php

class Sport implements JsonSerializable {
	private int $sportID;
	private ?int $maxTeamSize, $minDiv;
	private string $sportName;
	private ?bool $isGendered, $isIndividualed;
	private $events; // Optional property to hold an array of the Sport's Events
		// i don't like how this is set up, but because of dance & cheer an Event can have multiple Sports.
			// to access orders in an organized way, i want an Event to have Sports that have Sites
				// that have Divisions that have Orders
	private $eventSites;

	public function __construct(int $sportID, string $sportName, ?bool $isGendered, ?bool $isIndividualed, 
										?int $maxTeamSize, ?int $minDiv) {
		$this->sportID = $sportID;
		$this->sportName = $sportName;
		$this->isGendered = $isGendered;
		$this->isIndividualed = $isIndividualed;
		$this->maxTeamSize = $maxTeamSize;
		$this->minDiv = $minDiv;
		$this->events = []; // Initialize as an empty array
		$this->eventSites = []; // Initialize as an empty array
	}

	public function jsonSerialize() {
		return [
			'sportID' => $this->sportID,
			'sportName' => $this->sportName,
			'isGendered' => $this->isGendered,
			'isIndividualed' => $this->isIndividualed,
			'maxTeamSize' => $this->maxTeamSize,
			'minDiv' => $this->minDiv,
			'events' => $this->events,
			'eventSites' => $this->eventSites
		];
	}
	
	public static function buildFromRow(array $row): ?self {
			// if some how there is no sport, return null
		if (!isset($row['sportID']) || $row['sportID'] === null) return null;
		if ($row['sportID']) {
			return new self(
				$row['sportID'],
				$row['sportName'],
				$row['isGendered'],
				$row['isIndividualed'],
				$row['maxTeamSize'],
				$row['minDiv']
			);
		}
	}

	// Getters and Setters
	public function getSportID() { return $this->sportID; }
	public function setSportID($value) { $this->sportID = $value; }

	public function getSportName() { return $this->sportName; }
	public function setSportName($value) { $this->sportName = $value; }

	public function getIsGendered() { return $this->isGendered; }
	public function setIsGendered($value) { $this->isGendered = $value; }

	public function getIsIndividualed() { return $this->isIndividualed; }
	public function setIsIndividualed($value) { $this->isIndividualed = $value; }

	public function getMaxTeamSize() { return $this->maxTeamSize; }
	public function setMaxTeamSize($value) { $this->maxTeamSize = $value; }

	public function getMinDiv() { return $this->minDiv; }
	public function setMinDiv($value) { $this->minDiv = $value; }

	public function getEventSites() { return $this->eventSites; }
	// public function setEventSites(array $value) { $this->eventSites[] = $value; }
	public function pushEventSites($value, $key = null) { 
		if ($key === null) $this->eventSites[] = $value; 
		else $this->eventSites[$key] = $value;
	}


	//////////////////////////////////////////////////////
	// Database functions
	public static function addSport($sportName, $isGendered, $isIndividualed, $maxTeamSize) {
		$db = Database::getDB();

		$query = 'INSERT INTO sports (sportName, isGendered, isIndividualed, maxTeamSize)
					VALUES (:sportName, :isGendered, :isIndividualed, :maxTeamSize)';
		$statement = $db->prepare($query);
		$statement->bindValue(':sportName', $sportName);
		$statement->bindValue(':isGendered', $isGendered);
		$statement->bindValue(':isIndividualed', $isIndividualed);
		$statement->bindValue(':maxTeamSize', $maxTeamSize);
		$statement->execute();
		$statement->closeCursor();

		return $db->lastInsertId(); // Return the ID of the newly added sport
	}
	
	public static function getIDByName($name) {
		$db = Database::getDB();
		$query = 'SELECT sportID FROM sports WHERE sportName = :sportName';
		$statement = $db->prepare($query);
		$statement->execute([':sportName' => $name]);
			// return the id, or null
		return $statement->fetchColumn() ?: null;
	}

	public static function getNameBySportID($id) {
		$db = Database::getDB();
		$query = 'SELECT sportName FROM sports WHERE sportID = :sportID';
		$statement = $db->prepare($query);
		$statement->execute([':sportID' => $id]);
			// return the name, or null
		return $statement->fetchColumn() ?: null;
	}
	
	public static function getMinDivByID($id) {
		$db = Database::getDB();
		$query = 'SELECT minDiv FROM sports WHERE sportID = :sportID';
		$statement = $db->prepare($query);
		$statement->execute([':sportID' => $id]);
			// return the name, or null
		return $statement->fetchColumn() ?: null;
	}

	public static function getSportByID($id) {
		$db = Database::getDB();

		$query = 'SELECT * FROM sports WHERE sportID = :sportID';
		$statement = $db->prepare($query);
		$statement->bindValue(':sportID', $id);
		$statement->execute();
		$row = $statement->fetch(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		if ($row) return self::buildFromRow($row);
		return null; // Return null if no sport is found
	}

	public static function getAllSports() {
		$db = Database::getDB();

		$query = 'SELECT * FROM sports';
		$statement = $db->prepare($query);
		$statement->execute();
		$rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		$sports = [];
		foreach ($rows as $row) {
			$sports[] = self::buildFromRow($row);
		}
		return $sports; // Return an array of Sport objects
	}
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, displaying all items
	static function showSport($data) {
			// output has to be placed between ob_start() and ob_get_clean() as below
		ob_start(); 
			// we might be able to take the $year assignment out, but i can't test that right now
		$year = $data['year'];
		$sportID = $data['sportID'];
		
		$event = Event::getEventOrdersBySportIDAndYear($sportID, $year);
		
		
		// var_dump($event, $sportID, $year);
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/sport.php';
			// Get the buffered content as a string
		$htmlContent = ob_get_clean(); 
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $event
		]);
	}
}
?>
