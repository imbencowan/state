<?php
class MessageOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'messageorders'; }
   protected static function getPrimaryKey(): string { return 'messageOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'messageOrderID', 
					'schoolOrderID' => 'schoolOrderID', 
					'genderID' => 'genderID',
					'orderedBy' => 'orderedBy',
					'comment' => 'mOrderComment',
					'commentHandled' => 'mOrderCommentHandled',
					'orderText' => 'orderText',
					'fileName' => 'fileName',
					'orderDate' => 'orderDate'];
	}
		// no relations
	
	
	public readonly string $orderDate;
	
	public function __construct(
      public readonly ?int $id,
      public readonly int $schoolOrderID,
      public readonly int $genderID,
      public readonly string $orderedBy,
		public readonly ?string $comment,
		public readonly bool $commentHandled,
      public readonly string $orderText,
      public readonly ?string $fileName,
      string|DateTime $orderDate
   ) {
		   $this->orderDate = $orderDate instanceof DateTime ? $orderDate->format('Y-m-d H:i:s') : $orderDate;
	}
	
	public function jsonSerialize(): mixed {
		return [
			'id' => $this->id,
			'schoolOrderID' => $this->schoolOrderID,
			'genderID' => $this->genderID,
			// 'genderName' => $this->genderName,
			'orderedBy' => $this->orderedBy,
			'comment' => $this->comment,
			'commentHandled' => $this->commentHandled,
			'orderText' => $this->orderText,
			'fileName' => $this->fileName,
			'orderDate' => $this->orderDate,
		];
	}	
	
	
	
	//////////////////////////////////////////////////////
	// Database functions	
	public static function getIDByEventSiteHasDivisionAndSchool($eshdID, $schoolID) {
		$query = "SELECT schoolOrderID FROM schoolorders 
					WHERE eventSiteHasDivisionID = :eshdID AND schoolID = :schoolID";
		$rows = static::getFromDB($query, [':eshdID' => $eshdID, ':schoolID' => $schoolID]);
		return !empty($rows) ? $rows : null;
	}
	
	
	
	public static function getIDBySchoolOrderIDAndGenderID($schoolOrderID, $genderID) {
		$query = "SELECT messageOrderID FROM messageorders 
					WHERE schoolOrderID = :schoolOrderID AND genderID = :genderID";
		$rows = static::getFromDB($query, [':schoolOrderID' => $schoolOrderID, ':genderID' => $genderID]);
		return !empty($rows) ? $rows[0]['messageOrderID'] : null;
	}
	
	
	//////////////////////////////////////////////////////////
	// user actions
	static function changeCommentHandled($data) {
		$db = Database::getDB();
		
		$statement = $db->prepare('UPDATE messageOrders SET mOrderCommentHandled = :handled WHERE messageOrderID = :orderID');
		$statement->bindValue(":orderID", $data['id']);
		$statement->bindValue(":handled", $data['handled']);
		$statement->execute();
		$affectedRows = $statement->rowCount();
		$statement->closeCursor();
			
		return ['rowsAffected' => $affectedRows];
	}
	
}
?>