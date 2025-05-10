<div id="eventContainer">
	<h1>
		<?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?>
		<button class="genPDFButton clickable printAllSoSPDF" data-btnType="printAllSoSPDF">Get All SoS</button>
		<button class="genPDFButton clickable genUndoneBoxLabelsBtn" data-btnType="genBoxLabels">Print Undone Box Labels</button>
		<button class="genPDFButton clickable newOrderBtn" data-btnType="newOrder">+ Order</button>
	</h1>
	<div id="ordersContainer">
<?php	foreach ($event->eventSites as $eventSite) : ?>
			<h2><?= $eventSite->site->name; ?></h2>
<?php		foreach ($eventSite->divisions as $division) : ?>
				<h3><?= $division->name; ?>
					<button class="genPDFButton clickable printSoSPDF" data-btnType="printSoSPDF" 
						data-eshdid="<?= $division->id; ?>">Get SoS</button>
				</h3>
<?php			$schoolOrders = $division->schoolOrders;
				if ($schoolOrders) include 'ordersTable.php';
			endforeach;
		endforeach;	
?>
	</div>
<?php		
			// get any comments
		$commentOrders = $event->getUnhandledComments();
		if ($commentOrders) include 'orderCommentTable.php';
?>
</div>