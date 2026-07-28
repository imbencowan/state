<?php 
	// allows formalization of relations between objects representing db tables
class Relation {
	public function __construct(
			// the object property that holds the related object
      public readonly string $property,
			// the class that defines the related object
      public readonly string $rClass,
			// the column name in this table to match on
      public readonly string $leftKey,
			// the column in the related table to match on
		public readonly string $rightKey,
			// true if $property is an array intended to hold multiple related objects, ie an Event has many EventSites
		public readonly bool $isMany = false,
			// names an intermediate hasTable for many to many relationships. // if null should be ignored
		public readonly ?string $interTable = null,

			// an array of values that can be passed in callers to signal the relation should be ignored
				// basically a depth limiter for nested relations, so we don't JOIN tables we don't need.
		public readonly array $stopContexts = [],

			// a flag to load the Relation after the current load is finished.
				// JOINing every Relation can blow past memory limits when there is too much data. 
				// this sets a stop on JOINs, but unlike $stopContexts, we still want the Related data.
				// we just can't load it all at once. base class methods will manage loading this separately
		public readonly bool $loadSeparate = false
   ) {}
}
?>