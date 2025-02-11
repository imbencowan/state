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
   static function logX(...$x) {
			// returns info on where logX was called
		$callerInfo = debug_backtrace()[0];
		$fileName = basename($callerInfo['file']);
		$callerText = $fileName . ': line ' . $callerInfo['line'];
			// put it on the front of $x
		$x = [$callerText, ...$x];
		
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
		$table = 'Colors';
		// $colors = Color::getAllFromDB();
		// $districts = District::getAllFromDB();
		// $divisions = Division::getAllFromDB();
		// $employees = Employee::getAllFromDB();
		// $items = Item::getAllFromDB();
		// $messageOrders = MessageOrder::getAllFromDB();
		// $mOrderItems = MOrderItem::getAllFromDB();
		// $schools = School::getAllFromDB();
		$schoolOrders = SchoolOrder::getAllFromDB();
		// $sites = Site::getAllFromDB();
		// $sizes = Size::getAllFromDB();
		// $sOrderItems = SOrderItem::getAllFromDB();
		// $sports = Sport::getAllFromDB();
		// $styles = Style::getAllFromDB();
		// $vehicles = Vehicle::getAllFromDB();
		// $oneSchool = School::getByID(1);
		$rows = Database::getTable($table);
		if (!empty($rows)) {
				// Retrieve property names. just use the first item, any will work
			$propertyNames = array_keys(get_object_vars($rows[0]));
		} else {
			echo "No results found.";
		}
		include 'view/tests.php';
		include 'view/table.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => [	
			// 'colors' => $colors, 
			// 'districts' => $districts, 'divisions' => $divisions, 'employees' => $employees, 
			// 'items' => $items, 
			// 'mOrderItems' => $mOrderItems, 
			// 'messageOrders' => $messageOrders, 
			// 'schools' => $schools, 
			'schoolOrders' => $schoolOrders, 
			// 'sites' => $sites, 'sizes' => $sizes, 
			// 'sOrderItems' => $sOrderItems, 
			// 'sports' => $sports, 'styles' => $styles, 'vehicles' => $vehicles, 
			// 'oneSchool' => $oneSchool
			]
		]);
	}
	
	static function showTable($data) {
		ob_start();
		$table = $data['table'];
		$rows = Database::getTable($table);
		$colors = Color::getAllFromDB();
		if (!empty($rows)) {
				// Retrieve property names. just use the first item, any will work
			$propertyNames = array_keys(get_object_vars($rows[0]));
		} else {
			echo "No results found.";
		}
		include 'view/yearDiv.php';
		include 'view/tests.php';
		include 'view/table.php';
			// Get the buffered content as a string
		$htmlContent = ob_get_clean();
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $rows,
			'colors' => $colors
		]);
	}
	
	static function getItemByID($data) {
		$class = $data['className'];
		$action = 'getByID';
		$id = $data['id'];
		$item = call_user_func([$class, $action], $id);
		// call_user_func([$class, $action], $data);
		$html = "The Test::getItemsByID() function was called";
		echo json_encode(['item' => $item, 'data' => $data]);
	}
	
	static function getAllItems($data) {
		$class = $data['className'];
		$action = 'getAllFromDB';
		$items = call_user_func([$class, $action]);
		$html = "The Test::getAllItems() function was called";
		echo json_encode(['data' => $data, 'items' => $items]);
	}
	
	static function addItem($data) {
		$class = $data['className'];
		$action = 'addToDB';
		$name = $data['name'];
		$newID = call_user_func([$class, $action], $data);
		$html = "The Test::addItem() function was called";
		echo json_encode(['newID' => $newID]);
	}
	
	static function deleteItem($data) {
		$class = $data['className'];
		$action = 'deleteByID';
		$newID = call_user_func([$class, $action], $data['id']);
		$html = "The Test::deleteItem() function was called";
		echo json_encode(['deletedID' => $data['id']]);
	}
}
?>
