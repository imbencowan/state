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
				$isDone = $order->getIsDone();
					// $isDone can be 0, 1, or 2: undone, done, or partial
				if ($isDone == 0) {
					$trClass = 'unDoneRow';
				} elseif ($isDone == 1) {
					$trClass = 'doneRow';
				} elseif ($isDone == 2) {
					$trClass = 'partDoneRow';
				}
				$hasAddOns = false;
				$addRowClass = "hidden";
				$orderID = $order->getSchoolOrderID();
				$checkID = "check" . $orderID;
				$schoolName = $order->getSchool()->shortName;
					// dashes are easier to identify in a field of numbers than zeros. replace zeros with dashes
					// style rows based on additions
				if ($order->getAddedTotal() > 0) {
					$hasAddOns = true;
					$addRowClass = "";
				} 
			?>
				<tbody id="row<?php echo $orderID; ?>" class="<?php echo $trClass;?>" 
						data-schoolOrderID="<?php echo $orderID; ?>"
						data-messageOrderText="<?php echo $order->getMessageOrderText(); ?>">
					<tr>
						<td title="<?php echo $order->getMessageFileNames() ?>"><?php echo $schoolName; ?></td>
						<td title="S"><?php echo $order->getTeamDisplaySize('s'); ?></td>
						<td title="M"><?php echo $order->getTeamDisplaySize('m'); ?></td>
						<td title="L"><?php echo $order->getTeamDisplaySize('l'); ?></td>
						<td title="XL"><?php echo $order->getTeamDisplaySize('xl'); ?></td>
						<td title="2X"><?php echo $order->getTeamDisplaySize('xxl'); ?></td>
						<td title="3X"><?php echo $order->getTeamDisplaySize('xxxl'); ?></td>
						<td title="total"><?php echo $order->getTeamDisplayTotal(); ?></td>
							<?php // a cell to hold action buttons ?>
						<td rowspan="2">
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
					<tr class="addOnRow <?php echo $addRowClass; ?>">
						<td>add ons</td>
						<td title="S"><?php echo $order->getAddedS(); ?></td>
						<td title="M"><?php echo $order->getAddedM(); ?></td>
						<td title="L"><?php echo $order->getAddedL(); ?></td>
						<td title="XL"><?php echo $order->getAddedXL(); ?></td>
						<td title="2X"><?php echo $order->getAddedXXL(); ?></td>
						<td title="3X"><?php echo $order->getAddedXXXL(); ?></td>
						<td title="total"><?php echo $order->getAddedTotal(); ?></td>
					</tr>
				</tbody>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>