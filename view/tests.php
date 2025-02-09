<label>This button simply logs that it was clicked in the `tests` table of the DB.</label>
<button onclick="testFetch()">Test DB</button>
<br />
<label>This button generates a PDF</label>
<button onclick="testPDF()">Test Box Label</button>
<br />

<?php 
	$db = Database::getDB();
	$query = "SHOW TABLES";
	$statement = $db->query($query);
	$tables = $statement->fetchAll(PDO::FETCH_COLUMN);
	$tables = array_filter($tables, fn($str) => strpos($str, 'has') === false);
?>

<label>Select a Table to interact with in the DB: </label>
<select id="selectTable" onchange="changeSelectedTable(this)">
	<?php foreach ($tables as $table) : ?>
		<option value="<?= $table ?>" <?php if ($table == 'colors') echo 'selected'; ?>><?= $table ?></option>
	<?php endforeach; ?>
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