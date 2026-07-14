<?php
class EventSiteCost extends BasicTableModel {
   protected static function getTableName(): string { return 'eventsitecosts'; }
	protected static function getPrimaryKey(): string { return 'eventSiteCostID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'eventSiteCostID', 
               'esID' => 'eventSiteID',
               'costID' => 'costID',
					'quantity' => 'quantity', 
					'rate' => 'rate',
               'note' => 'note'];
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array { 
		return [ new Relation('cost', 'Cost', 'costID', 'costID') ];
	}

	public function __construct(
		public readonly ?int $id,
      public readonly ?int $esID,
      public readonly ?int $costID,
		public readonly ?float $rate,
			// float for fractional units
      public readonly ?float $quantity,
		public readonly ?string $note,
      public readonly ?Cost $cost = null
   ) {}
}
?>
