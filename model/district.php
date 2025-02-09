<?php
class District extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'districts'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'districtID', 
					'name' => 'districtName', 
					'districtDescription' => 'districtDescription', 
					'primaryCity' => 'primaryCity']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $districtDescription,
      public readonly ?string $primaryCity
   ) {}
}