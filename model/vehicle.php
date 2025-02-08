<?php
class Vehicle extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'vehicles'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'vehicleID', 
					'name' => 'vehicleName', 
					'isUnique' => 'vehicleIsUnique']; 
	}
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $isUnique
   ) {}
}
?>
