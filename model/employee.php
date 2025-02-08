<?php
class Employee implements JsonSerializable {
   private int $employeeID;
   private string $employeeName;
	private ?string $employeeShortName, $phone, $email;

   public function __construct(int $employeeID, string $employeeName, ?string $employeeShortName, 
										?string $phone, ?string $email) {
      $this->employeeID = $employeeID;
      $this->employeeName = $employeeName;
      $this->employeeShortName = $employeeShortName;
      $this->phone = $phone;
      $this->email = $email;
   }

   public function jsonSerialize() {
      return [
         'employeeID' => $this->employeeID,
         'employeeName' => $this->employeeName,
         'employeeShortName' => $this->employeeShortName,
         'phone' => $this->phone,
         'email' => $this->email
      ];
   }
	
	public static function buildFromRow(array $row): ?self {
			// if some how there is no employee, return null
		if (!isset($row['employeeID']) || $row['employeeID'] === null) return null;
		if ($row['employeeID']) {
			return new self(
				$row['employeeID'],
				$row['employeeName'],
				$row['employeeShortName'],
				$row['employeePhone'],
				$row['employeeEmail']
			);
		}
	}

   public function getEmployeeID() { return $this->employeeID; }
   public function setEmployeeID($value) { $this->employeeID = $value; }

   public function getEmployeeName() { return $this->employeeName; }
   public function setEmployeeName($value) { $this->employeeName = $value; }

   public function getEmployeeShortName() { return $this->employeeShortName; }
   public function setEmployeeShortName($value) { $this->employeeShortName = $value; }

   public function getPhone() { return $this->phone; }
   public function setPhone($value) { $this->phone = $value; }

   public function getEmail() { return $this->email; }
   public function setEmail($value) { $this->email = $value; }

   //////////////////////////////////////////////////
   // db functions
		// Add a new Employee to the database
   static function addEmployee($employeeName, $employeeShortName, $phone, $email) {
      $db = Database::getDB();

      $query = 'INSERT INTO employees (employeeName, employeeShortName, phone, email) VALUES (:employeeName, :employeeShortName, :phone, :email)';
      $statement = $db->prepare($query);
      $statement->bindValue(':employeeName', $employeeName);
      $statement->bindValue(':employeeShortName', $employeeShortName);
      $statement->bindValue(':phone', $phone);
      $statement->bindValue(':email', $email);
      $statement->execute();
      $statement->closeCursor();

			// Return the ID of the newly added employee
      return $db->lastInsertId();
   }

		// Get an Employee by ID
   static function getEmployeeByID($employeeID) {
      $db = Database::getDB();

      $query = 'SELECT * FROM employees WHERE employeeID = :employeeID';
      $statement = $db->prepare($query);
      $statement->bindValue(':employeeID', $employeeID);
      $statement->execute();
      $row = $statement->fetch(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      if ($row) return self::buildFromRow($row);
      return null; // Return null if not found
   }

		// Get all Employees
   static function getAllEmployees() {
      $db = Database::getDB();

      $query = 'SELECT * FROM employees';
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

			// returns an array of all vehicles built from $rows
		return array_map([self::class, 'buildFromRow'], $rows);
   }
}
?>
