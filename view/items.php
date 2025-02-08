<h2>Items</h2><table id="eventsTable" class = "eventsTable">
	<thead>
		<tr>
			<th>Style</th>
			<th>Size</th>
			<th>Price</th>
			<th>Stock</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($items as $item) : 
			$styleName = $item->getItemID();
			$sizes = [1];
			$rowspan = count($sizes);
			$rowClass = '';
			$i = 0;
		?>
			<tr id="row<?php echo $item->getItemID(); ?>" class="<?php echo $rowClass; ?>">
				<td rowspan="<?php echo $rowspan; ?>"><h2><?php echo $styleName; ?></h2><?php echo $styleName; ?></td>
				<?php foreach ($sizes as $size) :
					
					++$i;
				?>
					<td><?php echo ''; ?></td>
					<td><?php echo $styleName; ?></td>
					<td><?php echo $styleName; ?></td>
					<?php if ($i < $rowspan) : ?>
						</tr>
						<tr class="<?php echo $rowClass; ?>">
					<?php endif; ?>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
