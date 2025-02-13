<?php
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// a lot of classes representing db tables were looking very similar, so i made this.
	// it gives child classes an $id and a $name, and a jsonSerialization of all public properties
	// it includes basic db functions, add(), getByID(), getAll(), and deleteByID()
	// it involves some messy stuff making complex JOINs in get()s work, particularly buildJoins() and buildFromRow()
	// but it's working
	//////////////////////////////////////////////////////////////////////////////////////////////////

abstract class BasicTableModel implements JsonSerializable {
	
		// Each subclass must define its table, columns, and dependent tales
   abstract protected static function getTableName(): string;
	abstract protected static function getPrimaryKey(): string;
		// format as: return [propName1 => colName1, propName2 => colName2]
	abstract protected static function getColumns(): array;
		// defined as: new Relation($property, $class, $matchKey, $isMany)
   protected static function getRelations(): array { return []; }	
	
		// basic constructor. every child will have an $id and $name
	public function __construct(public readonly int $id, public readonly ?string $name) {}

		// get_object_vars() here will serializes all public properties.
			// over ride as needed, eg for private properties, or formatted data
   public function jsonSerialize(): mixed {
      return get_object_vars($this);
   }
	
		// builds a new object from a $row returned from a db call
			// we have to screw with prefixes to deconstruct unique column aliases in $row['keys']
	public static function buildFromRow(array $rows, string $colPrefix = ''): mixed { // ?static {
		if (empty($rows)) return null;
	
		$firstRow = $rows[0]; // Use first row for parent data
		$columns = static::getColumns();
		$relations = static::getRelations();
			// we have to screw with prefixes to deconstruct unique column aliases in $row['keys']
		$colPrefix .= static::getTableName() . '_';
		
		$mappedRow = [];
			// Map parent properties
		foreach ($columns as $propName => $colName) {
			$colAlias = $colPrefix . $colName;
			if (!array_key_exists($colAlias, $firstRow)) return null;
			$mappedRow[$propName] = $firstRow[$colAlias];
		}
	
			// Handle relations (both one-to-one and one-to-many)
		foreach ($relations as $relation) {
			if (class_exists($relation->rClass)) {
				$relatedObjects = [];
				$relationPK = $relation->rClass::getPrimaryKey();
				
				$relColPrefix = $colPrefix . $relation->rClass::getTableName() . '_';
	
					// Group related objects by their primary key ($rows, $rowKey)
				$relatedGrouped = self::groupRowsByKey($rows, $relColPrefix . $relationPK);
				// $relatedGrouped = [];
				// foreach ($rows as $row) {
					// if (!isset($row[$colPrefix . $relation->matchKey])) continue;
					// $relatedKey = $row[$relColPrefix . $relationPK];
					// $relatedGrouped[$relatedKey][] = $row;
				// }
				
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
			// ($rows, $rowKey)
		$groupedRows = self::groupRowsByKey($rows, static::getTableName() . '_' . static::getPrimaryKey());
		return array_map([static::class, 'buildFromRow'], $groupedRows);
	}
	
		// helper to group fetched rows by a key. // $keyPrefix is used for aliased column names
	protected static function groupRowsByKey(array $rows, string $rowKey): array {
		 $grouped = [];
		 foreach ($rows as $row) {
			  if (!isset($row[$rowKey])) continue;
			  $key = $row[$rowKey];
			  $grouped[$key][] = $row;
		 }
		 return $grouped;
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
	
		// getAll and getByID both implement a pair of helper functions (buildSelect() and buildJoins()) that do the heavy lifting
	public static function getAllFromDB(): array {
		$query = static::buildSelect();
		// return $query;
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
	protected static function getFromDB(string $query, array $params = []): array {
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
	
		// builds the SELECT statement for get...FromDB() functions. includes helpers to build JOINs and column selections
			// this and buildJoins() got a little messy in needing to build a query with unique table aliases for JOINs, and
				// unique column aliases. this is so we can join the same table to different tables, and have the returned
				// associative array know what is what. those constructed aliases are deconstructed in buildFromRow()
	protected static function buildSelect(): string {
		$table = static::getTableName();
		$columns = static::getColumns();
		$relations = static::getRelations();
	
		$selectColumns = [];
		self::buildSelects($selectColumns, $table, $columns);
			// Call recursive function to handle relations and their relations. returns array of JOIN statements
		$joins = self::buildJoins($table, $relations, $selectColumns);
			// Build the final SELECT query
		$query = "SELECT " . implode(", ", $selectColumns) . " FROM $table " . implode(" ", $joins);
		return $query;
	}
	
	protected static function buildSelects(&$selectColumns, $table, $columns) {
		foreach ($columns as $col) {
			$selectColumns[] = "$table.$col AS $table" . "_$col";
		}
	}
	
		// Recursive helper function to handle deep relations (relations of relations) for query builder
	protected static function buildJoins($currentTable, $currentRelations, &$selectColumns, $joins = [], $prefix = '') {
		$oldAlias = $prefix . $currentTable;
		$prefix .= $currentTable . '_';
		
		foreach ($currentRelations as $currentRelation) {
			$relatedClass = $currentRelation->rClass;
	
			if (!class_exists($relatedClass)) continue;
	
			$relatedTable = $relatedClass::getTableName();
			$relatedColumns = $relatedClass::getColumns();
			$matchKey = $currentRelation->matchKey;
			
			$tableAlias = $prefix . $relatedTable;
				// Add columns of the related table to the SELECT clause
			self::buildSelects($selectColumns, $tableAlias, $relatedColumns);
			
				// build joins with an intermediate table, or without
			if ($currentRelation->interTable) {
				$interTable = $currentRelation->interTable;
				$tableAlias = $prefix . $interTable;
				$joins[] = self::writeJoin($interTable, $tableAlias, $oldAlias, $matchKey);
				$priorAlias = $tableAlias;
				$tableAlias = $prefix . $relatedTable;
				$joins[] = self::writeJoin($relatedTable, $tableAlias, $priorAlias, $relatedClass::getPrimaryKey());
			} else {
// Test::logX($relatedClass, $relatedTable);
				$tableAlias = $prefix . $relatedTable;
				$joins[] = self::writeJoin($relatedTable, $tableAlias, $oldAlias, $matchKey);
			}
				// Recursively handle relations of the related class (i.e., relations of relations)
			$joins = self::buildJoins($relatedTable, $relatedClass::getRelations(), $selectColumns, $joins, $prefix);
		}
		return $joins;
	}
	
	private static function writeJoin($relatedTable, $tableAlias, $oldAlias, $matchKey) {
		return "LEFT JOIN $relatedTable AS $tableAlias ON $oldAlias.$matchKey = $tableAlias.$matchKey";
	}
}
?>
