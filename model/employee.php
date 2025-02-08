<?php
class Employee extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'employees'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'employeeID', 
					'name' => 'employeeName', 
					'shortName' => 'employeeShortName', 
					'phone' => 'employeePhone', 
					'email' => 'employeeEmail']; 
	}
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $shortName,
      public readonly ?string $phone,
      public readonly ?string $email
   ) {}
}
?>
