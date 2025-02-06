<?php
class MessageOrder implements JsonSerializable {
	private ?int $messageOrderID, $schoolOrderID, $genderID;
	private ?string $genderName, $orderedBy, $fileName, $orderText;
	private ?SizeList $sizes;
	private $orderDate;

	public function __construct($orderID, $schoolOrderID, $genderID, $genderName, $sizes, $orderedBy,
										$orderText,  $fileName, $orderDate) {
		$this->messageOrderID = $orderID;
		$this->schoolOrderID = $schoolOrderID;
		$this->genderID = $genderID;
		$this->genderName = $genderName;
		if ($sizes instanceof SizeList) {
			$this->sizes = $sizes;
		} elseif (is_array($sizes)) {
			$this->sizes = new SizeList($sizes[0], $sizes[1], $sizes[2], $sizes[3], $sizes[4], $sizes[5]);
		}
		
		$this->orderedBy = $orderedBy;
		$this->orderText = $orderText;
		$this->fileName = $fileName;
		$this->orderDate = new DateTime($orderDate);
	}

	public function jsonSerialize() {
		return [
			'orderID' => $this->messageOrderID,
			'schoolOrderID' => $this->schoolOrderID,
			'genderID' => $this->genderID,
			'genderName' => $this->genderName,
			'sizes' => $this->sizes,
			'orderedBy' => $this->orderedBy,
			'orderText' => $this->orderText,
			'fileName' => $this->fileName,
			'orderDate' => $this->orderDate
		];
	}

   public function getMessageOrderID() {return $this->messageOrderID;}
	public function setMessageOrderID($value) {$this->messageOrderID = $value;}

	public function getSchoolOrderID() {return $this->schoolOrderID;}
	public function setSchoolOrderID($value) {$this->schoolOrderID = $value;}

	public function getGenderID() {return $this->genderID;}
	public function setGenderID($value) {$this->genderID = $value;}

	public function getGenderName() {return $this->genderName;}
	public function setGenderName($value) {$this->genderName = $value;}

	public function getSizes() {return $this->sizes;}
	public function setSizes($value) {$this->sizes = $value;}

	public function getOrderedBy() {return $this->orderedBy;}
	public function setOrderedBy($value) {$this->orderedBy = $value;}

	public function getOrderText() {return $this->orderText;}
	public function setOrderText($value) {$this->orderText = $value;}
	
	public function getFileName() {return $this->fileName;}
	public function setFileName($value) {$this->fileName = $value;}

	public function getOrderDate() {return $this->orderDate;}
	public function setOrderDate($value) {$this->orderDate = $value;}


	// Database Functions
	public static function addOrder($messageOrder) {
	  $db = Database::getDB();
	  $query = "INSERT INTO messageOrders (schoolOrderID, genderID, s, m, l, xl, xxl, xxxl, 
					orderedBy, orderText, fileName) 
					VALUES (:schoolOrderID, :genderID, :s, :m, :l, :xl, :xxl, :xxxl, :orderedBy, :orderText, :fileName)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':schoolOrderID', $messageOrder->getSchoolOrderID());
	  $stmt->bindValue(':genderID', $messageOrder->getGenderID());
	  $stmt->bindValue(':s', $messageOrder->getSizes()->getSize('s'));
	  $stmt->bindValue(':m', $messageOrder->getSizes()->getSize('m'));
	  $stmt->bindValue(':l', $messageOrder->getSizes()->getSize('l'));
	  $stmt->bindValue(':xl', $messageOrder->getSizes()->getSize('xl'));
	  $stmt->bindValue(':xxl', $messageOrder->getSizes()->getSize('xxl'));
	  $stmt->bindValue(':xxxl', $messageOrder->getSizes()->getSize('xxxl'));
	  $stmt->bindValue(':orderedBy', $messageOrder->getOrderedBy());
	  $stmt->bindValue(':orderText', $messageOrder->getOrderText());
	  $stmt->bindValue(':fileName', $messageOrder->getFileName());

	  $stmt->execute();
	  $messageOrder->setMessageOrderID($db->lastInsertId());
	}
	
	public static function getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID) {
		$db = Database::getDB();
		$query = 'SELECT messageOrderID FROM messageOrders 
					WHERE schoolOrderID = :schoolOrderID AND genderID = :genderID';
		$statement = $db->prepare($query);
		$statement->execute([':schoolOrderID' => $schoolOrderID, ':genderID' => $genderID]);
			// return id or null
		return $statement->fetchColumn() ?: null;
	}
	
	public static function getIDByEventIDAndSchoolIDAndGenderID($eventID, $schoolID, $genderID) {
		$db = Database::getDB();
		$query = 'SELECT messageOrderID FROM messageOrders 
					INNER JOIN schoolOrders ON messageOrders.schoolOrderID = schoolOrders.schoolOrderID
					WHERE eventID = :eventID AND schoolID = :schoolID AND genderID = :genderID';
		$statement = $db->prepare($query);
		$statement->execute([':eventID' => $eventID, ':schoolID' => $schoolID, ':genderID' => $genderID]);
			// return id or null
		return $statement->fetchColumn() ?: null;
	}

	public static function getOrderByID($id) {
	  $db = Database::getDB();
	  $query = "SELECT messageOrders.*, genders.genderName FROM messageOrders
					INNER JOIN genders ON messageOrders.genderID = genders.genderID
					WHERE messageOrderID = :messageOrderID";
	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':messageOrderID', $id);
	  $stmt->execute();
	  
	  $data = $stmt->fetch(PDO::FETCH_ASSOC);
	  if ($data) {
			return new MessageOrder(
				 $data['messageOrderID'],
				 $data['schoolOrderID'],
				 $data['genderID'],
				 $data['genderName'],
				 $data['s'],
				 $data['m'],
				 $data['l'],
				 $data['xl'],
				 $data['xxl'],
				 $data['xxxl'],
				 $data['orderedBy'],
				 $data['orderText'],
				 $data['fileName'],
				 $data['orderDate']
			);
	  }
	  return null; // Return null if no order is found
	}
	
	// public static function getOrdersBySchoolOrderID($id) {
		// $db = Database::getDB();
		// $query = "SELECT messageOrders.*, genders.genderName FROM messageOrders
					// INNER JOIN genders ON messageOrders.genderID = genders.genderID
					// WHERE messageOrders.schoolOrderID = :schoolOrderID";
		// $stmt = $db->prepare($query);
		// $stmt->bindValue(':schoolOrderID', $id);
		// $stmt->execute();
		
		// $results = [];
		// while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			// $results[] = new MessageOrder(
				// $data['messageOrderID'],
				// $data['schoolOrderID'],
				// $data['genderID'],
				// $data['genderName'],
				// $data['s'],
				// $data['m'],
				// $data['l'],
				// $data['xl'],
				// $data['xxl'],
				// $data['xxxl'],
				// $data['orderedBy'],
				// $data['orderText'],
				// $data['fileName'],
				// $data['orderDate']
			// );
	  // }
	  // return null; // Return null if no order is found
	// }
	
	public static function updateSizes($id, $sizes) {
		$db = Database::getDB();
		$query = "UPDATE messageOrders 
					SET s = :s, m = :m, l = :l, xl = :xl, xxl = :xxl, xxxl = :xxxl
					WHERE messageOrderID = :id";
	
		$stmt = $db->prepare($query);
		$stmt->bindValue(':s', $sizes->getSize('s'));
		$stmt->bindValue(':m', $sizes->getSize('m'));
		$stmt->bindValue(':l', $sizes->getSize('l'));
		$stmt->bindValue(':xl', $sizes->getSize('xl'));
		$stmt->bindValue(':xxl', $sizes->getSize('xxl'));
		$stmt->bindValue(':xxxl', $sizes->getSize('xxxl'));
		$stmt->bindValue(':id', $id);
	
		$stmt->execute();
		// return $db->lastInsertId();
	}

	public static function getAllOrders() {
	  $db = Database::getDB();
	  $query = "SELECT messageOrders.*, genders.genderName FROM messageOrders
					INNER JOIN genders ON messageOrders.genderID = genders.genderID";
	  $stmt = $db->query($query);
	  $results = [];

	  while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$results[] = new MessageOrder(
				 $data['messageOrderID'],
				 $data['schoolOrderID'],
				 $data['genderID'],
				 $data['genderName'],
				 $data['s'],
				 $data['m'],
				 $data['l'],
				 $data['xl'],
				 $data['xxl'],
				 $data['xxxl'],
				 $data['orderedBy'],
				 $data['orderText'],
				 $data['fileName'],
				 $data['orderDate']
			);
	  }
	  return $results; // Return an array of MessageOrder objects
	}
}
?>