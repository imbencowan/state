<?php 
	// $year comes from the includer
	$nextYear = $year + 1;
	$displayYear = $year . '-' . $nextYear;
?>

<div id="yearContainer">
	<div class="row">
		<h2><?= $displayYear . ' Events'; ?></h2>
		<button class="topLevelButton" data-action="getSeasonStock">Get Next Season Stock</button>
		<button class="topLevelButton" data-action="addYear" title="add a year">
			<span class="material-icons">add</span>
		</button>
	</div>
<div class="table-container">
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
				<tr data-event-i-d="<?= $event->id; ?>" data-event-site-i-d="<?= $eventSite->id; ?>" 
					class="<?= $rowClass; ?>">
					<!-- Only first row gets the rowspan cells -->
					<?php if ($i === 0): ?>
						<td rowspan="<?= $rowspan; ?>">
							<h2><?= $eventName; ?></h2>
							<?= $eventDates; ?>
						</td>
					<?php endif; ?>
					<td data-column="site" data-o-value="<?= dataAttr($site->id); ?>"><?= $siteName; ?></td>
					<td data-column="divisions" data-o-value="<?= dataAttr($divIDsArr); ?>"><?= $divisionDisplay; ?></td>
					<!-- <td data-column="manager" data-o-value="<?= dataAttr($empIDsArr); ?>"><?= $managerName; ?></td> -->
					<td data-column="employees" data-o-value="<?= dataAttr($empIDsArr); ?>"><?= $employeesStr; ?></td>
					<td data-column="vehicles" data-o-value="<?= dataAttr($vhclIDsArr); ?>"><?= $vehiclesStr; ?></td>
					<td data-column="buttons"><button>
						<span class="material-icons" data-action="editRow" title="edit row">edit</span>
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
</div>
</div>