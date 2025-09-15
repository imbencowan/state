<?php 
	$year = 24;
	$nextYear = $year + 1;
	$displayYear = $year . '-' . $nextYear;
?>
<h2><?= $displayYear . ' Events'; ?></h2>
<table id="eventsTable" class = "eventsTable">
	<thead>
		<tr>
			<th>Event</th>
			<th>Site</th>
			<th>Divisions</th>
			<!-- <th>Manager</th> -->
			<th>Employees</th>
			<th>Vehicle</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($yearsEvents->getEvents() as $event) : 
			$eventName = $event->sport->name;
			$eventDates = $event->getDateRangeString();
			$eventSites = $event->eventSites;
			$rowspan = count($eventSites);
			$season = $event->getSeason();
			$rowClass = '';
			if ($season == 2) $rowClass = 'darkGreenRow';
			elseif ($season == 3) $rowClass = 'darkOrangeRow';
			$i = 0;

			foreach ($eventSites as $eventSite) :
				$site = $eventSite->site;
				$siteName = $site->name;
				$divisionDisplay = $eventSite->getDivisionsDisplay();
				$managerName = $eventSite->managerName;
				$employeesStr = implode(', ', $eventSite->getEmployeeShortNames());
				$vehiclesStr = implode(', ', $eventSite->getVehicleNames());
		?>
				<tr data-event-id="<?= $event->id; ?>" class="<?= $rowClass; ?>">
					<!-- Only first row gets the rowspan cells -->
					<?php if ($i === 0): ?>
						<td rowspan="<?= $rowspan; ?>">
							<h2><?= $eventName; ?></h2>
							<?= $eventDates; ?>
						</td>
					<?php endif; ?>
					<td><?= $siteName; ?></td>
					<td><?= $divisionDisplay; ?></td>
					<!-- <td><?= $managerName; ?></td> -->
					<td>
						<?= $employeesStr; ?> 
						<button><span class="material-icons" title="edit employees">edit</span></button>
					</td>
					<td><?= $vehiclesStr; ?> 
						<button><span class="material-icons" title="edit vehicle">edit</span></button>
					</td>
				</tr>
				<?php 
					++$i;
					endforeach; 
				?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>