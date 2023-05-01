<?php
session_start();
require_once("delete_func.php");
require_once("../auth/validation_functions.php");

if (isset($_POST["deleteLocation"])) {

    if (isset($_POST["locationID"])) {    

        $locationID = $_POST["locationID"];
        
        if (blankTest($locationID)) {
            deleteIndoorLocations($locationID);
        }

    }

    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";
    }
}
    

header("Location: delete_page.php");
    
?>
