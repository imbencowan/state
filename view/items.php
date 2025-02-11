<h2>Items</h2><table id="itemsTable" class = "eventsTable">
	<thead>
		<tr>
			<th>Style</th>
			<th></th>
			<th>Size</th>
			<th>Color</th>
			<th>Price</th>
			<th>Stock</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($gItems as $key => $gStyle) : 
			$rowspan = count($gStyle);
			$i = 0;
		?>
			<tr id="row<?= $key; ?>" class="">
				<td rowspan="<?= $rowspan; ?>"><?= $key; ?></td>
				<?php foreach ($gStyle as $item) : 
					++$i;
				?>
				<td><?= $item->id ?></td>
				<td><?= $item->size->charName; ?></td>
				<td><?= $item->color->name; ?></td>
				<td><?= $item->price; ?></td>
				<td><?= $item->stock; ?></td>
					<?php if ($i < $rowspan) : ?>
						</tr><tr class="">
					<?php endif; ?>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
