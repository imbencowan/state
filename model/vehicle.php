<?php
class Vehicle implements JsonSerializable {
   private int $vehicleID;
   private string $vehicleName;
   private bool $isUnique;

   public function __construct(int $vehicleID, string $vehicleName, bool $isUnique = false) {
      $this->vehicleID = $vehicleID;
      $this->vehicleName = $vehicleName;
      $this->isUnique = $isUnique;
   }

   public function jsonSerialize() {
      return [
          'vehicleID' => $this->vehicleID,
          'vehicleName' => $this->vehicleName,
          'isUnique' => $this->isUnique
      ];
   }
	
	public static function buildFromRow(array $row): ?self {
			// No vehicle assigned
		if (!isset($row['vehicleID']) || $row['vehicleID'] === null) return null;
		if ($row['vehicleID']) return new self($row['vehicleID'], $row['vehicleName'], $row['isUnique']);
			// consider adding a 'TBD' vehicle to the database
	}

   public function getVehicleID() { return $this->vehicleID; }
   public function setVehicleID($value) { $this->vehicleID = $value; }

   public function getVehicleName() { return $this->vehicleName; }
   public function setVehicleName($value) { $this->vehicleName = $value; }
   
   public function getIsUnique() { return $this->isUnique; } 
   public function setIsUnique($value) { $this->isUnique = $value; } 
	
	
   //////////////////////////////////////////////////
   // db functions
		// Add a new Vehicle to the database
   static function addVehicle($vehicleName, $isUnique = false) {
       $db = Database::getDB();

       $query = 'INSERT INTO vehicles (vehicleName, isUnique) VALUES (:vehicleName, :isUnique)';
       $statement = $db->prepare($query);
       $statement->bindValue(':vehicleName', $vehicleName);
       $statement->bindValue(':isUnique', $isUnique, PDO::PARAM_BOOL); // Bind isUnique as a boolean
       $statement->execute();
       $statement->closeCursor();

       // Return the ID of the newly added vehicle
       return $db->lastInsertId();
   }

		// Get a Vehicle by ID
   static function getVehicleByID($vehicleID) {
       $db = Database::getDB();

       $query = 'SELECT * FROM vehicles WHERE vehicleID = :vehicleID';
       $statement = $db->prepare($query);
       $statement->bindValue(':vehicleID', $vehicleID);
       $statement->execute();
       $row = $statement->fetch(PDO::FETCH_ASSOC);
       $statement->closeCursor();

       if ($row) {
           return self::buildFromRow($row);
       }
       return null; // Return null if not found
   }

		// Get all Vehicles
   static function getAllVehicles() {
      $db = Database::getDB();

      $query = 'SELECT * FROM vehicles';
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

			// returns an array of all vehicles built from $rows
		return array_map([self::class, 'buildFromRow'], $rows);

   }
}
?>
