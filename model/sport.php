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
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
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
      public readonly int $minDiv,
		private array $eventSites = []
   ) {}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'isGendered' => $this->isGendered,
			'isIndividualed' => $this->isIndividualed,
			'maxTeamSize' => $this->maxTeamSize,
			'minDiv' => $this->minDiv,
			'eventSites' => $this->eventSites
		];
	}

		// private array handlers
	public function getEventSites() { return $this->eventSites; }
	// public function setEventSites(array $value) { $this->eventSites[] = $value; }
	public function pushEventSites($value, $key = null) { 
		if ($key === null) $this->eventSites[] = $value; 
		else $this->eventSites[$key] = $value;
	}
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Items page, displaying all items
	static function showSport($data) {
			// output has to be placed between ob_start() and ob_get_clean() as below
		ob_start(); 
			// we might be able to take the $year assignment out, but i can't test that right now
		$year = $data['year'];
		$sportID = $data['sportID'];
		
		$event = Event::getEventOrdersBySportIDAndYear($sportID, $year);
		
		
		// var_dump($event, $sportID, $year);
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/sport.php';
			// Get the buffered content as a string
		$htmlContent = ob_get_clean(); 
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $event
		]);
	}
	
		//////////////////////////////////////////////////
   // user actions
		// takes us to the Schools page, displaying all schools
	// static function showSchools($input) {
		// // $schools = School::getAllSchools();
		// $schools = School::getAllFromDB();
		// ob_start();
		// include 'view/addOrdersDiv.php';
		// include 'view/yearDiv.php';
		// include 'view/schools.php';
		// $htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		// echo json_encode([
			// 'html' => $htmlContent,
			// 'data' => $schools
		// ]);
	// }
}
?>
