<?php
class Style extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'styles'; }
   protected static function getPrimaryKey(): string { return 'styleID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'styleID', 
					'name' => 'styleName', 
					'shortName' => 'styleShortName', 
					'vShortName' => 'styleVeryShortName',
					'code' => 'styleCode', 
					'brand' => 'brandID']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
      return [new Relation('brand', 'Brand', 'brandID', 'brandID')];
   }
	
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?string $shortName,
      public readonly ?string $vShortName,
      public readonly ?string $code,
		public readonly ?Brand $brand,
		private array $sizes = []
   ) {}
	
	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'shortName' => $this->shortName,
			'vShortName' => $this->vShortName,
			'code' => $this->code,
			'brand' => $this->brand,
			'sizes' => array_values($this->sizes)
		];
	}
	
	
	public function getSizes() { return $this->sizes; }
   public function pushSizes($value) { $this->sizes[$value->charName] = $value; }
}