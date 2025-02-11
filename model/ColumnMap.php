<?php
class ColumnMap {
   public function __construct(
      public readonly string $property,
      public readonly string $columnName,
      public readonly ?string $alias = null
   ) {}
}
?>