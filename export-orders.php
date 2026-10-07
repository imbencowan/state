<?php
require 'autoloader.php';
// normal application includes here

$rows = Database::getFromDB("
   SELECT messageOrderID, orderText
   FROM messageorders
   WHERE orderText IS NOT NULL
");

foreach ($rows as $row) {
   file_put_contents(
      __DIR__ . '/exported-orders/order_' . $row['messageOrderID'] . '.txt',
      $row['orderText']
   );
}

echo count($rows) . ' files exported.';
?>