<?php
class Year implements JsonSerializable {
		// we're defaulting to the state year running from june 16 to june 15.
			// this way when we look at the current year in late may and early june, we will be looking at
				// the past events that just finished.
			// when we look at the current year after mid june, we will be looking at the upcoming year.
	private $defaultMonth = 6;
	private $defaultStartDay = 16;
	private $defaultEndDay = 15;
		// $year represents the school year. 23 would represent the 23-24 school year. 
			// an integer representation of a date range
	private int $year;
	private $startDate;
	private $endDate;
	public $events; // Initialized as an empty array

		// both parameters can be null. this allows calling the function with either or neither.
			// if both are used, $year will be prioritized. if neither, the current date will be used
	public function __construct(?int $year = null, DateTime $date = null) {
			// if no $year was given, we'll use the date
		if (is_null($year)) {
				// if no date was given use now
			if (is_null($date)) $date = new DateTime();
			$year = $date->format('y');
				// if the $date is in the first 'half' of the year, -1 from the '$year'.
			if ($date->format('m') < $this->defaultMonth || 
					($date->format('m') == $this->defaultMonth && $date->format('d') <= $this->defaultEndDay)) {
				$year -= 1;
			}
		}
			// now we can set every thing with a correct $year
		$this->year = $year;
			// the endDate will be in the following year
		$endYear = $year + 1;
		$this->startDate = new DateTime("$year-$this->defaultMonth-$this->defaultStartDay");
		$this->endDate = new DateTime("$endYear-$this->defaultMonth-$this->defaultEndDay");
		$this->events = []; // Initialize as an empty array
		// $this->events = $this->getEventsForYear($year);
			// "year" context stops JOINing of the schoolorders table via the Relation class
				// this prevents the db call returning an unnecessarily huge result
		$this->events = Event::getAllFromDB(context: "year");
			// sort the events by date
		usort($this->events, function($a, $b) { return $a->startDate <=> $b->startDate; });
   }

   public function jsonSerialize() {
      return [
         'year' => $this->year,
         'startDate' => $this->startDate->format('Y-m-d'),
         'endDate' => $this->endDate->format('Y-m-d'),
         'events' => $this->events
      ];
   }
	

		// Getters and setters
	public function getYear() { return $this->year; }
	public function setYear($value) { $this->year = $value; }

	public function getStartDate() { return $this->startDate; }
	public function setStartDate($value) { $this->startDate = new DateTime($value); }

	public function getEndDate() { return $this->endDate; }
	public function setEndDate($value) { $this->endDate = new DateTime($value); }

	public function getEvents() { return $this->events; }
	// public function setEvent($value) { $this->events = $value; }
	public function pushEvent($value) { $this->events[$value->getEventID()] = $value; }
	
	static function convertDateToSchoolYear(DateTime $date) {
		$defaultMonth = 6;
		$defaultStartDay = 16;
		$defaultEndDay = 15;
		
		$year = $date->format('y');
			// if the $date is in the first 'half' of the year, -1 from the '$year'.
		if ($date->format('m') < $defaultMonth || 
				($date->format('m') == $defaultMonth && $date->format('d') <= $defaultEndDay)) {
			$year -= 1;
		}
		return $year;
	}

			

	
	//////////////////////////////////////////////////
   // user actions
		// takes us to the Year page, displaying all events for a given year
	static function showYear($input) {
			// we already have a variable called $year
		// $yearsEvents = new Year(null, new DateTime());
			// test on the previous year
		$yearsEvents = new Year(24, new DateTime());
		ob_start();
		include 'view/year.php';
		$htmlContent = ob_get_clean(); // Get the buffered content as a string
		
		return [ 'html' => $htmlContent, 'data' => [ 'year' => $yearsEvents ] ];
	}
}