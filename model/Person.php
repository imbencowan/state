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
}
