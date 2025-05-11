<?php
// this view uses an array named $schoolOrders of SchoolOrder objects and displays them in a table 
	$neededSizes = $event->getNeededSizes($incompleteOrders);
?>

<p>We still need: </p>
<table class="needTable">
	<thead>
		<tr>
			<th>S</th>
			<th>M</th>
			<th>L</th>
			<th>XL</th>
			<th>2X</th>
			<th>3X</th>
			<th>Total</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td title="S"><?= isset($neededSizes['S']) ? $neededSizes['S'] : '-'; ?></td>
			<td title="M"><?= isset($neededSizes['M']) ? $neededSizes['M'] : '-'; ?></td>
			<td title="L"><?= isset($neededSizes['L']) ? $neededSizes['L'] : '-'; ?></td>
			<td title="XL"><?= isset($neededSizes['XL']) ? $neededSizes['XL'] : '-'; ?></td>
			<td title="2XL"><?= isset($neededSizes['2XL']) ? $neededSizes['2XL'] : '-'; ?></td>
			<td title="3XL"><?= isset($neededSizes['3XL']) ? $neededSizes['3XL'] : '-'; ?></td>
			<td title="total"><?= ($neededSizes) ? array_sum($neededSizes) : '-'; ?></td>
		</tr>
	</tbody>
</table>