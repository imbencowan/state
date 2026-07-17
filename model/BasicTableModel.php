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

		// creates an assoc array from an instance to work with db functions that expect that format
	public function toRow(): array {
		$row = [];

		foreach (static::getColumns() as $prop => $col) {
			if ($prop === 'id') continue;
			$row[$col] = $this->$prop;
		}

		return $row;
	}
	
		////////////////////////////////////////// MAKING NESTED OBJECTS FROM DB SELECTS //////////////////
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

		// a basic writer for insert, upsert, etc. // append sql as necessary // with no $tailSQL, this is just an INSERT
	public static function writeMany(array $rows, string $tailSQL, ?PDO $db = null): ?int {
			// if no $db passed in (for transactions), create a new connection
		$db = $db ?? Database::getDB();
		
		if (empty($rows)) return null;

			// remove the primary key from rows if it exists. we don't insert that
		$primaryKey = static::getPrimaryKey();

		foreach ($rows as &$row) {
			unset($row[$primaryKey]);
		}
		unset($row);

			// get columns
		$columns = static::getColumns();
			// DO NOT allow id in inserts. remove it from column validator
		unset($columns['id']); 

		$pk = static::getPrimaryKey();

		$keys = array_keys(reset($rows));

			// if any $rows keys do not match column names, throw
		$invalidKeys = array_diff($keys, $columns);
		if (!empty($invalidKeys)) {
			throw new InvalidArgumentException("Invalid column(s): " . implode(', ', $invalidKeys));
		}

			// build strings for the $query
		$colNames = implode(', ', $keys);
		$placeholders = implode(', ', array_map(fn($c) => ":$c", $keys));

			// make the query
		$stmt = $db->prepare("INSERT INTO " . static::getTableName() . " ($colNames) VALUES ($placeholders)" . $tailSQL);

		foreach ($rows as $row) {
			$stmt->execute($row);
		}

			// return the last generated id
		return $db->lastInsertId();
	}
	
		// basic add. insert given properties. $data = {column => value}
	public static function insert(object|array $data, ?PDO $db = null): ?int {
		if (!$db) $db = Database::getDB();
			// ensure an array
		if (is_object($data)) $data = (array) $data;
		if (empty($data)) return null;

			//pass $data to insertMany wrapped in an array
		static::insertMany([$data], $db);

		return $db->lastInsertId();
	}

		// insert multiple entries via one prepared statement
	public static function insertMany(array $rows, ?PDO $db = null): ?int {
		return static::writeMany($rows, '', $db);
	}


		// a single upsert wraps the row in an array, and passes it on to upsertMany
	public static function upsert(array $row, array $updateCols, ?PDO $db = null): void {
		static::upsertMany([$row], $updateCols, $db);
	}

	public static function upsertMany(array $rows, array $updateCols, ?PDO $db = null) {
		$updates = implode(', ', array_map(
			fn($col) => "$col = VALUES($col)",
			$updateCols
		));

		static::writeMany($rows, "ON DUPLICATE KEY UPDATE $updates", $db);
	}

		// inserts the instance to the db
			// is this replaceable with insert()?
	public function addInstanceToDB(): ?int {
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

		// insert in an intermediate table. // utilizes a subclass's Relations
			// matched by property parameter to Relation property
			// $values expects a keyed array [leftKey: value, rightKey: value]
				// where leftKey and rightKey should match the values of those properties in the Relation
	public static function insertInterTable(string $prop, array $values): int {
        // find the relation
		$relation = null;
		foreach (static::getRelations() as $rel) {
			if ($rel->property === $prop) {
					$relation = $rel;
					break;
			}
		}

		if (!$relation) throw new Exception("No relation found for property '$prop'");
		if (!$relation->interTable) throw new Exception("Relation '$prop' has no intermediate table defined");


		$db = Database::getDB();
		$stmt = $db->prepare(
			"INSERT INTO {$relation->interTable} ({$relation->leftKey}, {$relation->rightKey})
        	VALUES (:left, :right)"
		);

		foreach ($values as $row) {
			$stmt->execute([
				':left'  => $row[$relation->leftKey],
				':right' => $row[$relation->rightKey]
			]);
		}

		return $db->lastInsertId();
   }

		// accepts an int $id, or an array of $ids. returns true if any rows were deleted, or else false
	public static function deleteByIDs(int|array $ids): bool {
		$db = Database::getDB();
		$idCol = static::getColumns()['id'];

		if (is_array($ids)) {
			// Prepare placeholders for each ID
			$placeholders = implode(',', array_fill(0, count($ids), '?'));
			$query = "DELETE FROM " . static::getTableName() . " WHERE $idCol IN ($placeholders)";
			$statement = $db->prepare($query);

				// Bind each value by position
			foreach (array_values($ids) as $index => $val) {
					$statement->bindValue($index + 1, $val, PDO::PARAM_INT);
			}
		} else {
			$query = "DELETE FROM " . static::getTableName() . " WHERE $idCol = :id";
			$statement = $db->prepare($query);
			$statement->bindValue(':id', $ids, PDO::PARAM_INT);
		}

		$statement->execute();
		$affectedRows = $statement->rowCount();
		$statement->closeCursor();

		return $affectedRows > 0; // return true if rows were affected
	}

		// delete records that match Conditions defined in a Where object
	public static function deleteWhere(Where $where): int {
		$query = "DELETE FROM " . static::getTableName() . $where->getWhereString();

		$db = Database::getDB();
		$stmt = $db->prepare($query);
		$stmt->execute();

		return $stmt->rowCount();
	}

		// updates given columns with given values, $updateValues is like ['column': value]
			// can update multiple rows, but all will receive the same values
	public static function updateByID(int|array $ids, array $updateValues): bool {
			// check if any thing to update
		if (empty($updateValues)) return false;

			// get some stuff
		$db = Database::getDB();
		$table = static::getTableName();
		$columns = static::getColumns();
		$idCol = $columns['id'];

			// Validate column names
		$invalidKeys = array_diff(array_keys($updateValues), $columns);
			// throw if bad name
		if (!empty($invalidKeys)) {
			throw new InvalidArgumentException("Invalid column(s): " . implode(', ', array_keys($invalidKeys)));
		}

			// prevent updating ID
		if (isset($updateValues['id'])) {
			throw new InvalidArgumentException("Cannot update primary key 'id'");
		}

			// Build SET clause with named placeholders
		$setClauses = [];
		foreach ($updateValues as $col => $val) {
			$setClauses[] = "$col = :$col";
		}
		$setString = implode(', ', $setClauses);

			// Normalize $ids into an array
		$ids = is_array($ids) ? $ids : [$ids];

			// Build named placeholders for ids
		$idPlaceholders = [];
		foreach ($ids as $i => $id) {
			$idPlaceholders[] = ":id$i";
		}
		$placeholdersString = implode(',', $idPlaceholders);

		$query = "UPDATE $table SET $setString WHERE $idCol IN ($placeholdersString)";
		$stmt = $db->prepare($query);

			// Bind update values
		foreach ($updateValues as $col => $val) {
			$stmt->bindValue(":$col", $val);
		}

			// Bind IDs
		foreach ($ids as $i => $id) {
			$stmt->bindValue(":id$i", $id, PDO::PARAM_INT);
		}

		$stmt->execute();
		$affectedRows = $stmt->rowCount();
		$stmt->closeCursor();

		return $affectedRows > 0;
	}

	public static function updateWhere(Where $where, array $updateValues): bool {
		if (empty($updateValues)) return false;

		$db = Database::getDB();
		$table = static::getTableName();
		$columns = static::getColumns();

		$invalidKeys = array_diff(array_keys($updateValues), $columns);

		if (!empty($invalidKeys)) {
			throw new InvalidArgumentException(
					"Invalid column(s): " . implode(', ', $invalidKeys)
			);
		}

		if (isset($updateValues['id'])) {
			throw new InvalidArgumentException("Cannot update primary key 'id'");
		}

		$setClauses = [];

		foreach ($updateValues as $col => $val) {
			$setClauses[] = "$col = :$col";
		}

		$setString = implode(', ', $setClauses);

		$query = "UPDATE $table SET $setString" . $where->getWhereString();

		$stmt = $db->prepare($query);

		foreach ($updateValues as $col => $val) {
			$stmt->bindValue(":$col", $val);
		}

		$stmt->execute();

		return $stmt->rowCount() > 0;
	}

		// $update should be an array of objects with an id property, and other props named for columns to update
	public static function updateRowsByIDs(array $update): bool {
		if (empty($update)) return false;

		$db = Database::getDB();
		$table = static::getTableName();
		$columns = static::getColumns();
		$idCol = $columns['id'];

		$stmt = null;
		$affected = 0;

		$db->beginTransaction();

		try {
			foreach ($update as $row) {

					// normalize objects → arrays
				if (is_object($row)) $row = get_object_vars($row);

					// must have id
				if (!isset($row[$idCol])) throw new InvalidArgumentException("Missing ID column: {$idCol}");

				$id = $row[$idCol];
					// so we don't try to UPDATE id
				unset($row[$idCol]);

					// filter invalid keys
				$invalid = array_diff(array_keys($row), $columns);
				if (!empty($invalid)) {
					throw new InvalidArgumentException("Invalid column(s): " . implode(', ', $invalid));
				}

					// build SET clause
				$setParts = [];
				$params = [':id' => $id];

				foreach ($row as $col => $val) {
					$setParts[] = "$col = :$col";
					$params[":$col"] = $val;
				}

					// don't update no thing
				if (empty($setParts)) continue;

				$sql = "UPDATE $table SET " . implode(', ', $setParts) . " WHERE $idCol = :id";

				$stmt = $db->prepare($sql);
				$stmt->execute($params);

				$affected += $stmt->rowCount();
			}

			$db->commit();
			return $affected > 0;

		} catch (Throwable $e) {
			$db->rollBack();
			throw $e;
		}
	}

		// the use case for this function is like 'for this $parent, the only records should be these $rows.
			// it will delete unmatched existing records, update existing matches, and insert new records
				// $parent is an array of column=>value pairs so we can say 'for these columns with these values, only 
				// these records should exists. $parent being an array allows supporting multi column definitions, 
				// like 'WHERE evensiteID = x AND siteID = y', but most $parents will likely be one column.
					// $keyColumns is a list of the columns in $rows that we care about updating, $path is necessary
					// for defining Conditions
	public static function syncByParent(array $parent, array $rows, array $keyColumns, array $path, 
													?string $context = null) {
			// a container
		$prntCndtns = [];

			// make a Condition for each $parent element. // will generate like `column = value`
		foreach ($parent as $column => $value) {
			$prntCndtns[] = new Condition($path, $column, $value);
		}

			// will be used to append a WHERE string in getAllFromDB()
		$where = new Where($prntCndtns);


		$query = "SELECT * FROM " . static::getTableName() . " " . $where->getWhereString();
		$existing = self::getFromDB($query);

		// $existing = self::getRowsFromDB(where: $where, context: $context);

			// index existing rows.
		$existingMap = [];
		foreach ($existing as $row) {
			$existingMap[self::buildKey($row, $keyColumns)] = $row;
		}

			// index incoming rows.
		$incomingMap = [];
		foreach ($rows as $row) {
			$incomingMap[self::buildKey($row, $keyColumns)] = $row;
		}

		Test::logX($existingMap, $keyColumns);

			// delete rows no longer present.
		foreach ($existingMap as $key => $existingRow) {
			if (!isset($incomingMap[$key])) {
				$conditions = [...$prntCndtns];

				foreach ($keyColumns as $column) {
						$conditions[] = new Condition($path, $column, $existingRow[$column]);
				}

				self::deleteWhere(new Where($conditions));
			}
		}

			// insert new rows or update existing ones.
		foreach ($incomingMap as $key => $row) {

			if (!isset($existingMap[$key])) {
					self::insert(array_merge($parent, $row));
			}
			else {
				$conditions = [...$prntCndtns];

				foreach ($keyColumns as $column) {
					$conditions[] = new Condition($path, $column, $row[$column]);
				}

				self::updateWhere(new Where($conditions),	$row);
			}
		}
	}

		// a helper
	private static function buildKey(array $row, array $keyColumns): string {
		return implode('|', array_map(
			fn($col) => $row[$col] ?? '',
			$keyColumns
		));
	}


	public static function updateInterTable(array $primaryKey, array $secondaryKey): void {
		$db = Database::getDB();

			// check keys
		if (count($primaryKey) !== 1 || count($secondaryKey) !== 1) {
			throw new InvalidArgumentException("Primary and secondary keys must be single-column arrays like ['col' => value].");
		}

		$primaryCol = key($primaryKey);
		$primaryVal = current($primaryKey);
		$secondaryCol = key($secondaryKey);
		$secondaryVals = (array) current($secondaryKey); // ensure array

			// Find the relation via getRelations()
		$relations = static::getRelations();
		$relation = null;
		foreach ($relations as $rel) {
			if (($rel->leftKey === $primaryCol && $rel->rightKey === $secondaryCol)) {
				$relation = $rel;
				break;
			}
		}

		if (!$relation) {
			Test::logX($primaryCol, $secondaryCol, $relations);
			throw new InvalidArgumentException("No relation found for columns $primaryCol and $secondaryCol");
		}

		$interTable = $relation->interTable;
		$leftCol = $relation->leftKey;
		$rightCol = $relation->rightKey;

		try {
			$db->beginTransaction();

				// 1. Delete rows that are no longer in $secondaryVals
			$placeholders = implode(',', array_fill(0, count($secondaryVals), '?'));
			$deleteQuery = "DELETE FROM $interTable WHERE $leftCol = ?"
								. (count($secondaryVals) ? " AND $rightCol NOT IN ($placeholders)" : "");
			$stmt = $db->prepare($deleteQuery);
			$stmt->execute(array_merge([$primaryVal], $secondaryVals));

				// 2. Find which secondary IDs already exist
			$selectQuery = "SELECT $rightCol FROM $interTable WHERE $leftCol = ?";
			$stmt = $db->prepare($selectQuery);
			$stmt->execute([$primaryVal]);
			$existing = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

				// 3. Insert missing secondary IDs
			$toInsert = array_diff($secondaryVals, $existing);
			if ($toInsert) {
					$insertQuery = "INSERT INTO $interTable ($leftCol, $rightCol) VALUES (?, ?)";
					$stmt = $db->prepare($insertQuery);
					foreach ($toInsert as $val) {
						$stmt->execute([$primaryVal, $val]);
					}
			}

			$db->commit();
		} catch (PDOException $e) {
			$db->rollBack();
			throw $e;
		}
	}





		// SELECTs ////////////////////////////////////////////////////////////////////////////////////////////////////
		// getAll returns fully hydrated objects
			// getAll and getByID both implement a pair of helper functions 
				// (buildSelect() and buildJoins()) that do the heavy lifting
			// pass $where if needed, a Where instance to build 
	public static function getAllFromDB(?string $context = null, ?array $columns = null, ?Where $where = null): array {
		$rows = static::getRowsFromDB($context, $columns, $where);
		return static::groupAndBuild($rows, $context);
	}

		// returns db rows.
	public static function getRowsFromDB(?string $context = null, ?array $columns = null, ?Where $where = null): array {
		$query = static::buildSelect($context, $columns);
			// if where, append it to the query
		if ($where) $query .= $where->getWhereString();
		return static::getFromDB($query);
	}

		// see above
	public static function getByID(int $id, ?string $context = null): ?static {
		$table = static::getTableName();
		$idCol = static::getColumns()['id'];
		$query = static::buildSelect($context) . " WHERE $table.$idCol  = :id";
		$rows = static::getFromDB($query, [':id' => $id]);
		$instance = !empty($rows) ? static::groupAndBuild($rows, $context)[$id] : null;
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

	public static function getColForID(string $column, int $id) {
		$tableCols = static::getColumns();
			// check if $column is valid
		if (!array_key_exists($column, $tableCols)) {
			throw new InvalidArgumentException("Invalid column requested");
		}

		$idCol = $tableCols['id'];
		$table = static::getTableName();
		$query = "SELECT {$column} FROM {$table} WHERE {$idCol} = :id";
		$value = static::getFromDB($query, [':id' => $id]);
		
		return $value ?: null;
	}

	// executes 'arbitrary' sql. called by multiple functions above and in other classes
protected static function getFromDB(string $query, array $params = []): array {
	$db = Database::getDB();
	$statement = $db->prepare($query);

		// bind parameters
	foreach ($params as $key => $value) {
		$statement->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
	}

	// $a = 'Memory before execute: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
	$statement->execute();

	// $b = 'Memory after execute, before fetch: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";

	$rows = $statement->fetchAll();

	// $c = 'Memory after fetchAll: ' . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
	// $d = 'Peak memory so far: ' . round(memory_get_peak_usage() / 1024 / 1024, 2) . " MB\n";
	// Test::logX($a, $b, $c, $d);

	$statement->closeCursor();

	return $rows;
}

	
		// builds the SELECT statement for get...FromDB() functions. uses helpers to build JOINs and column selections
			// this and buildJoins() got a little messy in needing to build a query with unique table aliases for JOINs, and
				// unique column aliases. this is so we can join the same table to different tables, and have the returned
				// associative array know what is what. those constructed aliases are deconstructed in buildFromRow()
	protected static function buildSelect(?string $context = null, ?array $columns = null): string {
			// allow specific columns to be provided, or get all by default
		if (!$columns) $columns = static::getColumns();
		$table = static::getTableName();
		$relations = static::getContextRelations($context);
	
		$selectColumns = [];
		self::buildSelects($selectColumns, $table, $columns);
			// Call recursive function to handle relations and their relations. returns array of JOIN statements
		$joins = self::buildJoins($table, $relations, $selectColumns, [], [], $context);
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
			$joins = self::buildJoins($relatedTable, $relatedClass::getContextRelations($context), 
												$selectColumns, $joins, $path, $context);
		}
		return $joins;
	}
	

		// build a string with an underscore between each string element in $path
	public static function buildAlias(array $path): string {
		return implode('_', $path);
	}
	
	private static function writeJoin($relatedTable, $tableAlias, $oldAlias, $leftKey, $rightKey) {
		return "LEFT JOIN $relatedTable AS $tableAlias ON $oldAlias.$leftKey = $tableAlias.$rightKey";
	}



		// HELPERS /////////////////////////////////////////
// this is currently not being used
// WELL, now it is
			// returns ids of an array of objects held in a $property. applicable to any class with such properties
	public function getChildIDs(string $property): array {
			// check that this function will work. 
		if (!property_exists($this, $property)) {
			throw new InvalidArgumentException("Property '$property' does not exist on " . static::class);
		}

		if (!is_array($this->$property)) {
			throw new UnexpectedValueException("Property '$property' is not an array");
		}

		// foreach ($children as $child) {
		// 	if (!isset($child->id)) {
		// 			throw new UnexpectedValueException("One of the children in '$property' does not have an 'id' property");
		// 	}
		// }

		return array_map(fn($child) => $child->id, $this->$property);
	}


}
?>
