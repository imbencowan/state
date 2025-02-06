<div id="sportPage">
<?php 
	$sports = $event->getSports();
	$realYear = $event->getStartDate()->format('Y');
	foreach ($sports as $sport) :
?>
		<h1>
			<?php echo $sport->getSportName() . ' ' . $realYear;?>
			<button class="genPDFButton" data-btnType="genAllSoSPDF">Get All SoS</button>
		</h1>
<?php	foreach ($sport->getEventSites() as $eventSite) : ?>
			<h2>
				<?php echo $eventSite->getSite()->getSiteName(); ?>
				<button class="genPDFButton" data-btnType="genSoSPDF"	
					data-eventSiteID="<?php echo $eventSite->getEventSiteID(); ?>">Get SoS</button>
			</h2>
<?php		
			$divisions = $eventSite->getDivisions();
			krsort($divisions);
			foreach($divisions as $division) : 
?>
				<h3><?php echo $division->getDivisionName(); ?></h3>
<?php	
				$schoolOrders = $division->getSchoolOrders();
				ksort($schoolOrders);
				if ($schoolOrders) include 'ordersTable.php';
 ?>
<?php

			endforeach;
		endforeach;
	endforeach;
?>
</div>