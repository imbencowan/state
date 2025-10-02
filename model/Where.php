<?php
        // defines a where condition used in sql queries
        // getWhereString() returns a WHERE clause to append to a query
        // formalizes correctly accessing table aliases that are dynamically generated
    class Where {
        public readonly string $tableAlias;
        public readonly string $valueStr;

        public function __construct(
            public readonly string $column,
            public readonly mixed $value,
            public readonly string $operator = '=',
                // specifies the table JOIN path the query takes to the target table ['events', 'eventsites', 'sites']
                    // necessary for table alias
            public readonly array $path = [] 
        ) {
            $this->tableAlias = BasicTableModel::buildAlias([...$path]);

                // Quote/escape the value to make it work
            if (is_null($value) && in_array(strtoupper($operator), ['=', '!='])) {
                $this->valueStr = $operator === '=' ? 'IS NULL' : 'IS NOT NULL';
            } else {
                $this->valueStr = is_numeric($value) ? (string)$value : "'" . addslashes($value) . "'";
            }
        }

            // builds a WHERE string to append to a query
        public function getWhereString(): string {
            return " WHERE $this->tableAlias.$this->column $this->operator $this->valueStr";
        }
    }
?>