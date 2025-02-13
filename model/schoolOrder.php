<?php
class SchoolOrder extends BasicTableModel {
		// define the corresponding table, columns, and dependent tables to be used in the class
   protected static function getTableName(): string { return 'schoolorders'; }
   protected static function getPrimaryKey(): string { return 'schoolOrderID'; }
		// formatted 'propertyName' => 'columnName'
   protected static function getColumns(): array { 
		return ['id' => 'schoolOrderID', 
					'eventID' => 'eventID', 
					'division' => 'divisionID',
					'school' => 'schoolID',
					'isDone' => 'isDone',
					'due' => 'due',
					'paid' => 'paid',
					'note' => 'schoolOrderNote',
					'invoiceSent' => 'invoiceSent'];
	}
		// defined as: new Relation($property, $rClass, $foreignKey, $isMany)
	protected static function getRelations(): array {
      return [new Relation('division', 'Division', 'divisionID', false), 
					new Relation('school', 'School', 'schoolID', false), 
					new Relation('addedShirts', 'SOrderItem', 'schoolOrderID', true), 
					new Relation('messageOrders', 'MessageOrder', 'schoolOrderID', true)];
   }
	
	public function __construct(
      public readonly int $id,
      public readonly int $eventID,
      public readonly Division $division,
      public readonly School $school,
      public readonly bool $isDone = false,
      public readonly ?int $due = 0,
      public readonly ?bool $paid = false,
      public readonly ?string $note,
      public readonly ?bool $invoiceSent = false,
		private array $messageOrders = [],
		private array $addedShirts = []
   ) {}
	
	public function jsonSerialize(): mixed {
        return [
            'orderID' => $this->id,
            'eventID' => $this->eventID,
            'division' => $this->division,
            'school' => $this->school,
            'isDone' => $this->isDone,
            'due' => $this->due,
            'paid' => $this->paid,
            'schoolOrderNote' => $this->note,
            'invoiceSent' => $this->invoiceSent,
				'messageOrders' => $this->messageOrders,
				'addedShirts' => $this->addedShirts
        ];
    }
	

	public function getEventSites() { return $this->eventSites; }
	// public function setEventSites(array $value) { $this->eventSites[] = $value; }
		// key the array for ease of access
	public function pushEventSites($value) { $this->eventSites[$value->id] = $value; }
	
	public function getMessageOrders() { return $this->messageOrders; }
	// public function setMessageOrders(array $value) { $this->messageOrders[] = $value; }
	public function pushMessageOrders($value) { $this->messageOrders[$value->id] = $value; }
}



    

	// // Getters and Setters
	
	// public function getTeamSize($size) {
		// $total = 0;
		// foreach ($this->messageOrders as $order) {
			// $total += $order->getSizes()->getSize($size);
		// }
		// return $total;
	// }
			// // a display getter that returns dashes in place of zeros
	// public function getTeamDisplaySize(string $size) {
		// $total = 0;
		// foreach ($this->messageOrders as $order) {
			// $total += $order->getSizes()->getSize($size);
		// }
		// return ($total == 0) ? '-' : $total;
	// }
	// public function getTeamTotal() { 
		// $total = 0;
		// foreach ($this->messageOrders as $order) {
			// $total += $order->getSizes()->getTotal();
		// }
		// return $total; 
	// }
	// public function getTeamDisplayTotal() { 
		// $total = 0;
		// foreach ($this->messageOrders as $order) {
			// $total += $order->getSizes()->getTotal();
		// }
		// return ($total == 0) ? '-' : $total;
	// }
	
		// // returns a SizeList, totalling the messageOrder SizeLists
	// public function getTeamSizesTotals() {
		// $teamSizesTotals = new SizeList(0, 0, 0, 0, 0, 0);
		// foreach ($this->messageOrders as $messageOrder) {
			// $teamSizesTotals = SizeList::combineSizeLists($teamSizesTotals, $messageOrder->getSizes());
			// // $messageSizes = $messageOrder->getSizes();
			// // foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
				// // $teamSizesTotals->getSize($size) += $messageSizes->getSize($size);
			// // }
		// }
		// return $teamSizesTotals;
	// }

	
	
			// // we could potentially use array_sum() if we changed sizes to an array...
	// public function getAddedTotal() {
		// return $this->getAddedS() + $this->getAddedM() + $this->getAddedL() + 
			// $this->getAddedXL() + $this->getAddedXXL() + $this->getAddedXXXL();
	// }

	
	// public function getMessageFileNames() {
		// $fileNames = [];
		// foreach ($this->messageOrders as $order) {
			// $fileNames[] = $order->getFileName();
		// }
		// return implode(", ", $fileNames);
	// }
	
	// public function getMessageOrderText() {
		// $orderTexts = [];
		// foreach ($this->messageOrders as $order) {
			// $orderTexts[] = $order->getOrderText();
		// }
		// return implode("\n", $orderTexts);
	// }
	 

		// //////////////////////////////////////////////////////////////////////////////////////////
		// // Database Functions
	// public static function addOrder($schoolOrder) {
	  // $db = Database::getDB();
	  // $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID, isDone, addedS, addedM, addedL, addedXL, 
														 // addedXXL, addedXXXL, due, paid, schoolOrderNote, invoiceSent) 
					// VALUES (:eventID, :divisionID, :schoolID, :isDone, :addedS, :addedM, :addedL, :addedXL, 
							  // :addedXXL, :addedXXXL, :due, :paid, :schoolOrderNote, :invoiceSent)";

	  // $stmt = $db->prepare($query);
	  // $stmt->bindValue(':eventID', $schoolOrder->getEventID());
	  // $stmt->bindValue(':divisionID', $schoolOrder->getDivisionID());
	  // $stmt->bindValue(':schoolID', $schoolOrder->getSchoolID());
	  // $stmt->bindValue(':isDone', $schoolOrder->getIsDone());
	  // $stmt->bindValue(':addedS', $schoolOrder->getAddedS());
	  // $stmt->bindValue(':addedM', $schoolOrder->getAddedM());
	  // $stmt->bindValue(':addedL', $schoolOrder->getAddedL());
	  // $stmt->bindValue(':addedXL', $schoolOrder->getAddedXL());
	  // $stmt->bindValue(':addedXXL', $schoolOrder->getAddedXXL());
	  // $stmt->bindValue(':addedXXXL', $schoolOrder->getAddedXXXL());
	  // $stmt->bindValue(':due', $schoolOrder->getDue());
	  // $stmt->bindValue(':paid', $schoolOrder->getPaid());
	  // $stmt->bindValue(':schoolOrderNote', $schoolOrder->getSchoolOrderNote());
	  // $stmt->bindValue(':invoiceSent', $schoolOrder->getInvoiceSent());

	  // $stmt->execute();
	  // $schoolOrder->setSchoolOrderID($db->lastInsertId());
	// }
	
		// // add a new order, with null default values
	// public static function addNewOrder($eventID, $divisionID, $schoolID) {
	  // $db = Database::getDB();
	  // $query = "INSERT INTO schoolOrders (eventID, divisionID, schoolID) 
					// VALUES (:eventID, :divisionID, :schoolID)";

	  // $stmt = $db->prepare($query);
	  // $stmt->bindValue(':eventID', $eventID);
	  // $stmt->bindValue(':divisionID', $divisionID);
	  // $stmt->bindValue(':schoolID', $schoolID);

	  // $stmt->execute();
	  // return $db->lastInsertId();
	// }
	
	// public static function updateSizes($schoolOrderID, $teamSizes, $addOnSizes) {
		// $db = Database::getDB();
			// // we can update the addOns immediately
		// $query = "UPDATE schoolOrders 
					// SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					// WHERE schoolOrderID = :schoolOrderID";
	
		// $stmt = $db->prepare($query);
		// $stmt->bindValue(':s', $addOnSizes[0]);
		// $stmt->bindValue(':m', $addOnSizes[1]);
		// $stmt->bindValue(':l', $addOnSizes[2]);
		// $stmt->bindValue(':xl', $addOnSizes[3]);
		// $stmt->bindValue(':xxl', $addOnSizes[4]);
		// $stmt->bindValue(':xxxl', $addOnSizes[5]);
		// $stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		// $stmt->execute();
		
			// // make a SizeList from the array argument. name it $new to differentiate it later. clarity
		// $newTeamSizes = new SizeList($teamSizes[0], $teamSizes[1], $teamSizes[2], $teamSizes[3], 
												// $teamSizes[4], $teamSizes[5]);
			// // teamSizes are held in one or two messageOrders, so we have to check where to update them
		// $sOrder = SchoolOrder::getOrderByID($schoolOrderID);
		// $mOrders = $sOrder->getMessageOrders();
			// // if there is only one mOrder, no problem, update it.
		// if (count($mOrders) == 1) {
			// MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newTeamSizes);
				// // if there are 2 mOrders, we don't want any negative values, so we have to do some checking
		// } elseif (count($mOrders) == 2) {
				// // get both original message sizes, and their total
			// $m1Sizes = $mOrders[0]->getSizes();
			// $m2Sizes = $mOrders[1]->getSizes();
			// $oldTeamSizes = $sOrder->getTeamSizesTotals();
				// // get the difference between what we will have and what we had
			// $differenceOldNew = SizeList::calculateSizeListDifference($newTeamSizes, $oldTeamSizes);
				// // combine that with the first mOrder sizes
					// // if any of them become negative, we will set them to zero and subtract the remainder from mOrder2
			// $newM1Sizes = SizeList::combineSizeLists($m1Sizes, $differenceOldNew);
				// // if 
			// $stillNegativeSizes = new SizeList(0, 0, 0, 0, 0, 0); // Start with all sizes as 0
			// foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
				// $value = $newM1Sizes->getSize($size); // Get the current size value
				// if ($value < 0) {
					// $stillNegativeSizes->setSize($size, $value); // Store the negative value
					// $newM1Sizes->setSize($size, 0); // Set the original size to 0
				// }
			// }
				// // Combine the negative sizes with $m2Sizes
			// $newM2Sizes = SizeList::combineSizeLists($m2Sizes, $stillNegativeSizes);
				// // Now we have $newM1Sizes with no negatives, and $newM2Sizes with the adjusted values.
				// // we can update
			// MessageOrder::updateSizes($mOrders[0]->getMessageOrderID(), $newM1Sizes);
			// MessageOrder::updateSizes($mOrders[1]->getMessageOrderID(), $newM2Sizes);

		// }
		
		
		// // return $db->lastInsertId();
	// }
	
	// public static function updateAddOns($schoolOrderID, $sizes) {
		// $db = Database::getDB();
		// $query = "UPDATE schoolOrders 
					// SET addedS = :s, addedM = :m, addedL = :l, addedXL = :xl, addedXXL = :xxl, addedXXXL = :xxxl
					// WHERE schoolOrderID = :schoolOrderID";
	
		// $stmt = $db->prepare($query);
		// $stmt->bindValue(':s', $sizes[0]);
		// $stmt->bindValue(':m', $sizes[1]);
		// $stmt->bindValue(':l', $sizes[2]);
		// $stmt->bindValue(':xl', $sizes[3]);
		// $stmt->bindValue(':xxl', $sizes[4]);
		// $stmt->bindValue(':xxxl', $sizes[5]);
		// $stmt->bindValue(':schoolOrderID', $schoolOrderID);
	
		// $stmt->execute();
		// // return $db->lastInsertId();
	// }


	
	// //////////////////////////////////////////////////
   // // user actions
		// // takes us to the Items page, displaying all items
	// static function changeOrderDone($data) {
		// $id = $data['id'];
		// $isDone = $data['isDone'];
		
		// $db = Database::getDB();
		
		// $query = 'UPDATE schoolOrders
					// SET isDone = :isDone
					// WHERE schoolOrderID = :orderID';
		// $statement = $db->prepare($query);
		// $statement->bindValue(":orderID", $id);
		// $statement->bindValue(":isDone", $isDone);
		// $statement->execute();
		// $id = $statement->fetchColumn();
		// $statement->closeCursor();
		
			// // i think this is working with out this. it was part of the db function that was reworked here.
		// // if (!empty($id)) {
			// // return $id;
		// // } else {
			// // return false;
		// // }
			// // this isn't returning any thing meaningful, but may be some day i'll want to
				// // some thing is expected back, even if it isn't used
		// echo json_encode(['result' => 1]);
	// }
// }
?>
