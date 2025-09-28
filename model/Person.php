<?php
class Person extends BasicTableModel {
   // define table and primary key
   protected static function getTableName(): string { return 'people'; }
   protected static function getPrimaryKey(): string { return 'personID'; }

   // map object properties to database columns
   protected static function getColumns(): array {
      return [
         'id' => 'personID',
         'name' => 'personName',
         'email' => 'personEmail',
         'phone' => 'personPhone',
         'extension' => 'personPhoneExtension',
         'fax' => 'personFax'
      ];
   }

   // no relations defined
   protected static function getRelations(): array { return []; }

   public function __construct(
      public readonly ?int $id,
      public readonly ?string $name,
      public readonly ?string $email,
      public readonly ?string $phone,
      public readonly ?string $extension,
      public readonly ?string $fax
   ) {}


   ///////////////////////////////////////////////////////////////////////////////////////////////////
   // DB functions
      // getting all activity directors requires a JOIN
   public static function getAllADs() {
         // get the data
      $query = "SELECT people.* FROM people INNER JOIN schools ON schools.activitiesDirectorID = people.personID";
      $rows = self::getFromDB($query);

         // have to turn them in to Persons manually cuz BasicTableModel functions expect aliases
      $columns = self::getColumns();
      $people = [];
      foreach($rows as $row) {
         $mappedRow = [];
         foreach ($columns as $propName => $colName) {
            if (!array_key_exists($colName, $row)) return null;
            $mappedRow[$propName] = $row[$colName];
         }
         $people[] = new self(...$mappedRow);
      }

      return $people;
   }
}
