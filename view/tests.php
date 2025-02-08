<label>This button simply logs that it was clicked in the `tests` table of the DB.</label>
<button onclick="testFetch()">Test DB</button>
<br />
<label>This button generates a PDF</label>
<button onclick="testPDF()">Test Box Label</button>
<br />

<label>Select a Table to interact with in the DB: </label>
<select id="selectTable" onchange="changeSelectedTable(this)">
	<option value="Colors">Colors</option>
	<option value="Districts">Districts</option>
	<option value="Divisions">Divisions</option>
	<option value="Employees">Employees</option>
	<option value="Events">Events</option>
	<option value="Genders">Genders</option>
	<option value="InventoryItems">Inventory Items</option>
	<option value="MessageOrders">Message Orders</option>
	<option value="SchoolOrders">School Orders</option>
	<option value="Schools">Schools</option>
	<option value="Sites">Sites</option>
	<option value="Sizes">Sizes</option>
	<option value="Sports">Sports</option>
	<option value="Styles">Styles</option>
	<option value="Vehicles">Vehicles</option>
	<option value="Tests">Tests</option>
</select>
<br />

<button onclick="showTable()">Show Table</button>
<br />
<button onclick="getAnItem()">Get An Item</button>
<select id="getByNameSelect">
	<?php foreach ($colors as $color) : ?>
		<option value="<?= $color->id ?>"><?= $color->name ?></option>;
	<?php endforeach; ?>
</select>
<br />
<button onclick="getAllItems()">Get All Items</button>
<br />
<button onclick="addAnItem()">Add An Item</button>
<label>Name: </label>
<input id="nameInput" type="text">
<br />
<button onclick="deleteAnItem()">Delete An Item</button>
<select id="deleteByNameSelect">
	<?php foreach ($colors as $color) : ?>
		<option value="<?= $color->id ?>"><?= $color->name ?></option>;
	<?php endforeach; ?>
</select>
<br />
<br />