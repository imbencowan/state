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
		
		//this function returns all of a class's (table's) relations.
		// it is overridden in subclasses with relations. if a subclass has no relations, the default works
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
  	protected static function getRelations(): array { return []; }
		// get relations filtered by $context
	protected static function getContextRelations(?string $context = null): array {
		$allRelations = static::getRelations();

		if ($context === null) return $allRelations;

			// use the callback to filter relations
		return array_filter($allRelations, function (Relation $relation) use ($context) {
				// if $context is included in stopContexts, return false, excluding the element from the filtered array
			return !in_array($context, $relation->stopContexts);
		});
	}
	
		// basic constructor. every child will have an $id and $name
	public function __construct(public readonly ?int $id, public readonly ?string $name) {}

		// get_object_vars() here will serializes all public properties.
			// over ride as needed, eg for private properties, or formatted data
	public function jsonSerialize(): mixed {
		return get_object_vars($this);
	}
	

		// builds a new object from $rows returned from a db call
			// we have to screw with prefixes to deconstruct unique column aliases in $row['keys']
	public static function buildFromRow(array $rows, string $colPrefix = '', ?string $context = null): mixed { // ?static {
		if (empty($rows)) return null;
	
		$firstRow = $rows[0]; // Use first row for parent data
		$columns = static::getColumns(); // an array [propertyName => columnName]
		$relations = static::getContextRelations($context);
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
				
					// Recursively process related entities
				foreach ($relatedGrouped as $relatedRows) {
						// if the id for the foreign key is null, don't try to instantiate an object
					if ($firstRow[$relColPrefix . $relationPK] == null) continue;
					$relatedObjects[] = $relation->rClass::buildFromRow($relatedRows, $colPrefix, $context);
				}
					// Store as an array if it's a one-to-many relation, otherwise store a single object
				$mappedRow[$relation->property] = $relation->isMany ? $relatedObjects : ($relatedObjects[0] ?? null);
			}
		}
		return new static(...$mappedRow);
	}

	
		// Helper function to group rows by primary key before passing to buildFromRow
	protected static function groupAndBuild(array $rows, ?string $context = null): array {	
			// ($rows, $rowKey)
		$groupedRows = self::groupRowsByKey($rows, static::getTableName() . '_' . static::getPrimaryKey());

			// make sure to transfer $context to buildFromRow()
		return array_map(function ($row) use ($context) {
			return static::buildFromRow($row, context: $context);
		}, $groupedRows);

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
	
		// returns the sent array keyed by element's name property and sorted
	protected static function organizeArray($arr): array {
		$organized = [];
		foreach ($arr as $a) {
			$organized[$a->name] = $a;
		}
		ksort($organized);
		return $organized;
	}

	

   ////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////
   // Database functions
	
	public function addToDB(): ?int {
		$db = Database::getDB();
		
			// get object properties and columns
		$instanceData = get_object_vars($this);
		$columnNames = static::getColumns();
			// Remove 'id' so the db can auto set it
		unset($columnNames['id']);
		
			// match column names to property values
		$insertArray = [];
		foreach ($columnNames as $propName => $colName) {
			$insertArray[$colName] = $instanceData[$propName];
		}
		
			// Avoid inserting nothing
		if (empty($insertArray)) return null; 
			// Build substrings for the query
		$columns = implode(', ', array_keys($insertArray));
		$placeholders = implode(', ', array_map(fn($col) => ":$col", array_keys($insertArray)));
			// build the query
		$query = "INSERT INTO " . static::getTableName() . " ($columns) VALUES ($placeholders)";		
		
		$statement = $db->prepare($query);
			// bind the values to be inserted
		foreach ($insertArray as $column => $value) {
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

		// SELECTs ////////////////////////////////////////////////////////////////////////////////////////////////////
		// getAll and getByID both implement a pair of helper functions (buildSelect() and buildJoins()) that do the heavy lifting
	public static function getAllFromDB(?string $context = null, ?WhereCondition $where = null): array {
		$query = static::buildSelect($context, $where);
		$rows = static::getFromDB($query);
		return static::groupAndBuild($rows, $context);
	}

		// see above
	public static function getByID(int $id): ?static {
		$table = static::getTableName();
		$idCol = static::getColumns()['id'];
		$query = static::buildSelect() . " WHERE $table.$idCol  = :id";
		$rows = static::getFromDB($query, [':id' => $id]);
		// foreach ($rows as $row) {
		// 	Test::logX($row);
		// }
		// Test::logX(implode(', ', array_keys($rows[0])));
		$instance = !empty($rows) ? static::groupAndBuild($rows)[$id] : null;
		return $instance;
	}
	
		// If the subclass doesn't have a 'name' property, return null. otherwise, get wild.
	public static function getIDByName(string $name): ?int {
		if (!array_key_exists('name', static::getColumns())) return null;
		$nameCol = static::getColumns()['name'];
		$idCol = static::getColumns()['id'];
		$query = static::buildSelect() . " WHERE " . $nameCol . " = :name";
		$rows = static::getFromDB($query, [':name' => $name]);
		return !empty($rows) ? $rows[0][static::getTableName() . "_$idCol"] : null;
	}

	
		// a helper for various get...()s. takes a $query and $params, and makes the actual call
	protected static function getFromDB(string $query, array $params = []): array {
		$db = Database::getDB();
		$statement = $db->prepare($query);
		// Test::logX($query);
		foreach ($params as $key => $value) {
			$statement->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
		}
		$statement->execute();
		$rows = $statement->fetchAll(PDO::FETCH_ASSOC);
		$statement->closeCursor();

		return $rows;
	}
	
		// builds the SELECT statement for get...FromDB() functions. uses helpers to build JOINs and column selections
			// this and buildJoins() got a little messy in needing to build a query with unique table aliases for JOINs, and
				// unique column aliases. this is so we can join the same table to different tables, and have the returned
				// associative array know what is what. those constructed aliases are deconstructed in buildFromRow()
	protected static function buildSelect(?string $context = null, ?WhereCondition $where = null): string {
		$table = static::getTableName();
		$columns = static::getColumns();
		$relations = static::getContextRelations($context);
	
		$selectColumns = [];
		self::buildSelects($selectColumns, $table, $columns);
			// Call recursive function to handle relations and their relations. returns array of JOIN statements
		$joins = self::buildJoins($table, $relations, $selectColumns);
			// get optional WHERE clause
		$whereClause = 
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
	protected static function buildJoins($currentTable, $currentRelations, &$selectColumns, $joins = [], 
							$path = [], ?string $context = null) {
			//get the oldAlias to use in the JOIN, and update the path with the new table
		$oldAlias = BasicTableModel::buildAlias([...$path, $currentTable]);
		$path[] = $currentTable;
		
		foreach ($currentRelations as $currentRelation) {
			$relatedClass = $currentRelation->rClass;
	
			if (!class_exists($relatedClass)) continue;
	
				// make short names to make the code readable
			$relatedTable = $relatedClass::getTableName();
			$relatedColumns = $relatedClass::getColumns();
			$leftKey = $currentRelation->leftKey;
			$rightKey = $currentRelation->rightKey;
			
			$tableAlias = BasicTableModel::buildAlias([...$path, $relatedTable]);
				// Add columns of the related table to the SELECT clause
			self::buildSelects($selectColumns, $tableAlias, $relatedColumns);
			
				// build joins with an intermediate table, or without
			if ($currentRelation->interTable) {
				$interTable = $currentRelation->interTable;
				$tableAlias = BasicTableModel::buildAlias([...$path, $interTable]);
				$joins[] = self::writeJoin($interTable, $tableAlias, $oldAlias, $leftKey, $leftKey);
				$priorAlias = $tableAlias;
				$tableAlias = BasicTableModel::buildAlias([...$path, $relatedTable]);
				$joins[] = self::writeJoin($relatedTable, $tableAlias, $priorAlias, $rightKey, $rightKey);
			} else {
				$tableAlias = BasicTableModel::buildAlias([...$path, $relatedTable]);
				$joins[] = self::writeJoin($relatedTable, $tableAlias, $oldAlias, $leftKey, $rightKey);
			}
				// Recursively handle relations of the related class (i.e., relations of relations)
			$joins = self::buildJoins($relatedTable, $relatedClass::getContextRelations($context), $selectColumns, $joins, $path);
		}
		return $joins;
	}
	
	// 	// Recursive helper function to handle deep relations (relations of relations) for query builder
	// protected static function buildJoins($currentTable, $currentRelations, &$selectColumns, $joins = [], 
	// 						$prefix = '', ?string $context = null) {
	// 	$oldAlias = $prefix . $currentTable;
	// 	$prefix .= $currentTable . '_';
		
	// 	foreach ($currentRelations as $currentRelation) {
	// 		$relatedClass = $currentRelation->rClass;
	
	// 		if (!class_exists($relatedClass)) continue;
	
	// 			// make short names to make the code readable
	// 		$relatedTable = $relatedClass::getTableName();
	// 		$relatedColumns = $relatedClass::getColumns();
	// 		$leftKey = $currentRelation->leftKey;
	// 		$rightKey = $currentRelation->rightKey;
			
	// 		$tableAlias = $prefix . $relatedTable;
	// 			// Add columns of the related table to the SELECT clause
	// 		self::buildSelects($selectColumns, $tableAlias, $relatedColumns);
			
	// 			// build joins with an intermediate table, or without
	// 		if ($currentRelation->interTable) {
	// 			$interTable = $currentRelation->interTable;
	// 			$tableAlias = $prefix . $interTable;
	// 			$joins[] = self::writeJoin($interTable, $tableAlias, $oldAlias, $leftKey, $leftKey);
	// 			$priorAlias = $tableAlias;
	// 			$tableAlias = $prefix . $relatedTable;
	// 			$joins[] = self::writeJoin($relatedTable, $tableAlias, $priorAlias, $rightKey, $rightKey);
	// 		} else {
	// 			$tableAlias = $prefix . $relatedTable;
	// 			$joins[] = self::writeJoin($relatedTable, $tableAlias, $oldAlias, $leftKey, $rightKey);
	// 		}
	// 			// Recursively handle relations of the related class (i.e., relations of relations)
	// 		$joins = self::buildJoins($relatedTable, $relatedClass::getContextRelations($context), $selectColumns, $joins, $prefix);
	// 	}
	// 	return $joins;
	// }

		// build a string with an underscore between each string element in $path
	public static function buildAlias(array $path): string {
		return implode('_', $path);
	}
	
	private static function writeJoin($relatedTable, $tableAlias, $oldAlias, $leftKey, $rightKey) {
		return "LEFT JOIN $relatedTable AS $tableAlias ON $oldAlias.$leftKey = $tableAlias.$rightKey";
	}
}
?>
