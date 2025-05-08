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
	$completeness = $order->completeness;
		// $completeness can be 0, 1, or 2: undone, done, or partial
	if ($completeness == 0) {
		$trClass = 'unDoneRow';
	} elseif ($completeness == 1) {
		$trClass = 'doneRow';
	} elseif ($completeness == 2) {
		$trClass = 'partDoneRow';
	}
	$hasAddOns = false;
	$orderID = $order->id;
	$checkID = "check" . $orderID;
	$schoolName = $order->school->shortName;
		// the if shouldn't be necessary
	$teamShirts = !empty($order->shirts['Dairy Hoods'] ?? null) ? $order->shirts['Dairy Hoods']->getSizes() : null;
?>
				<tbody id="row<?= $orderID; ?>" class="<?= $trClass;?>" data-school-order-id="<?= $orderID; ?>">
					<tr data-style-id="<?= $order->shirts['Dairy Hoods']->id; ?>">
						<td title="<?= $orderID . ' / ' . $order->getMessageFileNames(); ?>"><?= $schoolName; ?></td>
						<td title="S"><?= isset($teamShirts['S']) ? $teamShirts['S']->getQuantity() : '-'; ?></td>
						<td title="M"><?= isset($teamShirts['M']) ? $teamShirts['M']->getQuantity() : '-'; ?></td>
						<td title="L"><?= isset($teamShirts['L']) ? $teamShirts['L']->getQuantity() : '-'; ?></td>
						<td title="XL"><?= isset($teamShirts['XL']) ? $teamShirts['XL']->getQuantity() : '-'; ?></td>
						<td title="2XL"><?= isset($teamShirts['2XL']) ? $teamShirts['2XL']->getQuantity() : '-'; ?></td>
						<td title="3XL"><?= isset($teamShirts['3XL']) ? $teamShirts['3XL']->getQuantity() : '-'; ?></td>
						<td title="total"><?= $order->getStyleTotal('Dairy Hoods'); ?></td>
							<?php // a cell to hold action buttons ?>

						<td>
							<span class="material-icons clickable order-action addAddOns" title="add add ons">add</span>
							<span class="material-icons clickable order-action editSizes" title="edit the sizes">edit</span>
							<span class="material-icons clickable order-action showMessage" title="view the original message">article</span>
							<span class="material-icons clickable order-action printLabel" title="print box label">print</span>
							<span class="material-icons clickable order-action dlInvoice" title="download invoice">request_quote</span>
							<input type="checkbox" id="<?= $checkID; ?>" name="<?= $checkID; ?>" value="<?= $orderID; ?>" 
									title="mark order complete" <?php if ($completeness == 1) echo "checked"; ?>/>
						</td>
					</tr>
		<?php if (!empty($order->shirts)) : 
			foreach ($order->getAddedShirts() as $addedStyle) :
				$aStyle = $addedStyle->getSizes();
		?>
					<tr class="addOnRow" data-style-id="<?= $addedStyle->id; ?>">
						<td>+ <?= $addedStyle->shortName; ?></td>
						<td title="S"><?= isset($aStyle['S']) ? $aStyle['S']->getQuantity() : ''; ?></td>
						<td title="M"><?= isset($aStyle['M']) ? $aStyle['M']->getQuantity() : ''; ?></td>
						<td title="L"><?= isset($aStyle['L']) ? $aStyle['L']->getQuantity() : ''; ?></td>
						<td title="XL"><?= isset($aStyle['XL']) ? $aStyle['XL']->getQuantity() : ''; ?></td>
						<td title="2XL"><?= isset($aStyle['2XL']) ? $aStyle['2XL']->getQuantity() : ''; ?></td>
						<td title="3XL"><?= isset($aStyle['3XL']) ? $aStyle['3XL']->getQuantity() : ''; ?></td>
						<td title="total"><?= $order->getStyleTotal($addedStyle->shortName); ?></td>
						<td></td><?php // empty table place holder ?>
					</tr>
			<?php endforeach; ?>
		<?php endif; ?>
				</tbody>
	<?php endforeach; ?>
		</tbody>
	</table>
</div>