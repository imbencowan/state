<?php 
	if (!empty($input['year'])) {
		$year = $input['year'];
	} else {
		$year = date("y");
		$month = date("m");
		$day = date("d");
		if ($month < 6 || ($month == 6 && $day <= 15)) {
			$year -= 1;
		}
	}
?>

<div id="yearDiv">
	<label>Showing Year: </label>
	<select id="selectYear">
		<option value=23 <?php if ($year ==23) echo'selected'?>>23-24</option>
		<option value=24 <?php if ($year ==24) echo'selected'?>>24-25</option>
	</select>
</div>

<div class="clear"></div>