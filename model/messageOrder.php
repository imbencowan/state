<?php
class MessageOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'messageorders'; }
   protected static function getPrimaryKey(): string { return 'messageOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'messageOrderID', 
					'schoolOrderID' => 'schoolOrderID', 
					'genderID' => 'genderID',
					'orderedBy' => 'orderedBy',
					'orderText' => 'orderText',
					'fileName' => 'fileName',
					'orderDate' => 'orderDate'];
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
	protected static function getRelations(): array { return [new Relation('teamShirts', 'MOrderItem', 'messageOrderID', true)]; }
	
	
	public readonly DateTime $orderDate;
	
	public function __construct(
      public readonly int $id,
      public readonly int $schoolOrderID,
      public readonly int $genderID,
      public readonly string $orderedBy,
      public readonly string $orderText,
      public readonly ?string $fileName,
      string|DateTime $orderDate, 
		private array $teamShirts = []
   ) {
		$this->orderDate = is_string($orderDate) ? new DateTime($orderDate) : $orderDate;
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'schoolOrderID' => $this->schoolOrderID,
			'genderID' => $this->genderID,
			// 'genderName' => $this->genderName,
			'orderedBy' => $this->orderedBy,
			'orderText' => $this->orderText,
			'fileName' => $this->fileName,
			'orderDate' => $this->orderDate,
			'teamShirts' => $this->teamShirts
		];
	}
	

	public function getTeamShirts() { return $this->teamShirts; }
	// public function setTeamShirts(array $value) { $this->teamShirts[] = $value; }
		// key the array for ease of access
	public function pushTeamShirtss($value) { $this->teamShirts[$value->id] = $value; }
	
}
?>