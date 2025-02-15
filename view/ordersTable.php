<?php
// this view uses an array named $schoolOrders of SchoolOrder objects and displays them in a table 
?>

<div class="table-container">
	<table id="orderTable" class = "orderTable">
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
	if (!empty($order->teamShirts['Adult Hoods'] ?? null)) $teamShirts = $order->teamShirts['Adult Hoods']->getSizes();
	$rowspan = count($order->addedShirts) + 1;
?>
				<tbody id="row<?php echo $orderID; ?>" class="<?php echo $trClass;?>" 
						data-schoolOrderID="<?php echo $orderID; ?>"
						data-messageOrderText="<?php echo $order->getMessageOrdersText(); ?>">
					<tr>
						<td title="<?php echo $order->getMessageFileNames() ?>"><?php echo $schoolName; ?></td>
						<td title="S"><?= isset($teamShirts['S']) ? $teamShirts['S']->getQuantity() : '-'; ?></td>
						<td title="M"><?= isset($teamShirts['M']) ? $teamShirts['M']->getQuantity() : '-'; ?></td>
						<td title="L"><?= isset($teamShirts['L']) ? $teamShirts['L']->getQuantity() : '-'; ?></td>
						<td title="XL"><?= isset($teamShirts['XL']) ? $teamShirts['XL']->getQuantity() : '-'; ?></td>
						<td title="2X"><?= isset($teamShirts['2XL']) ? $teamShirts['2XL']->getQuantity() : '-'; ?></td>
						<td title="3X"><?= isset($teamShirts['3XL']) ? $teamShirts['3XL']->getQuantity() : '-'; ?></td>
						<td title="total"><?= $order->getTeamTotal(); ?></td>
							<?php // a cell to hold action buttons ?>
						<td rowspan="<?= $rowspan ?>">
		<?php if (!$hasAddOns) : ?>
							<span class="material-icons clickable" title="add add ons">add</span>
		<?php endif; ?>
							<span class="material-icons clickable" title="edit the sizes">edit</span>
							<span class="material-icons clickable" title="view the original message">article</span>
							<span class="material-icons clickable" title="print box label">print</span>
							<input type="checkbox" id="<?php echo $checkID?>" name="<?php echo $checkID?>" value="<?php echo $orderID;?>" 
									title="mark order complete" onchange="changeOrderDone(<?php echo $orderID; ?>)" 
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