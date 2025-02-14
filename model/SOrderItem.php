<?php 
class SOrderItem extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'sorderitems'; }
   protected static function getPrimaryKey(): string { return 'sOrderItemsID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sOrderItemsID', 
					'schoolOrderID' => 'schoolOrderID', 
					'item' => 'itemID', 
					'quantity' => 'sOrderItemsQuantity']; 
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
			// Item only, no circular reference
	protected static function getRelations(): array {
      return [new Relation('item', 'Item', 'itemID', false)];
   }
	
	public function __construct(
      public readonly int $id,
      public readonly int $schoolOrderID,
      public readonly ?Item $item,
      public readonly int $quantity
   ) {}
}
?>