<?php 
class MOrderItem extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'morderitems'; }
   protected static function getPrimaryKey(): string { return 'mOrderItemsID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'mOrderItemsID', 
					'messageOrderID' => 'messageOrderID', 
						// to avoid extraneous data, we could change the 'item' property to 'size', and just capture 
							// the item's size in the constructor
								// i think
							// or just make 'item' not be a property, but a parameter in the constructor that is 
								// translated in to the size property
					'item' => 'itemID', 
					'quantity' => 'mOrderItemsQuantity']; 
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
		// we are only going to define a relation for Item, not MessageOrder, to prevent circular references
		// MessageOrder will have MOrderItems, so MOrderItems can not also hold a MessageOrder
	protected static function getRelations(): array {
      return [new Relation('item', 'Item', 'itemID', false)];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $messageOrderID,
      public readonly ?Item $item,
      public readonly int $quantity
   ) {}
	
	
	
	public static function addNewMOrderItem($messageOrderID, $itemID, $quantity) {
	  $db = Database::getDB();
	  $query = "INSERT INTO morderitems (messageOrderID, itemID, mOrderItemsQuantity) 
					VALUES (:messageOrderID, :itemID, :quantity)";

	  $stmt = $db->prepare($query);
	  $stmt->bindValue(':messageOrderID', $messageOrderID);
	  $stmt->bindValue(':itemID', $itemID);
	  $stmt->bindValue(':quantity', $quantity);

	  $stmt->execute();
	  return $db->lastInsertId();
	}
}
?>