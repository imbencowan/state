<div id="eventContainer">
	<h1><?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?></h1>
	<div id="buttonContainer">
		<h1>
			<button class="topLevelButton clickable genUndoneBoxLabelsBtn" data-btnType="genBoxLabels" 
				title="print all undone box labels">
				<span class="material-icons">print</span> Undone Labels
			</button>
			<button class="topLevelButton clickable printAllSoSPDF" data-btnType="printAllSoSPDF" 
				title="print all site's sign off sheets">
				<span class="material-icons">print</span> All SoS
			</button>
			<!-- <button class="topLevelButton clickable genTotalsBtn" data-btnType="print Messages">Get IHSAA Totals</button> -->
			<button class="topLevelButton clickable printInvoicesBtn" data-btnType="printInvoices"
				title="print all invoices"><span class="material-icons">print</span> Invoices
			</button>
			<!-- <button class="topLevelButton clickable printMessagesBtn" data-btnType="printMessages">Print Messages</button> -->
			<button class="topLevelButton clickable newOrderBtn" data-btnType="newOrder"
				title="add an order">+ Order
			</button>
		</h1>
	</div>

	<div id="needContainer">
		<?php 
			$incompleteOrders = $event->getIncompleteOrders();
			if ($incompleteOrders) include 'needTable.php'; 
		?>
	</div>
	<div id="ordersContainer">
<?php	foreach ($event->eventSites as $eventSite) : ?>
			<h2 data-event-site-id="<?= $eventSite->id; ?>"><?= $eventSite->site->name; ?></h2>
<?php		foreach ($eventSite->esDivisions as $esd) : 
				$gender = $eventSite->gender?->name ? ' ' . $eventSite->gender->name : '';
?>
				<h3 data-event-site-division-id="<?= $esd->id; ?>"><?= $esd->name . $gender; ?>
					<button class="topLevelButton clickable printSoSPDF" data-btnType="printSoSPDF" 
						data-eshdid="<?= $esd->id; ?>"><span class="material-icons">print</span> SoS</button>
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