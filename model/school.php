<?php
class School extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'schools'; }
   protected static function getPrimaryKey(): string { return 'schoolID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'schoolID', 
					'name' => 'schoolName', 
					'division' => 'divisionID', 
					'district' => 'districtID']; 
	}
		// defined as: new Relation($property, $class, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [new Relation('division', 'Division', 'divisionID', false), 
					new Relation('district', 'District', 'districtID', false)];
   }
	
	public readonly string $shortName;
	
	public function __construct(
      public readonly int $id,
      public readonly ?string $name,
      public readonly ?Division $division,
      public readonly ?District $district
   ) {
		$this->shortName = self::shortenSchoolName($name);
	}
	 
		// the shortener. a helper removes the useless part of a school name
	public static function shortenSchoolName($longSchoolName) {
			// a couple special cases first
				// we'll give big Timberline and big Highland the shortshort names. 
					// Weippe and Craigmont will remain appended
		if ($longSchoolName == 'Timberline High School - Boise') {
			$shortSchoolName = 'Timberline';
		} elseif ($longSchoolName == 'Highland High School - Pocatello') {
			$shortSchoolName = 'Highland';
		} elseif ($longSchoolName == 'Idaho School for the Deaf & the Blind') {
			$shortSchoolName = 'Idaho School for the Deaf & the Blind';
		} else {
				// order matters here, we have to do ' High School' after these oddballs, or they won't get caught this way
			$remove = [" Jr/Sr High School", " Junior/Senior High School", " High School", "Academy", "School"];
			$shortSchoolName = str_replace($remove, "", $longSchoolName);
		}
		return $shortSchoolName;
	}
	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Schools page, displaying all schools
	static function showSchools($input) {
		// $schools = School::getAllSchools();
		$schools = School::getAllFromDB();
		ob_start();
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/schools.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		echo json_encode([
			'html' => $htmlContent,
			'data' => $schools
		]);
	}
}
?>
