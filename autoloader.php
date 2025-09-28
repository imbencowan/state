<?php 
	spl_autoload_register(function ($class) {
		$directories = ['model', 'controllers', 'view'];

		foreach ($directories as $dir) {
			$file = __DIR__ . "/$dir/$class.php";
			// Test::logX($file);
			if (file_exists($file)) {
				require_once $file;
				return;
			}
		}

		throw new Exception("Class $class not found.");
	});
?>