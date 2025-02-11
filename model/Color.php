<?php
class Color extends BasicTableModel {
   protected static function getTableName(): string { return 'colors'; }
	protected static function getPrimaryKey(): string { return 'colorID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { return ['id' => 'colorID', 'name' => 'colorName']; }
		// no relations
	protected static function getRelations(): array { return []; }
}
?>
