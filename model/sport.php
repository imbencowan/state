<?php
class Sport extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'sports'; }
	protected static function getPrimaryKey(): string { return 'sportID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'sportID', 
					'name' => 'sportName', 
					'isGendered' => 'isGendered', 
					'isIndividualed' => 'isIndividualed', 
					'maxTeamSize' => 'maxTeamSize', 
					'minDiv' => 'minDiv']; 
	}
		// defined as ['propertyName' => 'RelatedClass']
			// removed 'minDiv' => 'Division' for the time being
	protected static function getRelations(): array {
      return [];
   }
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly bool $isGendered = false,
      public readonly bool $isIndividualed = false,
      public readonly ?int $maxTeamSize,
      public readonly int $minDiv
   ) {}
	


	//////////////////////////////////////////////////////
	// Database functions	
	public static function getByName($name) {
		$query = static::buildSelect() . " WHERE sportName = :name";
		$rows = static::getFromDB($query, [':name' => $name]);
		return !empty($rows) ? static::buildFromRow($rows) : null;
	}
}
?>
