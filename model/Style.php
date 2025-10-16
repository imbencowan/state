<?php
class Style extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'styles'; }
   protected static function getPrimaryKey(): string { return 'styleID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'styleID', 
					'name' => 'styleName', 
					'inventoryName' => 'inventoryName',
					'shortName' => 'styleShortName', 
					'vShortName' => 'styleVeryShortName',
					'code' => 'styleCode', 
					'brandID' => 'brandID',
					'sizingCategoryID' => 'sizingCategoryID',
					'minSizeID' => 'minSizeID',
					'maxSizeID'=> 'maxSizeID']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, 
			// $interTable = null, $stopContexts = [])
	protected static function getRelations(): array {
      return [new Relation('brand', 'Brand', 'brandID', 'brandID', false, null, ['year', 'orders'])];
   }
	
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
		public readonly ?string $inventoryName,
      public readonly ?string $shortName,
      public readonly ?string $vShortName,
      public readonly ?string $code,
		public readonly ?int $brandID,
		public readonly ?int $sizingCategoryID,
		public readonly ?int $minSizeID,
		public readonly ?int $maxSizeID,
		public readonly ?Brand $brand = null,
		private array $sizes = []
   ) {}
	
	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'inventoryName' => $this->inventoryName,
			'shortName' => $this->shortName,
			'vShortName' => $this->vShortName,
			'code' => $this->code,
			'brand' => $this->brand,
			'sizingCategoryID' => $this->sizingCategoryID,
			'minSizeID' => $this->minSizeID,
			'maxSizeID' => $this->maxSizeID,
			'sizes' => array_values($this->sizes)
		];
	}
	
	
	public function getSizes() { return $this->sizes; }
   public function pushSizes($value) { $this->sizes[$value->charName] = $value; }
}