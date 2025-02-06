<?php
class School implements JsonSerializable {
	private int $schoolID;
	private string $schoolName, $schoolShortName;
	private ?Division $division;
	private ?District $district;
	
	public function __construct(int $schoolID, string $schoolName, $division, $district) {
		$this->schoolID = $schoolID;
		$this->schoolName = $schoolName;
		$this->schoolShortName = self::shortenSchoolName($schoolName);
		$this->division = $division;
		$this->district = $district;
	}
	
	public function jsonSerialize() {
		return [
			'schoolID' => $this->schoolID,
			'schoolName' => $this->schoolName,
			'schoolShortName' => $this->schoolShortName,
			'divisionID' => $this->division,
			'districtID' => $this->district
		];
	}
	
		// Getters and Setters
	public function getSchoolID() { return $this->schoolID; }
	public function setSchoolID($value) { $this->schoolID = $value; }

   public function getSchoolName() { return $this->schoolName; }
   public function setSchoolName($value) { $this->schoolName = $value; }

   public function getSchoolShortName() { return $this->schoolShortName; }
   public function setSchoolShortName($value) { $this->schoolShortName = $value; }

   public function getDivision() { return $this->division; }
   public function setDivision($value) { $this->division = $value; }

   public function getDistrict() { return $this->district; }
   public function setDistrict($value) { $this->district = $value; }
	 
	 
	public static function shortenSchoolName($longSchoolName) {
			// a couple special cases first
				// we'll give big Timberline and big Highland the shortshort names. 
					// Weippe and Craigmont will remain appended
		if ($longSchoolName == 'Timberline High School - Boise') {
			$shortSchoolName = 'Timberline';
		} elseif ($longSchoolName == 'Highland High School - Pocatello') {
			$shortSchoolName = 'Highland';
		} elseif ($longSchoolName == 'Idaho School for the Deaf & the Blind') {
			$shortSchoolName = 'Idaho School for the Deaf & the Blind';
		} else {
				// order matters here, we have to do ' High School' after these oddballs, or they won't get caught this way
			$remove = [" Jr/Sr High School", " Junior/Senior High School", " High School", "Academy", "School"];
			$shortSchoolName = str_replace($remove, "", $longSchoolName);
		}
		return $shortSchoolName;
	}
	 
	 
	 

	// Database Functions
	public static function addSchool($school) {
	  $db = Database::getDB();
	  $query = "INSERT INTO schools (schoolName, divisionID, districtID)
					VALUES (:schoolName, :divisionID, :districtID)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':schoolName', $school->getSchoolName());
	  $stmt->bindValue(':divisionID', $school->getDivisionID());
	  $stmt->bindValue(':districtID', $school->getDistrictID());

	  $stmt->execute();
	  $school->setSchoolID($db->lastInsertId());
	}

	public static function getIDByName($name) {
		$db = Database::getDB();
		$query = 'SELECT schoolID FROM schools WHERE schoolName = :schoolName';
		$statement = $db->prepare($query);
		$statement->execute([':schoolName' => $name]);
			// return the id or null
		return $statement->fetchColumn() ?: null;
	}

	public static function getSchoolByID($id) {
	  $db = Database::getDB();
	  $query = "SELECT * FROM schools 
					INNER JOIN divisions ON schools.divisionID = divisions.divisionID 
					INNER JOIN districts ON schools.districtID = districts.districtID
					WHERE schoolID = :schoolID";
	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':schoolID', $id);
	  $stmt->execute();

	  $data = $stmt->fetch(PDO::FETCH_ASSOC);
	  if ($data) {
		  $division = new Division(
				$data['divisionID'], 
				$data['divisionName'], 
				$data['minPop'],
				$data['pre24DivisionName']
			);
			$district = new District(
				$data['districtID'],
				$data['districtName'],
				$data['districtDescription'],
				$data['primaryCity']
			);
			return new School(
				 $data['schoolID'],
				 $data['schoolName'],
				 $division,
				 $district
			);
	  }
	  return null;
	}

	public static function getAllSchools() {
		$db = Database::getDB();
		$query = "SELECT * FROM schools
		INNER JOIN divisions ON schools.divisionID = divisions.divisionID 
		INNER JOIN districts ON schools.districtID = districts.districtID";
		$stmt = $db->query($query);
		$results = [];

		while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$division = new Division(
				$data['divisionID'], 
				$data['divisionName'], 
				$data['minPop'],
				$data['pre24DivisionName']
			);
			$district = new District(
				$data['districtID'],
				$data['districtName'],
				$data['districtDescription'],
				$data['primaryCity']
			);
			$results[] = new School(
				$data['schoolID'],
				$data['schoolName'],
				$division,
				$district
			);
		}
		return $results;
   }
}
?>
