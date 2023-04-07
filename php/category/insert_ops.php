<?php
session_start();
require_once("insert_func.php");

if (isset($_POST["uploadJSON"])) {


}

else {
    echo "if form submission is invalid";
    $_SESSION["error"] = "please submit the form properly <br>";
}


//redirecting the results back to the form page
header("Location: insert_page.php");
    
?>
