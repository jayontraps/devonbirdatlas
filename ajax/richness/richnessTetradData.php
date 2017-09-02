<?php
  require '../config.php';

  $dataset = $_POST['dataset'];
  $dataset = stripslashes($dataset);

  $tetrad = $_POST['tetradId'];
  $tetrad = stripslashes($tetrad);

  $range = $_POST['range'];
  $range = stripslashes($range);

  $status = $_POST['status'];
  $status = stripslashes($status);

  if ($range === 'conf') {
    $rangeCondition = " AND `Code`='A'";
  } elseif ($range === 'prob-conf') {
    $rangeCondition = " AND (`Code`='A' OR `Code`='B')";
  } else {
    $rangeCondition = "";
  }

  if ($status === 'red') {
    $statusCondition = " AND `Species` IN (SELECT `species_name` FROM `metaList` WHERE `status` LIKE 'Red%' )";
  } elseif ($status === 'amber') {
    $statusCondition = " AND `Species` IN (SELECT `species_name` FROM `metaList` WHERE `status` LIKE 'Amber%' )";
  } else {
    $statusCondition = "";
  }

  if ($dataset == 'dwdensity') {
    $sqlQuery = "SELECT Species,Code FROM dwdensity WHERE Tetrad =:tetrad";
  } else {
    $sqlQuery = "SELECT Species,Code FROM " . $dataset . " WHERE Tetrad =:tetrad" . $rangeCondition . $statusCondition;
  }

  /*
  example:
  SELECT Species,Code
  FROM dbreed
  WHERE Tetrad ="SX88J"
  AND (`Code`='A' OR `Code`='B')
  AND `Species` IN (SELECT `species_name` FROM `metaList` WHERE `status` LIKE 'Red%')
  */

  try {
    $conn = new PDO('mysql:host=' . $config['DB_HOST'] . ';dbname=devon_data_edit', $config['DB_USERNAME'], $config['DB_PASSWORD']);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare($sqlQuery);

    $stmt->execute(array(
      'tetrad' => $tetrad
    ));

    $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
    print json_encode($results);

  } catch(PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
  }


  die();


?>