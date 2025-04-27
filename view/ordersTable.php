<?php
// this view uses an array named $schoolOrders of SchoolOrder objects and displays them in a table 
?>

<div class="table-container">
	<table class="orderTable" data-event-id="<?= $event->id; ?>" data-event-site-id="<?= $eventSite->id; ?>"
	data-event-site-division-id="<?= $division->id; ?>">
		<thead>
			<tr>
				<th>School</th>
				<th>S</th>
				<th>M</th>
				<th>L</th>
				<th>XL</th>
				<th>2X</th>
				<th>3X</th>
				<th>Total</th>
				<th><span class="material-icons">more_horiz</span></th>
			</tr>
		</thead>
		<tbody>
<?php foreach ($schoolOrders as $order) : 
		// variables for ease
	$isDone = $order->isDone;
		// $isDone can be 0, 1, or 2: undone, done, or partial
	if ($isDone == 0) {
		$trClass = 'unDoneRow';
	} elseif ($isDone == 1) {
		$trClass = 'doneRow';
	} elseif ($isDone == 2) {
		$trClass = 'partDoneRow';
	}
	$hasAddOns = false;
	$orderID = $order->id;
	$checkID = "check" . $orderID;
	$schoolName = $order->school->shortName;
		// the if shouldn't be necessary
	$teamShirts = !empty($order->teamShirts['Adult Hoods'] ?? null) ? $order->teamShirts['Adult Hoods']->getSizes() : null;
	$rowspan = count($order->addedShirts) + 1;
?>
				<tbody id="row<?= $orderID; ?>" class="<?= $trClass;?>" data-school-order-id="<?= $orderID; ?>">
					<tr>
						<td title="<?= $orderID . ' / ' . $order->getMessageFileNames(); ?>"><?= $schoolName; ?></td>
						<td title="S"><?= isset($teamShirts['S']) ? $teamShirts['S']->getQuantity() : '-'; ?></td>
						<td title="M"><?= isset($teamShirts['M']) ? $teamShirts['M']->getQuantity() : '-'; ?></td>
						<td title="L"><?= isset($teamShirts['L']) ? $teamShirts['L']->getQuantity() : '-'; ?></td>
						<td title="XL"><?= isset($teamShirts['XL']) ? $teamShirts['XL']->getQuantity() : '-'; ?></td>
						<td title="2X"><?= isset($teamShirts['2XL']) ? $teamShirts['2XL']->getQuantity() : '-'; ?></td>
						<td title="3X"><?= isset($teamShirts['3XL']) ? $teamShirts['3XL']->getQuantity() : '-'; ?></td>
						<td title="total"><?= $order->getTeamTotal(); ?></td>
							<?php // a cell to hold action buttons ?>
						<td rowspan="<?= $rowspan ?>">
							<span class="material-icons clickable addAddOns" title="add add ons">add</span>
							<span class="material-icons clickable editSizes" title="edit the sizes">edit</span>
							<span class="material-icons clickable showMessage" title="view the original message">article</span>
							<span class="material-icons clickable printLabel" title="print box label">print</span>
							<input type="checkbox" id="<?= $checkID?>" name="<?= $checkID?>" value="<?= $orderID;?>" 
									title="mark order complete" onchange="changeOrderDone(<?= $orderID; ?>)" 
									<?php if ($isDone == 1) echo "checked"; ?>/>
						</td>
					</tr>
		<?php if (!empty($order->addedShirts['Adult Hoods'] ?? null)) : 
			$addedHoods = $order->addedShirts['Adult Hoods']->getSizes();
		?>
					<tr class="addOnRow">
						<td>added hoods</td>
						<td title="S"><?= isset($addedHoods['S']) ? $addedHoods['S']->getQuantity() : ''; ?></td>
						<td title="M"><?= isset($addedHoods['M']) ? $addedHoods['M']->getQuantity() : ''; ?></td>
						<td title="L"><?= isset($addedHoods['L']) ? $addedHoods['L']->getQuantity() : ''; ?></td>
						<td title="XL"><?= isset($addedHoods['XL']) ? $addedHoods['XL']->getQuantity() : ''; ?></td>
						<td title="2X"><?= isset($addedHoods['2XL']) ? $addedHoods['2XL']->getQuantity() : ''; ?></td>
						<td title="3X"><?= isset($addedHoods['3XL']) ? $addedHoods['3XL']->getQuantity() : ''; ?></td>
						<td title="total"><?php echo $order->getAddedHoodsTotal(); ?></td>
					</tr>
				</tbody>
		<?php endif; ?>
	<?php endforeach; ?>
		</tbody>
	</table>
</div>