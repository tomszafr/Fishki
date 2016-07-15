<?php 
include 'protected/db.php';

if($_SERVER['REQUEST_METHOD'] == 'PUT') {
	parse_str(file_get_contents("php://input"),$_PUT);
};

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
} else if (isset($_POST['user'])) {
	$username = $_POST['user'];
	
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		// prepare sql and bind parameters
		$stmt = $conn->prepare("INSERT INTO users (username) VALUES (:username)");
		$stmt->bindParam(':username', $username);
		$stmt->execute();
		$getInfo = $conn->prepare("SELECT * FROM users WHERE username=:username");
		$getInfo->bindParam(':username', $username);
		$getInfo->execute();
		$user = $getInfo->fetch(PDO::FETCH_ASSOC);
		echo json_encode($user);
		exit;
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	$conn = null;
} else if (isset($_PUT['user']) && isset($_PUT['hits']) && isset($_PUT['misses'])) {
	$username = $_PUT['user'];
	$hits = $_PUT['hits'];
	$misses = $_PUT['misses'];
	
	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		// prepare sql and bind parameters
		$stmt = $conn->prepare("UPDATE users SET hits=hits + :hits, misses=misses + :misses WHERE username=:username");
		$stmt->bindParam(':username', $username);
		$stmt->bindParam(':hits', $hits);
		$stmt->bindParam(':misses', $misses);
		$stmt->execute();
		$getInfo = $conn->prepare("SELECT * FROM users WHERE username=:username");
		$getInfo->bindParam(':username', $username);
		$getInfo->execute();
		$user = $getInfo->fetch(PDO::FETCH_ASSOC);
		echo json_encode($user);
	}
	catch(PDOException $e)
	{
		echo "Error: " . $e->getMessage();
	}
	$conn = null;
} else {
	echo "Niepoprawne dane";
}

?>