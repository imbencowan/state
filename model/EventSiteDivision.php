<?php
class EventSiteDivision extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'eventsitehasdivision'; }
   protected static function getPrimaryKey(): string { return 'eventSiteHasDivisionID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteHasDivisionID', 'eventSiteID' => 'eventSiteID', 'division' => 'divisionID']; 
	}
		// defined as: new Relation($property, $class, $matchKey, $isMany, $interTable)
	protected static function getRelations(): array { 
		return [new Relation('division', 'Division', 'divisionID'), 
					new Relation('schoolOrders', 'SchoolOrder', 'eventSiteHasDivisionID', true)
		];}
	
	public function __construct(
      public readonly int $id,
      public readonly int $eventSiteID,
      public readonly Division $division,
			// default empty array
		private array $schoolOrders = []
   ) {}
		
		// over ride base class method to include private properties
   public function jsonSerialize(): array {
      return [
         'id' => $this->id,
         'eventSiteID' => $this->eventSiteID,
         'division' => $this->division,
         'schoolOrders' => $this->schoolOrders
      ];
   }

	public function getSchoolOrders() { return $this->schoolOrders; }
		// public function setSchoolOrders(array $value) { $this->schoolOrders[] = $value; }
	public function pushSchoolOrders($value, $key = null) { 
		if ($key === null) $this->schoolOrders[] = $value; 
		else $this->schoolOrders[$key] = $value;
	}
}
?>