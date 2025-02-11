<?php
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// a lot of classes representing db tables were looking very similar, so i made this.
	// it gives child classes an $id and a $name, and a jsonSerialization of all public properties
	// it includes basic db functions, add(), getByID(), getAll(), and i should probably add a delete
	//////////////////////////////////////////////////////////////////////////////////////////////////

abstract class BasicTableModel implements JsonSerializable {
	
		// Each subclass must define its table, columns, and dependent tales
   abstract protected static function getTableName(): string;
	abstract protected static function getPrimaryKey(): string;
		// format as: return [propName1 => colName1, propName2 => colName2]
	abstract protected static function getColumns(): array;
		// defined as: new Relation($property, $class, $foreignKey)
   protected static function getRelations(): array { return []; }
	
	protected static function getColumnMaps(): array {
		$maps = [];
		foreach (static::getColumns() as $prop => $col) {
				// ColumnMap is formatted as ($property, $columnName, $alias). this will give unique aliases 
			$maps[$prop] = new ColumnMap($prop, $col, static::getTableName() . "_$col");
		}
	}
	
	
		// basic constructor. every child will have an $id and $name
	public function __construct(public readonly int $id, public readonly ?string $name) {}

		// get_object_vars() here will serializes all public properties.
			// over ride as needed, eg for private properties, or formatted data
   public function jsonSerialize(): mixed {
      return get_object_vars($this);
   }
	
		// builds a new object from a $row returned from a db call
	public static function buildFromRow(array $groupedRows, string $colPrefix = ''): mixed { // ?static {
		if (empty($groupedRows)) return null;
	
		$firstRow = $groupedRows[0]; // Use first row for parent data
		$columns = static::getColumns();
		$relations = static::getRelations();
		
		$colPrefix .= static::getTableName() . '_';
		
		$mappedRow = [];
			// Map parent properties
		foreach ($columns as $propName => $colName) {
			$colAlias = $colPrefix . $colName;
			if (!array_key_exists($colAlias, $firstRow)) Test::logX($colAlias); // return null;
			$mappedRow[$propName] = $firstRow[$colAlias];
		}
	
			// Handle relations (both one-to-one and one-to-many)
		foreach ($relations as $relation) {
			if (class_exists($relation->rClass)) {
				$relatedObjects = [];
				$relationPK = $relation->rClass::getPrimaryKey();
				
				$relColPrefix = $colPrefix . $relation->rClass::getTableName() . '_';
	
					// Group related objects by their primary key (prevents duplicates)
				$relatedGrouped = [];
				foreach ($groupedRows as $row) {
					if (!isset($row[$colPrefix . $relation->foreignKey])) continue;
					$relatedKey = $row[$relColPrefix . $relationPK];
					$relatedGrouped[$relatedKey][] = $row;
				}
				
					// Recursively process related entities
				foreach ($relatedGrouped as $relatedRows) {
						// if the id for the foreign key is null, don't try to instantiate an object
					if ($firstRow[$relColPrefix . $relationPK] == null) continue;
					$relatedObjects[] = $relation->rClass::buildFromRow($relatedRows, $colPrefix);
				}
					// Store as an array if it's a one-to-many relation, otherwise store a single object
				$mappedRow[$relation->property] = $relation->isMany ? $relatedObjects : ($relatedObjects[0] ?? null);
			}
		}
		
		return new static(...$mappedRow);
	}

	
		// Helper function to group rows by primary key before passing to buildFromRow
	protected static function groupAndBuild(array $rows): array {
		$groupedRows = [];
		foreach ($rows as $row) {
			$key = static::getTableName() . '_' . static::getPrimaryKey();
			$pkValue = $row[$key];
			$groupedRows[$pkValue][] = $row;
		}
		return array_map([static::class, 'buildFromRow'], $groupedRows);
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
	public static function getAllFromDB(): mixed { // array {
		$query = static::buildSelect();
		$rows = static::getFromDB($query);
		return static::groupAndBuild($rows);
	}

		// see above
	public static function getByID(int $id): ?static {
		$idCol = static::getColumns()['id'];
		$query = static::buildSelect() . " WHERE " . $idCol . " = :id";
		$rows = static::getFromDB($query, [':id' => $id]);
		return !empty($rows) ? static::groupAndBuild($rows)[$id] : null;
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
	
		// builds the SELECT statement for get...FromDB() functions. includes a helper to recursively build JOINs
	private static function buildSelect(): string {
		$table = static::getTableName();
		$columns = static::getColumns();
		$relations = static::getRelations();
	
		$selectColumns = [];
		foreach ($columns as $colName) {
			$selectColumns[] = "$table.$colName AS $table" . "_$colName";
		}
	
			// Initialize the joins arrays
		$joins = [];
	
			// Recursive function to handle deep relations (relations of relations)
		$buildJoins = function ($currentTable, $currentRelations, $prefix = '', $depth = 0) 
										use (&$buildJoins, &$joins, &$selectColumns, $table) {
			
			$oldAlias = $prefix . $currentTable;
			$prefix .= $currentTable . '_';
			
			foreach ($currentRelations as $currentRelation) {
				$relatedClass = $currentRelation->rClass;
		
				if (!class_exists($relatedClass)) continue;
		
				$relatedTable = $relatedClass::getTableName();
				$relatedColumns = $relatedClass::getColumns();
				$foreignKey = $currentRelation->foreignKey;
					
				$tableAlias = $prefix . $relatedTable;
				
					// Add columns of the related table to the SELECT clause
				foreach ($relatedColumns as $relCol) {
						// the if () prevents duplicate column names from JOIN clauses clashing in the returned associative array
					$alias = $tableAlias . "_$relCol";
					// if ($relCol !== $foreignKey) $selectColumns[] = "$tableAlias.$relCol AS $alias";
					$selectColumns[] = "$tableAlias.$relCol AS $alias";
				}
				
					// Build JOIN condition
				$joins[] = "LEFT JOIN $relatedTable AS $tableAlias ON $oldAlias.$foreignKey = $tableAlias.$foreignKey";
		
					// Recursively handle relations of the related class (i.e., relations of relations)
				$relatedRelations = $relatedClass::getRelations();
				if (!empty($relatedRelations)) {
					$buildJoins($relatedTable, $relatedRelations, $prefix, $depth + 1);
				}
			}
		};
	
			// Call recursive function to handle relations and their relations
		$buildJoins($table, $relations);
	
			// Build the final SELECT query
		$query = "SELECT " . implode(", ", $selectColumns) . " FROM $table ";
		if (!empty($joins)) {
			$query .= implode(" ", $joins);
		}
		
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
