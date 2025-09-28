<?php
class District extends BasicTableModel {
		// these give the table, primary key, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'districts'; }
   protected static function getPrimaryKey(): string { return 'districtID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'districtID', 
					'name' => 'districtName', 
					'districtDescription' => 'districtDescription', 
					'primaryCity' => 'primaryCityID']; 
	}
			// defined: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array { 
		return [ new Relation('primaryCity', 'City', 'primaryCityID', 'cityID') ];
	}
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?string $districtDescription,
      // public readonly ?int $primaryCity
      public readonly ?City $primaryCity
   ) {}
}