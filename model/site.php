<?php
class Site extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'sites'; }
   protected static function getPrimaryKey(): string { return 'siteID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'siteID', 
					'name' => 'siteName', 
					'city' => 'cityID']; 
	}
		// defined: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array { 
		return [ new Relation('city', 'City', 'cityID', 'cityID') ];
	}
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      // public readonly ?int $city
      public readonly ?City $city
   ) {}
}
?>
