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

function printFloorPlan($floorPlan) {
    
    $floorID = htmlspecialchars($floorPlan["floorID"]);
    $buildingName = htmlspecialchars($floorPlan["buildingName"]);
    $floorNumber = htmlspecialchars($floorPlan["floorNumber"]);

    $deleteButton = 
    "
    <form class=deleteForms action=\"delete_ops.php\" method=\"POST\"> 
    <input type=\"hidden\" name=\"floorID\" value=\"$floorID\">
    <input class=deleteButtons type=\"submit\" name=\"deleteFloorPlan\" value=\"Delete\">
    </form>
    ";



    echo "<tr>";
    echo "<td>$buildingName</td>";
    echo "<td>$floorNumber</td>";
    echo "<td>$deleteButton</td>";
    echo "</tr>";
}

// insert into buildings (`buildingID`, `buildingName`) VALUES ("4", "test");
// insert into floors VALUES (4, 4, 4, 4, 4);



function deleteFloorPlan($floorID) {
    $db = get_connection();
    $command = $db->prepare("DELETE FROM floors WHERE floorID = ?;");
    $command->bind_param('i', $floorID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    
    return;
}

?>