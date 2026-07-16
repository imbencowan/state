<?php
    // defines a where condition used in sql queries
    // getWhereString() returns a WHERE clause to append to a query
    // formalizes correctly accessing table aliases that are dynamically generated
class Where {

        /** @param Condition[] $conditions */
    public readonly string $conjunction;

    public function __construct(
        public readonly array $conditions,
        string $conjunction = 'AND'
    ) {
        $conjunction = strtoupper($conjunction);

        if (!in_array($conjunction, ['AND', 'OR'])) {
            throw new InvalidArgumentException("Invalid conjunction: $conjunction");
        }

        $this->conjunction = $conjunction;
    }

        // return the actual sql string
    public function getWhereString(): string {
        $parts = [];

        foreach ($this->conditions as $condition) {
            $parts[] = $condition->toSQL();
        }

        return ' WHERE ' . implode(" {$this->conjunction} ", $parts);
    }
}
?>