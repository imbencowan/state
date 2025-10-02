<?php
class Size extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'sizes'; }
   protected static function getPrimaryKey(): string { return 'sizeID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sizeID', 
					'name' => 'sizeName', 
					'charName' => 'charName',
					'displayChar' => 'displayChar',
					'sizingCategoryID' => 'sizingCategoryID']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	private int $quantity = 0;
	private ?float $price = null;
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?string $charName,
		public readonly ?string $displayChar,
		public readonly ?int $sizingCategoryID
   ) {}

	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'charName' => $this->charName,
			'displayChar' => $this->displayChar,
			'sizingCategoryID' => $this->sizingCategoryID,
			'quantity' => $this->quantity
		];
	}
	
	
	
	public function getQuantity() { return $this->quantity; }
   public function setQuantity($value) { $this->quantity = $value; }
}