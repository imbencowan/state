<div id="eventContainer">
	<h1>
		<?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?>
		<button class="genPDFButton clickable printAllSoSPDF" data-btnType="printAllSoSPDF">Get All SoS</button>
		<button class="genPDFButton clickable genUndoneBoxLabelsBtn" data-btnType="genBoxLabels">Print Undone Labels</button>
		<button class="genPDFButton clickable newOrderBtn" data-btnType="newOrder">+ Order</button>
	</h1>
	<div id="needContainer">
		<?php 
			$incompleteOrders = $event->getIncompleteOrders();
			if ($incompleteOrders) include 'needTable.php'; 
		?>
	</div>
	<div id="ordersContainer">
<?php	foreach ($event->eventSites as $eventSite) : ?>
			<h2 data-event-site-id="<?= $eventSite->id; ?>"><?= $eventSite->site->name; ?></h2>
<?php		foreach ($eventSite->esDivisions as $esd) : ?>
				<h3 data-event-site-division-id="<?= $esd->id; ?>"><?= $esd->name; ?>
					<button class="genPDFButton clickable printSoSPDF" data-btnType="printSoSPDF" 
						data-eshdid="<?= $esd->id; ?>">Get SoS</button>
				</h3>
<?php			$schoolOrders = $esd->schoolOrders;
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