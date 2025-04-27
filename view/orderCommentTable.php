<br />
<h2>Comments</h2>
<table>
	<thead>
		<tr>
			<th>School</th>
			<th>Division</th>
			<th>Comment</th>
			<th>Handled</th>
		</tr>
	</thead>
	<tbody>
<?php foreach ($commentOrders as $order) : ?>
		<tr>
			<td><?= $order->school; ?></td>
			<td><?= $order->division; ?></td>
			<td><?= $order->comment; ?></td>
			<td><input type="checkbox" /></td>
		</tr>
<?php endforeach; ?>
	</tbody>
</table>