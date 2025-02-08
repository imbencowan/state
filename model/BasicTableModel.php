<?php
	/////////////////////////////////////////////////////////////////////////////////////////////////
	// a lot of classes representing db tables were looking very similar, so i made this.
	// it gives child classes an $id and a $name, and a jsonSerialization of all public properties
	// it includes basic db functions, add(), getByID(), getAll(), and i should probably add a delete
	/////////////////////////////////////////////////////////////////////////////////////////////////

abstract class BasicTableModel implements JsonSerializable {
	
		// Each subclass must define its table and columns
   abstract protected static function getTableName(): string;
		// format as: return [propName1 => colName1, propName2 => colName2]
	abstract protected static function getColumns(): array;
	
	
		// basic constructor. every child will have an $id and $name
	public function __construct(public readonly int $id, public readonly ?string $name) {}

		// get_object_vars() here will serializes all public properties.
			// over ride as needed, eg for private properties, or formatted data
   public function jsonSerialize(): array {
      return get_object_vars($this);
   }


   public static function buildFromRow(array $row): ?static {
			// Flip so db column names => object property names
		$columns = static::getColumns();
			// Map database row to object properties
		$mappedRow = [];
		foreach ($columns as $propName => $colName) {
				// Ensure column exists
			if (!array_key_exists($colName, $row)) return null;
			$mappedRow[$propName] = $row[$colName];
		}

		return new static(...$mappedRow);
	}


	

   //////////////////////////////////////////////////
   // Database functions
	
	public static function addToDB(array $data): ?int {
		// Test::logX($data);
      $db = Database::getDB();
			// Ensure only valid columns are used
		$validColumnNames = array_intersect_key(static::getColumns(), $data);
      $validColumns = array_intersect_key($data, static::getColumns());
			// Avoid inserting nothing
      if (empty($validColumns)) return null; 

      $columns = implode(', ', $validColumnNames);
      $placeholders = implode(', ', array_map(fn($col) => ":$col", array_keys($validColumns)));

      $query = "INSERT INTO " . static::getTableName() . " ($columns) VALUES ($placeholders)";
      $statement = $db->prepare($query);

      foreach ($validColumns as $column => $value) {
         $statement->bindValue(":$column", $value);
      }

      $statement->execute();
      return $db->lastInsertId();
   }

   public static function getByID(int $id): ?static {
      $db = Database::getDB();
			// make a list from the returned array
      $columns = implode(', ', static::getColumns());
		$idCol = static::getColumns()['id'];
		$query = "SELECT $columns FROM " . static::getTableName() . " WHERE $idCol = :id";
      $statement = $db->prepare($query);
			// PARAM_INT ensures $id is an int (not a string)
      $statement->bindValue(':id', $id, PDO::PARAM_INT);
      $statement->execute();
      $row = $statement->fetch(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      return $row ? static::buildFromRow($row) : null;
   }

   public static function getAllFromDB(): array {
      $db = Database::getDB();
			// make a list from the returned array
      $columns = implode(', ', static::getColumns());
      $query = "SELECT $columns FROM " . static::getTableName();
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      return array_map([static::class, 'buildFromRow'], $rows);
   }
	
	public static function deleteByID(int $id): bool {
		$db = Database::getDB();
		$idCol = static::getColumns()['id'];
		$query = "DELETE FROM " . static::getTableName() . " WHERE $idCol = :id";
		$statement = $db->prepare($query);
		$statement->bindValue(':id', $id, PDO::PARAM_INT);
		$statement->execute();
		$affectedRows = $statement->rowCount();
		$statement->closeCursor();

		return $statement->rowCount() > 0; // return true if rows were affected
	}
}
?>
