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
			// true if $property is an array intended hold multiple related objects, ie an Event has many EventSites
		public readonly bool $isMany = false,
			// names an intermediate hasTable for many to many relationships. // if null should be ignored
		public readonly ?string $interTable = null
   ) {}
}
?>