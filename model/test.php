<?php
class Test implements JsonSerializable {
   private $txt;

   public function __construct($txt) {
       $this->txt = $txt;
   }

   public function jsonSerialize() {
       return [
           'txt' => $this->txt
       ];
   }

   public function getTxt() { return $this->txt; }
   public function setTxt($value) { $this->txt = $value; }
   
   //////////////////////////////////////////////////
   // db functions
   static function logX($x) {
		$db = Database::getDB();
	
		$query = 'INSERT INTO tests (testText) VALUES (:x)';
		$statement = $db->prepare($query);
		// json_encode() to turn variables in to strings
		$statement->bindValue(':x', json_encode($x));
		$statement->execute();
		$statement->closeCursor();
	
		// Return the ID of the newly added site
		return $db->lastInsertId();
   }
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to Tests page. who knows what it holds now
	static function showTests($data) {
		ob_start();
		include 'view/tests.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		echo json_encode([
			'html' => $htmlContent,
			// 'data' => [	'year' => $ ]
		]);
	}
	
	static function showTable($data) {
		ob_start();
		$table = $data['table'];
		// self::logText($table);
		$items = Database::getTable($table);
		if (!empty($items)) {
				// Retrieve property names. just use the first item, any will work
			$propertyNames = array_keys(get_object_vars($items[0]));
		} else {
			echo "No results found.";
		}
		include 'view/yearDiv.php';
		include 'view/table.php';
			// Get the buffered content as a string
		$htmlContent = ob_get_clean();
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $items
		]);
	}
}
?>
