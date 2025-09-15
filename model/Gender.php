<?php
	class Gender extends BasicTableModel {
		    // define table and primary key
		protected static function getTableName(): string { return 'genders'; }
		protected static function getPrimaryKey(): string { return 'genderID'; }

		    // map object properties to database columns
		protected static function getColumns(): array {
			return [
				'id' => 'genderID',
				'name' => 'genderName'
			];
		}

		    // no relations defined
		protected static function getRelations(): array { return []; }

		public readonly ?string $name; 

		public function __construct(
			public readonly ?int $id,
			?string $name
		) {
            $this->name = $name !== null ? ucfirst($name) : null;
        }
	}
?>