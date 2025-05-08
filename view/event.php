<div id="eventContainer">
	<h1>
		<?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?>
		<button class="genPDFButton" data-btnType="genAllSoSPDF">Get All SoS</button>
		<button class="genPDFButton" data-btnType="genBoxLabels">Print Undone Box Labels</button>
	</h1>
	<div id="ordersContainer">
<?php	foreach ($event->eventSites as $eventSite) : ?>
			<h2><?= $eventSite->site->name; ?>
	<?php if (count($event->eventSites) > 1) : ?>
				<button class="genPDFButton" data-btnType="genSoSPDF"	data-eventSiteID="<?= $eventSite->id; ?>">Get SoS</button>
	<?php endif; ?>
			</h2>
<?php		foreach ($eventSite->divisions as $division) : ?>
				<h3><?= $division->name; ?></h3>
<?php			$schoolOrders = $division->schoolOrders;
				if ($schoolOrders) include 'ordersTable.php';
			endforeach;
		endforeach;	
?>
	</div>
<?php		
			// get any comments
		$unhandled = $event->getUnhandledComments();
		if ($unhandled) include 'orderCommentTable.php';
?>
</div>