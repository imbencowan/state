<h2>Items</h2><table id="eventsTable" class = "eventsTable">
	<thead>
		<tr>
			<th>Style</th>
			<th>Site</th>
			<th>Divisions</th>
			<th>Manager</th>
			<th>Employees</th>
			<th>Vehicle</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($yearsEvents->getEvents() as $event) : 
			$eventName = $event->getEventName();
			$eventDates = $event->getDateRangeString();
			$eventSites = $event->getEventSites();
			$rowspan = count($eventSites);
			$season = $event->getSeason();
			$rowClass = '';
			if ($season == 2) $rowClass = 'darkGreenRow';
			elseif ($season == 3) $rowClass = 'darkOrangeRow';
			$i = 0;
		?>
			<tr id="row<?php echo $event->getEventID(); ?>" class="<?php echo $rowClass; ?>">
				<td rowspan="<?php echo $rowspan; ?>"><h2><?php echo $eventName; ?></h2><?php echo $eventDates; ?></td>
				<?php foreach ($eventSites as $eventSite) :
					$site = $eventSite->getSite();
					$siteName = $site->getSiteName();
					$managerName = $eventSite->getManagerName();
					$vehicleName = '';
					$divisionName = $eventSite->getDivisionsDisplay();
					$employeesStr = $eventSite->getEmployeesString();
					++$i;
				?>
					<td><?php echo $siteName; ?></td>
					<td><?php echo $divisionName; ?></td>
					<td><?php echo $managerName; ?></td>
					<td><?php echo $employeesStr; ?></td>
					<td><?php echo $vehicleName; ?></td>
					<?php if ($i < $rowspan) : ?>
						</tr>
						<tr class="<?php echo $rowClass; ?>">
					<?php endif; ?>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
<table id="eventsTable" class = "eventsTable">
	<thead>
		<tr>
			<th>Event</th>
			<th>Site</th>
			<th>Divisions</th>
			<th>Manager</th>
			<th>Employees</th>
			<th>Vehicle</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($yearsEvents->getEvents() as $event) : 
			$eventName = $event->getEventName();
			$eventDates = $event->getDateRangeString();
			$eventSites = $event->getEventSites();
			$rowspan = count($eventSites);
			$season = $event->getSeason();
			$rowClass = '';
			if ($season == 2) $rowClass = 'darkGreenRow';
			elseif ($season == 3) $rowClass = 'darkOrangeRow';
			$i = 0;
		?>
			<tr id="row<?php echo $event->getEventID(); ?>" class="<?php echo $rowClass; ?>">
				<td rowspan="<?php echo $rowspan; ?>"><h2><?php echo $eventName; ?></h2><?php echo $eventDates; ?></td>
				<?php foreach ($eventSites as $eventSite) :
					$site = $eventSite->getSite();
					$siteName = $site->getSiteName();
					$managerName = $eventSite->getManagerName();
					$vehicleName = '';
					$divisionName = $eventSite->getDivisionsDisplay();
					$employeesStr = $eventSite->getEmployeesString();
					++$i;
				?>
					<td><?php echo $siteName; ?></td>
					<td><?php echo $divisionName; ?></td>
					<td><?php echo $managerName; ?></td>
					<td><?php echo $employeesStr; ?></td>
					<td><?php echo $vehicleName; ?></td>
					<?php if ($i < $rowspan) : ?>
						</tr>
						<tr class="<?php echo $rowClass; ?>">
					<?php endif; ?>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>