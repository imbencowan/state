<?php
class Item implements JsonSerializable {
   private $id;
   private $style;
   private $size;
   private $color;
   private $price;
   private $stock;

   public function __construct($id, $style, $size, $color, $price, $stock = 0) {
      $this->id = $id;
      $this->style = $style;
      $this->size = $size;
      $this->color = $color;
      $this->price = $price;
      $this->stock = $stock;
   }

   public function jsonSerialize() {
      return [
         'id' => $this->id,
         'style' => $this->style,
         'size' => $this->size,
         'color' => $this->color,
         'price' => $this->price,
         'stock' => $this->stock
      ];
   }

   public function getId() { return $this->id; }
   public function setId($value) { $this->id = $value; }

   public function getStyle() { return $this->style; }
   public function setStyle($value) { $this->style = $value; }

   public function getSize() { return $this->size; }
   public function setSize($value) { $this->size = $value; }

   public function getColor() { return $this->color; }
   public function setColor($value) { $this->color = $value; }

   public function getPrice() { return $this->price; }
   public function setPrice($value) { $this->price = $value; }

   public function getStock() { return $this->stock; }
   public function setStock($value) { $this->stock = $value; }

   //////////////////////////////////////////////////
   // DB Functions

   static function addItem($style, $size, $color, $price, $stock) {
      $db = Database::getDB();

      $query = 'INSERT INTO InventoryItems (styleID, sizeID, colorID, price, stock) 
                VALUES (:style, :size, :color, :price, :stock)';
      $statement = $db->prepare($query);
      $statement->bindValue(':style', $style);
      $statement->bindValue(':size', $size);
      $statement->bindValue(':color', $color);
      $statement->bindValue(':price', $price);
      $statement->bindValue(':stock', $stock);
      $statement->execute();
      $statement->closeCursor();

      return $db->lastInsertId();
   }

   static function getItemByID($id) {
      $db = Database::getDB();

      $query = 'SELECT * FROM InventoryItems WHERE id = :id';
      $statement = $db->prepare($query);
      $statement->bindValue(':id', $id);
      $statement->execute();
      $row = $statement->fetch(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      if ($row) {
         return new Item($row['itemID'], $row['styleID'], $row['sizeID'], 
                          $row['colorID'], $row['price'], $row['stock']);
      }
      return null;
   }

   static function getAllItems() {
      $db = Database::getDB();

      $query = 'SELECT * FROM InventoryItems';
      $statement = $db->prepare($query);
      $statement->execute();
      $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
      $statement->closeCursor();

      $items = [];
      foreach ($rows as $row) {
         $items[] = new Item($row['itemID'], $row['styleID'], $row['sizeID'], 
                              $row['colorID'], $row['price'], $row['stock']);
      }
      return $items;
   }
}
?>
