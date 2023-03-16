<?php

require_once('config.php');

if (isset($_POST['get_list_of_indoor_locations_by_building_id'])) {
    $connection = get_connection();
    $building_id = intval($_POST['building_id']);

    $query = "SELECT indoor_locations.*, joined_floors_buildings.buildingID, joined_floors_buildings.gridRowLength, joined_floors_buildings.gridColumnLength  FROM indoor_locations 
                JOIN (SELECT floors.floorID, buildings.buildingID, buildings.buildingName, floors.gridRowLength, floors.gridColumnLength
                FROM floors 
                JOIN buildings ON floors.buildingID = buildings.buildingID WHERE buildings.buildingID = ?) as joined_floors_buildings 
                ON indoor_locations.floorId = joined_floors_buildings.floorID;
            ";
    $statement = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($statement, 'i', $building_id);
    mysqli_stmt_execute($statement);

    $result = mysqli_stmt_get_result($statement);

    $list_of_indoor_locations = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $list_of_indoor_locations[] = $row;
    }

    echo json_encode($list_of_indoor_locations);

} else if (isset($_POST['get_list_of_buildings'])) {
    $connection = get_connection();

    $query = "SELECT * from buildings;";
    $result = mysqli_query($connection, $query);

    $list_of_buildings = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $list_of_buildings[] = $row;
    }

    echo json_encode($list_of_buildings);
} else if (isset($_POST['get_walls_by_floor_id'])) {
    $connection = get_connection();

    $floor_id_for_walls = intval($_POST['floor_id_for_walls']);
    $query = "SELECT * FROM walls WHERE floorID = ?";

    $statement = mysqli_prepare($connection, $query);

    mysqli_stmt_bind_param($statement, 'i', $floor_id_for_walls);
    mysqli_stmt_execute($statement);

    $list_of_walls = array();
    $result = mysqli_stmt_get_result($statement);
    while ($row = mysqli_fetch_assoc($result)) {
        $list_of_walls[] = $row;
    }

    echo json_encode($list_of_walls);
} else if (isset($_POST['get_markers_by_floor_id'])) {
    $connection = get_connection();

    $floor_id_for_markers = intval($_POST['floor_id_for_markers']);
    $query = "SELECT * FROM markers WHERE floorID = ?";

    $statement = mysqli_prepare($connection, $query);

    mysqli_stmt_bind_param($statement, 'i', $floor_id_for_markers);
    mysqli_stmt_execute($statement);

    $list_of_markers = array();
    $result = mysqli_stmt_get_result($statement);
    while ($row = mysqli_fetch_assoc($result)) {
        $list_of_markers[] = $row;
    }

    echo json_encode($list_of_markers);
}


?>