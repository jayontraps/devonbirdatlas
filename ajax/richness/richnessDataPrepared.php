<?php
  require '../config.php';

  $dataset = $_POST['dataset'];
  $dataset = stripslashes($dataset);

  $range = $_POST['range'];
  $range = stripslashes($range);

  $status = $_POST['status'];
  $status = stripslashes($status);

  $table = $dataset . '-' . $status . '-' . $range;
  $table = stripslashes($table);

  /*
  table names:
  dbreed-amber-prob-conf
  dbreed-red-prob-conf
  sitters-amber-prob-conf
  sitters-red-prob-conf
  */

  try {
    $conn = new PDO('mysql:host=' . $config['DB_HOST'] . ';dbname=devon_data', $config['DB_USERNAME'], $config['DB_PASSWORD']);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('SELECT Tetrad,CountOf FROM `' . $table . '`');

    $stmt->execute();

    $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
    print json_encode($results);

  } catch(PDOException $e) {
  echo 'ERROR: ' . $e->getMessage();
  }


  die();


?>