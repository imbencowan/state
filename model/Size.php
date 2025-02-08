<?php
class Size extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'sizes'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sizeID', 
					'name' => 'sizeName', 
					'abbrName' => 'sizeChars']; 
	}
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $abbrName
   ) {}
}