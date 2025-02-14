<div id="eventPage">

		<h1>
			<?= $event->sport->name . ' ' . $event->startDate->format('Y'); ?>
			<button class="genPDFButton" data-btnType="genAllSoSPDF">Get All SoS</button>
		</h1>
<?php	foreach ($event->eventSites as $eventSite) : ?>
			<h2><?= $eventSite->site->name; ?>
	<?php if (count($event->eventSites) > 1) : ?>
				<button class="genPDFButton" data-btnType="genSoSPDF"	data-eventSiteID="<?= $eventSite->id; ?>">Get SoS</button>
	<?php endif; ?>
			</h2>
<?php		foreach($eventSite->divisions as $division) : ?>
				<h3><?= $division->name; ?></h3>
<?php			$schoolOrders = $division->schoolOrders;
				if ($schoolOrders) include 'ordersTable.php';
			endforeach;
		endforeach;
?>
</div>