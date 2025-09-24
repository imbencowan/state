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
			<th><span class="material-icons">edit</span></th><!-- button column -->
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
				$divIDsArr = $eventSite->getDivisionsIDs();
				$managerName = $eventSite->managerName;
				$employeesStr = implode(', ', $eventSite->getEmployeeShortNames());
				$empIDsArr = $eventSite->getChildIDs('employees');
				$vehiclesStr = implode(', ', $eventSite->getVehicleNames());
				$vhclIDsArr = $eventSite->getChildIDs('vehicles');
		?>
				<tr data-event-id="<?= $event->id; ?>" data-eventSite-id="<?= $eventSite->id; ?>" 
					class="<?= $rowClass; ?>">
					<!-- Only first row gets the rowspan cells -->
					<?php if ($i === 0): ?>
						<td rowspan="<?= $rowspan; ?>">
							<h2><?= $eventName; ?></h2>
							<?= $eventDates; ?>
						</td>
					<?php endif; ?>
					<td data-column="site" data-oValue="<?= $site->id; ?>"><?= $siteName; ?></td>
					<td data-column="divisions" data-oValue="<?= json_encode($divIDsArr); ?>"><?= $divisionDisplay; ?></td>
					<!-- <td data-field="manager"><?= $managerName; ?></td> -->
					<td data-column="employees" data-oValue="<?= json_encode($empIDsArr); ?>"><?= $employeesStr; ?></td>
					<td data-column="vehicles" data-oValue="<?= json_encode($vhclIDsArr); ?>"><?= $vehiclesStr; ?></td>
					<td data-column="buttons"><button>
						<span class="material-icons edit-row-button" title="edit row">edit</span>
					</button></td>
				</tr>
				<?php 
					++$i;
					endforeach; 
				?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>