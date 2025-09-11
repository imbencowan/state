<?php
    class WhereCondition {
        public readonly string $tableAlias;
        public readonly string $columnAlias;

        public function __construct(
            public readonly string $column,
            public readonly string $operator = '=',
            public readonly mixed $value = null,
                // specifies the table JOIN path the query takes to the target table ['events', 'eventsites', 'sites']
            public readonly array $path = [] 
        ) {
            $this->tableAlias = BasicTableModel::buildAlias([...$path]);
            $this->columnAlias = BasicTableModel::buildAlias([...$path, $column]);
        }

        
    }
?>