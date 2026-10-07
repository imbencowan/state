<?php
class Database {
	private static $dsn = 'mysql:host=localhost;dbname=state';
	private static $username = 'root';
	private static $password = '';
	private static $db;
	
	private function __construct() {}
	
	public static function getDB () {
		if (!isset(self::$db)) {
			try {
				// self::$db = new PDO(self::$dsn, self::$username, self::$password,
				// 	[
				// 			// set errormode, default fetch, and some thing for prepares
				// 		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				// 		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
				// 		PDO::ATTR_EMULATE_PREPARES => false,
				// 	]
				self::$db = new PDO(self::$dsn, self::$username, self::$password);
			} catch (PDOException $e) {
				$error_message = $e->getMessage();
				// include('../errors/database_error.php');
			}
		}
		return self::$db;
	}
	
		// a wrapper to manage transactions and catch errors in db functions
	public static function withDB(callable $callback) {
      try {
         $db = self::getDB();
         $db->beginTransaction();

         $result = $callback($db);

         $db->commit();
         return $result;

      // } catch (PDOException $e) {
      //    if (isset($db) && $db->inTransaction()) {
      //       $db->rollBack();
      //    }
      //    http_response_code(500);
      //    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
      //    exit;
      // }

		} catch (Throwable $e) {
			if (isset($db) && $db->inTransaction()) {
				$db->rollBack();
			}
			throw $e;
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


		// executes 'arbitrary' sql. called by multiple functions above and in other classes
public static function getFromDB(string $query, array $params = []): array {
	$db = self::getDB();

	$statement = $db->prepare($query);
		// bind parameters
	foreach ($params as $key => $value) {
		$statement->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
	}

	// $a = 'Memory before execute: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
	$statement->execute();

	// $b = 'Memory after execute, before fetch: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";

	$rows = $statement->fetchAll();

	// $table = 'Table: ' . static::getTableName();
	// $rCount = 'Rows fetched: ' . count($rows);
	// $cCount = 'Columns: ' . count($rows[0] ?? []);
	// $c = 'Memory after fetchAll: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
	// $d = 'Peak memory so far: ' . round(memory_get_peak_usage() / 1024 / 1024, 2) . " MB\n";
	// // if (count($rows) > 50) Test::logX($table, $rCount, $cCount, $a, $b, $c, $d);
	// Test::logX($table, $rCount, $cCount, $a, $b, $c, $d);

	$statement->closeCursor();

	return $rows;
}
}
?>