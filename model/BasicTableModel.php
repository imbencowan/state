<?php
	/////////////////////////////////////////////////////////////////////////////////////////////////
	// a lot of classes representing db tables were looking very similar, so i made this.
	// it gives child classes an $id and a $name, and a jsonSerialization of all public properties
	// it includes basic db functions, add(), getByID(), getAll(), and i should probably add a delete
	/////////////////////////////////////////////////////////////////////////////////////////////////

abstract class BasicTableModel implements JsonSerializable {
	
		// Each subclass must define its table, columns, and dependent tales
   abstract protected static function getTableName(): string;
		// format as: return [propName1 => colName1, propName2 => colName2]
	abstract protected static function getColumns(): array;
		// Define in subclasses: ['propertyName' => 'RelatedClass']
   protected static function getRelations(): array { return []; }
	
	
		// basic constructor. every child will have an $id and $name
	public function __construct(public readonly int $id, public readonly ?string $name) {}

		// get_object_vars() here will serializes all public properties.
			// over ride as needed, eg for private properties, or formatted data
   public function jsonSerialize(): mixed {
      return get_object_vars($this);
   }
	
		// builds a new object from a $row returned from a db call
	public static function buildFromRow(array $row): ?static {
			// use the columns and relations defined for the class
		$columns = static::getColumns();
		$relations = static::getRelations();
		$mappedRow = [];

			// if it's a valid column, map it to the $mappedRow to be sent to the constructor
		foreach ($columns as $propName => $colName) {
			if (!array_key_exists($colName, $row)) return null;
			$mappedRow[$propName] = $row[$colName];
		}

			// get the dependent objects. the joined tables
		foreach ($relations as $propName => $relatedClass) {
			if (class_exists($relatedClass)) {
				$mappedRow[$propName] = isset($row["{$propName}ID"]) ? $relatedClass::buildFromRow($row) : null;
			}
		}

		return new static(...$mappedRow);
	}

	

   //////////////////////////////////////////////////
   // Database functions
	
	public static function addToDB(array $data): ?int {
      $db = Database::getDB();
			// Ensure only valid columns are used
		$validColumnNames = array_intersect_key(static::getColumns(), $data);
      $validColumns = array_intersect_key($data, static::getColumns());
			// Avoid inserting nothing
      if (empty($validColumns)) return null; 

			// build a couple subStrings to be combined in the $query
      $columns = implode(', ', $validColumnNames);
      $placeholders = implode(', ', array_map(fn($col) => ":$col", array_keys($validColumns)));

      $query = "INSERT INTO " . static::getTableName() . " ($columns) VALUES ($placeholders)";
      $statement = $db->prepare($query);
			
			// dynamically bind the values to be inserted
      foreach ($validColumns as $column => $value) {
         $statement->bindValue(":$column", $value);
      }

      $statement->execute();
      return $db->lastInsertId();
   }
	
		// getAll and getByID both implement a pair of helper functions that do the heavy lifting
	public static function getAllFromDB(): array {
		$query = static::buildSelect();
		$rows = static::getFromDB($query);
		return array_map([static::class, 'buildFromRow'], $rows);
	}

		// see above
	public static function getByID(int $id): ?static {
		$idCol = static::getColumns()['id'];
		$query = static::buildSelect() . " WHERE " . $idCol . " = :id";
		$rows = static::getFromDB($query, [':id' => $id]);

		return !empty($rows) ? static::buildFromRow($rows[0]) : null;
	}
	
		// a helper for various get()s. takes a $query and $params, and makes the actual call
	private static function getFromDB(string $query, array $params = []): array {
		$db = Database::getDB();
		$statement = $db->prepare($query);

		foreach ($params as $key => $value) {
			$statement->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
		}
		$statement->execute();
		$rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		return $rows;
	}
	
		// builds SELECT queries for get() db calls. uses class data for columns and tables
	private static function buildSelect(): string {
		$table = static::getTableName();
		$columns = static::getColumns();
		$relations = static::getRelations();

		$selectColumns = [];
		foreach ($columns as $colName) {
			$selectColumns[] = "$table.$colName";
		}
		
			// these lines build the JOINs for tables named in getRelations()
		$joins = [];
		foreach ($relations as $propName => $relatedClass) {
			if (!class_exists($relatedClass)) continue;

			$relatedTable = $relatedClass::getTableName();
			$relatedColumns = $relatedClass::getColumns();
			$foreignKey = $relatedColumns['id'];

			foreach ($relatedColumns as $relCol) {
				$selectColumns[] = "$relatedTable.$relCol";
			}

			$joins[] = "LEFT JOIN $relatedTable ON $table.$foreignKey = $relatedTable.$foreignKey";
		}

		$query = "SELECT " . implode(", ", $selectColumns) . " FROM $table ";
		if (!empty($joins)) $query .= implode(" ", $joins);

		return $query;
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
