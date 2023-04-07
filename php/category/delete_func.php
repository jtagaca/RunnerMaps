<?php
session_start();
require_once("../config/config.php");

function fetchFloorPlans() {
    $db = get_connection();
    $command = $db->prepare("SELECT floorID, floorNumber, buildingName FROM floors NATURAL JOIN buildings ORDER BY buildingName, floorID;");

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $floorPlans = [];
    while ($row = $fetchedResult->fetch_assoc()) {
        $floorID = $row["floorID"];
        $buildingName = $row["buildingName"];
        $floorNumber = $row["floorNumber"];
        // $floorPlans[$buildingName] []= $floorID;
        $floorPlans []= array(
            "floorID" => $floorID,
            "buildingName" => $buildingName, 
            "floorNumber" => $floorNumber
        );
    }
    
    return $floorPlans;
}


function fetchIndoorLocationsByFloorID($floorID) {
    // echo $floorID;

    $db = get_connection();
    $command = $db->prepare("SELECT locationID, buildingName, floorNumber, i.name, services FROM indoor_locations as i NATURAL JOIN floors NATURAL JOIN buildings NATURAL JOIN categories WHERE floorID = ? ORDER BY buildingName, floorID, i.name;");
    $command->bind_param('i', $floorID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $locations = [];
    while ($row = $fetchedResult->fetch_assoc()) {
        // print_r($row);
        $locationID = $row["locationID"];
        $buildingName = $row["buildingName"];
        $floorNumber = $row["floorNumber"];
        $locationName = $row["name"];
        $categoryName = $row["services"];

        // $floorPlans[$buildingName] []= $floorID;
        $locations []= array(
            "locationID" => $locationID,
            "buildingName" => $buildingName, 
            "floorNumber" => $floorNumber,
            "locationName" => $locationName,
            "categoryName" => $categoryName
        );
    }
    
    return $locations;
}

function printIndoorLocations($location) {
    // print_r($location);
    
    $locationID = htmlspecialchars($location["locationID"]);
    // $buildingName = htmlspecialchars($location["buildingName"]);
    // $floorNumber = htmlspecialchars($location["floorNumber"]);
    $locationName = htmlspecialchars($location["locationName"]);
    $categoryName = htmlspecialchars($location["categoryName"]);
    
    $locationName = ucwords($locationName);
    $categoryName = ucwords($categoryName);

    $deleteButton = 
    "
    <form class=deleteForms action=\"delete_ops.php\" method=\"POST\"> 
    <input type=\"hidden\" name=\"locationID\" value=\"$locationID\">
    <input class=deleteButtons type=\"submit\" name=\"deleteLocation\" value=\"Delete\">
    </form>
    ";

    echo "<tr>";
    echo "<td>$locationName</td>";
    echo "<td>$categoryName</td>";
    echo "<td>$deleteButton</td>";
    echo "</tr>";
}

// insert into buildings (`buildingID`, `buildingName`) VALUES ("4", "test");
// insert into floors VALUES (4, 4, 4, 4, 4);



function deleteIndoorLocations($locationID) {
    $db = get_connection();
    $command = $db->prepare("DELETE FROM indoor_locations WHERE locationID = ?;");
    $command->bind_param('i', $locationID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    
    return;
}

?>