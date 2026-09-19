<?php
class SiteAlias extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'sitealiases'; }
   protected static function getPrimaryKey(): string { return 'siteAliasID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'siteAliasID', 
					'siteID' => 'siteID', 
					'alias' => 'alias']; 
	}
		// defined: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	// protected static function getRelations(): array { 
	// 	return [ new Relation('city', 'City', 'cityID', 'cityID') ];
	// }
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?int $siteID,
      public readonly ?string $alias,
   ) {}
}
?>
