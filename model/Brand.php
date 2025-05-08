<?php
	class Brand extends BasicTableModel {
		// define table and primary key
		protected static function getTableName(): string { return 'brands'; }
		protected static function getPrimaryKey(): string { return 'brandID'; }

		// map object properties to database columns
		protected static function getColumns(): array {
			return [
				'id' => 'brandID',
				'name' => 'brandName',
				'shortName' => 'brandShortName'
			];
		}

		// no relations defined
		protected static function getRelations(): array { return []; }

		public function __construct(
			public readonly ?int $id,
			public readonly ?string $name,
			public readonly ?string $shortName
		) {}
	}
?>