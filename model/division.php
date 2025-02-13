<?php
class Division extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'divisions'; }
   protected static function getPrimaryKey(): string { return 'divisionID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'divisionID', 'name' => 'divisionName', 'minPop' => 'minPop', 'pre24Name' => 'pre24Name']; 
	}
		// defined as: new Relation($property, $class, $matchKey, $isMany, $interTable) // no relations
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?int $minPop,
      public readonly ?string $pre24Name
   ) {}
}
?>
