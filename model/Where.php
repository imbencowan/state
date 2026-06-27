<?php
        // defines a where condition used in sql queries
        // getWhereString() returns a WHERE clause to append to a query
        // formalizes correctly accessing table aliases that are dynamically generated
    class Where {
        public readonly string $tableAlias;
        public readonly string $valueStr;

        public function __construct(
                // the column being referenced
            public readonly string $column,
                // the value to compare each row's column value to
            public readonly mixed $value,
                // how to compare
            public readonly string $operator = '=',
                // specifies the table JOIN path the query takes to the target table ['events', 'eventsites', 'sites']
                    // necessary for table alias
                        // if no tables are being JOINed, will simply be ['tablename']
            public readonly array $path = [] 
        ) {
            $this->tableAlias = BasicTableModel::buildAlias([...$path]);
            $this->valueStr = $this->buildValueStr();
        }

        private function buildValueStr(): string {
            $op = strtoupper($this->operator);

                // handle NULL comparisons
            if (is_null($this->value) && in_array($op, ['=', '!='])) {
                return $op === '=' ? 'IS NULL' : 'IS NOT NULL';
            }

                // handle IN / NOT IN
            if (in_array($op, ['IN', 'NOT IN'])) {
                    // check $value is an array
                if (!is_array($this->value) || empty($this->value)) {
                    throw new InvalidArgumentException("$op operator requires a non-empty array");
                }
                $vals = array_map(fn($v) => is_numeric($v) ? (string)$v : "'" . addslashes($v) . "'", $this->value);
                return '(' . implode(', ', $vals) . ')';
            }

                // handle BETWEEN
            if ($op === 'BETWEEN') {
                if (!is_array($this->value) || count($this->value) !== 2) {
                    throw new InvalidArgumentException("BETWEEN operator requires an array with exactly two values");
                }
                [$start, $end] = $this->value;
                $startStr = is_numeric($start) ? (string)$start : "'" . addslashes($start) . "'";
                $endStr = is_numeric($end) ? (string)$end : "'" . addslashes($end) . "'";
                return "$startStr AND $endStr";
            }

                // default single-value operators
            return is_numeric($this->value) ? (string)$this->value : "'" . addslashes($this->value) . "'";
        }


        public function getWhereString(): string {
            return " WHERE $this->tableAlias.$this->column $this->operator $this->valueStr";
        }
    }
?>