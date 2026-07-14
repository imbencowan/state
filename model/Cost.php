<?php
class Cost extends BasicTableModel {
   protected static function getTableName(): string { return 'costs'; }
	protected static function getPrimaryKey(): string { return 'costID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'costID', 
					'name' => 'costName', 
					'rate' => 'defaultRate',
               'units' => 'units'];
	}
		// no relations
	protected static function getRelations(): array { return []; }

	public function __construct(
		public readonly ?int $id,
		public readonly ?string $name,
		public readonly ?float $rate,
      public readonly ?string $units
   ) {}
}
?>
