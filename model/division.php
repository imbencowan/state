<?php
class Division implements JsonSerializable {
   private int $divisionID, $minPop;
	private string $divisionName, $pre24DivisionName;
	private $schoolOrders;

   public function __construct($divisionID, $divisionName, $minPop, $pre24DivisionName) {
      $this->divisionID = $divisionID;
      $this->divisionName = $divisionName;
      $this->minPop = $minPop;
      $this->pre24DivisionName = $pre24DivisionName;
		$this->schoolOrders = [];
   }

   public function jsonSerialize() {
      return [
         'divisionID' => $this->divisionID,
         'divisionName' => $this->divisionName,
         'minPop' => $this->minPop,
         'pre24DivisionName' => $this->pre24DivisionName,
			'schoolOrders' => $this->schoolOrders
      ];
   }
	
	public static function buildFromRow(array $row): ?self {
			// if some how there is no sport, return null
		if (!isset($row['divisionID']) || $row['divisionID'] === null) return null;
		if ($row['divisionID']) {
			return new self(
				$row['divisionID'],
				$row['divisionName'],
				$row['minPop'],
				$row['pre24DivisionName']
			);
		}
	}

	public function getDivisionID() { return $this->divisionID; }
	public function setDivisionID($value) { $this->divisionID = $value; }

	public function getDivisionName() { return $this->divisionName; }
	public function setDivisionName($value) { $this->divisionName = $value; }

	public function getMinPop() { return $this->minPop; }
	public function setMinPop($value) { $this->minPop = $value; }

	public function getPre24DivisionName() { return $this->pre24DivisionName; }
	public function setPre24DivisionName($value) { $this->pre24DivisionName = $value; }

	public function getSchoolOrders() { return $this->schoolOrders; }
		// public function setSchoolOrders(array $value) { $this->schoolOrders[] = $value; }
	public function pushSchoolOrders($value, $key = null) { 
		if ($key === null) $this->schoolOrders[] = $value; 
		else $this->schoolOrders[$key] = $value;
	}

    ////////////////////////////////////////////////
    // Database functions
    static function getDivisionByID($id) {
        $db = Database::getDB();

        $query = 'SELECT * FROM divisions WHERE divisionID = :divisionID';
        $statement = $db->prepare($query);
        $statement->bindValue(":divisionID", $id);
        $statement->execute();
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        $statement->closeCursor();

        return self::buildFromRow($row);
    }
	 
	public static function getIDByName($name) {
		$db = Database::getDB();
		$query = 'SELECT divisionID FROM divisions WHERE divisionName = :divisionName';
		$statement = $db->prepare($query);
		$statement->execute([':divisionName' => $name]);
			// return the id or null
		return $statement->fetchColumn() ?: null;
	}

   static function getDivisionsByMinPop($minPop) {
      $db = Database::getDB();

      $query = 'SELECT * FROM divisions WHERE minPop >= :minPop';
      $statement = $db->prepare($query);
      $statement->bindValue(":minPop", $minPop);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      $divisions = [];
      foreach ($rows as $row) {
         $divisions[] = self::buildFromRow($row);
      }
      return $divisions;
   }
	
	static function getAllDivisions() {
      $db = Database::getDB();

      $query = 'SELECT * FROM divisions';
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      $divisions = [];
      foreach ($rows as $row) {
         $divisions[] = self::buildFromRow($row);
      }
      return $divisions;
   }
}
?>
