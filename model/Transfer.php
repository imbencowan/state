<?php
class Transfer extends BasicTableModel {
		// these give the table and column names to be used else where in the class
   protected static function getTableName(): string { return 'transfers'; }
   protected static function getPrimaryKey(): string { return 'transferID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'transferID', 
					'transferName' => 'transferName', 
					'inventoryName' => 'inventoryName', 
					'price' => 'price',
               'cost' => 'mcuCost',
               'listOrder' => 'listOrder'
            ]; 
	}
		// defined: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array { return []; }
	
   public readonly string $inventoryName;

	public function __construct(
      public readonly ?int $id,
      public readonly ?string $transferName,
      ?string $inventoryName,
      public readonly ?float $price,
      public readonly ?float $cost,
      public readonly ?int $listOrder
   ) {
         // If $inventoryName is null, fallback to $transferName
      $this->inventoryName = $inventoryName ?? $transferName;
   }
}
?>
