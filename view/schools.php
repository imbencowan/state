<h2>Schools</h2>

<table id="eventsTable" class = "eventsTable">
		<thead>
			<tr>
				<th></th>
				<th>School</th>
				<th>District</th>
				<th>Division</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($schools as $school) : ?>
				<tr id="row<?php echo $school->id; ?>">
					<td><?= $school->id; ?></td>
					<td><?= $school->shortName; ?></td>
					<td><?= $school->district->name; ?></td>
					<td><?= $school->division->name; ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>