<?php
class Database {
	private static $dsn = 'mysql:host=localhost;dbname=state4';
	private static $username = 'root';
	private static $password = '';
	private static $db;
	
	private function __construct() {}
	
	public static function getDB () {
		if (!isset(self::$db)) {
			try {
				self::$db = new PDO(self::$dsn, self::$username, self::$password);
			} catch (PDOException $e) {
				$error_message = $e->getMessage();
				include('../errors/database_error.php');
			}
		}
		return self::$db;
	}
	
		// a wrapper to catch errors in db functions
	public static function withDB(callable $callback) {
      try {
         $db = self::getDB();
         $db->beginTransaction();

         $result = $callback($db);

         $db->commit();
         return $result;

      } catch (PDOException $e) {
         if (isset($db) && $db->inTransaction()) {
            $db->rollBack();
         }
         http_response_code(500);
         echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
         exit;
      }
   }
	
	public static function getTable($table) {
		$db = self::getDB();
			// Use backticks to allow table name substitution. table names can not be bound
		$query = "SELECT * FROM `$table`";
		$stmt = $db->prepare($query);
		$stmt->execute();

			// Fetch results as generic objects with properties matching column names
		$results = [];
		while ($data = $stmt->fetch(PDO::FETCH_OBJ)) {
			$results[] = $data;
		}
		
		return $results;
	}
}
?>