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
					'district' => 'districtID',
					'addressPhysical' => 'schoolAddressPhysical',
					'addressMailing' => 'schoolAddressMailing',
					'addressLine2' => 'schoolAddressLine2',
					'ad' => 'activitiesDirectorID']; 
	}
		// defined as: new Relation($property, $rClass, $leftKey, $rightKey, $isMany = false, $interTable = null)
	protected static function getRelations(): array {
      return [
			new Relation('division', 'Division', 'divisionID', 'divisionID', false), 
			new Relation('district', 'District', 'districtID', 'districtID', false),
				// right now we're only joining the ad, no need for principal, superintendent, etc
			new Relation('ad', 'Person', 'activitiesDirectorID', 'personID', false)
		];
   }
	
	public readonly string $shortName;
	
	public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?string $addressPhysical,
      public readonly ?string $addressMailing,
      public readonly ?string $addressLine2,
      public readonly ?Division $division,
      public readonly ?District $district,
		public readonly ?Person $ad
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
		$schools = School::getAllFromDB();
		ob_start();
		include 'view/addOrdersDiv.php';
		include 'view/yearDiv.php';
		include 'view/schools.php';
		$htmlContent = ob_get_clean();
		
		return [ 'html' => $htmlContent, 'data' => $schools ];
	}
}
?>
