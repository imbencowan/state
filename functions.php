<?php
   // functions.php
function dataAttr(mixed $value): string {
      // Encode value as JSON
   $json = json_encode($value);
      // Escape quotes and special chars for HTML attributes
   return htmlspecialchars($json, ENT_QUOTES, 'UTF-8');
}
?>