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
					'code' => 'styleCode', 
					'brandID' => 'brandID']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $shortName,
      public readonly ?string $code,
		public readonly int $brandID,
		private array $sizes = []
   ) {}
	
	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'shortName' => $this->shortName,
			'code' => $this->code,
			'brandID' => $this->brandID,
			'sizes' => $this->sizes
		];
	}
	
	
	public function getSizes() { return $this->sizes; }
   public function pushSizes($value) { $this->sizes[$value->charName] = $value; }
}