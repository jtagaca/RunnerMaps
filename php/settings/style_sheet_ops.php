<?php
session_start();

if (isset($_SESSION["style"])) {
    echo 1;
    $settings = $_SESSION["style"];
    print_r($settings);
    if (!is_null($settings)) {
        $fontSize = $settings["fontSize"];
        $fontColor = $settings["fontColor"];
        $backgroundColor = $settings["backgroundColor"];
        $borderColor = $settings["borderColor"];

    }
    else {
        $fontSize = "16";
        $fontColor = "#000000";
        $backgroundColor = "#FFFFFF";
        $borderColor = "#000000";
    }
    
    echo $fontSize;
}


?>