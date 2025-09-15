<?php
if ($sportID !== null && $year !== null) {
   $sportName = Sport::getByID($sportID)->name ?? 'Unknown Sport';
   $nextYear = $year + 1;
   $msg = "There is currently no information for {$sportName} for the 20{$year}-20{$nextYear} school year.";
} else {
   $msg = "No event information found. No parameters received.";
}
?>
<div>
   <p><?= $msg ?></p>
</div>
