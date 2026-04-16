<?php
class Season extends BasicTableModel {
   protected static function getTableName(): string { return 'seasons'; }
	protected static function getPrimaryKey(): string { return 'seasonID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array {
		return ['id' => 'seasonID',
					'name' => 'seasonName',
					'startMonth' => 'startMonth',
					'startDay' => 'startDay',
					'endMonth' => 'endMonth',
					'endDay' => 'endDay',
					'color' => 'color'];
	}
		// no relations
	protected static function getRelations(): array { return []; }

	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?int $startMonth,
      public readonly ?int $startDay,
      public readonly ?int $endMonth,
      public readonly ?int $endDay,
      public readonly ?string $color
   ) {}
}
?>
