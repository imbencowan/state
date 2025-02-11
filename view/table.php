<!--
<label>This button shows the selected table from the DB</label>
<select id="selectTable">
	<option value="colors">Colors</option>
	<option value="districts">Districts</option>
	<option value="divisions">Divisions</option>
	<option value="employees">Employees</option>
	<option value="events">Events</option>
	<option value="genders">Genders</option>
	<option value="inventoryItems">Inventory Items</option>
	<option value="messageOrders">Message Orders</option>
	<option value="schoolOrders">School Orders</option>
	<option value="schools">Schools</option>
	<option value="sites">Sites</option>
	<option value="sizes">Sizes</option>
	<option value="sports">Sports</option>
	<option value="styles">Styles</option>
	<option value="vehicles">Vehicles</option>
	<option value="tests">Tests</option>
</select>
<button onclick="showTable()">Show Table</button><h2><?php echo $table; ?></h2>
-->

<?php if ($propertyNames) : ?>
	<table class="defaultTable">
		<thead>
			<tr>
				<?php foreach ($propertyNames as $col) : ?>
					<th><?php echo $col; ?></th>
				<?php endforeach; ?>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($rows as $row) : ?>
				<tr>
					<?php foreach ($propertyNames as $col) : ?>
						<td><?php echo htmlspecialchars($row->$col); ?></td>
					<?php endforeach; ?>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
<?php endif; ?>
<br />
