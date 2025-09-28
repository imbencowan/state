<?php
class City extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'cities'; }
   protected static function getPrimaryKey(): string { return 'cityID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'cityID', 
					'name' => 'cityName', 
					'distance' => 'distance']; 
	}
      // no relations
		// defined: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?int $distance
   ) {}
}
?>
