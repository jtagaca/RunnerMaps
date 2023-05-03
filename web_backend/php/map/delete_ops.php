<?php
session_start();
require_once("delete_func.php");
require_once("../auth/validation_functions.php");

if (isset($_POST["deleteFloorPlan"])) {

    if (isset($_POST["floorID"])) {    

        $floorID = $_POST["floorID"];
        
        if (blankTest($floorID)) {
            deleteFloorPlan($floorID);
        }

    }

    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";
    }
}
    

header("Location: delete_page.php");
    
?>
