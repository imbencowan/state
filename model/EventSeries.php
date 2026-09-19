<?php
class EventSeries extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'eventseries'; }
	protected static function getPrimaryKey(): string { return 'seriesID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'seriesID', 
					'name' => 'seriesName', 
					'isGendered' => 'isGendered', 
					'isIndividualed' => 'isIndividualed', 
					'maxTeamSize' => 'maxTeamSize', 
					'minDiv' => 'minDiv',
					'labelColor' => 'labelColor']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
			// removed 'minDiv' => 'Division' for the time being
	protected static function getRelations(): array {
      return [];
   }
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?int $maxTeamSize,
      public readonly ?int $minDiv,
		public readonly ?string $labelColor,
      public readonly bool $isGendered = false,
      public readonly bool $isIndividualed = false
   ) {}
	


	//////////////////////////////////////////////////////
	// Database functions	
	public static function getByName(string $name) {
		$query = static::buildSelect() . " WHERE seriesName = :name";
		$rows = static::getFromDB($query, [':name' => $name]);
		return !empty($rows) ? static::buildFromRow($rows) : null;
	}
}
?>
