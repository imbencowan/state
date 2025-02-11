<?php
class Vehicle extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'vehicles'; }
   protected static function getPrimaryKey(): string { return 'vehicleID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'vehicleID', 
					'name' => 'vehicleName', 
					'isUnique' => 'vehicleIsUnique']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $isUnique
   ) {}
}
?>
