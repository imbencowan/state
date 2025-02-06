<?php
class Site implements JsonSerializable {
    private $siteID;
    private $siteName;
    private $city;

    public function __construct($siteID, $siteName, $city) {
        $this->siteID = $siteID;
        $this->siteName = $siteName;
        $this->city = $city;
    }

    public function jsonSerialize() {
        return [
            'siteID' => $this->siteID,
            'siteName' => $this->siteName,
            'city' => $this->city
        ];
    }
	
	public static function buildFromRow(array $row): ?self {
			// if some how there is no sport, return null
		if (!isset($row['siteID']) || $row['siteID'] === null) return null;
		if ($row['siteID']) {
			return new self(
				$row['siteID'],
				$row['siteName'],
				$row['city']
			);
		}
	}

   public function getSiteID() { return $this->siteID; }
   public function setSiteID($value) { $this->siteID = $value; }

   public function getSiteName() { return $this->siteName; }
   public function setSiteName($value) { $this->siteName = $value; }

   public function getCity() { return $this->city; }
   public function setCity($value) { $this->city = $value; }
   
   //////////////////////////////////////////////////
   // db functions
		// Add a new Site to the database
   static function addSite($siteName, $city) {
      $db = Database::getDB();

      $query = 'INSERT INTO sites (siteName, city) VALUES (:siteName, :city)';
      $statement = $db->prepare($query);
      $statement->bindValue(':siteName', $siteName);
      $statement->bindValue(':city', $city);
      $statement->execute();
      $statement->closeCursor();

			// Return the ID of the newly added site
      return $db->lastInsertId();
   }

		// Get a Site by ID
   static function getSiteByID($siteID) {
      $db = Database::getDB();

      $query = 'SELECT * FROM sites WHERE siteID = :siteID';
      $statement = $db->prepare($query);
      $statement->bindValue(':siteID', $siteID);
      $statement->execute();
      $row = $statement->fetch(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      if ($row) return self::buildFromRow($row);
      return null; // Return null if not found
   }

		// Get all Sites
   static function getAllSites() {
      $db = Database::getDB();

      $query = 'SELECT * FROM sites';
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      $sites = [];
      foreach ($rows as $row) {
         $sites[] = self::buildFromRow($row);
      }
      return $sites;
   }
}
?>
