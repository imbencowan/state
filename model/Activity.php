<?php
class Activity extends BasicTableModel {
   protected static function getTableName(): string { return 'activities'; }
	protected static function getPrimaryKey(): string { return 'activityID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'activityID', 
					'name' => 'activityName', 
					'isIndividualed' => 'isIndividualed',
					'minDiv' => 'minDiv'];
	}
		// no relations
	protected static function getRelations(): array { return []; }

	public function __construct(
		public readonly ?int $id,
		public readonly ?string $name,
		public readonly ?string $isIndividualed,
		public readonly ?int $minDiv
   ) {}
}
?>
