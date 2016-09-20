<?php
  require '../config.php';

  $dataset = $_POST['dataset'];
  $dataset = stripslashes($dataset);

  $range = $_POST['range'];
  $range = stripslashes($range);

  $status = $_POST['status'];
  $status = stripslashes($status);

  if ($range === 'conf') {
    $rangeCondition = " WHERE `Code`='A' ";
  } elseif ($range === 'prob-conf') {
    $rangeCondition = " WHERE `Code`='A' OR `Code`='B' ";
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
    $sqlQuery = "SELECT distinct Tetrad, count(`Species`) as CountOf from " . $dataset . " group by `Tetrad`";
  } else {
    $sqlQuery =  "SELECT distinct Tetrad, count(`Species`) as CountOf from " . $dataset . $rangeCondition . $statusCondition . " group by `Tetrad`";
  }

  /*
  example:
  SELECT distinct Tetrad,
  count(`Species`) as CountOf from dbreed
  WHERE `Code`='A' OR `Code`='B'
  AND `Species` IN (SELECT `species_name` FROM `metaList` WHERE `status` LIKE 'Red%')
  group by `Tetrad`

  NOTE:
  The inner select used for conservation status running too slow so branch of to richnessDataPrepared
  */

  try {
    $conn = new PDO('mysql:host=localhost;dbname=devon_data', $config['DB_USERNAME'], $config['DB_PASSWORD']);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare($sqlQuery);

    $stmt->execute();

    $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
    print json_encode($results);

  } catch(PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
  }


  die();


?>