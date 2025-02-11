<?php
class Division extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'divisions'; }
   protected static function getPrimaryKey(): string { return 'divisionID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'divisionID', 'name' => 'divisionName', 'minPop' => 'minPop', 'pre24Name' => 'pre24Name']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?int $minPop,
      public readonly ?string $pre24Name,
			// default empty array
		private array $schoolOrders = []
   ) {}
		
		// over ride base class method to include private properties
   public function jsonSerialize(): array {
      return [
         'id' => $this->id,
         'name' => $this->name,
         'minPop' => $this->minPop,
         'pre24Name' => $this->pre24Name,
         'schools' => $this->schoolOrders, // Include private $schools here
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
