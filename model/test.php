<?php
class Test implements JsonSerializable {
   private $txt;

   public function __construct($txt) {
       $this->txt = $txt;
   }

   public function jsonSerialize(): mixed {
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
		$action = 'addInstanceToDB';
		$name = $data['name'];
		$newID = call_user_func([$class, $action], $data);
		$html = "The Test::addItem() function was called";
		echo json_encode(['newID' => $newID]);
	}
	
	static function deleteItem($data) {
		$class = $data['className'];
		$action = 'deleteByIDs';
		$newID = call_user_func([$class, $action], $data['id']);
		$html = "The Test::deleteItem() function was called";
		echo json_encode(['deletedID' => $data['id']]);
	}
	
	public static function hEcho($content) {
		echo json_encode(['content' => $content]);
	}
}
?>
