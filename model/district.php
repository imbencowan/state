<?php
class District implements JsonSerializable {
    private int $districtID;
	 private string $districtName, $districtDescription, $primaryCity;

    public function __construct(int $districtID, string $districtName, string $districtDescription, 
											string $primaryCity) {
        $this->districtID = $districtID;
        $this->districtName = $districtName;
        $this->districtDescription = $districtDescription;
        $this->primaryCity = $primaryCity;
    }

    public function jsonSerialize() {
        return [
            'districtID' => $this->districtID,
            'districtName' => $this->districtName,
            'districtDescription' => $this->districtDescription,
            'primaryCity' => $this->primaryCity
        ];
    }
	
	public static function buildFromRow(array $row): ?self {
			// if some how there is no sport, return null
		if (!isset($row['districtID']) || $row['districtID'] === null) return null;
		if ($row['districtID']) {
			return new self(
				$row['districtID'],
				$row['districtName'],
				$row['districtDescription'],
				$row['primaryCity']
			);
		}
	}

   // Getters and Setters
   public function getDistrictID() { return $this->districtID; }
   public function setDistrictID($value) { $this->districtID = $value; }

   public function getDistrictName() { return $this->districtName; }
   public function setDistrictName($value) { $this->districtName = $value; }

   public function getDistrictDescription() { return $this->districtDescription; }
   public function setDistrictDescription($value) { $this->districtDescription = $value; }

   public function getPrimaryCity() { return $this->primaryCity; }
   public function setPrimaryCity($value) { $this->primaryCity = $value; }

	//////////////////////////////////////////////////////////////////////////
	// Database Functions
   public static function addDistrict($district) {
      $db = Database::getDB();
      $query = "INSERT INTO districts (districtName, districtDescription, primaryCity)
                VALUES (:districtName, :districtDescription, :primaryCity)";

      $stmt = $db->prepare($query);
      $stmt->bindValue(':districtName', $district->getDistrictName());
      $stmt->bindValue(':districtDescription', $district->getDistrictDescription());
      $stmt->bindValue(':primaryCity', $district->getPrimaryCity());

      $stmt->execute();
      $district->setDistrictID($db->lastInsertId());
   }

   public static function getDistrictByID($id) {
      $db = Database::getDB();
      $query = "SELECT * FROM districts WHERE districtID = :districtID";
      $stmt = $db->prepare($query);
      $stmt->bindValue(':districtID', $id);
      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($row) return self::buildFromRow($row);
      return null;
   }

   public static function getAllDistricts() {
      $db = Database::getDB();
      $query = "SELECT * FROM districts";
      $stmt = $db->query($query);
      $results = [];

      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
         $results[] = self::buildFromRow($row);
      }
      return $results;
   }
}
?>
