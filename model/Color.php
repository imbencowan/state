<?php
class Color extends BasicTableModel {
   protected static function getTableName(): string { return 'colors'; }

   protected static function getColumns(): array { return ['id' => 'colorID', 'name' => 'colorName']; }
}
?>
