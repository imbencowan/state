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
      return [new Relation('style', 'Style', 'styleID', 'styleID', false), 
				new Relation('size', 'Size', 'sizeID', 'sizeID', false), 
				new Relation('color', 'Color', 'colorID', 'colorID', false)];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?Style $style,
      public readonly ?Size $size,
      public readonly ?Color $color,
      public readonly ?int $price,
      public readonly ?int $stock = 0
   ) {}
	
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, showing all Items
	static function showItems($input) {
		$items = Item::getAllFromDB();
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
		
		return [ 'html' => $htmlContent, 'data' => $gItems ];
	}
	
	
	
	
		/////////////////////////////////////////////////////////////////////////////////////////
		// loading functions?
	public static function loadSizeCodesByStyle() {
		$items = static::getAllFromDB();
			// make an array including each style. attach each size that style has to a sizes array
		$styles = [];
		foreach ($items as $item) {
			$shortName = $item->style->shortName;
			if (!isset($styles[$shortName])) {
				$newObj = $item->style;
				$sizeObj = new stdClass();
				$sizeObj->name = $item->size->name;
				$sizeObj->charName = $item->size->charName;
				$sizeObj->id = $item->id;
				$newObj->pushSizes($sizeObj);
				
				$styles[$shortName] = $newObj;
			} else {
				$sizeObj = new stdClass();
				$sizeObj->name = $item->size->name;
				$sizeObj->charName = $item->size->charName;
				$sizeObj->id = $item->id;
				$styles[$shortName]->pushSizes($sizeObj);
			}
		}
		
		// foreach ($styles as $style) {
			// $style->sizes = array_values($style->sizes);
		// }
		
			// unkey the array
		$styles = array_values($styles);
			// sort it for ease later
			// set priorities
		$priority = [
			'Adult Hoods' => 1,
			'Adult Crews' => 2,
			'Youth Hoods' => 3
		];
			// the actual sort
		usort($styles, function($a, $b) use ($priority) {
			$priorityA = $priority[$a->shortName] ?? 999;
			$priorityB = $priority[$b->shortName] ?? 999;

			return $priorityA <=> $priorityB;
		});
		
		
		return ['data' => $styles];
	}
}
?>
