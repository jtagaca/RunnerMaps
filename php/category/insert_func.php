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
    $command = $db->prepare("SELECT * FROM categories order by services;");

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

function printCategoriesOptions() {
    // https://www.c-sharpcorner.com/UploadFile/051e29/dropdown-list-in-php/
    // https://html.form.guide/php-form/php-form-select/

    $categories = fetchAllCategories();
    
    echo "<select name=updatedCategory>";

    echo "<option value=\"\">Please Select A Category</option>";
    echo "<option style=\"background-color:#F2C0BD;\" value=\"remove\">Remove Category</option>";
    
    foreach($categories as $category) {
        // didn't end up needing the id
        
        $categoryName = $category["categoryName"];
        // $categoryID = $category["categoryID"];

        // if (!blankTest($categoryName) || !blankTest($categoryID)) {
        //     return;
        // }

        if (!blankTest($categoryName)) {
            return;
        }

        $categoryName = htmlspecialchars($categoryName);
        $categoryName = ucwords($categoryName);
        // $categoryID = htmlspecialchars($categoryID);

        // $realCategoryID = fetchCategoryID($categoryName);

        // if ($categoryID != $realCategoryID) {
        //     return false;
        // }

        $categoryOption = 
        "
        <option value=\"$categoryName\">$categoryName</option><br>
        ";

        echo $categoryOption;
    }

    echo "</select>";
    
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


function doesLocationExist($locationID) {
    
    $db = get_connection();

    $command = $db->prepare("select count(*) from indoor_locations WHERE locationID = ?");

    $command->bind_param('i', $locationID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $fetchedResult = $command->get_result();
        if ($row = $fetchedResult->fetch_assoc()) {
            $count = $row["count(*)"];
            if ($count > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function updateCategories($locationID, $categoryName) {
    if (!blankTest($locationID)) {
        $_SESSION["error"] = "location ID is blank.<br>";
        return;
    }
    if (!doesLocationExist($locationID)) {
        $_SESSION["error"] = "location ID does not exist. please check again.<br>";
        return;
    }

    if ($categoryName == "remove") {
        $db = get_connection();

        $command = $db->prepare("UPDATE indoor_locations SET categoryID = NULL WHERE locationID = ?");

        $command->bind_param('i', $locationID);

        if (!$command->execute()) {
            $_SESSION["error"] = die(mysqli_error($db) . "<br>");
        }
        else {
            $_SESSION["success_message"] = "Successfully removed the category for location #$locationID.<br>";
        }
    }

    else {
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
}

function editCategoryName($old, $new) {
    $old = strtolower(htmlspecialchars($old));
    $new = strtolower(htmlspecialchars($new));

    if (doesCategoryAlreadyExist($new)) {
        $_SESSION["error"] = "category name already exists. <br>";
        return;
    }

    $categoryID = fetchCategoryID($old);

    if (!blankTest($old) || !blankTest($categoryID) || !blankTest($new)) {
        $_SESSION["error"] = "invalid category input<br>";
        return;
    }

    $db = get_connection();

    $command = $db->prepare("UPDATE categories SET services = ? WHERE categoryID = ?");

    $command->bind_param('si', $new, $categoryID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] = "Successfully updated category name from $old to $new<br> This applies to ALL LOCATIONS that belong to this category";
    }
}


?>