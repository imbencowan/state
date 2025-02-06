<?php
class SizeList implements JsonSerializable {
	private ?int $s, $m, $l, $xl, $xxl, $xxxl;

	public function __construct($s = 0, $m = 0, $l = 0, $xl = 0, $xxl = 0, $xxxl = 0) {
		$this->s = $s;
		$this->m = $m;
		$this->l = $l;
		$this->xl = $xl;
		$this->xxl = $xxl;
		$this->xxxl = $xxxl;
	}

	public function jsonSerialize() {
		return [
			's' => $this->s,
			'm' => $this->m,
			'l' => $this->l,
			'xl' => $this->xl,
			'xxl' => $this->xxl,
			'xxxl' => $this->xxxl
		];
	}

		// general getter and setter.
	public function getSize(string $size): ?int { return $this->$size ?? null; }
	public function setSize(string $size, $value): void {
		if (property_exists($this, $size)) {
			$this->$size = $value;
		}
	}
		// and a display getter that returns dashes in place of zeros
	public function getDisplaySize(string $size): ?int {
		return ($this->$size == 0) ? '-' : $this->size;
	}
		// return the total
	public function getTotal() { 
		return $this->s + $this->m + $this->l + $this->xl + $this->xxl + $this->xxxl; 
	}
	
	public function getSizesArray() {
		return [$this->s, $this->m, $this->l, $this->xl, $this->xxl, $this->xxxl]; 
	}
	
	
	
	
		// Function to compute the size differences
	public static function calculateSizeListDifference(SizeList $list1, SizeList $list2) {
		$result = new SizeList();
		foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
			$difference = $list1->getSize($size) - $list2->getSize($size);
			$result->setSize($size, $difference);
		}
		return $result;
	}
	
	public static function combineSizeLists(SizeList $list1, SizeList $list2) {
		$result = new SizeList();
		foreach (['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as $size) {
			$result->setSize($size, $list1->getSize($size) + $list2->getSize($size));
		}
		return $result;
	}
}
?>
