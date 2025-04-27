<?php 
		// sort the added orders
	if ($addedOrders) :
			// Sort by sport, division, school
		usort($addedOrders, function($a, $b) {
				// First, compare getSportID()
			if ($a['sport'] != $b['sport']) {
				return $a['sport'] <=> $b['sport'];
			}
				// If getSportID() is the same, compare getDivisionID()
			if ($a['division'] != $b['division']) {
				return $a['division'] <=> $b['division'];
			}
				// If both getSportID() and getDivisionID() are the same, compare getSchoolName() alphabetically
			return strcmp($a['school'], $b['school']);
		});
		$commentOrders = [];
?>
	<h2>Orders Added</h2>
	<table class="addedOrdersTable">
		<thead>
			<tr>
				<th>Sport</th>
				<th>School</th>
				<th>Gender</th>
				<th>Year</th>
				<th>S</th>
				<th>M</th>
				<th>L</th>
				<th>XL</th>
				<th>2X</th>
				<th>3X</th>
			</tr>
		</thead>
		<tbody>
<?php			
		foreach ($addedOrders as $order) :
			if ($order['comment'] != '') $commentOrders[] = $order;
			
?>
				<tr class="unDoneRow">
					<td title="<?= $order['fileName']; ?>"><?= $order['sport']; ?></td>
					<td><?= $order['shortSchool']; ?></td>
					<td><?= $order['genderName']; ?></td>
					<td><?= $order['year']; ?></td>
					<td><?= $order['sizes'][0]; ?></td>
					<td><?= $order['sizes'][1]; ?></td>
					<td><?= $order['sizes'][2]; ?></td>
					<td><?= $order['sizes'][3]; ?></td>
					<td><?= $order['sizes'][4]; ?></td>
					<td><?= $order['sizes'][5]; ?></td>
				</tr>
<?php	endforeach; ?>
			</tbody>
		</table>
<?php if ($commentOrders) : ?>
		<br />
		<h2>Comments</h2>
		<table>
			<thead>
				<tr>
					<th>Sport</th>
					<th>School</th>
					<th>Comment</th>
					<th>Handled</th>
				</tr>
			</thead>
			<tbody>
<?php foreach ($commentOrders as $order) : ?>
				<tr>
					<td><?= $order['sport']; ?></td>
					<td><?= $order['shortSchool']; ?></td>
					<td><?= $order['comment']; ?></td>
					<td><input type="checkbox" /></td>
				</tr>
<?php endforeach; ?>
			</tbody>
		</table>
<?php 
		endif;
	endif;
		
		// show which orders were already in the db
	if ($preexistingOrders) :
			// Sort by sport, division, school
		usort($preexistingOrders, function($a, $b) {
				// First, compare getSportID()
			if ($a['sport'] != $b['sport']) {
				return $a['sport'] <=> $b['sport'];
			}
				// If getSportID() is the same, compare getDivisionID()
			if ($a['division'] != $b['division']) {
				return $a['division'] <=> $b['division'];
			}
				// If both getSportID() and getDivisionID() are the same, compare getSchoolName() alphabetically
			return strcmp($a['school'], $b['school']);
		});
?>
	<p>There is already an order for: </p>
	<ul>
<?php
		foreach ($preexistingOrders as $order) {
			echo '<li title="' . $order['fileName'] . '">' . $order['shortSchool'] . ' ' . $order['genderName'] . 
					$order['sport'] . ' ' . $year . '</li>';
		}
?>
	</ul>
<?php
	endif;	
?>

