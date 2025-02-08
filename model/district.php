<?php
class District extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'districts'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'districtID', 
					'name' => 'districtName', 
					'districtDescription' => 'districtDescription', 
					'primaryCity' => 'primaryCity']; 
	}
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $districtDescription,
      public readonly ?string $primaryCity
   ) {}
}