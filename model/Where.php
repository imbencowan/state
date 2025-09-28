<?php
    class Where {
        public readonly string $tableAlias;
        public readonly string $columnAlias;

        public function __construct(
            public readonly string $column,
            public readonly mixed $value = null,
            public readonly string $operator = '=',
                // specifies the table JOIN path the query takes to the target table ['events', 'eventsites', 'sites']
            public readonly array $path = [] 
        ) {
            $this->tableAlias = BasicTableModel::buildAlias([...$path]);
            $this->columnAlias = BasicTableModel::buildAlias([...$path, $column]);
        }

            // builds a WHERE string to append to a query
        public function getWhereString(): string {
            return " WHERE $this->tableAlias.$this->column $this->operator $this->value";
        }
    }
?>