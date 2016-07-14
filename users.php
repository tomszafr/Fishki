<?php 

$servername = "localhost:3307";
$dbusername = "root";
$password = "usbw";
$dbname = "fishki";

if (isset($_GET['user'])) {
	$username = $_GET['user'];
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		// prepare sql and bind parameters
		$stmt = $conn->prepare("SELECT * FROM users WHERE username=:username");
		$stmt->bindParam(':username', $username);
	
		$stmt->execute();
		$user = $stmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($user);
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	$conn = null;
} else if (isset($_POST['newUser'])) {
	$username = $_POST['newUser'];
	
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		// prepare sql and bind parameters
		$stmt = $conn->prepare("INSERT INTO users (username) VALUES (:username)");
		$stmt->bindParam(':username', $username);
		$stmt->execute();
		echo "Użytkownik dodany";
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	$conn = null;
} else if (isset($_POST['user']) && isset($_POST['hits'])) {
	$username = $_POST['user'];
	$hits = $_POST['hits'];
	
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		// prepare sql and bind parameters
		$stmt = $conn->prepare("UPDATE users SET hits=hits + :hits WHERE username=:username");
		$stmt->bindParam(':username', $username);
		$stmt->bindParam(':hits', $hits);
		$stmt->execute();
		echo "Statystyki zaktualizowane";
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	$conn = null;
}

?>