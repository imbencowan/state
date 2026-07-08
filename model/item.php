<?php
class Item extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'apparel'; }
   protected static function getPrimaryKey(): string { return 'itemID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'itemID', 
					'styleID' => 'styleID', 
					'sizeID' => 'sizeID', 
					'colorID' => 'colorID', 
					'price' => 'price', 
					'cost' => 'mcuCost',
					'stock' => 'stock',
					'caseQ' => 'caseQ',
					'inventoryMin' => 'inventoryMinimum',
					'inventoryStep' => 'inventoryStep']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array {
      return [new Relation('style', 'Style', 'styleID', 'styleID', false, null, ['inventory']), 
				new Relation('size', 'Size', 'sizeID', 'sizeID'), 
				new Relation('color', 'Color', 'colorID', 'colorID', false, null, ['inventory'])];
   }
	
	public function __construct(
      public readonly ?int $id,
		public readonly ?int $styleID,
		public readonly ?int $sizeID,
		public readonly ?int $colorID,
      public readonly ?float $price,
		public readonly ?float $cost, 
      public readonly ?int $caseQ = 0,
      public readonly ?int $inventoryMin = 0,
      public readonly ?int $inventoryStep = 0,
      public readonly ?Color $color = null,
      public readonly ?Style $style = null,
      public readonly ?Size $size = null,
      public readonly ?int $stock = 0
   ) {}

}
?>
