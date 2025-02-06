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
			<?php foreach ($schools as $school) : 
				// $school = $schools[0];
				// var_dump($school);
			?>
				<tr id="row<?php echo $school->getSchoolID(); ?>">
					<td><?php echo $school->getSchoolID(); ?></td>
					<td><?php echo $school->getSchoolShortName(); ?></td>
					<td><?php echo $school->getDistrict()->getDistrictName(); ?></td>
					<td><?php echo $school->getDivision()->getDivisionName(); ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>