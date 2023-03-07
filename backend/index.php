<?php

require_once('config.php');

if (isset($_POST['get_indoor_locations'])) {
    $connection = get_connection();

    $query = "SELECT indoor_locations.*, joined_floors_buildings.buildingID, joined_floors_buildings.buildingName FROM indoor_locations 
    JOIN (SELECT floors.floorID, buildings.buildingID, buildings.buildingName  
          FROM floors 
          JOIN buildings ON floors.buildingID = buildings.buildingID) as joined_floors_buildings 
    ON indoor_locations.floorId = joined_floors_buildings.floorID;
    ";

    $result = mysqli_query($connection, $query);
    $indoor_locations = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $indoor_locations[] = $row;
    }

    echo json_encode($indoor_locations);
}

?>