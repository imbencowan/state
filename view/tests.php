<label>This button simply logs that it was clicked in the `tests` table of the DB.</label>
<button onclick="testFetch()">Test DB</button>
<br />
<label>This button generates a PDF</label>
<button onclick="testPDF()">Test Box Label</button>
<br />
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
<button onclick="showTable()">Show Table</button>