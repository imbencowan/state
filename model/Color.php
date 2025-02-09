<?php
class Color extends BasicTableModel {
   protected static function getTableName(): string { return 'colors'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { return ['id' => 'colorID', 'name' => 'colorName']; }
		// no relations
	protected static function getRelations(): array { return []; }
}
?>
