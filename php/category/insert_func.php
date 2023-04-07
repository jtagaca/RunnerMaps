<?php
session_start();
require_once("../config/config.php");
require_once("../auth/validation_functions.php");


function doesCategoryAlreadyExist($categoryName) {

    $categoryName = strtolower(htmlspecialchars($categoryName));

    $db = get_connection();
    $command = $db->prepare("SELECT count(*) FROM `categories` WHERE services = ?");
    $command->bind_param('s', $categoryName);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();
    
    if ($row = $fetchedResult->fetch_assoc()) {
        $count = $row["count(*)"];
        if ($count > 0) {
            return true;
        }
    }

    return false;
}

function insertIntoCategories($categoryName) {

    $categoryName = strtolower(htmlspecialchars($categoryName));

    $db = get_connection();

    $command = $db->prepare("INSERT INTO categories (`services`) VALUES (?)");

    $command->bind_param('s', $categoryName);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] = "Successfully inserted category: $categoryName <br>";
    }
}


function fetchAllCategories() {
    $db = get_connection();
    $command = $db->prepare("SELECT * FROM categories;");

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $categories = [];
    while ($row = $fetchedResult->fetch_assoc()) {
        $categoryID = $row["categoryID"];
        $categoryName = $row["services"];
        
        $categories []= array(
            "categoryID" => $categoryID,
            "categoryName" => $categoryName
        );
    }
    
    return $categories;
}


function fetchCategoryID($categoryName) {

    $categoryName = strtolower(htmlspecialchars($categoryName));

    $db = get_connection();
    $command = $db->prepare("SELECT categoryID FROM categories WHERE services = ?;");
    $command->bind_param('s', $categoryName);


    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $categoryID = "";

    while ($row = $fetchedResult->fetch_assoc()) {
        $categoryID = $row["categoryID"];
    }
    
    return $categoryID;
}

function updateCategories($locationID, $categoryName) {

    $categoryName = strtolower(htmlspecialchars($categoryName));
    $categoryID = fetchCategoryID($categoryName);

    if (!blankTest($categoryName) || !blankTest($categoryID)) {
        $_SESSION["error"] = "invalid category input<br>";
        return;
    }

    $db = get_connection();

    $command = $db->prepare("UPDATE indoor_locations SET categoryID = ? WHERE locationID = ?");

    $command->bind_param('ii', $categoryID, $locationID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] = "Successfully updated category for location #$locationID to $categoryName<br>";
    }
}

?>