<?php
class Item extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'inventoryitems'; }
   protected static function getPrimaryKey(): string { return 'itemID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'itemID', 
					'style' => 'styleID', 
					'size' => 'sizeID', 
					'color' => 'colorID', 
					'price' => 'price', 
					'stock' => 'stock']; 
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [new Relation('style', 'Style', 'styleID', false), 
				new Relation('size', 'Size', 'sizeID', false), 
				new Relation('color', 'Color', 'colorID', false)];
   }
	
	public function __construct(
      public readonly int $id,
      public readonly ?Style $style,
      public readonly ?Size $size,
      public readonly ?Color $color,
      public readonly ?int $price,
      public readonly ?int $stock = 0
   ) {}
	
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Schools page, displaying all schools
	static function showItems($input) {
		$items = Item::getAllFromDB();$groupedItems = [];
		$gItems = [];
		foreach ($items as $item) {
			$styleKey = $item->style->shortName; 
			$gItems[$styleKey][] = $item;
		}
		ob_start();
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/items.php';
		$htmlContent = ob_get_clean();
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $groupedItems
		]);
	}
}
?>
