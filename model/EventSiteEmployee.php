<?php
class EventSiteEmployee extends BasicTableModel {
   protected static function getTableName(): string { return 'eventsitehasemployee'; }
	protected static function getPrimaryKey(): string { return 'eventSiteHasEmployeeID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteHasEmployeeID', 
               'esID' => 'eventSiteID',
               'employeeID' => 'employeeID',
					'payRate' => 'payRate',
               'hours' => 'hours'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array { 
		return [ new Relation('employee', 'Employee', 'employeeID', 'employeeID') ];
	}

	public function __construct(
		public readonly ?int $id,
      public readonly ?int $esID,
      public readonly ?int $employeeID,
		public readonly ?float $payRate,
			// float for fractional units
      public readonly ?float $hours,
      public readonly ?Employee $employee = null
   ) {}
}
?>
