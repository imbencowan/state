<br />
<h2>Comments</h2>
<table id="commentsTable">
	<thead>
		<tr>
			<th>School</th>
			<th>Division</th>
			<th>Comment</th>
			<th>Handled</th>
		</tr>
	</thead>
	<tbody>
<?php foreach ($unhandled as $order) : ?>
		<tr>
			<td title="<?= $order->id; ?>"><?= $order->school; ?></td>
			<td><?= $order->division; ?></td>
			<td><?= $order->comment; ?></td>
			<td><input data-order-id="<?= $order->id; ?>" type="checkbox" /></td>
		</tr>
<?php endforeach; ?>
	</tbody>
</table>