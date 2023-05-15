<?php
session_start();
require_once("../config/config.php");
require_once("../auth/validation_functions.php");

// returns list of floor plans
function fetchFloorPlans() {
    $db = get_connection();
    $string = "SELECT floorID, floorNumber, buildingName FROM floors " .
                    "NATURAL JOIN buildings ORDER BY buildingName, floorID;";
    $command = $db->prepare($string);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $floorPlans = [];
    while ($row = $fetchedResult->fetch_assoc()) {
        $floorID = $row["floorID"];
        $buildingName = $row["buildingName"];
        $floorNumber = $row["floorNumber"];

        $floorPlans []= array(
            "floorID" => $floorID,
            "buildingName" => $buildingName, 
            "floorNumber" => $floorNumber
        );
    }
    
    return $floorPlans;
}

// returns a list of indoor locations belonging to the floor
function fetchIndoorLocationsByFloorID($floorID) {
    $db = get_connection();
    $command = $db->prepare(
        "SELECT locationID, buildingName, floorNumber, i.name, services
        FROM indoor_locations as i NATURAL JOIN floors 
        NATURAL JOIN buildings LEFT JOIN categories 
        on categories.categoryID = i.categoryID
        WHERE floorID = ? ORDER BY buildingName, floorID, i.name;
    ");
    $command->bind_param('i', $floorID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $locations = [];
    while ($row = $fetchedResult->fetch_assoc()) {
        $locationID = $row["locationID"];
        $buildingName = $row["buildingName"];
        $floorNumber = $row["floorNumber"];
        $locationName = $row["name"];
        $categoryName = $row["services"];

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

// generates the table by floor
function printIndoorLocations($location) {
    
    $locationID = htmlspecialchars($location["locationID"]);
    $locationName = htmlspecialchars($location["locationName"]);
    $categoryName = htmlspecialchars($location["categoryName"]);
    
    $locationName = ucwords($locationName);
    $categoryName = ucwords($categoryName);

    $deleteButton = 
    "
    <form class=deleteForms action=\"delete_ops.php\" method=\"POST\"> 
    <input type=\"hidden\" name=\"locationID\" value=\"$locationID\">
    <input class=deleteButtons type=\"submit\" name=\"deleteLocation\" 
    value=\"Delete\">
    </form>
    ";

    echo "<tr>";
    echo "<td>$locationID</td>";
    echo "<td>$locationName</td>";
    echo "<td>$categoryName</td>";
    echo "<td>$deleteButton</td>";
    echo "</tr>";
}


function deleteIndoorLocations($locationID) {
    $db = get_connection();
    $command = $db->prepare("DELETE FROM indoor_locations 
                                                WHERE locationID = ?;");
    $command->bind_param('i', $locationID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    
    return;
}

?>