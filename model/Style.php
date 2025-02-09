<?php
class Style extends BasicTableModel {
		// these give the table, column names, and relations to be used in the class
   protected static function getTableName(): string { return 'styles'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'styleID', 
					'name' => 'styleName', 
					'shortName' => 'styleShortName', 
					'code' => 'styleCode', 
					'brandID' => 'brandID']; 
	}
		// no relations
	protected static function getRelations(): array { return []; }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?string $shortName,
      public readonly ?string $code,
		public readonly int $brandID
   ) {}
}