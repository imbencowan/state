<?php
	// i swear this should be some where else, not at the top of this view.
		// it should be part of the Event class
	$commentOrders = [];
		foreach($event->eventSites as $eventSite) {
			foreach ($eventSite->divisions as $division) {
				foreach ($division->schoolOrders as $schoolOrder) {
					foreach ($schoolOrder->getMessageOrders() as $order) {
						if ($order->commentHandled == 0) {
							$o = new stdClass();
							$o->school = $schoolOrder->school->shortName;
							$o->division = $division->name;
							$o->comment = $order->comment;
							$commentOrders[] = $o;
						}
					}
				}
			}
		}
?>
<div id="eventContainer">
		<h1>
			<?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?>
			<button class="genPDFButton" data-btnType="genAllSoSPDF">Get All SoS</button>
			<button class="genPDFButton" data-btnType="genBoxLabels">Print Undone Box Labels</button>
		</h1>
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
		if ($commentOrders) include 'orderCommentTable.php';
?>
</div>