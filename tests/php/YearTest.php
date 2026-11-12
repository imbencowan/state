
<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../autoloader.php';
echo "YearTest file loaded\n";

class YearTest extends TestCase
{
   public function testConvertDateToSchoolYear(): void
   {
      $cases = [
         ['2026-01-10', 25],
         ['2026-06-15', 25],
         ['2026-06-16', 26],
         ['2026-12-10', 26],
      ];

      foreach ($cases as [$date, $expected]) {
         $actual = Year::convertDateToSchoolYear(new DateTime($date));

         $this->assertEquals($expected, $actual);
      }
   }
}

?>