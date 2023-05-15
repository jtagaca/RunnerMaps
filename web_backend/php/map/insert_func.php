<?php
session_start();
require_once("../config/config.php");


function doesBuildingAlreadyExist($buildingName) {
    $db = get_connection();
    $command = $db->prepare("SELECT buildingID FROM `buildings` 
                                                    WHERE buildingName = ?");
    $command->bind_param('s', $buildingName);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    if ($row = $fetchedResult->fetch_assoc()) {
        return true;
    }
    else {
        return false;
    }

}


function doesFloorAlreadyExist($buildingName, $floorNumber) {

    $buildingID = getBuildingID($buildingName);

    $db = get_connection();
    $command = $db->prepare("SELECT floorID FROM `floors` WHERE buildingID = ? 
                                                        AND floorNumber = ?");
    $command->bind_param('ii', $buildingID, $floorNumber);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    if ($row = $fetchedResult->fetch_assoc()) {
        return true;
    }
    else {
        return false;
    }
}


function getBuildingID($buildingName) {
    $db = get_connection();
    $command = $db->prepare("SELECT buildingID FROM `buildings` 
                                                WHERE buildingName = ?");
    $command->bind_param('s', $buildingName);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    if ($row = $fetchedResult->fetch_assoc()) {
        return $row["buildingID"];
    }
}


function getFloorID($buildingName, $floorNumber) {

    $buildingID = getBuildingID($buildingName);

    $db = get_connection();
    $command = $db->prepare("SELECT floorID FROM `floors` WHERE buildingID = ? 
                                                        AND floorNumber = ?");
    $command->bind_param('ii', $buildingID, $floorNumber);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    while ($row = $fetchedResult->fetch_assoc()) {
       return $row["floorID"];
    }
}


function insertIntoBuildings($buildingName, $mapURL, $geoLocation) {
    $db = get_connection();

    $command = $db->prepare("INSERT INTO buildings 
                (`buildingName`, `mapURL`, `geolocation`) VALUES (?, ?, ?)");

    $command->bind_param('sss', $buildingName, $mapURL, $geoLocation);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] = "Successfully inserted building: " .
                                                        "$buildingName <br>";
    }
}


function insertIntoFloors($buildingName, $floorNumber, $gridColumnLength, 
                                                            $gridRowLength) {
    
    $returnedBuildingID = getBuildingID($buildingName, $floorNumber);

    $db = get_connection();
    $command = $db->prepare("INSERT INTO floors 
            (`buildingID`, `floorNumber`, `gridColumnLength`, `gridRowLength`) 
                                                        VALUES (?, ?, ?, ?)");
    $command->bind_param('iiss', $returnedBuildingID, $floorNumber, 
                                            $gridColumnLength, $gridRowLength);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] .= "Successfully inserted floor " . 
                        "number $floorNumber for building $buildingName <br>";
    }
}


function insertIntoIndoorLocations($floorID, $row, $col, $image, 
                                $latitude, $longitude, $name, $description) {
    
    $db = get_connection();
    $command = $db->prepare("INSERT INTO indoor_locations 
            (`floorID`, `row`, `col`, `image`, `latitude`, `longitude`, 
                    `name`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $command->bind_param('isssddss', $floorID, $row, $col, $image, $latitude, 
                                            $longitude, $name, $description);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] .= "Successfully inserted indoor " . 
                                                        "location: $name <br>";
    }
}


function insertIntoMarkers($floorID, $row, $col, $image, $latitude, 
                                                                $longitude) {
    
    $db = get_connection();
    $command = $db->prepare("INSERT INTO markers (`floorID`, `row`, `col`, 
                `image`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?)");
    $command->bind_param('isssdd', $floorID, $row, $col, $image, 
                                                        $latitude, $longitude);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] .= "Successfully inserted markers " . 
                                                        "at: $row, $col <br>";
    }
}


function insertIntoWalls($floorID, $row, $col) {
    
    $db = get_connection();
    $command = $db->prepare("INSERT INTO walls (`floorID`, `row`, `col`) 
                                                            VALUES (?, ?, ?)");
    $command->bind_param('iss', $floorID, $row, $col);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] .= "Successfully inserted walls " . 
                                                        "at: $row, $col <br>";
    }
}

?>

