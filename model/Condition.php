<?php
class Condition {
   public readonly string $tableAlias;
   public readonly string $valueStr;

   public function __construct(
      public readonly array $path,
      public readonly string $column,
      public readonly mixed $value,
      public readonly string $operator = '='
   ) {
      $this->tableAlias = BasicTableModel::buildAlias([...$path]);
      $this->valueStr = $this->buildValueStr();
   }

   private function buildValueStr(): string {
      $op = strtoupper($this->operator);

         // NULL
      if ($this->value === null && in_array($op, ['=', '!='])) {
         return $op === '=' ? 'NULL' : 'NULL';
      }

         // IN / NOT IN
      if (in_array($op, ['IN', 'NOT IN'])) {
         if (!is_array($this->value) || empty($this->value)) {
               throw new InvalidArgumentException("$op requires a non-empty array.");
         }

         return '(' . implode(', ', array_map([$this, 'quote'], $this->value)) . ')';
      }

         // BETWEEN
      if ($op === 'BETWEEN') {
         if (!is_array($this->value) || count($this->value) !== 2) {
               throw new InvalidArgumentException("BETWEEN requires exactly two values.");
         }

         return $this->quote($this->value[0]) . ' AND ' . $this->quote($this->value[1]);
      }

      return $this->quote($this->value);
   }

   private function quote(mixed $value): string {
      if ($value === null) {
         return 'NULL';
      }

      if (is_numeric($value)) {
         return (string)$value;
      }

      return "'" . addslashes($value) . "'";
   }

   public function toSQL(): string {
      $op = strtoupper($this->operator);

      if ($this->value === null && $op === '=')  return "$this->tableAlias.$this->column IS NULL";

      if ($this->value === null && $op === '!=') return "$this->tableAlias.$this->column IS NOT NULL";

      return "$this->tableAlias.$this->column $this->operator $this->valueStr";
   }
}
?>